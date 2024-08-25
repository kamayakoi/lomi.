-- Create a new user
CREATE OR REPLACE FUNCTION create_user(
  p_name VARCHAR,
  p_email VARCHAR,
  p_phone_number VARCHAR,
  p_password_hash VARCHAR,
  p_user_type VARCHAR DEFAULT 'merchant',
  p_metadata JSONB DEFAULT NULL
) RETURNS users AS $$
DECLARE
  new_user users;
BEGIN
  -- Validate input
  IF p_name IS NULL OR p_email IS NULL OR p_phone_number IS NULL OR p_password_hash IS NULL THEN
    RAISE EXCEPTION 'Name, email, phone number, and password hash are required';
  END IF;

  -- Insert the new user
  INSERT INTO users (name, email, phone_number, password_hash, user_type, metadata)
  VALUES (p_name, p_email, p_phone_number, p_password_hash, p_user_type, p_metadata)
  RETURNING * INTO new_user;
  
  RETURN new_user;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Read a user by ID
CREATE OR REPLACE FUNCTION get_user_by_id(p_user_id BIGINT)
RETURNS users AS $$
  SELECT * FROM users WHERE user_id = p_user_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Update a user
CREATE OR REPLACE FUNCTION update_user(
  p_user_id BIGINT,
  p_name VARCHAR,
  p_email VARCHAR,
  p_phone_number VARCHAR,
  p_user_type VARCHAR,
  p_metadata JSONB
) RETURNS users AS $$
DECLARE
  updated_user users;
BEGIN
  -- Validate input
  IF p_name IS NULL OR p_email IS NULL OR p_phone_number IS NULL THEN
    RAISE EXCEPTION 'Name, email, and phone number are required';
  END IF;

  -- Update the user
  UPDATE users
  SET 
    name = p_name,
    email = p_email,
    phone_number = p_phone_number,
    user_type = p_user_type,
    metadata = p_metadata,
    updated_at = NOW()
  WHERE user_id = p_user_id
  RETURNING * INTO updated_user;
  
  RETURN updated_user;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Soft delete a user
CREATE OR REPLACE FUNCTION delete_user(p_user_id BIGINT)
RETURNS BOOLEAN AS $$
DECLARE
  rows_affected INT;
BEGIN
  UPDATE users
  SET deleted_at = NOW()
  WHERE user_id = p_user_id
    AND deleted_at IS NULL;
  
  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  RETURN rows_affected > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;