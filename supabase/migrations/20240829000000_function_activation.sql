-- Function to complete activation process
CREATE OR REPLACE FUNCTION public.complete_activation(
    p_merchant_id UUID,
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
    -- Insert or update the organization KYC data
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
        kyc_submitted_at
    )
    SELECT
        mol.organization_id,
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
        NOW()
    FROM merchant_organization_links mol
    WHERE mol.merchant_id = p_merchant_id
    ON CONFLICT (organization_id) DO UPDATE SET
        legal_organization_name = EXCLUDED.legal_organization_name,
        tax_number = EXCLUDED.tax_number,
        business_description = EXCLUDED.business_description,
        legal_country = EXCLUDED.legal_country,
        legal_region = EXCLUDED.legal_region,
        legal_city = EXCLUDED.legal_city,
        legal_postal_code = EXCLUDED.legal_postal_code,
        legal_street = EXCLUDED.legal_street,
        proof_of_business = EXCLUDED.proof_of_business,
        business_platform_url = EXCLUDED.business_platform_url,
        authorized_signatory_name = EXCLUDED.authorized_signatory_name,
        authorized_signatory_email = EXCLUDED.authorized_signatory_email,
        authorized_signatory_phone_number = EXCLUDED.authorized_signatory_phone_number,
        legal_representative_ID_url = EXCLUDED.legal_representative_ID_url,
        address_proof_url = EXCLUDED.address_proof_url,
        business_registration_url = EXCLUDED.business_registration_url,
        kyc_submitted_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to check activation state
CREATE OR REPLACE FUNCTION public.check_activation_state(p_organization_id UUID)
RETURNS VARCHAR AS $$
BEGIN
    RETURN (
        SELECT status 
        FROM organization_kyc
        WHERE organization_id = p_organization_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;
