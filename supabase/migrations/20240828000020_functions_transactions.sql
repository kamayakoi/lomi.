-- Function to fetch transactions for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_transactions(
    p_merchant_id UUID,
    p_start_date DATE DEFAULT NULL,
    p_end_date DATE DEFAULT NULL,
    p_provider_code provider_code DEFAULT NULL,
    p_status transaction_status[] DEFAULT NULL,
    p_type transaction_type[] DEFAULT NULL,
    p_currency currency_code[] DEFAULT NULL,
    p_payment_method payment_method_code[] DEFAULT NULL
)
RETURNS TABLE (
    transaction_id UUID,
    customer_name VARCHAR,
    gross_amount NUMERIC(10,2),
    net_amount NUMERIC(10,2),
    currency_code currency_code,
    payment_method_code payment_method_code,
    status transaction_status,
    transaction_type transaction_type,
    created_at TIMESTAMPTZ,
    provider_code provider_code
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.transaction_id,
        c.name AS customer_name,
        t.gross_amount,
        t.net_amount,
        t.currency_code,
        t.payment_method_code,
        t.status,
        t.transaction_type,
        t.created_at,
        t.provider_code
    FROM 
        transactions t
    JOIN
        customers c ON t.customer_id = c.customer_id
    WHERE 
        t.merchant_id = p_merchant_id AND
        (p_start_date IS NULL OR t.created_at >= p_start_date) AND
        (p_end_date IS NULL OR t.created_at <= p_end_date) AND
        (p_provider_code IS NULL OR t.provider_code = p_provider_code) AND
        (p_status IS NULL OR t.status = ANY(p_status)) AND
        (p_type IS NULL OR t.transaction_type = ANY(p_type)) AND
        (p_currency IS NULL OR t.currency_code = ANY(p_currency)) AND
        (p_payment_method IS NULL OR t.payment_method_code = ANY(p_payment_method));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch total incoming amount for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_total_incoming_amount(p_merchant_id UUID)
RETURNS NUMERIC(15,2) AS $$
DECLARE
    v_total_incoming NUMERIC(15,2);
BEGIN
    SELECT 
        COALESCE(SUM(net_amount), 0) INTO v_total_incoming
    FROM 
        transactions
    WHERE 
        merchant_id = p_merchant_id AND
        status = 'completed' AND
        transaction_type = 'payment';
        
    RETURN v_total_incoming;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch total outgoing amount for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_total_outgoing_amount(p_merchant_id UUID)
RETURNS NUMERIC(15,2) AS $$
DECLARE
    v_total_outgoing NUMERIC(15,2);
BEGIN
    SELECT 
        COALESCE(SUM(refunded_amount), 0) INTO v_total_outgoing
    FROM 
        refunds r
    JOIN
        transactions t ON r.transaction_id = t.transaction_id
    WHERE 
        t.merchant_id = p_merchant_id AND
        r.status = 'completed';
        
    RETURN v_total_outgoing;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;