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
    IF NEW.status = 'approved' THEN
        UPDATE organizations
        SET verified = true
        WHERE organization_id = (
            SELECT organization_id
            FROM merchant_organization_links
            WHERE merchant_id = NEW.merchant_id
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Trigger to call the update_organization_verification_status function
CREATE TRIGGER update_organization_verification_status_trigger
AFTER INSERT OR UPDATE ON organization_kyc
FOR EACH ROW
EXECUTE FUNCTION update_organization_verification_status();