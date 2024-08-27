-- Create a new user organization link
CREATE OR REPLACE FUNCTION create_user_organization_link(
  p_user_id UUID,
  p_organization_id UUID,
  p_role VARCHAR
) RETURNS user_organization_links AS $$
DECLARE
  new_link user_organization_links;
BEGIN
  -- Validate input
  IF p_user_id IS NULL OR p_organization_id IS NULL OR p_role IS NULL THEN
    RAISE EXCEPTION 'User ID, organization ID, and role are required';
  END IF;

  -- Insert the new user organization link
  INSERT INTO user_organization_links (user_id, organization_id, role)
  VALUES (p_user_id, p_organization_id, p_role)
  RETURNING * INTO new_link;
  
  RETURN new_link;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Read a user organization link by ID
CREATE OR REPLACE FUNCTION get_user_organization_link_by_id(p_link_id UUID)
RETURNS user_organization_links AS $$
  SELECT * FROM user_organization_links WHERE link_id = p_link_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Update a user organization link
CREATE OR REPLACE FUNCTION update_user_organization_link(
  p_link_id UUID,
  p_role VARCHAR
) RETURNS user_organization_links AS $$
DECLARE
  updated_link user_organization_links;
BEGIN
  -- Update the user organization link
  UPDATE user_organization_links
  SET 
    role = p_role,
    updated_at = NOW()
  WHERE link_id = p_link_id
  RETURNING * INTO updated_link;
  
  RETURN updated_link;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Soft delete a user organization link
CREATE OR REPLACE FUNCTION delete_user_organization_link(p_link_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  rows_affected INT;
BEGIN
  UPDATE user_organization_links
  SET deleted_at = NOW()
  WHERE link_id = p_link_id
    AND deleted_at IS NULL;
  
  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  RETURN rows_affected > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;