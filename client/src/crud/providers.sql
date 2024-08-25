-- Create a new provider
CREATE OR REPLACE FUNCTION create_provider(
  p_name VARCHAR,
  p_description TEXT,
  p_metadata JSONB DEFAULT NULL
) RETURNS providers AS $$
DECLARE
  new_provider providers;
BEGIN
  -- Validate input
  IF p_name IS NULL THEN
    RAISE EXCEPTION 'Name is required';
  END IF;

  -- Insert the new provider
  INSERT INTO providers (name, description, metadata)
  VALUES (p_name, p_description, p_metadata)
  RETURNING * INTO new_provider;
  
  RETURN new_provider;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Read a provider by ID
CREATE OR REPLACE FUNCTION get_provider_by_id(p_provider_id BIGINT)
RETURNS providers AS $$
  SELECT * FROM providers WHERE provider_id = p_provider_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Update a provider
CREATE OR REPLACE FUNCTION update_provider(
  p_provider_id BIGINT,
  p_name VARCHAR,
  p_description TEXT,
  p_metadata JSONB
) RETURNS providers AS $$
DECLARE
  updated_provider providers;
BEGIN
  -- Update the provider
  UPDATE providers
  SET 
    name = p_name,
    description = p_description,
    metadata = p_metadata,
    updated_at = NOW()
  WHERE provider_id = p_provider_id
  RETURNING * INTO updated_provider;
  
  RETURN updated_provider;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Soft delete a provider
CREATE OR REPLACE FUNCTION delete_provider(p_provider_id BIGINT)
RETURNS BOOLEAN AS $$
DECLARE
  rows_affected INT;
BEGIN
  UPDATE providers
  SET deleted_at = NOW()
  WHERE provider_id = p_provider_id
    AND deleted_at IS NULL;
  
  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  RETURN rows_affected > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;