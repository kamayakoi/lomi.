CREATE OR REPLACE FUNCTION update_wave_transaction(
    p_wave_checkout_id TEXT,
    p_wave_transaction_id TEXT,
    p_payment_status TEXT,
    p_transaction_status transaction_status
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_transaction_id UUID;
BEGIN
    -- Get transaction ID from providers_transactions
    SELECT pt.transaction_id INTO v_transaction_id
    FROM providers_transactions pt
    WHERE pt.wave_checkout_id = p_wave_checkout_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Transaction not found for Wave checkout ID: %', p_wave_checkout_id;
    END IF;

    -- Update providers_transactions
    UPDATE providers_transactions
    SET 
        wave_payment_status = p_payment_status,
        wave_transaction_id = p_wave_transaction_id,
        updated_at = NOW()
    WHERE transaction_id = v_transaction_id;

    -- Update main transaction record
    UPDATE transactions
    SET 
        status = p_transaction_status,
        updated_at = NOW()
    WHERE transaction_id = v_transaction_id;

    -- If transaction is completed, trigger any necessary webhooks or notifications
    IF p_transaction_status = 'completed' THEN
        -- You can add webhook/notification logic here
        -- For example, calling another function to send notifications
        NULL;
    END IF;

    RETURN v_transaction_id;
END;
$$; 