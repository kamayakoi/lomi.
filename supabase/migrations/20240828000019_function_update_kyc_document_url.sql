CREATE OR REPLACE FUNCTION public.update_kyc_document_url(
    p_organization_id UUID,
    p_document_type VARCHAR,
    p_document_url VARCHAR
)
RETURNS VOID AS $$
BEGIN
    UPDATE organization_kyc
    SET
        legal_representative_id_url = CASE WHEN p_document_type = 'legal_representative_ID' THEN p_document_url ELSE legal_representative_id_url END,
        address_proof_url = CASE WHEN p_document_type = 'address_proof' THEN p_document_url ELSE address_proof_url END,
        business_registration_url = CASE WHEN p_document_type = 'business_registration' THEN p_document_url ELSE business_registration_url END
    WHERE organization_id = p_organization_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;