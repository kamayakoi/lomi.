-- Fetch NOWPayments provider settings
CREATE OR REPLACE FUNCTION public.fetch_nowpayments_provider_settings(p_organization_id UUID)
RETURNS TABLE (
    organization_id UUID,
    provider_code text,
    provider_merchant_id text,
    is_connected boolean,
    metadata jsonb
)
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ops.organization_id,
        ops.provider_code::text,
        ops.provider_merchant_id,
        ops.is_connected,
        ops.metadata
    FROM 
        public.organization_providers_settings ops
    WHERE 
        ops.organization_id = p_organization_id
        AND ops.provider_code = 'NOWPAYMENTS';
END;
$$ LANGUAGE plpgsql;

-- Create a new NOWPayments checkout transaction - UPDATED with dedicated columns
CREATE OR REPLACE FUNCTION public.create_nowpayments_checkout_transaction(
    p_merchant_id UUID,
    p_organization_id UUID,
    p_customer_id UUID,
    p_amount NUMERIC,
    p_currency_code public.currency_code,
    p_provider_checkout_id VARCHAR, -- payment_id
    p_checkout_url TEXT,
    p_error_url TEXT, -- cancel_url
    p_success_url TEXT, -- success_url
    p_pay_currency VARCHAR DEFAULT NULL, -- Cryptocurrency used (e.g., BTC, ETH)
    p_pay_amount NUMERIC DEFAULT NULL, -- Amount in cryptocurrency
    p_ipn_callback_url TEXT DEFAULT NULL, -- Callback URL for notifications
    p_product_id UUID DEFAULT NULL,
    p_subscription_id UUID DEFAULT NULL,
    p_description TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT NULL
)
RETURNS UUID
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
    v_transaction_id UUID;
    v_fee_name VARCHAR;
    v_fee_amount NUMERIC;
    v_net_amount NUMERIC;
BEGIN
    -- Calculate fees
    SELECT 
        f.name, 
        (p_amount * f.percentage / 100) + f.fixed_amount,
        p_amount - ((p_amount * f.percentage / 100) + f.fixed_amount)
    INTO 
        v_fee_name, 
        v_fee_amount,
        v_net_amount
    FROM 
        public.fees f
    WHERE 
        f.payment_method_code = 'CRYPTO'
        AND f.provider_code = 'NOWPAYMENTS'
        AND f.currency_code = p_currency_code
        AND f.transaction_type = 'payment'
    LIMIT 1;
    
    -- If no fee found, use a default fee
    IF v_fee_name IS NULL THEN
        v_fee_name := 'nowpayments_default_fee';
        v_fee_amount := p_amount * 0.01; -- 1% default fee
        v_net_amount := p_amount - v_fee_amount;
    END IF;
    
    -- Create transaction record
    INSERT INTO public.transactions (
        merchant_id,
        organization_id,
        customer_id,
        product_id,
        subscription_id,
        transaction_type,
        status,
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
        'pending',
        p_description,
        p_metadata,
        p_amount,
        v_fee_amount,
        v_net_amount,
        v_fee_name,
        p_currency_code,
        'NOWPAYMENTS',
        'CRYPTO'
    )
    RETURNING transaction_id INTO v_transaction_id;
    
    -- Create provider transaction record - Using dedicated columns
    INSERT INTO public.providers_transactions (
        transaction_id,
        merchant_id,
        provider_code,
        provider_checkout_id,
        checkout_url,
        error_url,
        success_url,
        provider_payment_status,
        pay_currency,          -- Using dedicated column
        pay_amount,            -- Using dedicated column
        ipn_callback_url       -- Using dedicated column
    ) VALUES (
        v_transaction_id,
        p_merchant_id,
        'NOWPAYMENTS',
        p_provider_checkout_id,
        p_checkout_url,
        p_error_url,
        p_success_url,
        'processing',
        p_pay_currency,        -- Storing cryptocurrency used
        p_pay_amount,          -- Storing amount in cryptocurrency
        p_ipn_callback_url     -- Storing IPN callback URL
    );
    
    RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql;

-- Update NOWPayments payment status - UPDATED to use dedicated columns
CREATE OR REPLACE FUNCTION public.update_nowpayments_payment_status(
    p_provider_checkout_id VARCHAR, -- payment_id
    p_payment_status TEXT, -- NOWPayments status
    p_metadata JSONB DEFAULT NULL
)
RETURNS VOID
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
    v_transaction_id UUID;
    v_transaction_status public.transaction_status;
    v_current_metadata JSONB;
    v_merchant_id UUID;
    v_organization_id UUID;
    v_amount NUMERIC;
    v_currency_code public.currency_code;
    v_pay_currency VARCHAR;
    v_pay_amount NUMERIC;
