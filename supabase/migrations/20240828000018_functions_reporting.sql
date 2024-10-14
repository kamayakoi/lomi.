-- Function to fetch revenue data by month for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_revenue_by_month(
    p_merchant_id UUID,
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS TABLE (
    date DATE,
    month TEXT,
    revenue NUMERIC(15,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        DATE_TRUNC('day', t.created_at)::DATE AS date,
        to_char(DATE_TRUNC('month', t.created_at), 'Mon') AS month,
        SUM(t.net_amount) AS revenue
    FROM 
        transactions t
    WHERE 
        t.merchant_id = p_merchant_id AND
        t.status = 'completed' AND
        (p_start_date IS NULL OR t.created_at >= p_start_date) AND
        (p_end_date IS NULL OR t.created_at <= p_end_date)
    GROUP BY 
        DATE_TRUNC('day', t.created_at),
        DATE_TRUNC('month', t.created_at)
    ORDER BY 
        DATE_TRUNC('day', t.created_at);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch transaction volume by month for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_transaction_volume_by_month(
    p_merchant_id UUID,
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS TABLE (
    month TEXT,
    transaction_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        to_char(date_trunc('month', t.created_at), 'Mon') AS month,
        COUNT(*) AS transaction_count
    FROM 
        transactions t
    WHERE 
        t.merchant_id = p_merchant_id AND
        t.status = 'completed' AND
        (p_start_date IS NULL OR t.created_at >= p_start_date) AND
        (p_end_date IS NULL OR t.created_at <= p_end_date)
    GROUP BY 
        date_trunc('month', t.created_at)
    ORDER BY 
        date_trunc('month', t.created_at);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch top-performing products for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_top_performing_products(
    p_merchant_id UUID,
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
    product_name VARCHAR,
    sales_count BIGINT,
    total_revenue NUMERIC(15,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.name AS product_name,
        COUNT(t.transaction_id) AS sales_count,
        SUM(t.net_amount) AS total_revenue
    FROM 
        transactions t
    JOIN 
        merchant_products p ON t.product_id = p.product_id
    WHERE 
        t.merchant_id = p_merchant_id AND
        t.status = 'completed' AND
        (p_start_date IS NULL OR t.created_at >= p_start_date) AND
        (p_end_date IS NULL OR t.created_at <= p_end_date)
    GROUP BY 
        p.name
    ORDER BY 
        total_revenue DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch payment channel distribution for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_payment_channel_distribution(
    p_merchant_id UUID,
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS TABLE (
    payment_method_code payment_method_code,
    transaction_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.payment_method_code,
        COUNT(*) AS transaction_count
    FROM 
        transactions t
    WHERE 
        t.merchant_id = p_merchant_id AND
        t.status = 'completed' AND
        (p_start_date IS NULL OR t.created_at >= p_start_date) AND
        (p_end_date IS NULL OR t.created_at <= p_end_date)
    GROUP BY 
        t.payment_method_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch the number of new customers for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_new_customer_count(
    p_merchant_id UUID,
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
    v_new_customer_count INTEGER;
BEGIN
    SELECT 
        COUNT(DISTINCT c.customer_id) INTO v_new_customer_count
    FROM 
        customers c
    JOIN 
        transactions t ON c.customer_id = t.customer_id
    WHERE 
        c.merchant_id = p_merchant_id AND
        t.status = 'completed' AND
        (p_start_date IS NULL OR c.created_at >= p_start_date) AND
        (p_end_date IS NULL OR c.created_at <= p_end_date);
        
    RETURN v_new_customer_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch the change in new customer count for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_new_customer_count_change(
    p_merchant_id UUID,
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS NUMERIC AS $$
DECLARE
    v_current_period_count INTEGER;
    v_previous_period_count INTEGER;
    v_change_percentage NUMERIC;
    v_interval INTERVAL;
BEGIN
    SELECT 
        COUNT(DISTINCT c.customer_id) INTO v_current_period_count
    FROM 
        customers c
    JOIN 
        transactions t ON c.customer_id = t.customer_id
    WHERE 
        c.merchant_id = p_merchant_id AND
        t.status = 'completed' AND
        (p_start_date IS NULL OR c.created_at >= p_start_date) AND
        (p_end_date IS NULL OR c.created_at <= p_end_date);
        
    IF p_start_date IS NULL OR p_end_date IS NULL THEN
        v_interval := '1 month';
    ELSE
        v_interval := p_end_date - p_start_date;
    END IF;
        
    SELECT 
        COUNT(DISTINCT c.customer_id) INTO v_previous_period_count
    FROM 
        customers c
    JOIN 
        transactions t ON c.customer_id = t.customer_id
    WHERE 
        c.merchant_id = p_merchant_id AND
        t.status = 'completed' AND
        c.created_at >= (p_start_date - v_interval) AND
        c.created_at < p_start_date;
        
    IF v_previous_period_count > 0 THEN
        v_change_percentage := ((v_current_period_count - v_previous_period_count) * 100.0) / v_previous_period_count;
    ELSE
        v_change_percentage := 0;
    END IF;
    
    RETURN ROUND(v_change_percentage, 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch top-performing subscriptions for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_top_performing_subscriptions(
    p_merchant_id UUID,
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
    subscription_name VARCHAR,
    sales_count BIGINT,
    total_revenue NUMERIC(15,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.name AS subscription_name,
        COUNT(t.transaction_id) AS sales_count,
        SUM(t.net_amount) AS total_revenue
    FROM 
        transactions t
    JOIN 
        subscriptions s ON t.subscription_id = s.subscription_id
    WHERE 
        t.merchant_id = p_merchant_id AND
        t.status = 'completed' AND
        (p_start_date IS NULL OR t.created_at >= p_start_date) AND
        (p_end_date IS NULL OR t.created_at <= p_end_date)
    GROUP BY 
        s.name
    ORDER BY 
        total_revenue DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Add the following function
CREATE OR REPLACE FUNCTION public.fetch_provider_distribution(
    p_merchant_id UUID,
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS TABLE (
    provider_code provider_code,
    transaction_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.provider_code,
        COUNT(*) AS transaction_count
    FROM 
        transactions t
    WHERE 
        t.merchant_id = p_merchant_id AND
        t.status = 'completed' AND
        (p_start_date IS NULL OR t.created_at >= p_start_date) AND
        (p_end_date IS NULL OR t.created_at <= p_end_date)
    GROUP BY 
        t.provider_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch revenue data by date for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_revenue_by_date(
    p_merchant_id UUID,
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_granularity VARCHAR(10) DEFAULT 'day'
)
RETURNS TABLE (
    date TIMESTAMP WITH TIME ZONE,
    revenue NUMERIC(15,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        CASE
            WHEN p_granularity = 'hour' THEN DATE_TRUNC('hour', t.created_at)
            WHEN p_granularity = 'day' THEN DATE_TRUNC('day', t.created_at)
            WHEN p_granularity = 'week' THEN DATE_TRUNC('week', t.created_at)
            WHEN p_granularity = 'month' THEN DATE_TRUNC('month', t.created_at)
            ELSE DATE_TRUNC('day', t.created_at)
        END AS date,
        SUM(t.net_amount) AS revenue
    FROM 
        transactions t
    WHERE 
        t.merchant_id = p_merchant_id AND
        t.status = 'completed' AND
        (p_start_date IS NULL OR t.created_at >= p_start_date) AND
        (p_end_date IS NULL OR t.created_at <= p_end_date)
    GROUP BY 
        CASE
            WHEN p_granularity = 'hour' THEN DATE_TRUNC('hour', t.created_at)
            WHEN p_granularity = 'day' THEN DATE_TRUNC('day', t.created_at)
            WHEN p_granularity = 'week' THEN DATE_TRUNC('week', t.created_at)
            WHEN p_granularity = 'month' THEN DATE_TRUNC('month', t.created_at)
            ELSE DATE_TRUNC('day', t.created_at)
        END
    ORDER BY 
        date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch transaction volume by date for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_transaction_volume_by_date(
    p_merchant_id UUID,
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS TABLE (
    date TIMESTAMP WITH TIME ZONE,
    transaction_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        DATE_TRUNC('hour', t.created_at) AS date,
        COUNT(*) AS transaction_count
    FROM 
        transactions t
    WHERE 
        t.merchant_id = p_merchant_id AND
        t.status = 'completed' AND
        (p_start_date IS NULL OR t.created_at >= p_start_date) AND
        (p_end_date IS NULL OR t.created_at <= p_end_date)
    GROUP BY 
        DATE_TRUNC('hour', t.created_at)
    ORDER BY 
        DATE_TRUNC('hour', t.created_at);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;
