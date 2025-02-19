-- Drop existing objects to ensure clean state
DROP FUNCTION IF EXISTS update_merchant_2fa(UUID, TEXT, BOOLEAN, TIMESTAMPTZ) CASCADE;
DROP FUNCTION IF EXISTS get_merchant_2fa_status(UUID) CASCADE;
DROP FUNCTION IF EXISTS generate_2fa_device_token(UUID) CASCADE;
DROP FUNCTION IF EXISTS verify_2fa_device_token(UUID, TEXT) CASCADE;
DROP FUNCTION IF EXISTS revoke_2fa_device_token(UUID, TEXT) CASCADE;
DROP TABLE IF EXISTS secrets.merchant_mfa CASCADE;

-- MFA table in secrets schema
CREATE TABLE secrets.merchant_mfa (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES public.merchants(merchant_id),
    totp_secret TEXT,
    has_2fa BOOLEAN NOT NULL DEFAULT false,
    last_2fa_verification TIMESTAMPTZ,
    device_token TEXT,
    token_created_at TIMESTAMPTZ,
    token_expires_at TIMESTAMPTZ,
    token_revoked BOOLEAN NOT NULL DEFAULT false,
    name TEXT
);

-- Create indexes
CREATE UNIQUE INDEX merchant_mfa_base_record_idx ON secrets.merchant_mfa (merchant_id) 
WHERE device_token IS NULL;

CREATE UNIQUE INDEX merchant_mfa_device_token_idx ON secrets.merchant_mfa (merchant_id, device_token) 
WHERE device_token IS NOT NULL;

-- Function to update merchant 2FA settings
CREATE OR REPLACE FUNCTION update_merchant_2fa(
    p_merchant_id UUID,
    p_totp_secret TEXT,
    p_has_2fa BOOLEAN,
    p_last_2fa_verification TIMESTAMPTZ DEFAULT NULL,
    p_name TEXT DEFAULT NULL
) RETURNS void AS $$
BEGIN
    -- Delete any existing base record for this merchant
    DELETE FROM secrets.merchant_mfa 
    WHERE merchant_id = p_merchant_id 
    AND device_token IS NULL;

    -- Insert new base record
    INSERT INTO secrets.merchant_mfa (
        merchant_id,
        totp_secret,
        has_2fa,
        last_2fa_verification,
        name
    ) VALUES (
        p_merchant_id,
        p_totp_secret,
        p_has_2fa,
        COALESCE(p_last_2fa_verification, NOW()),
        p_name
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify merchant 2FA status
CREATE OR REPLACE FUNCTION get_merchant_2fa_status(
    p_merchant_id UUID
) RETURNS TABLE (
    has_2fa BOOLEAN,
    totp_secret TEXT,
    last_2fa_verification TIMESTAMPTZ,
    token_expires_at TIMESTAMPTZ,
    name TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT ON (m.merchant_id)
        m.has_2fa,
        m.totp_secret,
        m.last_2fa_verification,
        m.token_expires_at,
        m.name
    FROM secrets.merchant_mfa m
    WHERE m.merchant_id = p_merchant_id
    AND (m.device_token IS NULL OR NOT m.token_revoked)
    ORDER BY m.merchant_id, m.id DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate a device token for 2FA remembering
CREATE OR REPLACE FUNCTION generate_2fa_device_token(
    p_merchant_id UUID
) RETURNS TEXT AS $$
DECLARE
    v_token TEXT;
BEGIN
    -- Generate a random token
    v_token := encode(gen_random_bytes(32), 'hex');
    
    -- Store the token with expiration
    INSERT INTO secrets.merchant_mfa (
        merchant_id,
        device_token,
        token_created_at,
        token_expires_at,
        has_2fa
    )
    SELECT 
        p_merchant_id,
        v_token,
        NOW(),
        NOW() + INTERVAL '30 days',
        true
    WHERE EXISTS (
        SELECT 1 FROM secrets.merchant_mfa 
        WHERE merchant_id = p_merchant_id 
        AND has_2fa = true
    );
    
    RETURN v_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify a device token
CREATE OR REPLACE FUNCTION verify_2fa_device_token(
    p_merchant_id UUID,
    p_token TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    v_valid BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 
        FROM secrets.merchant_mfa
        WHERE merchant_id = p_merchant_id
        AND device_token = p_token
        AND token_expires_at > NOW()
        AND NOT token_revoked
    ) INTO v_valid;
    
    RETURN v_valid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to revoke a device token
CREATE OR REPLACE FUNCTION revoke_2fa_device_token(
    p_merchant_id UUID,
    p_token TEXT
) RETURNS void AS $$
BEGIN
    UPDATE secrets.merchant_mfa
    SET token_revoked = true
    WHERE merchant_id = p_merchant_id
    AND device_token = p_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
REVOKE ALL ON ALL TABLES IN SCHEMA secrets FROM PUBLIC;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA secrets FROM PUBLIC;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA secrets FROM PUBLIC;

GRANT USAGE ON SCHEMA secrets TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA secrets TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA secrets TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA secrets TO service_role; 