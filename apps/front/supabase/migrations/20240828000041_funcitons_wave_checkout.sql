-- Function to create a Wave checkout transaction
CREATE OR REPLACE FUNCTION create_wave_checkout_transaction(
    p_merchant_id UUID,
    p_organization_id UUID,
    p_customer_id UUID,
    p_amount NUMERIC,
    p_currency_code currency_code,
    p_provider_checkout_id VARCHAR,
    p_checkout_url TEXT,
    p_error_url TEXT,
    p_success_url TEXT,
    p_product_id UUID DEFAULT NULL,
    p_subscription_id UUID DEFAULT NULL,
    p_description TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_transaction_id UUID;
    v_fee_amount NUMERIC;
    v_net_amount NUMERIC;
    v_fee_reference TEXT;
BEGIN
    -- Calculate fee
    SELECT name, COALESCE(fixed_amount, 0) + (p_amount * percentage / 100)
    INTO v_fee_reference, v_fee_amount
    FROM fees 
    WHERE transaction_type = 'payment'
    AND payment_method_code = 'MOBILE_MONEY'
    AND provider_code = 'WAVE'
    AND currency_code = p_currency_code
    LIMIT 1;

    -- Calculate net amount
    v_net_amount := p_amount - v_fee_amount;

    -- Create transaction record
    INSERT INTO transactions (
        merchant_id,
        organization_id,
        customer_id,
        product_id,
        subscription_id,
        transaction_type,
        description,
        reference_id,
        metadata,
        gross_amount,
        fee_amount,
        net_amount,
        fee_reference,
        currency_code,
        provider_code,
        payment_method_code
    )
    VALUES (
        p_merchant_id,
        p_organization_id,
        p_customer_id,
        p_product_id,
        p_subscription_id,
        'payment',
        p_description,
        SUBSTRING(MD5(RANDOM()::TEXT) FOR 8),
        p_metadata,
        p_amount,
        v_fee_amount,
        v_net_amount,
        v_fee_reference,
        p_currency_code,
        'WAVE',
        'MOBILE_MONEY'
    )
    RETURNING transaction_id INTO v_transaction_id;

    -- Create provider transaction record
    INSERT INTO providers_transactions (
        transaction_id,
        merchant_id,
        provider_code,
        provider_checkout_id,
        checkout_url,
        error_url,
        success_url
    )
    VALUES (
        v_transaction_id,
        p_merchant_id,
        'WAVE',
        p_provider_checkout_id,
        p_checkout_url,
        p_error_url,
        p_success_url
    );

    -- Log event
    PERFORM log_event(
        p_merchant_id,
        'process_payment'::event_type,
        jsonb_build_object(
            'transaction_id', v_transaction_id,
            'provider', 'WAVE',
            'amount', p_amount,
            'currency', p_currency_code,
            'checkout_id', p_provider_checkout_id
        ),
        'NOTICE'
    );

    RETURN v_transaction_id;
END;
$$;

-- Function to update Wave checkout status
CREATE OR REPLACE FUNCTION update_wave_checkout_status(
    p_provider_checkout_id VARCHAR,
    p_provider_transaction_id VARCHAR DEFAULT NULL,
    p_payment_status provider_payment_status DEFAULT NULL,
    p_error_code VARCHAR DEFAULT NULL,
    p_error_message TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_transaction_id UUID;
    v_merchant_id UUID;
    v_current_status provider_payment_status;
BEGIN
    -- Get transaction ID and current status
    SELECT 
        pt.transaction_id,
        pt.merchant_id,
        pt.provider_payment_status
    INTO v_transaction_id, v_merchant_id, v_current_status
    FROM providers_transactions pt
    WHERE provider_checkout_id = p_provider_checkout_id
    AND provider_code = 'WAVE';

    IF FOUND THEN
        -- Update provider transaction
        UPDATE providers_transactions
        SET provider_payment_status = COALESCE(p_payment_status, provider_payment_status),
            provider_transaction_id = COALESCE(p_provider_transaction_id, provider_transaction_id),
            error_code = COALESCE(p_error_code, error_code),
            error_message = COALESCE(p_error_message, error_message),
            updated_at = NOW()
        WHERE transaction_id = v_transaction_id;

        -- Update main transaction status
        UPDATE transactions
        SET status = CASE 
            WHEN COALESCE(p_payment_status, v_current_status) = 'succeeded' THEN 'completed'::transaction_status
            WHEN COALESCE(p_payment_status, v_current_status) = 'cancelled' THEN 'failed'::transaction_status
            WHEN COALESCE(p_payment_status, v_current_status) = 'refunded' THEN 'refunded'::transaction_status
            ELSE status
        END,
        metadata = CASE 
            WHEN p_metadata IS NOT NULL THEN jsonb_set(metadata, '{wave_session}', p_metadata->'wave_session')
            ELSE metadata
        END,
        updated_at = NOW()
        WHERE transaction_id = v_transaction_id;

        -- Log event
        PERFORM log_event(
            v_merchant_id,
            CASE 
                WHEN COALESCE(p_payment_status, v_current_status) = 'succeeded' THEN 'payment_succeeded'::event_type
                WHEN COALESCE(p_payment_status, v_current_status) = 'cancelled' THEN 'payment_failed'::event_type
                WHEN COALESCE(p_payment_status, v_current_status) = 'refunded' THEN 'payment.refunded'::event_type
                ELSE 'payment_status_change'::event_type
            END,
            jsonb_build_object(
                'transaction_id', v_transaction_id,
                'provider', 'WAVE',
                'status', COALESCE(p_payment_status, v_current_status),
                'error_code', p_error_code,
                'error_message', p_error_message
            ),
            CASE 
                WHEN p_error_code IS NOT NULL THEN 'ERROR'
                ELSE 'NOTICE'
            END
        );
    END IF;
END;
$$;

-- Function to update merchant account balance after successful transaction
CREATE OR REPLACE FUNCTION update_merchant_account_after_transaction()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_merchant_id UUID;
    v_net_amount NUMERIC;
    v_currency_code currency_code;
BEGIN
    -- Only process completed transactions
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        -- Get transaction details
        SELECT merchant_id, net_amount, currency_code
        INTO v_merchant_id, v_net_amount, v_currency_code
        FROM transactions
        WHERE transaction_id = NEW.transaction_id;

        -- Update merchant account balance
        UPDATE merchant_accounts
        SET balance = balance + v_net_amount,
            updated_at = NOW()
        WHERE merchant_id = v_merchant_id
        AND currency_code = v_currency_code;

        -- If no account exists for this currency, create one
        IF NOT FOUND THEN
            INSERT INTO merchant_accounts (
                merchant_id,
                currency_code,
                balance
            )
            VALUES (
                v_merchant_id,
                v_currency_code,
                v_net_amount
            );
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

-- Create trigger for merchant account updates
CREATE TRIGGER trg_update_merchant_account
    AFTER UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_merchant_account_after_transaction();

-- Function to get Wave payment status
CREATE OR REPLACE FUNCTION get_wave_payment_status(
    p_provider_checkout_id VARCHAR
)
RETURNS TABLE (
    status transaction_status,
    payment_status provider_payment_status,
    error_code VARCHAR,
    error_message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.status,
        pt.provider_payment_status,
        pt.error_code,
        pt.error_message
    FROM providers_transactions pt
    JOIN transactions t ON t.transaction_id = pt.transaction_id
    WHERE pt.provider_checkout_id = p_provider_checkout_id
    AND pt.provider_code = 'WAVE';
END;
$$;

-- Function to update provider settings metadata
CREATE OR REPLACE FUNCTION update_provider_settings_metadata(
    p_organization_id UUID,
    p_provider_code provider_code,
    p_provider_merchant_id VARCHAR,
    p_metadata JSONB
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    UPDATE organization_providers_settings
    SET 
        provider_merchant_id = p_provider_merchant_id,
        metadata = p_metadata,
        updated_at = NOW()
    WHERE 
        organization_id = p_organization_id 
        AND provider_code = p_provider_code;
END;
$$;
