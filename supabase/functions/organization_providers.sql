-- Create a new organization provider
CREATE OR REPLACE FUNCTION create_organization_provider(
  p_organization_id UUID,
  p_provider_id UUID
) RETURNS organization_providers AS $$
DECLARE
  new_org_provider organization_providers;
BEGIN
  -- Validate input
  IF p_organization_id IS NULL OR p_provider_id IS NULL THEN
    RAISE EXCEPTION 'Organization ID and provider ID are required';
  END IF;

  -- Insert the new organization provider
  INSERT INTO organization_providers (organization_id, provider_id)
  VALUES (p_organization_id, p_provider_id)
  RETURNING * INTO new_org_provider;
  
  RETURN new_org_provider;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Read an organization provider by ID
CREATE OR REPLACE FUNCTION get_organization_provider_by_id(p_org_provider_id UUID)
RETURNS organization_providers AS $$
  SELECT * FROM organization_providers WHERE org_provider_id = p_org_provider_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Update an organization provider
CREATE OR REPLACE FUNCTION update_organization_provider(
  p_org_provider_id UUID,
  p_provider_id UUID
) RETURNS organization_providers AS $$
DECLARE
  updated_org_provider organization_providers;
BEGIN
  -- Update the organization provider
  UPDATE organization_providers
  SET 
    provider_id = p_provider_id,
    updated_at = NOW()
  WHERE org_provider_id = p_org_provider_id
  RETURNING * INTO updated_org_provider;
  
  RETURN updated_org_provider;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Soft delete an organization provider
CREATE OR REPLACE FUNCTION delete_organization_provider(p_org_provider_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  rows_affected INT;
BEGIN
  UPDATE organization_providers
  SET deleted_at = NOW()
  WHERE org_provider_id = p_org_provider_id
    AND deleted_at IS NULL;
  
  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  RETURN rows_affected > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;