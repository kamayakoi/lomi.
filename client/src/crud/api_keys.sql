-- Create a new API key
CREATE OR REPLACE FUNCTION create_api_key(
  p_user_id UUID,
  p_key_type VARCHAR,
  p_api_key VARCHAR,
  p_expiration_date TIMESTAMPTZ,
  p_metadata JSONB DEFAULT NULL
) RETURNS api_keys AS $$
DECLARE
  new_api_key api_keys;
BEGIN
  -- Validate input
  IF p_user_id IS NULL OR p_key_type IS NULL OR p_api_key IS NULL THEN
    RAISE EXCEPTION 'User ID, key type, and API key are required';
  END IF;

  -- Insert the new API key
  INSERT INTO api_keys (user_id, key_type, api_key, expiration_date, metadata)
  VALUES (p_user_id, p_key_type, p_api_key, p_expiration_date, p_metadata)
  RETURNING * INTO new_api_key;
  
  RETURN new_api_key;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Read an API key by ID
CREATE OR REPLACE FUNCTION get_api_key_by_id(p_api_key_id UUID)
RETURNS api_keys AS $$
  SELECT * FROM api_keys WHERE api_key_id = p_api_key_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Update an API key
CREATE OR REPLACE FUNCTION update_api_key(
  p_api_key_id UUID,
  p_key_type VARCHAR,
  p_api_key VARCHAR,
  p_expiration_date TIMESTAMPTZ,
  p_metadata JSONB
) RETURNS api_keys AS $$
DECLARE
  updated_api_key api_keys;
BEGIN
  -- Update the API key
  UPDATE api_keys
  SET 
    key_type = p_key_type,
    api_key = p_api_key,
    expiration_date = p_expiration_date,
    metadata = p_metadata,
    updated_at = NOW()
  WHERE api_key_id = p_api_key_id
  RETURNING * INTO updated_api_key;
  
  RETURN updated_api_key;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Soft delete an API key
CREATE OR REPLACE FUNCTION delete_api_key(p_api_key_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  rows_affected INT;
BEGIN
  UPDATE api_keys
  SET deleted_at = NOW()
  WHERE api_key_id = p_api_key_id
    AND deleted_at IS NULL;
  
  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  RETURN rows_affected > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;