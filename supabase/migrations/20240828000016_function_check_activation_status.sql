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