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
    -- Log the incoming request
    PERFORM log_event(
        p_organization_id,
        'provider_connection_update'::event_type,
        jsonb_build_object(
            'provider_code', p_provider_code,
            'is_connected', p_is_connected,
            'provider_merchant_id', p_provider_merchant_id,
            'metadata', p_metadata
        ),
        'NOTICE'
    );

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
        provider_merchant_id = COALESCE(EXCLUDED.provider_merchant_id, organization_providers_settings.provider_merchant_id),
        metadata = COALESCE(EXCLUDED.metadata, organization_providers_settings.metadata),
        updated_at = NOW();

    -- Log the successful update
    PERFORM log_event(
        p_organization_id,
        CASE 
            WHEN p_is_connected THEN 'provider_connected'::event_type
            ELSE 'provider_disconnected'::event_type
        END,
        jsonb_build_object(
            'provider_code', p_provider_code,
            'provider_merchant_id', COALESCE(p_provider_merchant_id, 'none'),
            'metadata', p_metadata
        ),
        'NOTICE'
    );

    -- Special handling for Wave provider
    IF p_provider_code = 'WAVE' AND p_is_connected THEN
        -- Log Wave merchant registration
        PERFORM log_event(
            p_organization_id,
            'wave_merchant_registered'::event_type,
            jsonb_build_object(
                'provider_merchant_id', p_provider_merchant_id,
                'merchant_details', p_metadata->'wave_merchant'
            ),
            'NOTICE'
        );
    END IF;
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

-- Add a function to fetch Wave merchant details
CREATE OR REPLACE FUNCTION public.get_wave_merchant_details(
    p_organization_id UUID
)
RETURNS TABLE (
    provider_merchant_id VARCHAR,
    is_connected BOOLEAN,
    metadata JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ops.provider_merchant_id,
        ops.is_connected,
        ops.metadata
    FROM 
        organization_providers_settings ops
    WHERE 
        ops.organization_id = p_organization_id
        AND ops.provider_code = 'WAVE';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to verify Wave merchant registration
CREATE OR REPLACE FUNCTION public.verify_wave_merchant_registration(
    p_organization_id UUID
)
RETURNS TABLE (
    is_registered BOOLEAN,
    provider_merchant_id VARCHAR,
    registration_details JSONB
) AS $$
BEGIN
    -- Log verification attempt
    PERFORM log_event(
        p_organization_id,
        'wave_merchant_verification'::event_type,
        jsonb_build_object(
            'organization_id', p_organization_id
        ),
        'NOTICE'
    );

    RETURN QUERY
    SELECT 
        ops.is_connected,
        ops.provider_merchant_id,
        ops.metadata->'wave_merchant' as registration_details
    FROM 
        organization_providers_settings ops
    WHERE 
        ops.organization_id = p_organization_id
        AND ops.provider_code = 'WAVE';

    -- Log verification result
    PERFORM log_event(
        p_organization_id,
        'wave_merchant_verification_complete'::event_type,
        jsonb_build_object(
            'organization_id', p_organization_id,
            'found', FOUND
        ),
        'NOTICE'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to fetch merchant details for Wave registration
CREATE OR REPLACE FUNCTION public.get_merchant_details_for_wave(
    p_merchant_id UUID,
    p_organization_id UUID
)
RETURNS TABLE (
    merchant_name VARCHAR,
    merchant_email VARCHAR,
    organization_name VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.name as merchant_name,
        m.email as merchant_email,
        o.name as organization_name
    FROM merchants m
    LEFT JOIN organizations o ON o.organization_id = p_organization_id
    WHERE m.merchant_id = p_merchant_id
    AND NOT m.is_deleted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;