-- Create a new organization
CREATE OR REPLACE FUNCTION create_organization(
  p_name VARCHAR,
  p_email VARCHAR,
  p_phone_number VARCHAR,
  p_country VARCHAR,
  p_metadata JSONB DEFAULT NULL
) RETURNS organizations AS $$
DECLARE
  new_organization organizations;
BEGIN
  -- Validate input
  IF p_name IS NULL OR p_email IS NULL OR p_phone_number IS NULL OR p_country IS NULL THEN
    RAISE EXCEPTION 'Name, email, phone number, and country are required';
  END IF;

  -- Insert the new organization
  INSERT INTO organizations (name, email, phone_number, country, metadata)
  VALUES (p_name, p_email, p_phone_number, p_country, p_metadata)
  RETURNING * INTO new_organization;
  
  RETURN new_organization;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Read an organization by ID
CREATE OR REPLACE FUNCTION get_organization_by_id(p_organization_id BIGINT)
RETURNS organizations AS $$
  SELECT * FROM organizations WHERE organization_id = p_organization_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Update an organization
CREATE OR REPLACE FUNCTION update_organization(
  p_organization_id BIGINT,
  p_name VARCHAR,
  p_email VARCHAR,
  p_phone_number VARCHAR,
  p_country VARCHAR,
  p_status VARCHAR,
  p_metadata JSONB
) RETURNS organizations AS $$
DECLARE
  updated_organization organizations;
BEGIN
  -- Validate input
  IF p_name IS NULL OR p_email IS NULL OR p_phone_number IS NULL OR p_country IS NULL THEN
    RAISE EXCEPTION 'Name, email, phone number, and country are required';
  END IF;

  -- Update the organization
  UPDATE organizations
  SET 
    name = p_name,
    email = p_email,
    phone_number = p_phone_number,
    country = p_country,
    status = p_status,
    metadata = p_metadata,
    updated_at = NOW()
  WHERE organization_id = p_organization_id
  RETURNING * INTO updated_organization;
  
  RETURN updated_organization;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Soft delete an organization
CREATE OR REPLACE FUNCTION delete_organization(p_organization_id BIGINT)
RETURNS BOOLEAN AS $$
DECLARE
  rows_affected INT;
BEGIN
  UPDATE organizations
  SET deleted_at = NOW()
  WHERE organization_id = p_organization_id
    AND deleted_at IS NULL;
  
  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  RETURN rows_affected > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;