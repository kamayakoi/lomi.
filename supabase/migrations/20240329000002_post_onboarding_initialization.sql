-- Function to initialize provider settings and accounts for a new organization and merchant
CREATE OR REPLACE FUNCTION public.initialize_org_and_merchant_data(
    p_organization_id UUID,
    p_merchant_id UUID
)
RETURNS VOID AS $$
DECLARE
    v_provider RECORD;
BEGIN
    -- Initialize organization provider settings
    FOR v_provider IN (SELECT code FROM providers) LOOP
        INSERT INTO organization_providers_settings (
            organization_id,
            provider_code,
            is_connected
        ) VALUES (
            p_organization_id,
            v_provider.code,
            false
        );
    END LOOP;

    -- Initialize merchant accounts for each provider
    FOR v_provider IN (SELECT code FROM providers) LOOP
        INSERT INTO accounts (
            merchant_id,
            balance,
            provider_code,
            currency_code
        ) VALUES (
            p_merchant_id,
            0,
            v_provider.code,
            CASE 
                WHEN v_provider.code = 'STRIPE' THEN 'USD'
                ELSE 'XOF'
            END
        );
    END LOOP;

    -- Initialize main accounts for XOF and USD
    INSERT INTO main_accounts (merchant_id, balance, currency_code)
    VALUES 
        (p_merchant_id, 0, 'XOF'),
        (p_merchant_id, 0, 'USD');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Modify the complete_onboarding function to call the initialization function
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
    p_org_employee_number VARCHAR
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
        default_currency
    ) VALUES (
        p_org_name,
        p_org_email,
        p_org_phone_number,
        p_org_website_url,
        p_org_industry,
        p_org_employee_number,
        'XOF'
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
        organization_position
    ) VALUES (
        p_merchant_id,
        v_organization_id,
        'admin',
        'Founder'
    );

    -- Call the initialization function
    PERFORM public.initialize_org_and_merchant_data(v_organization_id, p_merchant_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;