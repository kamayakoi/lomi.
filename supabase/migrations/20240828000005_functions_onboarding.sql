-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS public.complete_onboarding;

-- Create the complete_onboarding function
CREATE OR REPLACE FUNCTION public.complete_onboarding(
    p_merchant_id UUID,
    p_phone_number VARCHAR,
    p_country VARCHAR,
    p_preferred_language VARCHAR,
    p_org_name VARCHAR,
    p_org_email VARCHAR,
    p_org_phone_number VARCHAR,
    p_org_country VARCHAR,
    p_org_region VARCHAR,
    p_org_city VARCHAR,
    p_org_district VARCHAR,
    p_org_street VARCHAR,
    p_org_postal_code VARCHAR,
    p_org_industry VARCHAR,
    p_org_website_url VARCHAR,
    p_org_employee_number VARCHAR,
    p_workspace_handle VARCHAR,
    p_how_did_you_hear_about_us VARCHAR,
    p_avatar_url VARCHAR,
    p_logo_url VARCHAR,
    p_organization_position VARCHAR
)
RETURNS VOID AS $$
DECLARE
    v_organization_id UUID;
    v_merchant_exists BOOLEAN;
BEGIN
    -- Check if merchant exists
    SELECT EXISTS (
        SELECT 1 FROM merchants WHERE merchant_id = p_merchant_id
    ) INTO v_merchant_exists;

    IF NOT v_merchant_exists THEN
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
            p_org_name, -- Use organization name as merchant name initially
            p_org_email, -- Use organization email as merchant email initially
            p_phone_number,
            p_country,
            true,
            p_preferred_language,
            REPLACE(p_avatar_url, 'https://injlwsgidvxehdmwdoov.supabase.co/storage/v1/object/public/avatars/', '')
        );
    ELSE
        -- Update merchant information if it exists
        UPDATE merchants
        SET 
            phone_number = p_phone_number,
            country = p_country,
            onboarded = true,
            preferred_language = p_preferred_language,
            avatar_url = REPLACE(p_avatar_url, 'https://injlwsgidvxehdmwdoov.supabase.co/storage/v1/object/public/avatars/', ''),
            updated_at = NOW()
        WHERE merchant_id = p_merchant_id;
    END IF;

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
        REPLACE(p_logo_url, 'https://injlwsgidvxehdmwdoov.supabase.co/storage/v1/object/public/logos/', '')
    )
    RETURNING organization_id INTO v_organization_id;

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

    -- Create merchant-organization link
    INSERT INTO merchant_organization_links (
        merchant_id,
        organization_id,
        role,
        organization_position,
        workspace_handle,
        how_did_you_hear_about_us
    ) VALUES (
        p_merchant_id,
        v_organization_id,
        'Admin',
        p_organization_position,
        p_workspace_handle,
        p_how_did_you_hear_about_us
    );
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