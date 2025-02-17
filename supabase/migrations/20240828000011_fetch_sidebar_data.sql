-- Function to fetch all organizations for a merchant
CREATE OR REPLACE FUNCTION public.fetch_merchant_organizations(p_merchant_id UUID)
RETURNS TABLE (
    organization_id UUID,
    organization_name VARCHAR,
    organization_logo_url VARCHAR,
    merchant_role VARCHAR,
    is_current BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        o.organization_id,
        o.name AS organization_name,
        o.logo_url AS organization_logo_url,
        mol.role::VARCHAR AS merchant_role,
        false AS is_current
    FROM 
        merchant_organization_links mol
    JOIN
        organizations o ON mol.organization_id = o.organization_id
    WHERE 
        mol.merchant_id = p_merchant_id
        AND mol.team_status = 'active'
    ORDER BY 
        o.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch sidebar data
CREATE OR REPLACE FUNCTION public.fetch_sidebar_data(
    p_merchant_id UUID,
    p_organization_id UUID DEFAULT NULL
)
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
        mol.role::VARCHAR AS merchant_role
    FROM 
        merchants m
    JOIN 
        merchant_organization_links mol ON m.merchant_id = mol.merchant_id
    JOIN
        organizations o ON mol.organization_id = o.organization_id
    WHERE 
        m.merchant_id = p_merchant_id
        AND mol.team_status = 'active'
        AND (p_organization_id IS NULL OR o.organization_id = p_organization_id)
    ORDER BY 
        o.created_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;
