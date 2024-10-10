-- Funtion to get or
CREATE OR REPLACE FUNCTION public.get_merchant_organization_id(p_merchant_id UUID)
RETURNS UUID AS $$
DECLARE
    v_organization_id UUID;
BEGIN
    SELECT organization_id INTO v_organization_id
    FROM merchant_organization_links
    WHERE merchant_id = p_merchant_id;

    IF v_organization_id IS NULL THEN
        RAISE EXCEPTION 'No organization found for merchant_id %', p_merchant_id;
    END IF;

    RETURN v_organization_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to complete activation (renamed from upsert_organization_kyc)
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
    p_legal_representative_id_url VARCHAR,
    p_address_proof_url VARCHAR,
    p_business_registration_url VARCHAR
) RETURNS VOID AS $$
DECLARE
    v_organization_id UUID;
BEGIN
    -- Get the organization_id for the merchant
    v_organization_id := get_merchant_organization_id(p_merchant_id);

    -- Insert or update the organization_kyc record
    INSERT INTO organization_kyc (
        organization_id,
        merchant_id,
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
        legal_representative_id_url,
        address_proof_url,
        business_registration_url,
        kyc_submitted_at
    ) VALUES (
        v_organization_id,
        p_merchant_id,
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
        p_legal_representative_id_url,
        p_address_proof_url,
        p_business_registration_url,
        CURRENT_TIMESTAMP
    ) ON CONFLICT (organization_id, merchant_id) DO UPDATE SET
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
        legal_representative_id_url = EXCLUDED.legal_representative_id_url,
        address_proof_url = EXCLUDED.address_proof_url,
        business_registration_url = EXCLUDED.business_registration_url,
        kyc_submitted_at = CURRENT_TIMESTAMP,
        status = 'pending';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check activation status
CREATE OR REPLACE FUNCTION public.check_activation_state(p_merchant_id UUID)
RETURNS VARCHAR AS $$
DECLARE
    v_status VARCHAR;
BEGIN
    SELECT status INTO v_status
    FROM organization_kyc
    WHERE merchant_id = p_merchant_id
    ORDER BY kyc_submitted_at DESC
    LIMIT 1;

    IF v_status IS NULL THEN
        RETURN 'not_submitted';
    ELSE
        RETURN v_status;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;