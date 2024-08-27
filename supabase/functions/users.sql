-- Create a new user
CREATE OR REPLACE FUNCTION create_user(
  p_name VARCHAR,
  p_email VARCHAR,
  p_phone_number VARCHAR,
  p_is_admin BOOLEAN DEFAULT false,
  p_verified BOOLEAN DEFAULT false,
  p_country VARCHAR,
  p_metadata JSONB DEFAULT NULL,
  p_avatar_url TEXT DEFAULT NULL,
  p_logo_url TEXT DEFAULT NULL
) RETURNS users AS $$
DECLARE
  new_user users;
BEGIN
  -- Validate input
  IF p_name IS NULL OR p_email IS NULL OR p_phone_number IS NULL THEN
    RAISE EXCEPTION 'Name, email, and phone number are required';
  END IF;

  -- Insert the new user
  INSERT INTO users (name, email, phone_number, is_admin, verified, country, metadata, avatar_url, logo_url)
  VALUES (p_name, p_email, p_phone_number, p_is_admin, p_verified, p_country, p_metadata, p_avatar_url, p_logo_url)
  RETURNING * INTO new_user;
  
  RETURN new_user;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Read a user by ID
CREATE OR REPLACE FUNCTION get_user_by_id(p_user_id UUID)
RETURNS users AS $$
  SELECT * FROM users WHERE user_id = p_user_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Update a user
CREATE OR REPLACE FUNCTION update_user(
  p_user_id UUID,
  p_name VARCHAR,
  p_email VARCHAR,
  p_phone_number VARCHAR,
  p_is_admin BOOLEAN,
  p_verified BOOLEAN,
  p_country VARCHAR,
  p_metadata JSONB,
  p_avatar_url TEXT,
  p_logo_url TEXT,
  p_updated_by UUID
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
    is_admin = p_is_admin,
    verified = p_verified,
    country = p_country,
    metadata = p_metadata,
    avatar_url = p_avatar_url,
    logo_url = p_logo_url,
    updated_at = NOW(),
    updated_by = p_updated_by
  WHERE user_id = p_user_id
  RETURNING * INTO updated_user;
  
  RETURN updated_user;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Soft delete a user
CREATE OR REPLACE FUNCTION delete_user(p_user_id UUID)
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