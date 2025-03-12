-- Function to manage organization fee type
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
        UPDATE organization_fees
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
        INSERT INTO organization_fees (
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
        DELETE FROM organization_fees
        WHERE organization_id = p_organization_id AND fee_type_id = p_fee_type_id
        RETURNING *
    )
    SELECT EXISTS (SELECT 1 FROM deleted) INTO v_deleted;

    RETURN v_deleted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to update customer notifications
CREATE OR REPLACE FUNCTION public.update_customer_notifications(
    p_organization_id UUID,
    p_notifications JSONB
) RETURNS void AS $$
BEGIN
    INSERT INTO organization_checkout_settings (
        organization_id,
        customer_notifications
    ) VALUES (
        p_organization_id,
        p_notifications
    )
    ON CONFLICT (organization_id) 
    DO UPDATE SET 
        customer_notifications = p_notifications,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to update merchant recipients
CREATE OR REPLACE FUNCTION public.update_merchant_recipients(
    p_organization_id UUID,
    p_recipients JSONB
) RETURNS void AS $$
BEGIN
    INSERT INTO organization_checkout_settings (
        organization_id,
        merchant_recipients
    ) VALUES (
        p_organization_id,
        p_recipients
    )
    ON CONFLICT (organization_id) 
    DO UPDATE SET 
        merchant_recipients = p_recipients,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.manage_organization_fee_type(UUID, UUID, VARCHAR, NUMERIC, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_organization_fee_type(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_customer_notifications(UUID, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_merchant_recipients(UUID, JSONB) TO authenticated; 