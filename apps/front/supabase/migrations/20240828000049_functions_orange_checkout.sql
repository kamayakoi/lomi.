-- Fetch Orange provider settings
CREATE OR REPLACE FUNCTION public.fetch_orange_provider_settings(p_organization_id UUID)
RETURNS TABLE (
    organization_id UUID,
    provider_code text,
    provider_merchant_id text,
    is_connected boolean,
    phone_number text,
    is_phone_verified boolean,
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
        ops.phone_number,
        ops.is_phone_verified,
        ops.metadata
    FROM 
        public.organization_providers_settings ops
    WHERE 
        ops.organization_id = p_organization_id
        AND ops.provider_code = 'ORANGE';
END;
$$ LANGUAGE plpgsql;

-- Create a new Orange checkout transaction
CREATE OR REPLACE FUNCTION public.create_orange_checkout_transaction(
    p_merchant_id UUID,
    p_organization_id UUID,
    p_customer_id UUID,
    p_amount NUMERIC,
    p_currency_code public.currency_code,
    p_provider_checkout_id VARCHAR, -- pay_token
    p_checkout_url TEXT, -- payment_url
    p_error_url TEXT, -- cancel_url
    p_success_url TEXT, -- return_url
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
        f.payment_method_code = 'MOBILE_MONEY'
        AND f.provider_code = 'ORANGE'
        AND f.currency_code = p_currency_code
        AND f.transaction_type = 'payment'
    LIMIT 1;
    
    -- If no fee found, use a default fee
    IF v_fee_name IS NULL THEN
        v_fee_name := 'orange_default_fee';
        v_fee_amount := p_amount * 0.02; -- 2% default fee
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
        'ORANGE',
        'MOBILE_MONEY'
    )
    RETURNING transaction_id INTO v_transaction_id;
    
    -- Create provider transaction record
    INSERT INTO public.providers_transactions (
        transaction_id,
        merchant_id,
        provider_code,
        provider_checkout_id,
        checkout_url,
        error_url,
        success_url,
        provider_payment_status
    ) VALUES (
        v_transaction_id,
        p_merchant_id,
        'ORANGE',
        p_provider_checkout_id,
        p_checkout_url,
        p_error_url,
        p_success_url,
        'processing'
    );
    
    RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql;

-- Update Orange payment status
CREATE OR REPLACE FUNCTION public.update_orange_payment_status(
    p_provider_checkout_id VARCHAR, -- pay_token
    p_provider_transaction_id VARCHAR DEFAULT NULL, -- txnid
    p_payment_status TEXT, -- Orange status (SUCCESS, FAILED, etc.)
    p_error_code VARCHAR DEFAULT NULL,
    p_error_message TEXT DEFAULT NULL,
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
        AND pt.provider_code = 'ORANGE';
    
    IF v_transaction_id IS NULL THEN
        RAISE EXCEPTION 'Transaction not found for provider checkout ID: %', p_provider_checkout_id;
    END IF;
    
    -- Map Orange status to our status
    CASE p_payment_status
        WHEN 'SUCCESS' THEN v_transaction_status := 'completed';
        WHEN 'FAILED' THEN v_transaction_status := 'failed';
        ELSE v_transaction_status := 'pending';
    END CASE;
    
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
    
    -- Update provider transaction
    UPDATE public.providers_transactions
    SET 
        provider_transaction_id = COALESCE(p_provider_transaction_id, provider_transaction_id),
        provider_payment_status = CASE
            WHEN v_transaction_status = 'completed' THEN 'succeeded'
            WHEN v_transaction_status = 'failed' THEN 'cancelled'
            ELSE 'processing'
        END,
        error_code = COALESCE(p_error_code, error_code),
        error_message = COALESCE(p_error_message, error_message),
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

-- Verify Orange notification
CREATE OR REPLACE FUNCTION public.verify_orange_notification(
    p_notif_token VARCHAR,
    p_status public.provider_payment_status,
    p_txnid VARCHAR
)
RETURNS BOOLEAN
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
    v_transaction_id UUID;
    v_notif_token VARCHAR;
    v_transaction_exists BOOLEAN;
BEGIN
    -- Find transaction with matching notif_token in metadata
    SELECT 
        t.transaction_id,
        (t.metadata->'orange_session'->>'notif_token')::VARCHAR AS notif_token
    INTO 
        v_transaction_id,
        v_notif_token
    FROM 
        public.transactions t
    JOIN 
        public.providers_transactions pt ON t.transaction_id = pt.transaction_id
    WHERE 
        pt.provider_code = 'ORANGE'
        AND t.metadata->'orange_session'->>'notif_token' IS NOT NULL;
    
    -- Check if notification token matches and update status
    IF v_transaction_id IS NOT NULL AND v_notif_token = p_notif_token THEN
        -- Update transaction status
        PERFORM public.update_orange_payment_status(
            p_provider_checkout_id := (SELECT provider_checkout_id FROM public.providers_transactions WHERE transaction_id = v_transaction_id),
            p_provider_transaction_id := p_txnid,
            p_payment_status := CASE
                WHEN p_status = 'succeeded' THEN 'SUCCESS'
                ELSE 'FAILED'
            END,
            p_metadata := jsonb_build_object(
                'orange_session', jsonb_build_object(
                    'txnid', p_txnid
                )
            )
        );
        
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Get Orange payment status by checkout ID
CREATE OR REPLACE FUNCTION public.get_orange_payment_status(
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
            'created_at', t.created_at,
            'updated_at', t.updated_at,
            'provider_transaction_id', pt.provider_transaction_id,
            'metadata', t.metadata
        ) INTO v_result
    FROM 
        public.transactions t
    JOIN 
        public.providers_transactions pt ON t.transaction_id = pt.transaction_id
    WHERE 
        pt.provider_checkout_id = p_provider_checkout_id
        AND pt.provider_code = 'ORANGE';
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql; 