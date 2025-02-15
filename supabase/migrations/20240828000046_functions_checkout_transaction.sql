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
        'payment',
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
            last_updated_at = NOW();

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
            last_updated_at = NOW();
    END IF;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;