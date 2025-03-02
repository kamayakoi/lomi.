-- Function to fetch user avatar URL
CREATE OR REPLACE FUNCTION public.fetch_user_avatar(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
    v_avatar_url TEXT;
BEGIN
    SELECT avatar_url INTO v_avatar_url
    FROM merchants
    WHERE merchant_id = p_user_id;

    RETURN v_avatar_url;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;