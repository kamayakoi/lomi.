-- Function to fetch transactions for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_transactions(p_merchant_id UUID)
RETURNS TABLE (
    transaction_id UUID,
    customer_name VARCHAR,
    gross_amount NUMERIC(10,2),
    net_amount NUMERIC(10,2),
    currency_code VARCHAR,
    payment_method_code VARCHAR,
    status VARCHAR,
    transaction_type VARCHAR,
    created_at TIMESTAMPTZ
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
        t.created_at
    FROM 
        transactions t
    JOIN
        customers c ON t.customer_id = c.customer_id
    WHERE 
        t.merchant_id = p_merchant_id;
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