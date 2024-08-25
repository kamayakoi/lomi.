-- Create a new entry
CREATE OR REPLACE FUNCTION create_entry(
  p_account_id BIGINT,
  p_transaction_id BIGINT,
  p_amount BIGINT,
  p_type VARCHAR
) RETURNS entries AS $$
DECLARE
  new_entry entries;
BEGIN
  -- Validate input
  IF p_account_id IS NULL OR p_transaction_id IS NULL OR p_amount IS NULL OR p_type IS NULL THEN
    RAISE EXCEPTION 'Account ID, transaction ID, amount, and type are required';
  END IF;

  -- Insert the new entry
  INSERT INTO entries (account_id, transaction_id, amount, type)
  VALUES (p_account_id, p_transaction_id, p_amount, p_type)
  RETURNING * INTO new_entry;
  
  RETURN new_entry;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Read an entry by ID
CREATE OR REPLACE FUNCTION get_entry_by_id(p_entry_id BIGINT)
RETURNS entries AS $$
  SELECT * FROM entries WHERE entry_id = p_entry_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Update an entry
CREATE OR REPLACE FUNCTION update_entry(
  p_entry_id BIGINT,
  p_amount BIGINT,
  p_type VARCHAR
) RETURNS entries AS $$
DECLARE
  updated_entry entries;
BEGIN
  -- Update the entry
  UPDATE entries
  SET 
    amount = p_amount,
    type = p_type,
    updated_at = NOW()
  WHERE entry_id = p_entry_id
  RETURNING * INTO updated_entry;
  
  RETURN updated_entry;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Soft delete an entry
CREATE OR REPLACE FUNCTION delete_entry(p_entry_id BIGINT)
RETURNS BOOLEAN AS $$
DECLARE
  rows_affected INT;
BEGIN
  UPDATE entries
  SET deleted_at = NOW()
  WHERE entry_id = p_entry_id
    AND deleted_at IS NULL;
  
  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  RETURN rows_affected > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;