-- Create a new main account
CREATE OR REPLACE FUNCTION create_main_account(
  p_organization_id UUID,
  p_account_id UUID
) RETURNS main_accounts AS $$
DECLARE
  new_main_account main_accounts;
BEGIN
  -- Validate input
  IF p_organization_id IS NULL OR p_account_id IS NULL THEN
    RAISE EXCEPTION 'Organization ID and account ID are required';
  END IF;

  -- Insert the new main account
  INSERT INTO main_accounts (organization_id, account_id)
  VALUES (p_organization_id, p_account_id)
  RETURNING * INTO new_main_account;
  
  RETURN new_main_account;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Read a main account by ID
CREATE OR REPLACE FUNCTION get_main_account_by_id(p_main_account_id UUID)
RETURNS main_accounts AS $$
  SELECT * FROM main_accounts WHERE main_account_id = p_main_account_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Update a main account
CREATE OR REPLACE FUNCTION update_main_account(
  p_main_account_id UUID,
  p_account_id UUID
) RETURNS main_accounts AS $$
DECLARE
  updated_main_account main_accounts;
BEGIN
  -- Update the main account
  UPDATE main_accounts
  SET 
    account_id = p_account_id,
    updated_at = NOW()
  WHERE main_account_id = p_main_account_id
  RETURNING * INTO updated_main_account;
  
  RETURN updated_main_account;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Soft delete a main account
CREATE OR REPLACE FUNCTION delete_main_account(p_main_account_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  rows_affected INT;
BEGIN
  UPDATE main_accounts
  SET deleted_at = NOW()
  WHERE main_account_id = p_main_account_id
    AND deleted_at IS NULL;
  
  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  RETURN rows_affected > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;