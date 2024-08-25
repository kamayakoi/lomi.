-- Create a new API credential
CREATE OR REPLACE FUNCTION create_api_credential(
  p_api_provider_id BIGINT,
  p_organization_id BIGINT,
  p_credentials JSONB
) RETURNS api_credentials AS $$
DECLARE
  new_api_credential api_credentials;
BEGIN
  -- Validate input
  IF p_api_provider_id IS NULL OR p_organization_id IS NULL OR p_credentials IS NULL THEN
    RAISE EXCEPTION 'API provider ID, organization ID, and credentials are required';
  END IF;

  -- Insert the new API credential
  INSERT INTO api_credentials (api_provider_id, organization_id, credentials)
  VALUES (p_api_provider_id, p_organization_id, p_credentials)
  RETURNING * INTO new_api_credential;
  
  RETURN new_api_credential;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Read an API credential by ID
CREATE OR REPLACE FUNCTION get_api_credential_by_id(p_api_credential_id BIGINT)
RETURNS api_credentials AS $$
  SELECT * FROM api_credentials WHERE api_credential_id = p_api_credential_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Update an API credential
CREATE OR REPLACE FUNCTION update_api_credential(
  p_api_credential_id BIGINT,
  p_credentials JSONB
) RETURNS api_credentials AS $$
DECLARE
  updated_api_credential api_credentials;
BEGIN
  -- Update the API credential
  UPDATE api_credentials
  SET 
    credentials = p_credentials,
    updated_at = NOW()
  WHERE api_credential_id = p_api_credential_id
  RETURNING * INTO updated_api_credential;
  
  RETURN updated_api_credential;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Soft delete an API credential
CREATE OR REPLACE FUNCTION delete_api_credential(p_api_credential_id BIGINT)
RETURNS BOOLEAN AS $$
DECLARE
  rows_affected INT;
BEGIN
  UPDATE api_credentials
  SET deleted_at = NOW()
  WHERE api_credential_id = p_api_credential_id
    AND deleted_at IS NULL;
  
  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  RETURN rows_affected > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;