BEGIN
    -- Get transaction ID from provider checkout ID
    SELECT 
        t.transaction_id,
        t.merchant_id,
        t.organization_id,
        t.gross_amount,
        t.currency_code,
        t.metadata
    INTO 
        v_transaction_id,
        v_merchant_id,
        v_organization_id,
        v_amount,
        v_currency_code,
        v_current_metadata
    FROM 
        public.transactions t
    JOIN 
        public.providers_transactions pt ON t.transaction_id = pt.transaction_id
    WHERE 
        pt.provider_checkout_id = p_provider_checkout_id
        AND pt.provider_code = 'NOWPAYMENTS';
    
    IF v_transaction_id IS NULL THEN
        RAISE EXCEPTION 'Transaction not found for provider checkout ID: %', p_provider_checkout_id;
    END IF;
    
    -- Map NOWPayments status to our status
    CASE p_payment_status
        WHEN 'finished' THEN v_transaction_status := 'completed';
        WHEN 'failed' THEN v_transaction_status := 'failed';
        WHEN 'refunded' THEN v_transaction_status := 'refunded';
        ELSE v_transaction_status := 'pending';
    END CASE;
    
    -- Extract pay_currency and pay_amount from metadata if available
    IF p_metadata IS NOT NULL AND p_metadata ? 'nowpayments_session' THEN
        v_pay_currency := (p_metadata->'nowpayments_session'->>'pay_currency')::VARCHAR;
        v_pay_amount := (p_metadata->'nowpayments_session'->>'pay_amount')::NUMERIC;
    END IF;
    
    -- Merge metadata
    IF p_metadata IS NOT NULL THEN
        v_current_metadata := v_current_metadata || p_metadata;
    END IF;
    
    -- Update transaction
    UPDATE public.transactions
    SET 
        status = v_transaction_status,
        metadata = v_current_metadata,
        updated_at = NOW()
    WHERE 
        transaction_id = v_transaction_id;
    
    -- Update provider transaction with both status and crypto payment details
    UPDATE public.providers_transactions
    SET 
        provider_payment_status = CASE
            WHEN v_transaction_status = 'completed' THEN 'succeeded'
            WHEN v_transaction_status = 'failed' THEN 'cancelled'
            ELSE 'processing'
        END,
        pay_currency = COALESCE(pay_currency, v_pay_currency),  -- Update if available
        pay_amount = COALESCE(pay_amount, v_pay_amount),        -- Update if available
        updated_at = NOW()
    WHERE
        transaction_id = v_transaction_id;
    
    -- If transaction is completed, update merchant account balance
    IF v_transaction_status = 'completed' THEN
        -- Update merchant balance
        PERFORM public.update_merchant_account_balance(
            p_merchant_id := v_merchant_id,
            p_amount := (SELECT net_amount FROM public.transactions WHERE transaction_id = v_transaction_id),
            p_currency_code := v_currency_code
        );
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Verify NOWPayments notification
CREATE OR REPLACE FUNCTION public.verify_nowpayments_notification(
    p_payload JSONB,
    p_signature VARCHAR,
    p_organization_id UUID
)
RETURNS BOOLEAN
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
    v_ipn_secret VARCHAR;
    v_calculated_signature VARCHAR;
    v_payment_id VARCHAR;
    v_payment_status VARCHAR;
BEGIN
    -- Get IPN secret from organization settings
    SELECT 
        (ops.metadata->>'ipn_secret')::VARCHAR
    INTO 
        v_ipn_secret
    FROM 
        public.organization_providers_settings ops
    WHERE 
        ops.organization_id = p_organization_id
        AND ops.provider_code = 'NOWPAYMENTS';
    
    IF v_ipn_secret IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Calculate signature (Note: In practice, you'd implement the HMAC-SHA512 algorithm here)
    -- This is a simplified example
    SELECT 
        digest(
            jsonb_sort_keys(p_payload)::text || v_ipn_secret, 
            'sha512'
        )::text INTO v_calculated_signature;
    
    -- If signatures match, update payment status
    IF v_calculated_signature = p_signature THEN
        v_payment_id := (p_payload->>'payment_id')::VARCHAR;
        v_payment_status := (p_payload->>'payment_status')::VARCHAR;
        
        -- Update payment status
        PERFORM public.update_nowpayments_payment_status(
            p_provider_checkout_id := v_payment_id,
            p_payment_status := v_payment_status,
            p_metadata := jsonb_build_object(
                'nowpayments_session', p_payload
            )
        );
        
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Get NOWPayments payment status by payment ID
CREATE OR REPLACE FUNCTION public.get_nowpayments_payment_status(
    p_provider_checkout_id VARCHAR
)
RETURNS JSONB
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
    v_result JSONB;
BEGIN
    SELECT 
        jsonb_build_object(
            'transaction_id', t.transaction_id,
            'status', t.status,
            'provider_status', pt.provider_payment_status,
            'amount', t.gross_amount,
            'currency', t.currency_code,
            'pay_amount', pt.pay_amount,
            'pay_currency', pt.pay_currency,
            'created_at', t.created_at,
            'updated_at', t.updated_at,
            'metadata', t.metadata
        ) INTO v_result
    FROM 
        public.transactions t
    JOIN 
        public.providers_transactions pt ON t.transaction_id = pt.transaction_id
    WHERE 
        pt.provider_checkout_id = p_provider_checkout_id
        AND pt.provider_code = 'NOWPAYMENTS';
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql;