-- Function to fetch organization details
CREATE OR REPLACE FUNCTION public.fetch_organization_details(p_merchant_id UUID)
RETURNS TABLE (
    organization_id UUID,
    name VARCHAR,
    email VARCHAR,
    logo_url VARCHAR,
    website_url VARCHAR,
    country VARCHAR,
    region VARCHAR,
    city VARCHAR,
    district VARCHAR,
    street VARCHAR,
    postal_code VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        o.organization_id,
        o.name,
        o.email,
        o.logo_url,
        o.website_url,
        oa.country,
        oa.region,
        oa.city,
        oa.district,
        oa.street,
        oa.postal_code
    FROM 
        organizations o
    JOIN 
        merchant_organization_links mol ON o.organization_id = mol.organization_id
    LEFT JOIN 
        organization_addresses oa ON o.organization_id = oa.organization_id
    WHERE 
        mol.merchant_id = p_merchant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to update organization details
CREATE OR REPLACE FUNCTION public.update_organization_details(
    p_organization_id UUID,
    p_name VARCHAR,
    p_email VARCHAR,
    p_website_url VARCHAR
)
RETURNS VOID AS $$
BEGIN
    UPDATE organizations
    SET 
        name = p_name,
        email = p_email,
        website_url = p_website_url,
        updated_at = NOW()
    WHERE 
        organization_id = p_organization_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;