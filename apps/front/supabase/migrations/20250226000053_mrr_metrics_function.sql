-- Create the MRR metrics function with improved historical data handling
CREATE OR REPLACE FUNCTION public.fetch_mrr_metrics_custom_range(
    p_merchant_id UUID,
    p_start_date TIMESTAMP WITH TIME ZONE,
    p_end_date TIMESTAMP WITH TIME ZONE
)
RETURNS TABLE (
    date TIMESTAMP WITH TIME ZONE,
    mrr NUMERIC(15,2)
) AS $$
DECLARE
    v_interval interval;
    v_date_trunc text;
    v_current_mrr numeric(15,2);
    v_subscription_count integer;
    v_date_range_days integer;
    v_oldest_subscription_date date;
    v_has_historical_data boolean;
    v_series_start timestamp with time zone;
    v_series_end timestamp with time zone;
    v_latest_end_date date;
    v_today date;
BEGIN
    -- Get today's date
    v_today := CURRENT_DATE;

    -- Calculate the date range in days
    v_date_range_days := EXTRACT(DAY FROM (p_end_date - p_start_date));
    
    -- Calculate the interval based on the date range
    IF p_end_date - p_start_date <= interval '24 hours' THEN
        v_interval := '1 hour'::interval;
        v_date_trunc := 'hour';
    ELSIF p_end_date - p_start_date <= interval '7 days' THEN
        v_interval := '1 day'::interval;
        v_date_trunc := 'day';
    ELSIF p_end_date - p_start_date <= interval '31 days' THEN
        v_interval := '1 day'::interval;
        v_date_trunc := 'day';
    ELSIF p_end_date - p_start_date <= interval '90 days' THEN
        -- For 3 months, use weekly granularity to avoid too many points
        v_interval := '7 days'::interval;
        v_date_trunc := 'day';
    ELSIF p_end_date - p_start_date <= interval '180 days' THEN
        -- For 6 months, use bi-weekly granularity
        v_interval := '14 days'::interval;
        v_date_trunc := 'day';
    ELSE
        -- For longer periods, use monthly granularity
        v_interval := '30 days'::interval;
        v_date_trunc := 'day';
    END IF;

    -- Get the current MRR for this merchant
    SELECT COALESCE(SUM(
        CASE 
            WHEN sp.billing_frequency = 'monthly' THEN sp.amount
            WHEN sp.billing_frequency = 'yearly' THEN sp.amount / 12
            WHEN sp.billing_frequency = 'quarterly' THEN sp.amount / 3
            WHEN sp.billing_frequency = 'bi-monthly' THEN sp.amount / 2
            WHEN sp.billing_frequency = 'semi-annual' THEN sp.amount / 6
            WHEN sp.billing_frequency = 'weekly' THEN sp.amount * 4
            WHEN sp.billing_frequency = 'bi-weekly' THEN sp.amount * 2
            ELSE 0
        END
    ), 0)
    INTO v_current_mrr
    FROM merchant_subscriptions ms
    JOIN subscription_plans sp ON ms.plan_id = sp.plan_id
    WHERE ms.merchant_id = p_merchant_id
    AND ms.status = 'active';

    -- Count active subscriptions
    SELECT COUNT(*)
    INTO v_subscription_count
    FROM merchant_subscriptions
    WHERE merchant_id = p_merchant_id
    AND status = 'active';
    
    -- Find the oldest subscription date for this merchant
    SELECT MIN(created_at)::date
    INTO v_oldest_subscription_date
    FROM merchant_subscriptions
    WHERE merchant_id = p_merchant_id;
    
    -- Find the latest end date for subscriptions
    SELECT MAX(end_date)::date
    INTO v_latest_end_date
    FROM merchant_subscriptions
    WHERE merchant_id = p_merchant_id
    AND end_date IS NOT NULL;
    
    -- Determine if we need to show historical data
    v_has_historical_data := v_oldest_subscription_date IS NOT NULL AND v_oldest_subscription_date <= v_today;

    -- Set up the series start and end to ensure we include the end date
    v_series_start := date_trunc(v_date_trunc, p_start_date);
    v_series_end := date_trunc(v_date_trunc, p_end_date);
    
    -- Ensure the end date is included by adjusting the series end if needed
    IF v_series_end < p_end_date THEN
        v_series_end := v_series_end + v_interval;
    END IF;

    -- Debug logging
    RAISE NOTICE 'MRR calculation for merchant % from % to % with interval % (% days)', 
        p_merchant_id, p_start_date, p_end_date, v_interval, v_date_range_days;
    RAISE NOTICE 'Current MRR: %, Active subscriptions: %, Oldest subscription date: %, Latest end date: %, Today: %', 
        v_current_mrr, v_subscription_count, v_oldest_subscription_date, v_latest_end_date, v_today;
    RAISE NOTICE 'Series will run from % to % with interval %',
        v_series_start, v_series_end, v_interval;

    -- Generate timepoints for the requested date range
    RETURN QUERY
    WITH timepoints AS (
        SELECT generate_series(
            v_series_start,
            v_series_end,
            v_interval
        ) AS timepoint
    ),
    -- For historical and future data with accurate representation
    historical_mrr AS (
        SELECT 
            t.timepoint,
            CASE
                -- For future dates, calculate based on subscriptions that will still be active
                WHEN DATE(t.timepoint) > v_today THEN
                    (
                        SELECT COALESCE(SUM(
                            CASE 
                                WHEN sp.billing_frequency = 'monthly' THEN sp.amount
                                WHEN sp.billing_frequency = 'yearly' THEN sp.amount / 12
                                WHEN sp.billing_frequency = 'quarterly' THEN sp.amount / 3
                                WHEN sp.billing_frequency = 'bi-monthly' THEN sp.amount / 2
                                WHEN sp.billing_frequency = 'semi-annual' THEN sp.amount / 6
                                WHEN sp.billing_frequency = 'weekly' THEN sp.amount * 4
                                WHEN sp.billing_frequency = 'bi-weekly' THEN sp.amount * 2
                                ELSE 0
                            END
                        ), 0)
                        FROM merchant_subscriptions ms
                        JOIN subscription_plans sp ON ms.plan_id = sp.plan_id
                        WHERE ms.merchant_id = p_merchant_id
                        AND ms.created_at <= t.timepoint
                        AND (ms.end_date IS NULL OR ms.end_date > t.timepoint)
                        AND ms.status = 'active'
                    )
                -- For today, use current MRR
                WHEN DATE(t.timepoint) = v_today THEN
                    v_current_mrr
                -- For historical dates after the oldest subscription, calculate based on actual data
                WHEN v_has_historical_data AND DATE(t.timepoint) >= v_oldest_subscription_date THEN
                    -- For dates with actual subscriptions, calculate MRR at that point in time
                    (
                        SELECT COALESCE(SUM(
                            CASE 
                                WHEN sp.billing_frequency = 'monthly' THEN sp.amount
                                WHEN sp.billing_frequency = 'yearly' THEN sp.amount / 12
                                WHEN sp.billing_frequency = 'quarterly' THEN sp.amount / 3
                                WHEN sp.billing_frequency = 'bi-monthly' THEN sp.amount / 2
                                WHEN sp.billing_frequency = 'semi-annual' THEN sp.amount / 6
                                WHEN sp.billing_frequency = 'weekly' THEN sp.amount * 4
                                WHEN sp.billing_frequency = 'bi-weekly' THEN sp.amount * 2
                                ELSE 0
                            END
                        ), 0)
                        FROM merchant_subscriptions ms
                        JOIN subscription_plans sp ON ms.plan_id = sp.plan_id
                        WHERE ms.merchant_id = p_merchant_id
                        AND ms.created_at <= t.timepoint
                        AND (ms.end_date IS NULL OR ms.end_date > t.timepoint)
                        AND (ms.status = 'active' OR (ms.status = 'cancelled' AND ms.end_date > t.timepoint))
                    )
                -- For dates before the oldest subscription, MRR should be 0
                ELSE
                    0
            END as mrr_value
        FROM 
            timepoints t
    )
    -- Return the final result
    SELECT 
        h.timepoint as date,
        ROUND(h.mrr_value::numeric, 2) as mrr
    FROM 
        historical_mrr h
    UNION ALL
    -- Include today's date with current MRR only if it falls within the date range and isn't already in the result
    SELECT 
        date_trunc('day', v_today::timestamp with time zone) as date,
        ROUND(v_current_mrr::numeric, 2) as mrr
    WHERE 
        v_today >= p_start_date::date AND v_today <= p_end_date::date AND
        NOT EXISTS (
            SELECT 1 FROM historical_mrr 
            WHERE DATE(timepoint) = v_today
        )
    -- Add a data point for the day after the latest subscription end date to show the drop to zero
    UNION ALL
    SELECT 
        (v_latest_end_date + interval '1 day')::timestamp with time zone as date,
        0::numeric(15,2) as mrr
    WHERE 
        v_latest_end_date IS NOT NULL AND
        v_latest_end_date < p_end_date::date AND
        v_latest_end_date + interval '1 day' >= p_start_date::date AND
        NOT EXISTS (
            SELECT 1 FROM historical_mrr 
            WHERE DATE(timepoint) = v_latest_end_date + interval '1 day'
        )
    ORDER BY 
        date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp; 