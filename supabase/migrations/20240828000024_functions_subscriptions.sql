-- Function to create a new subscription
CREATE OR REPLACE FUNCTION public.create_subscription(
    p_merchant_id UUID,
    p_organization_id UUID,
    p_customer_id UUID,
    p_name VARCHAR,
    p_description TEXT,
    p_start_date DATE,
    p_billing_frequency frequency,
    p_amount NUMERIC,
    p_failed_payment_action VARCHAR,
    p_email_notifications JSONB,
    p_metadata JSONB,
    p_currency_code currency_code DEFAULT 'XOF',
    p_retry_payment_every INT DEFAULT 0,
    p_total_retries INT DEFAULT 0
)
RETURNS UUID AS $$
DECLARE
    v_subscription_id UUID;
BEGIN
    INSERT INTO merchant_subscriptions (
        merchant_id, organization_id, customer_id, name, description, start_date,
        billing_frequency, amount, failed_payment_action, email_notifications, metadata,
        currency_code, retry_payment_every, total_retries
    )
    VALUES (
        p_merchant_id, p_organization_id, p_customer_id, p_name, p_description, p_start_date,
        p_billing_frequency, p_amount, p_failed_payment_action, p_email_notifications, p_metadata,
        p_currency_code, p_retry_payment_every, p_total_retries
    )
    RETURNING subscription_id INTO v_subscription_id;

    RETURN v_subscription_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch subscriptions for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_subscriptions(
    p_merchant_id UUID,
    p_status subscription_status DEFAULT NULL,
    p_page INTEGER DEFAULT 1,
    p_page_size INTEGER DEFAULT 50
)
RETURNS TABLE (
    subscription_id UUID,
    plan_id UUID,
    plan_name VARCHAR,
    customer_id UUID,
    customer_name VARCHAR,
    status subscription_status,
    start_date DATE,
    end_date DATE,
    next_billing_date DATE,
    metadata JSONB,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.subscription_id,
        s.plan_id,
        sp.name AS plan_name,
        s.customer_id,
        c.name AS customer_name,
        s.status,
        s.start_date,
        s.end_date,
        s.next_billing_date,
        s.metadata,
        s.created_at,
        s.updated_at
    FROM
        merchant_subscriptions s
    JOIN
        subscription_plans sp ON s.plan_id = sp.plan_id
    JOIN
        customers c ON s.customer_id = c.customer_id
    WHERE
        sp.merchant_id = p_merchant_id
        AND (p_status IS NULL OR s.status = p_status)
    ORDER BY
        s.created_at DESC
    LIMIT p_page_size
    OFFSET ((p_page - 1) * p_page_size);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to create a new subscription plan
CREATE OR REPLACE FUNCTION public.create_subscription_plan(
    p_merchant_id UUID,
    p_organization_id UUID,
    p_name VARCHAR,
    p_description TEXT,
    p_billing_frequency frequency,
    p_amount NUMERIC,
    p_currency_code currency_code DEFAULT 'XOF',
    p_failed_payment_action failed_payment_action,
    p_charge_day INT,
    p_metadata JSONB,
    p_first_payment_type first_payment_type
)
RETURNS UUID AS $$
DECLARE
    v_plan_id UUID;
BEGIN
    INSERT INTO subscription_plans (
        merchant_id, organization_id, name, description, billing_frequency, amount, currency_code,
        failed_payment_action, charge_day, metadata, first_payment_type
    )
    VALUES (
        p_merchant_id, p_organization_id, p_name, p_description, p_billing_frequency, p_amount, p_currency_code,
        p_failed_payment_action, p_charge_day, p_metadata, p_first_payment_type
    )
    RETURNING plan_id INTO v_plan_id;

    RETURN v_plan_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch subscription plans for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_subscription_plans(
    p_merchant_id UUID,
    p_page INTEGER DEFAULT 1,
    p_page_size INTEGER DEFAULT 50
)
RETURNS TABLE (
    plan_id UUID,
    name VARCHAR,
    description TEXT,
    billing_frequency frequency,
    amount NUMERIC,
    currency_code currency_code,
    failed_payment_action failed_payment_action,
    charge_day INT,
    metadata JSONB,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        sp.plan_id,
        sp.name,
        sp.description,
        sp.billing_frequency,
        sp.amount,
        sp.currency_code,
        sp.failed_payment_action,
        sp.charge_day,
        sp.metadata,
        sp.created_at,
        sp.updated_at
    FROM
        subscription_plans sp
    WHERE
        sp.merchant_id = p_merchant_id
    ORDER BY
        sp.created_at DESC
    LIMIT p_page_size
    OFFSET ((p_page - 1) * p_page_size);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch transactions for a specific subscription
CREATE OR REPLACE FUNCTION public.fetch_subscription_transactions(
    p_subscription_id UUID
)
RETURNS TABLE (
    transaction_id UUID,
    description TEXT,
    gross_amount NUMERIC,
    currency_code currency_code,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        t.transaction_id,
        t.description,
        t.gross_amount,
        t.currency_code,
        t.created_at
    FROM
        transactions t
    WHERE
        t.subscription_id = p_subscription_id
    ORDER BY
        t.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;
