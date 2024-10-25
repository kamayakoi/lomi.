-- Function to fetch sidebar data
CREATE OR REPLACE FUNCTION public.fetch_sidebar_data(p_merchant_id UUID)
RETURNS TABLE (
    organization_id UUID,
    organization_name VARCHAR,
    organization_logo_url VARCHAR,
    merchant_name VARCHAR,
    merchant_role VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        o.organization_id,
        o.name AS organization_name,
        o.logo_url AS organization_logo_url,
        m.name AS merchant_name,
        mol.role AS merchant_role
    FROM 
        merchants m
    JOIN 
        merchant_organization_links mol ON m.merchant_id = mol.merchant_id
    JOIN
        organizations o ON mol.organization_id = o.organization_id
    WHERE 
        m.merchant_id = p_merchant_id
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;
