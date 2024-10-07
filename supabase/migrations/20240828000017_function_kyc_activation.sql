-- Function to fetch organization details for KYC activation
CREATE OR REPLACE FUNCTION public.fetch_organization_details_for_kyc(p_organization_id UUID)
RETURNS TABLE (
    organization_id UUID,
    name VARCHAR,
    email VARCHAR,
    logo_url VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        o.organization_id,
        o.name,
        o.email,
        o.logo_url
    FROM 
        organizations o
    WHERE 
        o.organization_id = p_organization_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to update organization KYC details
CREATE OR REPLACE FUNCTION public.update_organization_kyc_details(
    p_organization_id UUID,
    p_legal_organization_name VARCHAR,
    p_tax_number VARCHAR,
    p_business_description VARCHAR,
    p_legal_country VARCHAR,
    p_legal_region VARCHAR,
    p_legal_city VARCHAR,
    p_legal_postal_code VARCHAR,
    p_legal_street VARCHAR,
    p_proof_of_business VARCHAR,
    p_business_platform_url VARCHAR,
    p_authorized_signatory_name VARCHAR,
    p_authorized_signatory_email VARCHAR,
    p_authorized_signatory_phone_number VARCHAR,
    p_legal_representative_ID_url VARCHAR,
    p_address_proof_url VARCHAR,
    p_business_registration_url VARCHAR
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO organization_kyc (
        organization_id,
        legal_organization_name,
        tax_number,
        business_description,
        legal_country,
        legal_region,
        legal_city,
        legal_postal_code,
        legal_street,
        proof_of_business,
        business_platform_url,
        authorized_signatory_name,
        authorized_signatory_email,
        authorized_signatory_phone_number,
        legal_representative_ID_url,
        address_proof_url,
        business_registration_url,
        status,
        kyc_submitted_at
    )
    VALUES (
        p_organization_id,
        p_legal_organization_name,
        p_tax_number,
        p_business_description,
        p_legal_country,
        p_legal_region,
        p_legal_city,
        p_legal_postal_code,
        p_legal_street,
        p_proof_of_business,
        p_business_platform_url,
        p_authorized_signatory_name,
        p_authorized_signatory_email,
        p_authorized_signatory_phone_number,
        p_legal_representative_ID_url,
        p_address_proof_url,
        p_business_registration_url,
        'pending',
        NOW()
    )
    ON CONFLICT (organization_id) DO UPDATE SET
        legal_organization_name = p_legal_organization_name,
        tax_number = p_tax_number,
        business_description = p_business_description,
        legal_country = p_legal_country,
        legal_region = p_legal_region,
        legal_city = p_legal_city,
        legal_postal_code = p_legal_postal_code,
        legal_street = p_legal_street,
        proof_of_business = p_proof_of_business,
        business_platform_url = p_business_platform_url,
        authorized_signatory_name = p_authorized_signatory_name,
        authorized_signatory_email = p_authorized_signatory_email,
        authorized_signatory_phone_number = p_authorized_signatory_phone_number,
        legal_representative_ID_url = p_legal_representative_ID_url,
        address_proof_url = p_address_proof_url,
        business_registration_url = p_business_registration_url,
        status = 'pending',
        kyc_submitted_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch organization details for KYC by merchant
CREATE OR REPLACE FUNCTION public.fetch_organization_details_for_kyc_by_merchant(p_merchant_id UUID)
RETURNS TABLE (
    organization_id UUID,
    name VARCHAR,
    email VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        o.organization_id,
        o.name,
        o.email
    FROM 
        organizations o
        JOIN merchant_organization_links mol ON o.organization_id = mol.organization_id
    WHERE 
        mol.merchant_id = p_merchant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;