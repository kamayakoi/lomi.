-- Create a new transfer
CREATE OR REPLACE FUNCTION create_transfer(
  p_from_account_id UUID,
  p_to_account_id UUID,
  p_amount NUMERIC(10,2),
  p_currency_code currency_code,
  p_status transfer_status,
  p_metadata JSONB DEFAULT NULL
) RETURNS transfers AS $$
DECLARE
  new_transfer transfers;
BEGIN
  -- Validate input
  IF p_from_account_id IS NULL OR p_to_account_id IS NULL OR p_amount IS NULL OR p_currency_code IS NULL OR p_status IS NULL THEN
    RAISE EXCEPTION 'From account ID, to account ID, amount, currency code, and status are required';
  END IF;

  -- Insert the new transfer
  INSERT INTO transfers (from_account_id, to_account_id, amount, currency_code, status, metadata)
  VALUES (p_from_account_id, p_to_account_id, p_amount, p_currency_code, p_status, p_metadata)
  RETURNING * INTO new_transfer;
  
  RETURN new_transfer;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Read a transfer by ID
CREATE OR REPLACE FUNCTION get_transfer_by_id(p_transfer_id BIGINT)
RETURNS transfers AS $$
  SELECT * FROM transfers WHERE transfer_id = p_transfer_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Update a transfer
CREATE OR REPLACE FUNCTION update_transfer(
  p_transfer_id UUID,
  p_status transfer_status,
  p_metadata JSONB
) RETURNS transfers AS $$
DECLARE
  updated_transfer transfers;
BEGIN
  -- Update the transfer
  UPDATE transfers
  SET 
    status = p_status,
    metadata = p_metadata,
    updated_at = NOW()
  WHERE transfer_id = p_transfer_id
  RETURNING * INTO updated_transfer;
  
  RETURN updated_transfer;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Soft delete a transfer
CREATE OR REPLACE FUNCTION delete_transfer(p_transfer_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  rows_affected INT;
BEGIN
  UPDATE transfers
  SET deleted_at = NOW()
  WHERE transfer_id = p_transfer_id
    AND deleted_at IS NULL;
  
  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  RETURN rows_affected > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;