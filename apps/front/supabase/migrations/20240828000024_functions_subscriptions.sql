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
    updated_at TIMESTAMPTZ,
    amount NUMERIC,
    currency_code currency_code
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
        s.updated_at,
        sp.amount,
        sp.currency_code
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
    p_failed_payment_action failed_payment_action DEFAULT 'continue',
    p_charge_day INT DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'::jsonb,
    p_first_payment_type first_payment_type DEFAULT 'initial',
    p_display_on_storefront BOOLEAN DEFAULT true,
    p_image_url TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_plan_id UUID;
    v_metadata JSONB;
BEGIN
    -- Add display_on_storefront to metadata
    v_metadata := COALESCE(p_metadata, '{}'::jsonb) || jsonb_build_object('display_on_storefront', p_display_on_storefront);

    INSERT INTO subscription_plans (
        merchant_id, organization_id, name, description, billing_frequency, amount, currency_code,
        failed_payment_action, charge_day, metadata, first_payment_type, image_url
    )
    VALUES (
        p_merchant_id, p_organization_id, p_name, p_description, p_billing_frequency, p_amount, p_currency_code,
        p_failed_payment_action, CASE WHEN p_metadata->>'subscription_length' = 'automatic' THEN NULL ELSE p_charge_day END, 
        v_metadata, p_first_payment_type, p_image_url
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
    updated_at TIMESTAMPTZ,
    display_on_storefront BOOLEAN,
    image_url TEXT
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
        sp.updated_at,
        COALESCE((sp.metadata->>'display_on_storefront')::boolean, true) as display_on_storefront,
        sp.image_url
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

-- Function to update a subscription plan
CREATE OR REPLACE FUNCTION public.update_subscription_plan(
    p_plan_id UUID,
    p_name VARCHAR,
    p_description TEXT,
    p_billing_frequency frequency,
    p_amount NUMERIC,
    p_failed_payment_action failed_payment_action,
    p_charge_day INT,
    p_metadata JSONB,
    p_display_on_storefront BOOLEAN DEFAULT NULL,
    p_image_url TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
    v_metadata JSONB;
    v_old_image_url TEXT;
BEGIN
    -- Get current metadata and image_url
    SELECT metadata, image_url 
    INTO v_metadata, v_old_image_url 
    FROM subscription_plans 
    WHERE plan_id = p_plan_id;
    
    -- Update display_on_storefront in metadata if provided
    IF p_display_on_storefront IS NOT NULL THEN
        v_metadata := COALESCE(v_metadata, '{}'::jsonb) || jsonb_build_object('display_on_storefront', p_display_on_storefront);
    END IF;

    -- Merge with new metadata if provided
    IF p_metadata IS NOT NULL THEN
        v_metadata := COALESCE(v_metadata, '{}'::jsonb) || p_metadata;
    END IF;

    UPDATE subscription_plans
    SET
        name = COALESCE(p_name, name),
        description = p_description,
        billing_frequency = COALESCE(p_billing_frequency, billing_frequency),
        amount = COALESCE(p_amount, amount),
        failed_payment_action = COALESCE(p_failed_payment_action, failed_payment_action),
        charge_day = COALESCE(p_charge_day, charge_day),
        metadata = v_metadata,
        image_url = p_image_url,
        updated_at = NOW()
    WHERE plan_id = p_plan_id;

    -- Log plan update with image change info
    PERFORM public.log_event(
        p_merchant_id := (SELECT merchant_id FROM subscription_plans WHERE plan_id = p_plan_id),
        p_event := 'update_subscription_plan'::event_type,
        p_details := jsonb_build_object(
            'plan_id', p_plan_id,
            'name', p_name,
            'old_image_url', v_old_image_url,
            'new_image_url', p_image_url,
            'image_changed', (v_old_image_url IS DISTINCT FROM p_image_url),
            'display_on_storefront', p_display_on_storefront
        ),
        p_severity := 'NOTICE'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to delete a subscription plan
CREATE OR REPLACE FUNCTION public.delete_subscription_plan(
    p_plan_id UUID
)
RETURNS VOID AS $$
BEGIN
    DELETE FROM subscription_plans
    WHERE plan_id = p_plan_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.create_subscription_plan(UUID, UUID, VARCHAR, TEXT, frequency, NUMERIC, currency_code, failed_payment_action, INT, JSONB, first_payment_type, BOOLEAN, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.fetch_subscription_plans(UUID, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_subscription_plan(UUID, VARCHAR, TEXT, frequency, NUMERIC, failed_payment_action, INT, JSONB, BOOLEAN, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_subscription_plan(UUID) TO authenticated;
