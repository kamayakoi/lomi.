-- Function to fetch organization providers settings
CREATE OR REPLACE FUNCTION public.fetch_organization_providers_settings(p_organization_id UUID)
RETURNS TABLE (
    provider_code provider_code,
    is_connected BOOLEAN,
    phone_number VARCHAR,
    is_phone_verified BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ops.provider_code,
        ops.is_connected,
        ops.phone_number,
        ops.is_phone_verified
    FROM 
        organization_providers_settings ops
    WHERE 
        ops.organization_id = p_organization_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to update organization provider connection
CREATE OR REPLACE FUNCTION public.update_organization_provider_connection(
    p_organization_id UUID,
    p_provider_code provider_code,
    p_is_connected BOOLEAN
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO organization_providers_settings (organization_id, provider_code, is_connected)
    VALUES (p_organization_id, p_provider_code, p_is_connected)
    ON CONFLICT (organization_id, provider_code) DO UPDATE 
    SET is_connected = p_is_connected;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;


-- Function to update organization provider phone number
CREATE OR REPLACE FUNCTION public.update_organization_provider_phone(
    p_organization_id UUID,
    p_provider_code provider_code,
    p_phone_number VARCHAR,
    p_is_phone_verified BOOLEAN DEFAULT false
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO organization_providers_settings (
        organization_id, 
        provider_code, 
        phone_number,
        is_phone_verified
    )
    VALUES (
        p_organization_id, 
        p_provider_code, 
        p_phone_number,
        p_is_phone_verified
    )
    ON CONFLICT (organization_id, provider_code) DO UPDATE 
    SET 
        phone_number = EXCLUDED.phone_number,
        is_phone_verified = EXCLUDED.is_phone_verified,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;