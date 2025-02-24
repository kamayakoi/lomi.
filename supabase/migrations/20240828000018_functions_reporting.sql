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

-- Function to fetch top-performing subscriptions for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_top_performing_subscriptions(
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
        COUNT(t.transaction_id) AS sales_count,
        SUM(t.net_amount) AS total_revenue
    FROM 
        transactions t
    JOIN 
        merchant_subscriptions s ON t.subscription_id = s.subscription_id
    JOIN
        subscription_plans p ON s.plan_id = p.plan_id
    WHERE 
        t.merchant_id = p_merchant_id AND
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
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_granularity VARCHAR(10) DEFAULT 'day'
)
RETURNS TABLE (
    date TIMESTAMP WITH TIME ZONE,
    transaction_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        CASE
            WHEN p_granularity = 'hour' THEN DATE_TRUNC('hour', t.created_at)
            WHEN p_granularity = 'day' THEN DATE_TRUNC('day', t.created_at)
            WHEN p_granularity = 'month' THEN DATE_TRUNC('month', t.created_at)
            ELSE DATE_TRUNC('day', t.created_at)
        END AS date,
        COUNT(*) AS transaction_count
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
            WHEN p_granularity = 'month' THEN DATE_TRUNC('month', t.created_at)
            ELSE DATE_TRUNC('day', t.created_at)
        END
    ORDER BY 
        date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch revenue data for the last 24 hours
CREATE OR REPLACE FUNCTION public.fetch_revenue_last_24_hours(
    p_merchant_id UUID
)
RETURNS TABLE (
    hour TIMESTAMP WITH TIME ZONE,
    revenue NUMERIC(15,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        DATE_TRUNC('hour', t.created_at) AS hour,
        SUM(t.net_amount) AS revenue
    FROM 
        transactions t
    WHERE 
        t.merchant_id = p_merchant_id AND
        t.status = 'completed' AND
        t.created_at >= NOW() - INTERVAL '24 hours'
    GROUP BY 
        DATE_TRUNC('hour', t.created_at)
    ORDER BY 
        hour;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch transaction volume for the last 24 hours
CREATE OR REPLACE FUNCTION public.fetch_transaction_volume_last_24_hours(
    p_merchant_id UUID
)
RETURNS TABLE (
    hour TIMESTAMP WITH TIME ZONE,
    transaction_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        DATE_TRUNC('hour', t.created_at) AS hour,
        COUNT(*) AS transaction_count
    FROM 
        transactions t
    WHERE 
        t.merchant_id = p_merchant_id AND
        t.status = 'completed' AND
        t.created_at >= NOW() - INTERVAL '24 hours'
    GROUP BY 
        DATE_TRUNC('hour', t.created_at)
    ORDER BY 
        hour;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch revenue data for the last 7 days
CREATE OR REPLACE FUNCTION public.fetch_revenue_last_7_days(
    p_merchant_id UUID
)
RETURNS TABLE (
    date DATE,
    revenue NUMERIC(15,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        DATE_TRUNC('day', t.created_at)::DATE AS date,
        SUM(t.net_amount) AS revenue
    FROM 
        transactions t
    WHERE 
        t.merchant_id = p_merchant_id AND
        t.status = 'completed' AND
        t.created_at >= NOW() - INTERVAL '7 days'
    GROUP BY 
        DATE_TRUNC('day', t.created_at)
    ORDER BY 
        date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch transaction volume for the last 7 days
CREATE OR REPLACE FUNCTION public.fetch_transaction_volume_last_7_days(
    p_merchant_id UUID
)
RETURNS TABLE (
    date DATE,
    transaction_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        DATE_TRUNC('day', t.created_at)::DATE AS date,
        COUNT(*) AS transaction_count
    FROM 
        transactions t
    WHERE 
        t.merchant_id = p_merchant_id AND
        t.status = 'completed' AND
        t.created_at >= NOW() - INTERVAL '7 days'
    GROUP BY 
        DATE_TRUNC('day', t.created_at)
    ORDER BY 
        date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch revenue data for the last 1 month
CREATE OR REPLACE FUNCTION public.fetch_revenue_last_1_month(
    p_merchant_id UUID
)
RETURNS TABLE (
    date DATE,
    revenue NUMERIC(15,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        DATE_TRUNC('day', t.created_at)::DATE AS date,
        SUM(t.net_amount) AS revenue
    FROM 
        transactions t
    WHERE 
        t.merchant_id = p_merchant_id AND
        t.status = 'completed' AND
        t.created_at >= DATE_TRUNC('month', NOW()) - INTERVAL '1 month'
    GROUP BY 
        DATE_TRUNC('day', t.created_at)
    ORDER BY 
        date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch transaction volume for the last 1 month
CREATE OR REPLACE FUNCTION public.fetch_transaction_volume_last_1_month(
    p_merchant_id UUID
)
RETURNS TABLE (
    date DATE,
    transaction_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        DATE_TRUNC('day', t.created_at)::DATE AS date,
        COUNT(*) AS transaction_count
    FROM 
        transactions t
    WHERE 
        t.merchant_id = p_merchant_id AND
        t.status = 'completed' AND
        t.created_at >= DATE_TRUNC('month', NOW()) - INTERVAL '1 month'
    GROUP BY 
        DATE_TRUNC('day', t.created_at)
    ORDER BY 
        date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch subscription data for a given transaction
CREATE OR REPLACE FUNCTION public.fetch_subscription_data(
    p_transaction_id UUID
)
RETURNS TABLE (
    subscription_id UUID,
    plan_name VARCHAR,
    plan_description TEXT,
    plan_billing_frequency frequency,
    subscription_end_date DATE,
    subscription_next_billing_date DATE,
    subscription_status subscription_status
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        ms.subscription_id,
        sp.name AS plan_name,
        sp.description AS plan_description,
        sp.billing_frequency AS plan_billing_frequency,
        ms.end_date AS subscription_end_date,
        ms.next_billing_date AS subscription_next_billing_date,
        ms.status AS subscription_status
    FROM
        transactions t
    LEFT JOIN
        merchant_subscriptions ms ON t.subscription_id = ms.subscription_id
    LEFT JOIN
        subscription_plans sp ON ms.plan_id = sp.plan_id
    WHERE
        t.transaction_id = p_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

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

-- Add the new function for time-based provider distribution
CREATE OR REPLACE FUNCTION public.fetch_provider_distribution_by_date(
    p_merchant_id UUID,
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS TABLE (
    date TIMESTAMP WITH TIME ZONE,
    provider_code provider_code,
    transaction_count BIGINT
) AS $$
BEGIN
    IF p_start_date IS NULL OR p_end_date IS NULL THEN
        RETURN QUERY
        SELECT 
            date_trunc('hour', t.created_at) AS date,
            t.provider_code,
            COUNT(*) AS transaction_count
        FROM 
            transactions t
        WHERE 
            t.merchant_id = p_merchant_id AND
            t.status = 'completed'
        GROUP BY 
            date_trunc('hour', t.created_at),
            t.provider_code
        ORDER BY 
            date, provider_code;
    ELSE
        RETURN QUERY
        WITH timepoints AS (
            SELECT generate_series(
                date_trunc('hour', p_start_date),
                date_trunc('hour', p_end_date),
                '1 hour'::interval
            ) AS timepoint
        )
        SELECT 
            t.timepoint as date,
            COALESCE(tr.provider_code, 'OTHER') as provider_code,
            COUNT(tr.transaction_id) as transaction_count
        FROM 
            timepoints t
        LEFT JOIN transactions tr ON 
            date_trunc('hour', tr.created_at) = t.timepoint AND
            tr.merchant_id = p_merchant_id AND
            tr.status = 'completed'
        GROUP BY 
            t.timepoint, tr.provider_code
        ORDER BY 
            t.timepoint, tr.provider_code;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch provider distribution for the last 24 hours
CREATE OR REPLACE FUNCTION public.fetch_provider_distribution_last_24_hours(
    p_merchant_id UUID
)
RETURNS TABLE (
    date TIMESTAMP WITH TIME ZONE,
    provider_code provider_code,
    transaction_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    WITH hours AS (
        SELECT generate_series(
            date_trunc('hour', NOW() - INTERVAL '24 hours'),
            date_trunc('hour', NOW()),
            '1 hour'::interval
        ) AS hour
    )
    SELECT 
        h.hour as date,
        COALESCE(t.provider_code, 'OTHER') as provider_code,
        COUNT(t.transaction_id) as transaction_count
    FROM 
        hours h
    LEFT JOIN transactions t ON 
        date_trunc('hour', t.created_at) = h.hour AND
        t.merchant_id = p_merchant_id AND
        t.status = 'completed'
    GROUP BY 
        h.hour, t.provider_code
    ORDER BY 
        h.hour, t.provider_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch provider distribution for the last 7 days
CREATE OR REPLACE FUNCTION public.fetch_provider_distribution_last_7_days(
    p_merchant_id UUID
)
RETURNS TABLE (
    date TIMESTAMP WITH TIME ZONE,
    provider_code provider_code,
    transaction_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    WITH days AS (
        SELECT generate_series(
            date_trunc('day', NOW() - INTERVAL '7 days'),
            date_trunc('day', NOW()),
            '1 day'::interval
        ) AS day
    )
    SELECT 
        d.day as date,
        COALESCE(t.provider_code, 'OTHER') as provider_code,
        COUNT(t.transaction_id) as transaction_count
    FROM 
        days d
    LEFT JOIN transactions t ON 
        date_trunc('day', t.created_at) = d.day AND
        t.merchant_id = p_merchant_id AND
        t.status = 'completed'
    GROUP BY 
        d.day, t.provider_code
    ORDER BY 
        d.day, t.provider_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch provider distribution for the last month
CREATE OR REPLACE FUNCTION public.fetch_provider_distribution_last_1_month(
    p_merchant_id UUID
)
RETURNS TABLE (
    date TIMESTAMP WITH TIME ZONE,
    provider_code provider_code,
    transaction_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    WITH days AS (
        SELECT generate_series(
            date_trunc('day', NOW() - INTERVAL '30 days'),
            date_trunc('day', NOW()),
            '1 day'::interval
        ) AS day
    )
    SELECT 
        d.day as date,
        COALESCE(t.provider_code, 'OTHER') as provider_code,
        COUNT(t.transaction_id) as transaction_count
    FROM 
        days d
    LEFT JOIN transactions t ON 
        date_trunc('day', t.created_at) = d.day AND
        t.merchant_id = p_merchant_id AND
        t.status = 'completed'
    GROUP BY 
        d.day, t.provider_code
    ORDER BY 
        d.day, t.provider_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch revenue data for the last 3 months
CREATE OR REPLACE FUNCTION public.fetch_revenue_last_3_months(
    p_merchant_id UUID
)
RETURNS TABLE (
    date DATE,
    revenue NUMERIC(15,2)
) AS $$
BEGIN
    RETURN QUERY
    WITH days AS (
        SELECT generate_series(
            date_trunc('day', NOW() - INTERVAL '3 months'),
            date_trunc('day', NOW()),
            '1 day'::interval
        ) AS day
    )
    SELECT 
        d.day::DATE as date,
        COALESCE(SUM(t.net_amount), 0) as revenue
    FROM 
        days d
    LEFT JOIN transactions t ON 
        date_trunc('day', t.created_at) = d.day AND
        t.merchant_id = p_merchant_id AND
        t.status = 'completed'
    GROUP BY 
        d.day
    ORDER BY 
        d.day;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch revenue data for the last 6 months
CREATE OR REPLACE FUNCTION public.fetch_revenue_last_6_months(
    p_merchant_id UUID
)
RETURNS TABLE (
    date DATE,
    revenue NUMERIC(15,2)
) AS $$
BEGIN
    RETURN QUERY
    WITH days AS (
        SELECT generate_series(
            date_trunc('day', NOW() - INTERVAL '6 months'),
            date_trunc('day', NOW()),
            '1 day'::interval
        ) AS day
    )
    SELECT 
        d.day::DATE as date,
        COALESCE(SUM(t.net_amount), 0) as revenue
    FROM 
        days d
    LEFT JOIN transactions t ON 
        date_trunc('day', t.created_at) = d.day AND
        t.merchant_id = p_merchant_id AND
        t.status = 'completed'
    GROUP BY 
        d.day
    ORDER BY 
        d.day;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch revenue data for year to date
CREATE OR REPLACE FUNCTION public.fetch_revenue_ytd(
    p_merchant_id UUID
)
RETURNS TABLE (
    date DATE,
    revenue NUMERIC(15,2)
) AS $$
BEGIN
    RETURN QUERY
    WITH days AS (
        SELECT generate_series(
            date_trunc('year', NOW()),
            date_trunc('day', NOW()),
            '1 day'::interval
        ) AS day
    )
    SELECT 
        d.day::DATE as date,
        COALESCE(SUM(t.net_amount), 0) as revenue
    FROM 
        days d
    LEFT JOIN transactions t ON 
        date_trunc('day', t.created_at) = d.day AND
        t.merchant_id = p_merchant_id AND
        t.status = 'completed'
    GROUP BY 
        d.day
    ORDER BY 
        d.day;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch provider distribution for the last 3 months
CREATE OR REPLACE FUNCTION public.fetch_provider_distribution_last_3_months(
    p_merchant_id UUID
)
RETURNS TABLE (
    date TIMESTAMP WITH TIME ZONE,
    provider_code provider_code,
    transaction_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    WITH days AS (
        SELECT generate_series(
            date_trunc('day', NOW() - INTERVAL '3 months'),
            date_trunc('day', NOW()),
            '1 day'::interval
        ) AS day
    )
    SELECT 
        d.day as date,
        COALESCE(t.provider_code, 'OTHER') as provider_code,
        COUNT(t.transaction_id) as transaction_count
    FROM 
        days d
    LEFT JOIN transactions t ON 
        date_trunc('day', t.created_at) = d.day AND
        t.merchant_id = p_merchant_id AND
        t.status = 'completed'
    GROUP BY 
        d.day, t.provider_code
    ORDER BY 
        d.day, t.provider_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch provider distribution for the last 6 months
CREATE OR REPLACE FUNCTION public.fetch_provider_distribution_last_6_months(
    p_merchant_id UUID
)
RETURNS TABLE (
    date TIMESTAMP WITH TIME ZONE,
    provider_code provider_code,
    transaction_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    WITH days AS (
        SELECT generate_series(
            date_trunc('day', NOW() - INTERVAL '6 months'),
            date_trunc('day', NOW()),
            '1 day'::interval
        ) AS day
    )
    SELECT 
        d.day as date,
        COALESCE(t.provider_code, 'OTHER') as provider_code,
        COUNT(t.transaction_id) as transaction_count
    FROM 
        days d
    LEFT JOIN transactions t ON 
        date_trunc('day', t.created_at) = d.day AND
        t.merchant_id = p_merchant_id AND
        t.status = 'completed'
    GROUP BY 
        d.day, t.provider_code
    ORDER BY 
        d.day, t.provider_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch provider distribution for year to date
CREATE OR REPLACE FUNCTION public.fetch_provider_distribution_ytd(
    p_merchant_id UUID
)
RETURNS TABLE (
    date TIMESTAMP WITH TIME ZONE,
    provider_code provider_code,
    transaction_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    WITH days AS (
        SELECT generate_series(
            date_trunc('year', NOW()),
            date_trunc('day', NOW()),
            '1 day'::interval
        ) AS day
    )
    SELECT 
        d.day as date,
        COALESCE(t.provider_code, 'OTHER') as provider_code,
        COUNT(t.transaction_id) as transaction_count
    FROM 
        days d
    LEFT JOIN transactions t ON 
        date_trunc('day', t.created_at) = d.day AND
        t.merchant_id = p_merchant_id AND
        t.status = 'completed'
    GROUP BY 
        d.day, t.provider_code
    ORDER BY 
        d.day, t.provider_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch revenue data for custom date range with continuous data points
CREATE OR REPLACE FUNCTION public.fetch_revenue_custom_range(
    p_merchant_id UUID,
    p_start_date TIMESTAMP WITH TIME ZONE,
    p_end_date TIMESTAMP WITH TIME ZONE
)
RETURNS TABLE (
    date DATE,
    revenue NUMERIC(15,2)
) AS $$
BEGIN
    RETURN QUERY
    WITH days AS (
        SELECT generate_series(
            date_trunc('day', p_start_date),
            date_trunc('day', p_end_date),
            '1 day'::interval
        ) AS day
    )
    SELECT 
        d.day::DATE as date,
        COALESCE(SUM(t.net_amount), 0) as revenue
    FROM 
        days d
    LEFT JOIN transactions t ON 
        date_trunc('day', t.created_at) = d.day AND
        t.merchant_id = p_merchant_id AND
        t.status = 'completed'
    GROUP BY 
        d.day
    ORDER BY 
        d.day;
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
