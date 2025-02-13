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
    p_is_connected BOOLEAN,
    p_provider_merchant_id VARCHAR DEFAULT NULL,
    p_metadata JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO organization_providers_settings (
        organization_id, 
        provider_code, 
        is_connected,
        provider_merchant_id,
        metadata
    )
    VALUES (
        p_organization_id, 
        p_provider_code, 
        p_is_connected,
        p_provider_merchant_id,
        p_metadata
    )
    ON CONFLICT (organization_id, provider_code) DO UPDATE 
    SET 
        is_connected = EXCLUDED.is_connected,
        provider_merchant_id = EXCLUDED.provider_merchant_id,
        metadata = EXCLUDED.metadata,
        updated_at = NOW();
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to get merchant details for Wave integration
CREATE OR REPLACE FUNCTION public.get_merchant_details_for_wave(
    p_merchant_id UUID,
    p_organization_id UUID
)
RETURNS TABLE (
    merchant_id UUID,
    merchant_name VARCHAR,
    organization_id UUID,
    organization_name VARCHAR,
    business_description TEXT,
    website_url VARCHAR,
    industry VARCHAR,
    registration_number VARCHAR,
    country VARCHAR,
    email VARCHAR,
    phone_number VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.merchant_id,
        m.name AS merchant_name,
        o.organization_id,
        o.name AS organization_name,
        COALESCE(
            kyc.business_description::TEXT, 
            (o.name || ' - ' || COALESCE(o.industry, 'Retail business'))::TEXT
        ) AS business_description,
        COALESCE(o.website_url, kyc.business_platform_url) AS website_url,
        o.industry,
        COALESCE(o.organization_id::text, m.merchant_id::text)::VARCHAR AS registration_number,
        COALESCE(kyc.legal_country, m.country) AS country,
        o.email,
        o.phone_number
    FROM 
        merchants m
        INNER JOIN merchant_organization_links mol ON m.merchant_id = mol.merchant_id
        INNER JOIN organizations o ON mol.organization_id = o.organization_id
        LEFT JOIN organization_kyc kyc ON o.organization_id = kyc.organization_id 
            AND m.merchant_id = kyc.merchant_id
    WHERE 
        m.merchant_id = p_merchant_id
        AND o.organization_id = p_organization_id
        AND m.is_deleted = false
        AND o.is_deleted = false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

COMMENT ON FUNCTION public.get_merchant_details_for_wave IS 'Retrieves merchant and organization details needed for Wave aggregated merchant creation';