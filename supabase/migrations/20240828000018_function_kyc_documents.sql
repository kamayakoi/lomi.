-- Function to update KYC document URLs
CREATE OR REPLACE FUNCTION public.update_kyc_document_urls(
    p_organization_id UUID,
    p_legal_representative_ID_url VARCHAR,
    p_address_proof_url VARCHAR,
    p_business_registration_url VARCHAR
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO organization_kyc_documents (
        organization_id,
        legal_representative_ID_url,
        address_proof_url,
        business_registration_url
    )
    VALUES (
        p_organization_id,
        p_legal_representative_ID_url,
        p_address_proof_url,
        p_business_registration_url
    )
    ON CONFLICT (organization_id) DO UPDATE SET
        legal_representative_ID_url = EXCLUDED.legal_representative_ID_url,
        address_proof_url = EXCLUDED.address_proof_url,
        business_registration_url = EXCLUDED.business_registration_url,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch KYC document URLs
CREATE OR REPLACE FUNCTION public.fetch_kyc_document_urls(p_organization_id UUID)
RETURNS TABLE (
    legal_representative_ID_url VARCHAR,
    address_proof_url VARCHAR,
    business_registration_url VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        okd.legal_representative_ID_url,
        okd.address_proof_url,
        okd.business_registration_url
    FROM 
        organization_kyc_documents okd
    WHERE 
        okd.organization_id = p_organization_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;