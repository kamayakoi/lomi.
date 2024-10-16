-- Function to create a new subscription
CREATE OR REPLACE FUNCTION public.create_subscription(
    p_merchant_id UUID,
    p_organization_id UUID,
    p_customer_id UUID,
    p_name VARCHAR,
    p_description TEXT,
    p_image_url TEXT,
    p_start_date DATE,
    p_billing_frequency frequency,
    p_amount NUMERIC,
    p_currency_code currency_code,
    p_retry_payment_every INT,
    p_total_retries INT,
    p_failed_payment_action VARCHAR,
    p_email_notifications JSONB,
    p_metadata JSONB
)
RETURNS UUID AS $$
DECLARE
    v_subscription_id UUID;
BEGIN
    INSERT INTO merchant_subscriptions (
        merchant_id, organization_id, customer_id, name, description, image_url, start_date,
        billing_frequency, amount, currency_code, retry_payment_every, total_retries,
        failed_payment_action, email_notifications, metadata
    )
    VALUES (
        p_merchant_id, p_organization_id, p_customer_id, p_name, p_description, p_image_url, p_start_date,
        p_billing_frequency, p_amount, p_currency_code, p_retry_payment_every, p_total_retries,
        p_failed_payment_action, p_email_notifications, p_metadata
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
    name VARCHAR,
    description TEXT,
    status subscription_status,
    image_url TEXT,
    start_date DATE,
    end_date DATE,
    next_billing_date DATE,
    billing_frequency frequency,
    amount NUMERIC,
    currency_code currency_code,
    retry_payment_every INT,
    total_retries INT,
    failed_payment_action VARCHAR,
    email_notifications JSONB,
    metadata JSONB,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.subscription_id,
        s.name,
        s.description,
        s.status,
        s.image_url,
        s.start_date,
        s.end_date,
        s.next_billing_date,
        s.billing_frequency,
        s.amount,
        s.currency_code,
        s.retry_payment_every,
        s.total_retries,
        s.failed_payment_action,
        s.email_notifications,
        s.metadata,
        s.created_at,
        s.updated_at
    FROM
        merchant_subscriptions s
    WHERE
        s.merchant_id = p_merchant_id
        AND (p_status IS NULL OR s.status = p_status)
    ORDER BY
        s.created_at DESC
    LIMIT p_page_size
    OFFSET ((p_page - 1) * p_page_size);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;
