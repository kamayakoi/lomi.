-- Function to fetch payouts for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_payouts(
    p_merchant_id UUID,
    p_status TEXT[] DEFAULT NULL,
    p_page INTEGER DEFAULT 1,
    p_page_size INTEGER DEFAULT 50
)
RETURNS TABLE (
    payout_id UUID,
    amount NUMERIC(10,2),
    currency_code currency_code,
    payout_method VARCHAR,
    bank_account_number VARCHAR,
    bank_name VARCHAR,
    bank_code VARCHAR,
    phone_number VARCHAR,
    status payout_status,
    created_at TIMESTAMPTZ,
    provider_code provider_code
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.payout_id,
        p.amount,
        p.currency_code,
        p.payout_method,
        p.bank_account_number,
        p.bank_name,
        p.bank_code,
        p.phone_number,
        p.status,
        p.created_at,
        p.provider_code
    FROM 
        payouts p
    JOIN
        merchant_accounts ma ON p.account_id = ma.account_id
    WHERE 
        ma.merchant_id = p_merchant_id AND
        (p_status IS NULL OR p.status = ANY(p_status::payout_status[]))
    ORDER BY
        p.created_at DESC
    LIMIT p_page_size
    OFFSET ((p_page - 1) * p_page_size);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch payout count for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_payout_count(
    p_merchant_id UUID,
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
    v_payout_count INTEGER;
BEGIN
    SELECT 
        COUNT(*) INTO v_payout_count
    FROM 
        payouts p
    JOIN
        merchant_accounts ma ON p.account_id = ma.account_id
    WHERE 
        ma.merchant_id = p_merchant_id AND
        (p_start_date IS NULL OR p.created_at >= p_start_date) AND
        (p_end_date IS NULL OR p.created_at <= p_end_date);
        
    RETURN v_payout_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch the balance for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_balance(
    p_merchant_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
    v_balance NUMERIC;
BEGIN
    SELECT 
        COALESCE(SUM(balance), 0) INTO v_balance
    FROM 
        merchant_accounts
    WHERE 
        merchant_id = p_merchant_id;
        
    RETURN v_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;
