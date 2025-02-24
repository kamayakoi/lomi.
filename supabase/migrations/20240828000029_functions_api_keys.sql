-- Function to generate an API key
CREATE OR REPLACE FUNCTION public.generate_api_key(
    p_merchant_id UUID,
    p_organization_id UUID,
    p_name VARCHAR,
    p_expiration_date TIMESTAMPTZ DEFAULT NULL,
    p_environment VARCHAR DEFAULT 'live'
) RETURNS TABLE (
    api_key VARCHAR
) AS $$
DECLARE
    v_api_key VARCHAR;
    v_prefix VARCHAR;
BEGIN
    -- Set the environment prefix
    v_prefix := CASE 
        WHEN p_environment = 'test' THEN 'lomi_sk_test_'
        ELSE 'lomi_sk_'
    END;

    -- Generate a secure API key using the original method
    v_api_key := v_prefix || md5(random()::text || clock_timestamp()::text);
    v_api_key := v_api_key || substring(md5(random()::text), 1, 88 - length(v_api_key));

    -- Insert the new API key
    INSERT INTO api_keys (
        merchant_id,
        organization_id,
        api_key,
        name,
        is_active,
        expiration_date,
        environment
    ) VALUES (
        p_merchant_id,
        p_organization_id,
        v_api_key,
        p_name,
        TRUE,
        p_expiration_date,
        p_environment
    );

    -- Log the API key generation
    PERFORM public.log_event(
        p_merchant_id := p_merchant_id,
        p_event := 'create_api_key'::event_type,
        p_details := jsonb_build_object(
            'api_key', substring(v_api_key, 1, 8) || '****',
            'name', p_name,
            'environment', p_environment
        ),
        p_severity := 'INFO'
    );

    RETURN QUERY SELECT v_api_key;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to generate an API key when the user completes onboarding
CREATE OR REPLACE FUNCTION public.generate_onboarding_api_key()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM public.generate_api_key(
        NEW.merchant_id,
        NEW.organization_id,
        'Test Key',
        NULL
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Trigger to generate an API key when a new merchant-organization link is created
CREATE TRIGGER generate_onboarding_api_key_trigger
AFTER INSERT ON merchant_organization_links
FOR EACH ROW
EXECUTE FUNCTION public.generate_onboarding_api_key();

-- Function to fetch API keys for a given organization
CREATE OR REPLACE FUNCTION public.fetch_api_keys(p_organization_id UUID)
RETURNS TABLE (
    name VARCHAR,
    api_key VARCHAR,
    is_active BOOLEAN,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT ak.name, ak.api_key, ak.is_active, ak.created_at
    FROM api_keys ak
    WHERE ak.organization_id = p_organization_id
    ORDER BY ak.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to delete an API key
CREATE OR REPLACE FUNCTION public.delete_api_key(p_api_key VARCHAR)
RETURNS VOID AS $$
BEGIN
    DELETE FROM api_keys WHERE api_key = p_api_key;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to update the status of an API key
CREATE OR REPLACE FUNCTION public.update_api_key_status(
    p_api_key VARCHAR,
    p_is_active BOOLEAN,
    p_merchant_id UUID
)
RETURNS VOID AS $$
BEGIN
    UPDATE api_keys 
    SET is_active = p_is_active 
    WHERE api_key = p_api_key 
    AND merchant_id = p_merchant_id;

    -- Log the API key status update
    PERFORM public.log_event(
        p_merchant_id := p_merchant_id,
        p_event := 'edit_api_key'::event_type,
        p_details := jsonb_build_object(
            'api_key', p_api_key,
            'is_active', p_is_active
        ),
        p_severity := 'CRITICAL'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to validate an API key
CREATE OR REPLACE FUNCTION public.validate_api_key(p_api_key VARCHAR)
RETURNS TABLE (
    merchant_id UUID,
    organization_id UUID,
    is_active BOOLEAN,
    expiration_date TIMESTAMPTZ,
    environment VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ak.merchant_id,
        ak.organization_id,
        ak.is_active,
        ak.expiration_date,
        ak.environment
    FROM api_keys ak
    WHERE ak.api_key = p_api_key;

    -- Log the API key validation attempt
    IF FOUND THEN
        PERFORM public.log_event(
            p_merchant_id := merchant_id,
            p_event := 'validate_api_key'::event_type,
            p_details := jsonb_build_object(
                'api_key', substring(p_api_key, 1, 8) || '****',
                'success', true,
                'environment', environment
            ),
            p_severity := 'INFO'
        );
    ELSE
        -- Log failed validation attempt with null merchant_id
        PERFORM public.log_event(
            p_merchant_id := NULL,
            p_event := 'validate_api_key'::event_type,
            p_details := jsonb_build_object(
                'api_key', substring(p_api_key, 1, 8) || '****',
                'success', false
            ),
            p_severity := 'WARNING'
        );
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;