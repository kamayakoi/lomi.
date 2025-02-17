-- Function to check activation status
CREATE OR REPLACE FUNCTION public.check_activation_status(p_merchant_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_is_activated BOOLEAN;
BEGIN
    SELECT o.verified INTO v_is_activated
    FROM merchant_organization_links mol
    JOIN organizations o ON mol.organization_id = o.organization_id
    WHERE mol.merchant_id = p_merchant_id
    LIMIT 1;

    RETURN v_is_activated;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Trigger function to update organization verification status
CREATE OR REPLACE FUNCTION public.update_organization_verification_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'approved'::kyc_status THEN
        -- Update organization verification status using the organization_id directly from NEW record
        UPDATE organizations
        SET 
            verified = true,
            updated_at = CURRENT_TIMESTAMP
        WHERE organization_id = NEW.organization_id;

        -- Update kyc_approved_at timestamp
        UPDATE organization_kyc
        SET kyc_approved_at = CURRENT_TIMESTAMP
        WHERE organization_id = NEW.organization_id 
        AND merchant_id = NEW.merchant_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Trigger to call the update_organization_verification_status function
DROP TRIGGER IF EXISTS update_organization_verification_status_trigger ON organization_kyc;
CREATE TRIGGER update_organization_verification_status_trigger
AFTER UPDATE OF status ON organization_kyc
FOR EACH ROW
EXECUTE FUNCTION update_organization_verification_status();