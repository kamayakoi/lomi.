-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Function to verify TOTP code
CREATE OR REPLACE FUNCTION verify_totp_code(
    secret TEXT,
    token TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    time_step INTEGER := 30;  -- 30 seconds time step
    current_unix_time INTEGER;
    counter INTEGER;
    time_counter BIGINT;
    message BYTEA;
    key BYTEA;
    hmac BYTEA;
    hmac_offset INTEGER;
    otp_binary INTEGER;
    temp_token TEXT;
BEGIN
    -- Basic validation
    IF LENGTH(token) != 6 OR token !~ '^\d{6}$' THEN
        RETURN FALSE;
    END IF;

    -- Get current Unix timestamp as an integer
    current_unix_time := EXTRACT(EPOCH FROM CURRENT_TIMESTAMP)::INTEGER;
    
    -- Convert secret to bytes
    key := decode(secret, 'hex');
    
    -- Check tokens within time window
    FOR counter IN -1..1 LOOP
        -- Calculate time counter
        time_counter := current_unix_time / time_step + counter;
        
        -- Convert counter to 8-byte big-endian bytes
        message := decode(lpad(to_hex(time_counter), 16, '0'), 'hex');
        
        -- Calculate HMAC-SHA1
        hmac := hmac(message, key, 'sha1');
        
        -- Get offset (last nibble of hash)
        hmac_offset := get_byte(hmac, 19) & 15;
        
        -- Generate 4-byte code starting at offset
        otp_binary := (
            ((get_byte(hmac, hmac_offset) & 127) << 24) |
            (get_byte(hmac, hmac_offset + 1) << 16) |
            (get_byte(hmac, hmac_offset + 2) << 8) |
            get_byte(hmac, hmac_offset + 3)
        );
        
        -- Get 6 digits
        temp_token := lpad(mod(otp_binary, 1000000)::text, 6, '0');
        
        IF temp_token = token THEN
            RETURN TRUE;
        END IF;
    END LOOP;
    
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to enable 2FA
CREATE OR REPLACE FUNCTION public.enable_2fa(
    p_merchant_id UUID,
    p_totp_secret TEXT,
    p_verification_code TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    is_valid BOOLEAN;
BEGIN
    -- Verify the TOTP code
    is_valid := verify_totp_code(p_totp_secret, p_verification_code);
    
    IF NOT is_valid THEN
        RAISE EXCEPTION 'Invalid verification code';
    END IF;

    -- Update merchant record
    UPDATE merchants
    SET 
        has_2fa = TRUE,
        totp_secret = p_totp_secret,
        last_2fa_verification = NOW(),
        metadata = jsonb_set(
            COALESCE(metadata, '{}'::jsonb),
            '{last_ip}',
            to_jsonb(inet_client_addr()::TEXT)
        ),
        updated_at = NOW()
    WHERE 
        merchant_id = p_merchant_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify 2FA during login
CREATE OR REPLACE FUNCTION public.verify_2fa_login(
    p_merchant_id UUID,
    p_verification_code TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    merchant_secret TEXT;
    is_valid BOOLEAN;
BEGIN
    -- Get merchant's TOTP secret
    SELECT totp_secret INTO merchant_secret
    FROM merchants
    WHERE merchant_id = p_merchant_id;

    -- Verify the TOTP code
    is_valid := verify_totp_code(merchant_secret, p_verification_code);
    
    IF NOT is_valid THEN
        RAISE EXCEPTION 'Invalid verification code';
    END IF;

    -- Update verification timestamp and IP
    UPDATE merchants
    SET 
        last_2fa_verification = NOW(),
        metadata = jsonb_set(
            COALESCE(metadata, '{}'::jsonb),
            '{last_ip}',
            to_jsonb(inet_client_addr()::TEXT)
        )
    WHERE 
        merchant_id = p_merchant_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to disable 2FA
CREATE OR REPLACE FUNCTION public.disable_2fa(
    p_merchant_id UUID
) RETURNS BOOLEAN AS $$
BEGIN
    UPDATE merchants
    SET 
        has_2fa = FALSE,
        totp_secret = NULL,
        last_2fa_verification = NULL,
        updated_at = NOW()
    WHERE 
        merchant_id = p_merchant_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.verify_totp_code(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.enable_2fa(UUID, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.verify_2fa_login(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.disable_2fa(UUID) TO authenticated; 