-- Function to perform natural language search on transactions
CREATE OR REPLACE FUNCTION public.search_transactions_nl(
    p_merchant_id UUID,
    p_query TEXT
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
DECLARE
    v_start_date DATE;
    v_end_date DATE;
    v_amount NUMERIC(10,2);
    v_currency currency_code;
    v_payment_method payment_method_code;
    v_status transaction_status;
    v_type transaction_type;
    v_provider provider_code;
BEGIN
    -- Here you would typically use a natural language processing model to parse the query
    -- For this example, we'll use a simple keyword matching approach

    -- Extract date range
    IF p_query ~* 'last month' THEN
        v_start_date := date_trunc('month', current_date - interval '1 month');
        v_end_date := date_trunc('month', current_date) - interval '1 day';
    ELSIF p_query ~* 'past 2 years' THEN
        v_start_date := date_trunc('year', current_date - interval '2 year');
        v_end_date := current_date;
    END IF;

    -- Extract amount
    IF p_query ~* 'amount[:>\s]+(\d+)' THEN
        v_amount := (regexp_matches(p_query, 'amount[:>\s]+(\d+)'))[1]::NUMERIC;
    END IF;

    -- Extract currency
    IF p_query ~* 'XOF' THEN
        v_currency := 'XOF';
    END IF;

    -- Extract payment method
    IF p_query ~* 'mobile money' THEN
        v_payment_method := 'MOBILE_MONEY';
    END IF;

    -- Extract status
    IF p_query ~* 'completed' THEN
        v_status := 'completed';
    END IF;

    -- Extract transaction type
    IF p_query ~* 'payment' THEN
        v_type := 'payment';
    END IF;

    -- Extract provider
    IF p_query ~* 'wave' THEN
        v_provider := 'WAVE';
    END IF;

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
        (v_start_date IS NULL OR t.created_at >= v_start_date) AND
        (v_end_date IS NULL OR t.created_at <= v_end_date) AND
        (v_amount IS NULL OR t.gross_amount = v_amount) AND
        (v_currency IS NULL OR t.currency_code = v_currency) AND
        (v_payment_method IS NULL OR t.payment_method_code = v_payment_method) AND
        (v_status IS NULL OR t.status = v_status) AND
        (v_type IS NULL OR t.transaction_type = v_type) AND
        (v_provider IS NULL OR t.provider_code = v_provider)
    ORDER BY
        t.created_at DESC
    LIMIT 100;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.search_transactions_nl(UUID, TEXT) TO authenticated;
