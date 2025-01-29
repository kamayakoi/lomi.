CREATE OR REPLACE FUNCTION create_wave_transaction(
    p_merchant_id UUID,
    p_organization_id UUID,
    p_customer_id UUID,
    p_product_id UUID DEFAULT NULL,
    p_subscription_id UUID DEFAULT NULL,
    p_transaction_type transaction_type DEFAULT 'payment',
    p_description TEXT DEFAULT '',
    p_metadata JSONB DEFAULT '{}'::jsonb,
    p_gross_amount NUMERIC,
    p_fee_amount NUMERIC,
    p_fee_reference TEXT,
    p_currency_code currency_code DEFAULT 'XOF',
    p_wave_checkout_id TEXT,
    p_client_reference TEXT DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_transaction_id UUID;
    v_reference_id VARCHAR(8);
    v_net_amount NUMERIC;
BEGIN
    -- Calculate net amount (gross - fees)
    v_net_amount := p_gross_amount - p_fee_amount;

    -- Generate unique 8-character reference ID
    v_reference_id := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FOR 8));

    -- Insert transaction record
    INSERT INTO transactions (
        merchant_id,
        organization_id,
        customer_id,
        product_id,
        subscription_id,
        transaction_type,
        status,
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
    ) VALUES (
        p_merchant_id,
        p_organization_id,
        p_customer_id,
        p_product_id,
        p_subscription_id,
        p_transaction_type,
        'pending',
        p_description,
        v_reference_id,
        p_metadata,
        p_gross_amount,
        p_fee_amount,
        v_net_amount,
        p_fee_reference,
        p_currency_code,
        'WAVE',
        'WAVE'
    ) RETURNING transaction_id INTO v_transaction_id;

    -- Create provider transaction record
    INSERT INTO providers_transactions (
        transaction_id,
        merchant_id,
        provider_code,
        wave_checkout_id,
        wave_payment_status
    ) VALUES (
        v_transaction_id,
        p_merchant_id,
        'WAVE',
        p_wave_checkout_id,
        'pending'
    );

    RETURN v_transaction_id;
END;
$$; 