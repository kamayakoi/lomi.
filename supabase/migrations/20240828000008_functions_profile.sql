-- Function to fetch merchant details
CREATE OR REPLACE FUNCTION public.fetch_merchant_details(p_merchant_id UUID)
RETURNS TABLE (
    merchant_id UUID,
    name VARCHAR,
    email VARCHAR,
    avatar_url VARCHAR,
    phone_number VARCHAR,
    referral_code VARCHAR,
    pin_code VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.merchant_id,
        m.name,
        m.email,
        m.avatar_url,
        m.phone_number,
        m.referral_code,
        m.pin_code
    FROM 
        merchants m
    WHERE 
        m.merchant_id = p_merchant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update merchant details
CREATE OR REPLACE FUNCTION public.update_merchant_details(
    p_merchant_id UUID,
    p_name VARCHAR,
    p_email VARCHAR,
    p_phone_number VARCHAR,
    p_pin_code VARCHAR,
    p_referral_code VARCHAR
)
RETURNS VOID AS $$
BEGIN
    UPDATE merchants
    SET 
        name = p_name,
        email = p_email,
        phone_number = p_phone_number,
        pin_code = p_pin_code,
        referral_code = p_referral_code,
        updated_at = NOW()
    WHERE 
        merchant_id = p_merchant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update merchant avatar
CREATE OR REPLACE FUNCTION public.update_merchant_avatar(
    p_merchant_id UUID,
    p_avatar_url VARCHAR
)
RETURNS VOID AS $$
BEGIN
    UPDATE merchants
    SET 
        avatar_url = p_avatar_url,
        updated_at = NOW()
    WHERE 
        merchant_id = p_merchant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;