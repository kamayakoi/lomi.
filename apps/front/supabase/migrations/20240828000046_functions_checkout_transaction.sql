-- Function to create a new transaction
CREATE OR REPLACE FUNCTION create_transaction(
    p_merchant_id UUID,
    p_organization_id UUID,
    p_customer_id UUID,
    p_amount NUMERIC,
    p_currency_code currency_code,
    p_provider_code provider_code,
    p_payment_method_code payment_method_code,
    p_description TEXT DEFAULT NULL,
    p_product_id UUID DEFAULT NULL,
    p_subscription_id UUID DEFAULT NULL,
    p_metadata JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_transaction_id UUID;
    v_fee_data RECORD;
    v_fee_amount NUMERIC;
    v_net_amount NUMERIC;
    v_fee_name TEXT;
    v_transaction_type transaction_type;
BEGIN
    -- Get fee calculation based on provider and payment method
    SELECT name, percentage, fixed_amount 
    FROM get_transaction_fee(
        'payment'::transaction_type,
        p_provider_code,
        p_payment_method_code,
        p_currency_code
    ) INTO v_fee_data;
    
    -- Calculate fee and net amounts
    v_fee_amount := (p_amount * v_fee_data.percentage / 100) + v_fee_data.fixed_amount;
    v_net_amount := p_amount - v_fee_amount;
    v_fee_name := v_fee_data.name;

    -- Determine the transaction type based on whether it's a subscription payment
    v_transaction_type := CASE 
        WHEN p_subscription_id IS NOT NULL THEN 'instalment'::transaction_type
        ELSE 'payment'::transaction_type
    END;

    -- Insert transaction
    INSERT INTO transactions (
        merchant_id,
        organization_id,
        customer_id,
        product_id,
        subscription_id,
        transaction_type,
        description,
        metadata,
        gross_amount,
        fee_amount,
        net_amount,
        fee_reference,
        currency_code,
        provider_code,
        payment_method_code
    ) VALUES (
        p_merchant_id,
        p_organization_id,
        p_customer_id,
        p_product_id,
        p_subscription_id,
        v_transaction_type,
        p_description,
        p_metadata,
        p_amount,
        v_fee_amount,
        v_net_amount,
        v_fee_name,
        p_currency_code,
        p_provider_code,
        p_payment_method_code
    ) RETURNING transaction_id INTO v_transaction_id;

    RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to update transaction status and handle balances
CREATE OR REPLACE FUNCTION update_transaction_status(
    p_transaction_id UUID,
    p_status transaction_status,
    p_metadata JSONB DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
    v_transaction RECORD;
BEGIN
    -- Get transaction details
    SELECT * FROM transactions 
    WHERE transaction_id = p_transaction_id
    INTO v_transaction;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Transaction not found';
    END IF;

    -- Update transaction status
    UPDATE transactions 
    SET 
        status = p_status,
        metadata = COALESCE(p_metadata, metadata),
        updated_at = NOW()
    WHERE transaction_id = p_transaction_id;

    -- If transaction is completed, update all balances
    IF p_status = 'completed' THEN
        -- 1. Update platform main account (our fee revenue)
        INSERT INTO platform_main_account (
            balance,
            available_balance,
            currency_code
        ) VALUES (
            v_transaction.fee_amount,
            v_transaction.fee_amount,
            v_transaction.currency_code
        )
        ON CONFLICT (currency_code) DO UPDATE
        SET 
            balance = platform_main_account.balance + v_transaction.fee_amount,
            available_balance = platform_main_account.available_balance + v_transaction.fee_amount,
            updated_at = NOW();

        -- 2. Update merchant account (what they receive)
        INSERT INTO merchant_accounts (
            merchant_id,
            balance,
            currency_code
        ) VALUES (
            v_transaction.merchant_id,
            v_transaction.net_amount,
            v_transaction.currency_code
        )
        ON CONFLICT (merchant_id, currency_code) DO UPDATE
        SET 
            balance = merchant_accounts.balance + v_transaction.net_amount;

        -- 3. Update provider balance (what they hold)
        INSERT INTO platform_provider_balance (
            provider_code,
            balance,
            currency_code
        ) VALUES (
            v_transaction.provider_code,
            v_transaction.gross_amount,
            v_transaction.currency_code
        )
        ON CONFLICT (provider_code, currency_code) DO UPDATE
        SET 
            balance = platform_provider_balance.balance + v_transaction.gross_amount,
            updated_at = NOW();
    END IF;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Add 'expired' to the transaction_status enum if it doesn't exist yet
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_status' AND 
                  'expired' = ANY(enum_range(NULL::transaction_status)::text[])) THEN
        ALTER TYPE transaction_status ADD VALUE 'expired' AFTER 'failed';
    END IF;
END$$;

-- Function to expire pending transactions with custom status
CREATE OR REPLACE FUNCTION public.expire_pending_transactions_with_custom_status(
    expiry_hours INTEGER DEFAULT 2,
    new_status transaction_status DEFAULT 'expired'
)
RETURNS INTEGER AS $$
DECLARE
  rows_updated INTEGER;
BEGIN
  WITH expired_transactions AS (
    SELECT 
      t.transaction_id,
      t.merchant_id,
      t.organization_id
    FROM transactions t
    LEFT JOIN providers_transactions pt ON t.transaction_id = pt.transaction_id
    WHERE 
      t.status = 'pending' AND
      (
        -- Expired based on creation time (fallback)
        t.created_at < (NOW() - (expiry_hours || ' hours')::interval) OR
        -- Expired based on Wave session expiration time if available
        (
          t.metadata->'wave_session'->>'when_expires' IS NOT NULL AND
          (t.metadata->'wave_session'->>'when_expires')::timestamptz < NOW()
        )
      )
  ),
  updated_transactions AS (
    UPDATE transactions t
    SET 
      status = new_status,
      metadata = jsonb_set(
        COALESCE(t.metadata, '{}'::jsonb),
        '{expiration_info}',
        jsonb_build_object(
          'expired_at', now(),
          'reason', 'Transaction expired after ' || expiry_hours || ' hours'
        )
      ),
      updated_at = NOW()
    FROM expired_transactions et
    WHERE t.transaction_id = et.transaction_id
    RETURNING t.transaction_id, et.merchant_id, et.organization_id
  )
  -- Also update the provider_transactions table
  UPDATE providers_transactions pt
  SET 
    provider_payment_status = new_status::text,
    error_code = 'expired',
    error_message = 'Transaction expired after ' || expiry_hours || ' hours',
    updated_at = NOW()
  FROM updated_transactions ut
  WHERE pt.transaction_id = ut.transaction_id;
  
  -- Count how many rows were updated
  GET DIAGNOSTICS rows_updated = ROW_COUNT;
  
  -- Log the action
  IF rows_updated > 0 THEN
    INSERT INTO system_logs (
      log_type,
      message,
      details,
      severity
    ) VALUES (
      'transaction_expiration',
      'Expired ' || rows_updated || ' pending transactions',
      jsonb_build_object(
        'expiry_hours', expiry_hours,
        'executed_at', NOW(),
        'new_status', new_status
      ),
      'INFO'
    );
  END IF;
  
  RETURN rows_updated;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to expire pending transactions (original version that uses 'failed' status)
CREATE OR REPLACE FUNCTION public.expire_pending_transactions(expiry_hours INTEGER DEFAULT 24)
RETURNS INTEGER AS $$
DECLARE
  rows_updated INTEGER;
BEGIN
  WITH expired_transactions AS (
    SELECT 
      t.transaction_id,
      t.merchant_id,
      t.organization_id
    FROM transactions t
    LEFT JOIN providers_transactions pt ON t.transaction_id = pt.transaction_id
    WHERE 
      t.status = 'pending' AND
      (
        -- Expired based on creation time (fallback)
        t.created_at < (NOW() - (expiry_hours || ' hours')::interval) OR
        -- Expired based on Wave session expiration time if available
        (
          t.metadata->'wave_session'->>'when_expires' IS NOT NULL AND
          (t.metadata->'wave_session'->>'when_expires')::timestamptz < NOW()
        )
      )
  ),
  updated_transactions AS (
    UPDATE transactions t
    SET 
      status = 'failed',
      metadata = jsonb_set(
        COALESCE(t.metadata, '{}'::jsonb),
        '{expiration_info}',
        jsonb_build_object(
          'expired_at', now(),
          'reason', 'Transaction expired after ' || expiry_hours || ' hours'
        )
      ),
      updated_at = NOW()
    FROM expired_transactions et
    WHERE t.transaction_id = et.transaction_id
    RETURNING t.transaction_id, et.merchant_id, et.organization_id
  )
  -- Also update the provider_transactions table
  UPDATE providers_transactions pt
  SET 
    provider_payment_status = 'failed',
    error_code = 'expired',
    error_message = 'Transaction expired after ' || expiry_hours || ' hours',
    updated_at = NOW()
  FROM updated_transactions ut
  WHERE pt.transaction_id = ut.transaction_id;
  
  -- Count how many rows were updated
  GET DIAGNOSTICS rows_updated = ROW_COUNT;
  
  -- Log the action
  IF rows_updated > 0 THEN
    INSERT INTO system_logs (
      log_type,
      message,
      details,
      severity
    ) VALUES (
      'transaction_expiration',
      'Expired ' || rows_updated || ' pending transactions',
      jsonb_build_object(
        'expiry_hours', expiry_hours,
        'executed_at', NOW()
      ),
      'INFO'
    );
  END IF;
  
  RETURN rows_updated;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to manually trigger transaction expiration (for testing or manual cleanup)
CREATE OR REPLACE FUNCTION public.manually_expire_transactions(expiry_hours INTEGER DEFAULT 2)
RETURNS TEXT AS $$
DECLARE
  rows_updated INTEGER;
BEGIN
  SELECT public.expire_pending_transactions_with_custom_status(expiry_hours, 'expired') INTO rows_updated;
  
  RETURN 'Expired ' || rows_updated || ' pending transactions';
EXCEPTION WHEN OTHERS THEN
  RETURN 'Error expiring transactions: ' || SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Comment explaining the migration
COMMENT ON FUNCTION public.expire_pending_transactions IS 
'Expires pending transactions that are older than a specified number of hours or have passed their Wave expiration time.';

COMMENT ON FUNCTION public.expire_pending_transactions_with_custom_status IS 
'Expires pending transactions that are older than a specified number of hours or have passed their Wave expiration time. Marks them with the specified status (defaults to "expired").';

COMMENT ON FUNCTION public.manually_expire_transactions IS
'Manually triggers the transaction expiration process for testing or immediate cleanup.'; 