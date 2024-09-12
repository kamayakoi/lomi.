-- Function to fetch organization name for a user
CREATE OR REPLACE FUNCTION public.fetch_organization_name(user_id UUID)
RETURNS TEXT AS $$
DECLARE
    org_name TEXT;
BEGIN
    SELECT o.name INTO org_name
    FROM organizations o
    JOIN merchant_organization_links mol ON o.organization_id = mol.organization_id
    WHERE mol.merchant_id = user_id
    LIMIT 1;

    RETURN org_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.fetch_organization_name(UUID) TO authenticated;