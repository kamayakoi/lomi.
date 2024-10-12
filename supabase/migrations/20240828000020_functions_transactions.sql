-- Function to fetch transactions for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_transactions(
    p_merchant_id UUID,
    p_provider_code provider_code DEFAULT NULL,
    p_status transaction_status[] DEFAULT NULL,
    p_type transaction_type[] DEFAULT NULL,
    p_currency currency_code[] DEFAULT NULL,
    p_payment_method payment_method_code[] DEFAULT NULL,
    p_page INTEGER DEFAULT 1,
    p_page_size INTEGER DEFAULT 50
)
RETURNS TABLE (
    transaction_id UUID,
    customer_name VARCHAR,
    customer_email VARCHAR,
    customer_phone VARCHAR,
    customer_country VARCHAR,
    customer_city VARCHAR,
    customer_address VARCHAR,
    customer_postal_code VARCHAR,
    gross_amount NUMERIC(10,2),
    net_amount NUMERIC(10,2),
    currency_code currency_code,
    payment_method_code payment_method_code,
    status transaction_status,
    transaction_type transaction_type,
    created_at TIMESTAMPTZ,
    provider_code provider_code,
    product_id UUID,
    subscription_id UUID,
    product_name VARCHAR,
    product_description TEXT,
    product_price NUMERIC(10,2),
    subscription_name VARCHAR,
    subscription_description TEXT,
    subscription_status subscription_status,
    subscription_start_date DATE,
    subscription_end_date DATE,
    subscription_next_billing_date DATE,
    subscription_billing_frequency frequency,
    subscription_amount NUMERIC(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.transaction_id,
        c.name AS customer_name,
        c.email AS customer_email,
        c.phone_number AS customer_phone,
        c.country AS customer_country,
        c.city AS customer_city,
        c.address AS customer_address,
        c.postal_code AS customer_postal_code,
        t.gross_amount,
        t.net_amount,
        t.currency_code,
        t.payment_method_code,
        t.status,
        t.transaction_type,
        t.created_at,
        t.provider_code,
        t.product_id,
        t.subscription_id,
        p.name AS product_name,
        p.description AS product_description,
        p.price AS product_price,
        s.name AS subscription_name,
        s.description AS subscription_description,
        s.status AS subscription_status,
        s.start_date AS subscription_start_date,
        s.end_date AS subscription_end_date,
        s.next_billing_date AS subscription_next_billing_date,
        s.billing_frequency AS subscription_billing_frequency,
        s.amount AS subscription_amount
    FROM 
        transactions t
    JOIN
        customers c ON t.customer_id = c.customer_id
    LEFT JOIN
        merchant_products p ON t.product_id = p.product_id
    LEFT JOIN
        merchant_subscriptions s ON t.subscription_id = s.subscription_id
    WHERE 
        t.merchant_id = p_merchant_id AND
        (p_provider_code IS NULL OR t.provider_code = p_provider_code) AND
        (p_status IS NULL OR t.status = ANY(p_status)) AND
        (p_type IS NULL OR t.transaction_type = ANY(p_type)) AND
        (p_currency IS NULL OR t.currency_code = ANY(p_currency)) AND
        (p_payment_method IS NULL OR t.payment_method_code = ANY(p_payment_method))
    ORDER BY
        t.created_at DESC
    LIMIT p_page_size
    OFFSET ((p_page - 1) * p_page_size);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch total incoming amount for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_total_incoming_amount(
    p_merchant_id UUID,
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS NUMERIC(15,2) AS $$
DECLARE
    v_total_incoming NUMERIC(15,2);
BEGIN
    SELECT 
        COALESCE(SUM(t.net_amount), 0) - COALESCE(SUM(r.amount), 0) INTO v_total_incoming
    FROM 
        transactions t
    LEFT JOIN
        refunds r ON t.transaction_id = r.transaction_id
    WHERE 
        t.merchant_id = p_merchant_id AND
        t.status = 'completed' AND
        t.transaction_type IN ('payment', 'instalment') AND
        (p_start_date IS NULL OR t.created_at >= p_start_date) AND
        (p_end_date IS NULL OR t.created_at <= p_end_date);
        
    RETURN ROUND(v_total_incoming, 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch the number of transactions for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_transaction_count(
    p_merchant_id UUID,
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
    v_transaction_count INTEGER;
BEGIN
    SELECT 
        COUNT(*) INTO v_transaction_count
    FROM 
        transactions
    WHERE 
        merchant_id = p_merchant_id AND
        transaction_type IN ('payment', 'instalment') AND
        status IN ('completed', 'pending', 'refunded') AND
        (p_start_date IS NULL OR created_at >= p_start_date) AND
        (p_end_date IS NULL OR created_at <= p_end_date);
        
    RETURN v_transaction_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch completion rate data for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_completion_rate(
    p_merchant_id UUID,
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS TABLE (
    completed INTEGER,
    refunded INTEGER,
    failed INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*) FILTER (WHERE status = 'completed') AS completed,
        COUNT(*) FILTER (WHERE status = 'refunded') AS refunded,
        COUNT(*) FILTER (WHERE status = 'failed') AS failed
    FROM
        transactions
    WHERE
        merchant_id = p_merchant_id AND
        transaction_type IN ('payment', 'instalment') AND
        (p_start_date IS NULL OR created_at >= p_start_date) AND
        (p_end_date IS NULL OR created_at <= p_end_date);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;
