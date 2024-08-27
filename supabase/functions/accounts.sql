-- Create a new account
CREATE OR REPLACE FUNCTION create_account(
  p_user_id UUID,
  p_organization_id UUID,
  p_name VARCHAR,
  p_description TEXT,
  p_metadata JSONB DEFAULT NULL
) RETURNS accounts AS $$
DECLARE
  new_account accounts;
BEGIN
  -- Insert the new account
  INSERT INTO accounts (user_id, organization_id, name, description, metadata)
  VALUES (p_user_id, p_organization_id, p_name, p_description, p_metadata)
  RETURNING * INTO new_account;
  
  RETURN new_account;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Read an account by ID
CREATE OR REPLACE FUNCTION get_account_by_id(p_account_id UUID)
RETURNS accounts AS $$
  SELECT * FROM accounts WHERE account_id = p_account_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Update an account
CREATE OR REPLACE FUNCTION update_account(
  p_account_id UUID,
  p_name VARCHAR,
  p_description TEXT,
  p_metadata JSONB
) RETURNS accounts AS $$
DECLARE
  updated_account accounts;
BEGIN
  -- Update the account
  UPDATE accounts
  SET 
    name = p_name,
    description = p_description,
    metadata = p_metadata,
    updated_at = NOW()
  WHERE account_id = p_account_id
  RETURNING * INTO updated_account;
  
  RETURN updated_account;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Soft delete an account
CREATE OR REPLACE FUNCTION delete_account(p_account_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  rows_affected INT;
BEGIN
  UPDATE accounts
  SET deleted_at = NOW()
  WHERE account_id = p_account_id
    AND deleted_at IS NULL;
  
  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  RETURN rows_affected > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;