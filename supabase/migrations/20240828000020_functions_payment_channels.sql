-- Function to fetch organization providers settings
CREATE OR REPLACE FUNCTION public.fetch_organization_providers_settings(p_organization_id UUID)
RETURNS TABLE (
    provider_code provider_code,
    is_connected BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ops.provider_code,
        ops.is_connected
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
