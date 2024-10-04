-- Function to fetch organization name by user ID
CREATE OR REPLACE FUNCTION public.fetch_organization_name(user_id UUID)
RETURNS VARCHAR AS $$
DECLARE
    organization_name VARCHAR;
BEGIN
    SELECT o.name INTO organization_name
    FROM organizations o
    JOIN merchant_organization_links mol ON o.organization_id = mol.organization_id
    JOIN merchants m ON mol.merchant_id = m.merchant_id
    WHERE m.merchant_id = user_id
    LIMIT 1;

    RETURN organization_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;