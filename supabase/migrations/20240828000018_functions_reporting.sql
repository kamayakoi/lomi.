-- Function to fetch top-performing subscription plans for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_top_performing_subscription_plans(
    p_merchant_id UUID,
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
    plan_name VARCHAR,
    sales_count BIGINT,
    total_revenue NUMERIC(15,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.name AS plan_name,
        COUNT(s.subscription_id) AS sales_count,
        SUM(t.net_amount) AS total_revenue
    FROM 
        transactions t
    JOIN 
        merchant_subscriptions s ON t.subscription_id = s.subscription_id
    JOIN
        subscription_plans p ON s.plan_id = p.plan_id
    WHERE 
        p.merchant_id = p_merchant_id AND
        t.status = 'completed' AND
        t.transaction_type = 'instalment' AND
        (p_start_date IS NULL OR t.created_at >= p_start_date) AND
        (p_end_date IS NULL OR t.created_at <= p_end_date)
    GROUP BY 
        p.name
    ORDER BY 
        total_revenue DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch provider distribution for custom date range with continuous data points
CREATE OR REPLACE FUNCTION public.fetch_provider_distribution_custom_range(
    p_merchant_id UUID,
    p_start_date TIMESTAMP WITH TIME ZONE,
    p_end_date TIMESTAMP WITH TIME ZONE
)
RETURNS TABLE (
    date TIMESTAMP WITH TIME ZONE,
    provider_code provider_code,
    transaction_count BIGINT
) AS $$
DECLARE
    v_interval interval;
    v_date_trunc text;
BEGIN
    -- Calculate the interval based on the date range
    IF p_end_date - p_start_date <= interval '24 hours' THEN
        v_interval := '1 hour'::interval;
        v_date_trunc := 'hour';
    ELSIF p_end_date - p_start_date <= interval '7 days' THEN
        v_interval := '1 hour'::interval;
        v_date_trunc := 'hour';
    ELSE
        -- For all other periods, use daily granularity
        v_interval := '1 day'::interval;
        v_date_trunc := 'day';
    END IF;

    -- Get all unique provider codes for the period
    RETURN QUERY
    WITH providers AS (
        SELECT DISTINCT t.provider_code
        FROM transactions t
        WHERE t.merchant_id = p_merchant_id
            AND t.created_at BETWEEN p_start_date AND p_end_date
            AND t.status = 'completed'
    ),
    timepoints AS (
        SELECT generate_series(
            date_trunc(v_date_trunc, p_start_date),
            date_trunc(v_date_trunc, p_end_date),
            v_interval
        ) AS timepoint
    ),
    time_provider_cross AS (
        SELECT t.timepoint, p.provider_code
        FROM timepoints t
        CROSS JOIN providers p
    )
    SELECT 
        tcp.timepoint as date,
        tcp.provider_code as provider_code,
        COUNT(tr.transaction_id) as transaction_count
    FROM 
        time_provider_cross tcp
    LEFT JOIN transactions tr ON 
        date_trunc(v_date_trunc, tr.created_at) = date_trunc(v_date_trunc, tcp.timepoint)
        AND tr.provider_code = tcp.provider_code
        AND tr.merchant_id = p_merchant_id 
        AND tr.status = 'completed'
    GROUP BY 
        tcp.timepoint, tcp.provider_code
    ORDER BY 
        tcp.timepoint, tcp.provider_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch revenue data for custom date range with continuous data points
CREATE OR REPLACE FUNCTION public.fetch_revenue_custom_range(
    p_merchant_id UUID,
    p_start_date TIMESTAMP WITH TIME ZONE,
    p_end_date TIMESTAMP WITH TIME ZONE
)
RETURNS TABLE (
    date TIMESTAMP WITH TIME ZONE,
    revenue NUMERIC(15,2)
) AS $$
DECLARE
    v_interval interval;
    v_date_trunc text;
BEGIN
    -- Calculate the interval based on the date range
    IF p_end_date - p_start_date <= interval '24 hours' THEN
        v_interval := '1 hour'::interval;
        v_date_trunc := 'hour';
    ELSIF p_end_date - p_start_date <= interval '7 days' THEN
        v_interval := '1 hour'::interval;
        v_date_trunc := 'hour';
    ELSE
        -- For all other periods, use daily granularity
        v_interval := '1 day'::interval;
        v_date_trunc := 'day';
    END IF;

    RETURN QUERY
    WITH timepoints AS (
        SELECT generate_series(
            date_trunc(v_date_trunc, p_start_date),
            date_trunc(v_date_trunc, p_end_date),
            v_interval
        ) AS timepoint
    )
    SELECT 
        t.timepoint as date,
        COALESCE(SUM(tr.net_amount), 0) as revenue
    FROM 
        timepoints t
    LEFT JOIN transactions tr ON 
        date_trunc(v_date_trunc, tr.created_at) = date_trunc(v_date_trunc, t.timepoint)
        AND tr.merchant_id = p_merchant_id 
        AND tr.status = 'completed'
    GROUP BY 
        t.timepoint
    ORDER BY 
        t.timepoint;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;
