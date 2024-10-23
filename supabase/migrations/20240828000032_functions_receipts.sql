CREATE OR REPLACE FUNCTION get_organization_details(p_organization_id UUID)
RETURNS TABLE (
  name VARCHAR,
  logo_url VARCHAR
)
AS $$
BEGIN
  RETURN QUERY
  SELECT o.name, o.logo_url
  FROM organizations o
  WHERE o.organization_id = p_organization_id;
END;
$$ LANGUAGE plpgsql;
