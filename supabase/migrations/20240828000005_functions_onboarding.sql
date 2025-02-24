-- Create the complete_onboarding function
CREATE OR REPLACE FUNCTION public.complete_onboarding(
    p_merchant_id UUID,
    p_phone_number VARCHAR,
    p_country VARCHAR,
    p_org_name VARCHAR,
    p_org_email VARCHAR,
    p_org_phone_number VARCHAR,
    p_org_country VARCHAR,
    p_org_region VARCHAR,
    p_org_city VARCHAR,
    p_org_street VARCHAR,
    p_org_district VARCHAR,
    p_org_postal_code VARCHAR,
    p_org_industry VARCHAR,
    p_org_website_url VARCHAR,
    p_org_employee_number VARCHAR,
    p_preferred_language VARCHAR,
    p_store_handle VARCHAR,
    p_how_did_you_hear_about_us VARCHAR,
    p_avatar_url VARCHAR,
    p_logo_url VARCHAR,
    p_organization_position VARCHAR
)
RETURNS VOID AS $$
DECLARE
    v_organization_id UUID;
    v_merchant_exists BOOLEAN;
    v_merchant_name TEXT;
    v_merchant_email TEXT;
    v_resend_api_key TEXT;
BEGIN
    -- Debug logging
    RAISE NOTICE 'Starting complete_onboarding for merchant_id: %', p_merchant_id;

    -- Check if Resend API key is configured
    SELECT value INTO v_resend_api_key FROM secrets.resend_config WHERE key = 'resend_api_key';
    IF v_resend_api_key IS NULL THEN
        RAISE WARNING 'Resend API key not found in secrets.resend_config';
    ELSE
        RAISE NOTICE 'Resend API key found successfully';
    END IF;

    -- Check if merchant exists
    SELECT EXISTS (
        SELECT 1 FROM merchants WHERE merchant_id = p_merchant_id
    ) INTO v_merchant_exists;
    
    RAISE NOTICE 'Merchant exists check: %', v_merchant_exists;

    -- Check if store handle is available
    IF EXISTS (
        SELECT 1 FROM public.merchant_organization_links 
        WHERE store_handle = p_store_handle
    ) THEN
        RAISE EXCEPTION 'Store handle "%" is already taken', p_store_handle;
    END IF;

    IF NOT v_merchant_exists THEN
        RAISE NOTICE 'Creating new merchant record';
        -- Create merchant record if it doesn't exist
        INSERT INTO merchants (
            merchant_id,
            name,
            email,
            phone_number,
            country,
            onboarded,
            preferred_language,
            avatar_url
        ) VALUES (
            p_merchant_id,
            p_org_name,
            p_org_email,
            p_phone_number,
            p_country,
            true,
            p_preferred_language,
            REPLACE(p_avatar_url, 'https://mdswvokxrnfggrujsfjd.supabase.co/storage/v1/object/public/avatars/', '')
        );

        -- Log merchant creation
        PERFORM public.log_event(
            p_merchant_id := p_merchant_id,
            p_event := 'user_login'::event_type,
            p_details := jsonb_build_object(
                'name', p_org_name,
                'email', p_org_email,
                'country', p_country,
                'phone_number', p_phone_number
            ),
            p_severity := 'NOTICE'
        );
    ELSE
        RAISE NOTICE 'Updating existing merchant record';
        -- Update merchant information if it exists
        UPDATE merchants
        SET 
            phone_number = p_phone_number,
            country = p_country,
            onboarded = true,
            preferred_language = p_preferred_language,
            avatar_url = REPLACE(p_avatar_url, 'https://mdswvokxrnfggrujsfjd.supabase.co/storage/v1/object/public/avatars/', ''),
            updated_at = NOW()
        WHERE merchant_id = p_merchant_id;

        -- Log merchant update
        PERFORM public.log_event(
            p_merchant_id := p_merchant_id,
            p_event := 'edit_user_details'::event_type,
            p_details := jsonb_build_object(
                'phone_number', p_phone_number,
                'country', p_country,
                'preferred_language', p_preferred_language
            ),
            p_severity := 'NOTICE'
        );
    END IF;

    -- Get the merchant name and email
    SELECT name, email INTO v_merchant_name, v_merchant_email
    FROM merchants
    WHERE merchant_id = p_merchant_id;

    RAISE NOTICE 'Preparing to send welcome email to % (%)', v_merchant_name, v_merchant_email;

    -- Send welcome email with error handling
    BEGIN
        PERFORM public.send_onboarding_welcome_email(v_merchant_email, v_merchant_name);
        RAISE NOTICE 'Welcome email sent successfully to %', v_merchant_email;
    EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'Failed to send welcome email: % - %', SQLERRM, SQLSTATE;
    END;

    RAISE NOTICE 'Creating organization';
    -- Create organization
    INSERT INTO organizations (
        name,
        email,
        phone_number,
        website_url,
        industry,
        employee_number,
        default_currency,
        logo_url
    ) VALUES (
        p_org_name,
        p_org_email,
        p_org_phone_number,
        p_org_website_url,
        p_org_industry,
        p_org_employee_number,
        'XOF',
        REPLACE(p_logo_url, 'https://mdswvokxrnfggrujsfjd.supabase.co/storage/v1/object/public/logos/', '')
    )
    RETURNING organization_id INTO v_organization_id;

    RAISE NOTICE 'Organization created with ID: %', v_organization_id;

    -- Create organization address
    INSERT INTO organization_addresses (
        organization_id,
        country,
        region,
        city,
        district,
        street,
        postal_code
    ) VALUES (
        v_organization_id,
        p_org_country,
        p_org_region,
        p_org_city,
        p_org_district,
        p_org_street,
        p_org_postal_code
    );

    RAISE NOTICE 'Organization address created';

    -- Create merchant-organization link
    INSERT INTO merchant_organization_links (
        merchant_id,
        organization_id,
        role,
        organization_position,
        store_handle,
        how_did_you_hear_about_us
    ) VALUES (
        p_merchant_id,
        v_organization_id,
        'Admin',
        p_organization_position,
        p_store_handle,
        p_how_did_you_hear_about_us
    );

    RAISE NOTICE 'Merchant-organization link created';
    RAISE NOTICE 'Complete onboarding process finished successfully';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to check if a merchant has completed the onboarding process
CREATE OR REPLACE FUNCTION public.check_onboarding_status(p_merchant_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_onboarded BOOLEAN;
BEGIN
    SELECT onboarded INTO v_onboarded
    FROM merchants
    WHERE merchant_id = p_merchant_id;

    RETURN v_onboarded;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;