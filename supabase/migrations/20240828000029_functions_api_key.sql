-- Function to generate a new API key
CREATE OR REPLACE FUNCTION public.generate_api_key(
    p_merchant_id UUID,
    p_organization_id UUID,
    p_name VARCHAR,
    p_expiration_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS TABLE (api_key VARCHAR) AS $$
DECLARE
    v_api_key VARCHAR;
BEGIN
    v_api_key := 'lomi_sk_' || encode(gen_random_bytes(48), 'base64');
    v_api_key := regexp_replace(v_api_key, '[+/=]', '', 'g');
    v_api_key := regexp_replace(v_api_key, '\s', '_', 'g');
    v_api_key := left(v_api_key, 88);

    INSERT INTO api_keys (merchant_id, organization_id, api_key, name, expiration_date)
    VALUES (p_merchant_id, p_organization_id, v_api_key, p_name, p_expiration_date);

    RETURN QUERY SELECT v_api_key AS api_key;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to generate an API key when the user completes onboarding
CREATE OR REPLACE FUNCTION public.generate_onboarding_api_key()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM public.generate_api_key(
        NEW.merchant_id,
        NEW.organization_id,
        'Default API Key',
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete an API key
CREATE OR REPLACE FUNCTION public.delete_api_key(p_api_key VARCHAR)
RETURNS VOID AS $$
BEGIN
    DELETE FROM api_keys WHERE api_key = p_api_key;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update the status of an API key
CREATE OR REPLACE FUNCTION public.update_api_key_status(p_api_key VARCHAR, p_is_active BOOLEAN)
RETURNS VOID AS $$
BEGIN
    UPDATE api_keys SET is_active = p_is_active WHERE api_key = p_api_key;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
