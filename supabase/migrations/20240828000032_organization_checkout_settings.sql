-- Function to fetch organization checkout settings
CREATE OR REPLACE FUNCTION public.fetch_organization_checkout_settings(p_organization_id UUID)
RETURNS TABLE (
    organization_id UUID,
    default_language VARCHAR,
    display_currency currency_code,
    payment_link_duration INTEGER,
    fee_types JSONB,
    customer_notifications JSONB,
    merchant_recipients JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        ocs.organization_id,
        ocs.default_language,
        ocs.display_currency,
        ocs.payment_link_duration,
        ocs.fee_types,
        ocs.customer_notifications,
        ocs.merchant_recipients
    FROM
        organization_checkout_settings ocs
    WHERE
        ocs.organization_id = p_organization_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to update organization checkout settings
CREATE OR REPLACE FUNCTION public.update_organization_checkout_settings(
    p_organization_id UUID,
    p_settings JSONB
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO organization_checkout_settings (
        organization_id,
        default_language,
        display_currency,
        payment_link_duration,
        fee_types,
        customer_notifications,
        merchant_recipients,
        updated_at
    )
    VALUES (
        p_organization_id,
        COALESCE((p_settings->>'default_language')::VARCHAR, 'en'),
        COALESCE((p_settings->>'display_currency')::currency_code, 'XOF'),
        COALESCE((p_settings->>'payment_link_duration')::INTEGER, 1),
        COALESCE(p_settings->'fee_types', '[]'::jsonb),
        COALESCE(p_settings->'customer_notifications', '{
            "new_payment_links": {"email": false, "whatsapp": false},
            "payment_reminders": {"email": false, "whatsapp": false},
            "successful_payment_attempts": {"email": false, "whatsapp": false}
        }'::jsonb),
        COALESCE(p_settings->'merchant_recipients', '[]'::jsonb),
        NOW()
    )
    ON CONFLICT (organization_id) DO UPDATE SET
        default_language = COALESCE((EXCLUDED.default_language)::VARCHAR, organization_checkout_settings.default_language),
        display_currency = COALESCE((EXCLUDED.display_currency)::currency_code, organization_checkout_settings.display_currency),
        payment_link_duration = COALESCE(EXCLUDED.payment_link_duration, organization_checkout_settings.payment_link_duration),
        fee_types = COALESCE(EXCLUDED.fee_types, organization_checkout_settings.fee_types),
        customer_notifications = COALESCE(EXCLUDED.customer_notifications, organization_checkout_settings.customer_notifications),
        merchant_recipients = COALESCE(EXCLUDED.merchant_recipients, organization_checkout_settings.merchant_recipients),
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch organization checkout settings
CREATE OR REPLACE FUNCTION public.fetch_organization_checkout_settings(p_organization_id UUID)
RETURNS TABLE (
    organization_id UUID,
    default_language VARCHAR,
    display_currency currency_code,
    payment_link_duration INTEGER,
    customer_notifications JSONB,
    merchant_recipients JSONB,
    fee_types JSON
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ocs.organization_id,
        ocs.default_language,
        ocs.display_currency,
        ocs.payment_link_duration,
        ocs.customer_notifications,
        ocs.merchant_recipients,
        (
            SELECT json_agg(json_build_object(
                'fee_type_id', oft.fee_type_id,
                'name', oft.name,
                'percentage', oft.percentage,
                'is_enabled', oft.is_enabled
            ))
            FROM organization_fee_types oft
            WHERE oft.organization_id = ocs.organization_id
        )::JSON as fee_types
    FROM organization_checkout_settings ocs
    WHERE ocs.organization_id = p_organization_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to update organization checkout settings
CREATE OR REPLACE FUNCTION public.update_organization_checkout_settings(
    p_organization_id UUID,
    p_settings JSONB
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO organization_checkout_settings (
        organization_id,
        default_language,
        display_currency,
        payment_link_duration,
        customer_notifications,
        merchant_recipients,
        updated_at
    )
    VALUES (
        p_organization_id,
        COALESCE((p_settings->>'default_language')::VARCHAR, 'en'),
        COALESCE((p_settings->>'display_currency')::currency_code, 'XOF'),
        COALESCE((p_settings->>'payment_link_duration')::INTEGER, 1),
        COALESCE(p_settings->'customer_notifications', '{
            "new_payment_links": {"email": false, "whatsapp": false},
            "payment_reminders": {"email": false, "whatsapp": false},
            "successful_payment_attempts": {"email": false, "whatsapp": false}
        }'::jsonb),
        COALESCE(p_settings->'merchant_recipients', '[]'::jsonb),
        NOW()
    )
    ON CONFLICT (organization_id) DO UPDATE SET
        default_language = COALESCE((EXCLUDED.default_language)::VARCHAR, organization_checkout_settings.default_language),
        display_currency = COALESCE((EXCLUDED.display_currency)::currency_code, organization_checkout_settings.display_currency),
        payment_link_duration = COALESCE(EXCLUDED.payment_link_duration, organization_checkout_settings.payment_link_duration),
        customer_notifications = COALESCE(EXCLUDED.customer_notifications, organization_checkout_settings.customer_notifications),
        merchant_recipients = COALESCE(EXCLUDED.merchant_recipients, organization_checkout_settings.merchant_recipients),
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to manage organization fee types
CREATE OR REPLACE FUNCTION public.manage_organization_fee_type(
    p_organization_id UUID,
    p_fee_type_id UUID DEFAULT NULL,
    p_name VARCHAR DEFAULT NULL,
    p_percentage NUMERIC DEFAULT NULL,
    p_is_enabled BOOLEAN DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_fee_type_id UUID;
BEGIN
    -- If fee_type_id is provided, update existing fee type
    IF p_fee_type_id IS NOT NULL THEN
        UPDATE organization_fee_types
        SET
            name = COALESCE(p_name, name),
            percentage = COALESCE(p_percentage, percentage),
            is_enabled = COALESCE(p_is_enabled, is_enabled),
            updated_at = NOW()
        WHERE fee_type_id = p_fee_type_id AND organization_id = p_organization_id
        RETURNING fee_type_id INTO v_fee_type_id;
        
        IF v_fee_type_id IS NULL THEN
            RAISE EXCEPTION 'Fee type not found or not authorized';
        END IF;
    -- If no fee_type_id, create new fee type
    ELSE
        INSERT INTO organization_fee_types (
            organization_id,
            name,
            percentage,
            is_enabled
        )
        VALUES (
            p_organization_id,
            p_name,
            COALESCE(p_percentage, 0),
            COALESCE(p_is_enabled, true)
        )
        RETURNING fee_type_id INTO v_fee_type_id;
    END IF;

    RETURN v_fee_type_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to delete organization fee type
CREATE OR REPLACE FUNCTION public.delete_organization_fee_type(
    p_organization_id UUID,
    p_fee_type_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    v_deleted BOOLEAN;
BEGIN
    WITH deleted AS (
        DELETE FROM organization_fee_types
        WHERE organization_id = p_organization_id AND fee_type_id = p_fee_type_id
        RETURNING *
    )
    SELECT EXISTS (SELECT 1 FROM deleted) INTO v_deleted;

    RETURN v_deleted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp; 