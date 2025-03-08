-- Insert default fees for different providers and payment methods
-- Fee hierarchy:
-- 1. Provider-specific fees: Used when provider_code and payment_method_code match
-- 2. Platform default fees: Used when no provider-specific fee is found (NULL provider_code and payment_method_code)
INSERT INTO fees (name, transaction_type, fee_type, percentage, fixed_amount, currency_code, provider_code, payment_method_code) 
VALUES 
    -- Platform default fee (fallback when no provider-specific fee exists)
    ('Platform Processing Fee', 'payment', 'platform', 3.2, 200, 'XOF', NULL, NULL),
    
    -- Mobile Money providers
    ('Wave Processing Fee', 'payment', 'processing', 3.2, 200, 'XOF', 'WAVE', 'E_WALLET'),
    ('Orange Processing Fee', 'payment', 'processing', 3.2, 200, 'XOF', 'ORANGE', 'MOBILE_MONEY'),
    ('MTN Processing Fee', 'payment', 'processing', 3.2, 200, 'XOF', 'MTN', 'MOBILE_MONEY'),
    ('Moov Processing Fee', 'payment', 'processing', 3.2, 200, 'XOF', 'MOOV', 'MOBILE_MONEY'),
    
    -- Card processing fees
    ('Card Processing Fee XOF', 'payment', 'processing', 3.2, 200, 'XOF', 'ECOBANK', 'CARDS'),
    ('Card Processing Fee EUR', 'payment', 'processing', 3.2, 0.30, 'EUR', 'ECOBANK', 'CARDS'),
    ('Card Processing Fee USD', 'payment', 'processing', 3.2, 0.30, 'USD', 'ECOBANK', 'CARDS'),

    -- Currency conversion fees
    ('USD Currency Conversion Fee', 'payment', 'conversion', 1.5, 0.00, 'USD', NULL, NULL),
    ('EUR Currency Conversion Fee', 'payment', 'conversion', 1.5, 0.00, 'EUR', NULL, NULL),
    ('XOF Currency Conversion Fee', 'payment', 'conversion', 2.0, 0.00, 'XOF', NULL, NULL),

    -- Payout fees
    ('USD Express Payout Fee', 'payment', 'payout', 0.0, 1.00, 'USD', NULL, NULL),
    ('EUR Express Payout Fee', 'payment', 'payout', 0.0, 1.00, 'EUR', NULL, NULL),
    ('XOF Express Payout Fee', 'payment', 'payout', 0.0, 650.00, 'XOF', NULL, NULL),

    -- Refund fees
    ('USD Refund Processing Fee', 'payment', 'refund', 1.5, 0.00, 'USD', NULL, NULL),
    ('EUR Refund Processing Fee', 'payment', 'refund', 1.5, 0.00, 'EUR', NULL, NULL),
    ('XOF Refund Processing Fee', 'payment', 'refund', 2.0, 0.00, 'XOF', NULL, NULL),

    -- Payout processing fees
    ('USD Payout Processing Fee', 'payment', 'payout', 1.0, 0.00, 'USD', NULL, NULL),
    ('EUR Payout Processing Fee', 'payment', 'payout', 1.0, 0.00, 'EUR', NULL, NULL),
    ('XOF Payout Processing Fee', 'payment', 'payout', 1.0, 0.00, 'XOF', NULL, NULL),
    ('Wave Payout Fee', 'payment', 'payout', 1.0, 0, 'XOF', 'WAVE', 'E_WALLET');

-- Function to get fee for a specific provider and payment method
-- Returns the provider-specific fee if found, otherwise returns the platform default fee
CREATE OR REPLACE FUNCTION get_transaction_fee(
    p_transaction_type transaction_type,
    p_provider_code provider_code,
    p_payment_method_code payment_method_code,
    p_currency_code currency_code
)
RETURNS TABLE (
    name VARCHAR,
    percentage NUMERIC(5,2),
    fixed_amount NUMERIC(10,2)
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    -- First try to get provider-specific fee
    RETURN QUERY
    SELECT f.name, f.percentage, f.fixed_amount
    FROM fees f
    WHERE f.transaction_type = p_transaction_type
    AND f.provider_code = p_provider_code
    AND f.payment_method_code = p_payment_method_code
    AND f.currency_code = p_currency_code
    LIMIT 1;

    -- If no provider-specific fee found, return platform default fee
    IF NOT FOUND THEN
        RETURN QUERY
        SELECT f.name, f.percentage, f.fixed_amount
        FROM fees f
        WHERE f.transaction_type = p_transaction_type
        AND f.provider_code IS NULL
        AND f.payment_method_code IS NULL
        AND f.currency_code = p_currency_code
        LIMIT 1;
    END IF;
END;
$$;