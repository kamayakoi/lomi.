-- Function to fetch revenue data by month for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_revenue_by_month(
    p_merchant_id UUID,
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS TABLE (
    month TEXT,
    revenue NUMERIC(15,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        to_char(date_trunc('month', t.created_at), 'Mon') AS month,
        SUM(t.net_amount) AS revenue
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

-- Function to fetch transaction volume by day of the week for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_transaction_volume_by_day(
    p_merchant_id UUID,
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS TABLE (
    day_of_week TEXT,
    transaction_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        to_char(t.created_at, 'Day') AS day_of_week,
        COUNT(*) AS transaction_count
    FROM 
        transactions t
    WHERE 
        t.merchant_id = p_merchant_id AND
        t.status = 'completed' AND
        (p_start_date IS NULL OR t.created_at >= p_start_date) AND
        (p_end_date IS NULL OR t.created_at <= p_end_date)
    GROUP BY 
        to_char(t.created_at, 'Day')
    ORDER BY 
        CASE to_char(t.created_at, 'Day')
            WHEN 'Monday' THEN 1
            WHEN 'Tuesday' THEN 2
            WHEN 'Wednesday' THEN 3
            WHEN 'Thursday' THEN 4
            WHEN 'Friday' THEN 5
            WHEN 'Saturday' THEN 6
            WHEN 'Sunday' THEN 7
        END;
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

-- Function to calculate the conversion rate for a specific merchant
CREATE OR REPLACE FUNCTION public.calculate_conversion_rate(
    p_merchant_id UUID,
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS NUMERIC AS $$
DECLARE
    v_total_transactions INTEGER;
    v_completed_transactions INTEGER;
    v_conversion_rate NUMERIC;
BEGIN
    SELECT 
        COUNT(*) INTO v_total_transactions
    FROM 
        transactions
    WHERE 
        merchant_id = p_merchant_id AND
        (p_start_date IS NULL OR created_at >= p_start_date) AND
        (p_end_date IS NULL OR created_at <= p_end_date);
        
    SELECT 
        COUNT(*) INTO v_completed_transactions
    FROM 
        transactions
    WHERE 
        merchant_id = p_merchant_id AND
        status = 'completed' AND
        (p_start_date IS NULL OR created_at >= p_start_date) AND
        (p_end_date IS NULL OR created_at <= p_end_date);
        
    IF v_total_transactions > 0 THEN
        v_conversion_rate := (v_completed_transactions * 100.0) / v_total_transactions;
    ELSE
        v_conversion_rate := 0;
    END IF;
    
    RETURN ROUND(v_conversion_rate, 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;
