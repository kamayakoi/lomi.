-- Create a new API provider
CREATE OR REPLACE FUNCTION create_api_provider(
  p_name VARCHAR,
  p_description TEXT
) RETURNS api_providers AS $$
DECLARE
  new_api_provider api_providers;
BEGIN
  -- Validate input
  IF p_name IS NULL THEN
    RAISE EXCEPTION 'Name is required';
  END IF;

  -- Insert the new API provider
  INSERT INTO api_providers (name, description)
  VALUES (p_name, p_description)
  RETURNING * INTO new_api_provider;
  
  RETURN new_api_provider;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Read an API provider by ID
CREATE OR REPLACE FUNCTION get_api_provider_by_id(p_api_provider_id BIGINT)
RETURNS api_providers AS $$
  SELECT * FROM api_providers WHERE api_provider_id = p_api_provider_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Update an API provider
CREATE OR REPLACE FUNCTION update_api_provider(
  p_api_provider_id BIGINT,
  p_name VARCHAR,
  p_description TEXT
) RETURNS api_providers AS $$
DECLARE
  updated_api_provider api_providers;
BEGIN
  -- Update the API provider
  UPDATE api_providers
  SET 
    name = p_name,
    description = p_description,
    updated_at = NOW()
  WHERE api_provider_id = p_api_provider_id
  RETURNING * INTO updated_api_provider;
  
  RETURN updated_api_provider;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Soft delete an API provider
CREATE OR REPLACE FUNCTION delete_api_provider(p_api_provider_id BIGINT)
RETURNS BOOLEAN AS $$
DECLARE
  rows_affected INT;
BEGIN
  UPDATE api_providers
  SET deleted_at = NOW()
  WHERE api_provider_id = p_api_provider_id
    AND deleted_at IS NULL;
  
  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  RETURN rows_affected > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;