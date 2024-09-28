-- Disable RLS
ALTER TABLE merchants DISABLE ROW LEVEL SECURITY;
ALTER TABLE organizations DISABLE ROW LEVEL SECURITY;
ALTER TABLE organization_addresses DISABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_organization_links DISABLE ROW LEVEL SECURITY;

-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS public.complete_onboarding;

-- Create the new complete_onboarding function
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
    p_org_address VARCHAR,
    p_org_postal_code VARCHAR,
    p_org_industry VARCHAR,
    p_org_website_url VARCHAR,
    p_org_employee_number VARCHAR,
    p_workspace_handle VARCHAR,
    p_how_did_you_hear_about_us VARCHAR,
    p_avatar_url VARCHAR,
    p_logo_url VARCHAR
)
RETURNS VOID AS $$
DECLARE
    v_organization_id UUID;
BEGIN
    -- Update merchant information
    UPDATE merchants
    SET 
        phone_number = p_phone_number,
        country = p_country,
        onboarded = true,
        preferred_language = p_preferred_language,
        avatar_url = p_avatar_url,
        updated_at = NOW()
    WHERE merchant_id = p_merchant_id;

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
        p_logo_url
    )
    RETURNING organization_id INTO v_organization_id;

    -- Create organization address
    INSERT INTO organization_addresses (
        organization_id,
        country,
        region,
        city,
        district,
        address,
        postal_code
    ) VALUES (
        v_organization_id,
        p_org_country,
        p_org_region,
        p_org_city,
        p_org_district,
        p_org_address,
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
        'admin',
        'Founder',
        p_workspace_handle,
        p_how_did_you_hear_about_us
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_organization_links ENABLE ROW LEVEL SECURITY;