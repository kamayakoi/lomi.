-- Function to fetch merchant details
CREATE OR REPLACE FUNCTION public.fetch_merchant_details(p_user_id UUID)
RETURNS TABLE (
    merchant_id UUID,
    name VARCHAR,
    email VARCHAR,
    avatar_url TEXT,
    phone_number VARCHAR,
    pin_code VARCHAR,
    onboarded BOOLEAN,
    preferred_language VARCHAR(10)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.merchant_id,
        m.name,
        m.email,
        m.avatar_url,
        m.phone_number,
        m.pin_code,
        m.onboarded,
        m.preferred_language
    FROM 
        merchants m
    WHERE 
        m.merchant_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to update merchant details
CREATE OR REPLACE FUNCTION public.update_merchant_details(
    p_merchant_id UUID,
    p_name VARCHAR,
    p_email VARCHAR,
    p_phone_number VARCHAR,
    p_pin_code VARCHAR,
    p_preferred_language VARCHAR(10)
)
RETURNS VOID AS $$
BEGIN
    UPDATE merchants
    SET 
        name = p_name,
        email = p_email,
        phone_number = p_phone_number,
        pin_code = p_pin_code,
        preferred_language = p_preferred_language,
        updated_at = NOW()
    WHERE 
        merchant_id = p_merchant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;