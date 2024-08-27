-- Create a new internal transfer
CREATE OR REPLACE FUNCTION create_internal_transfer(
  p_from_account_id UUID,
  p_to_account_id UUID,
  p_amount NUMERIC(10,2),
  p_currency_code currency_code,
  p_metadata JSONB DEFAULT NULL
) RETURNS internal_transfers AS $$
DECLARE
  new_internal_transfer internal_transfers;
BEGIN
  -- Insert the new internal transfer
  INSERT INTO internal_transfers (from_account_id, to_account_id, amount, currency_code, metadata)
  VALUES (p_from_account_id, p_to_account_id, p_amount, p_currency_code, p_metadata)
  RETURNING * INTO new_internal_transfer;
  
  RETURN new_internal_transfer;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Read an internal transfer by ID
CREATE OR REPLACE FUNCTION get_internal_transfer_by_id(p_internal_transfer_id UUID)
RETURNS internal_transfers AS $$
  SELECT * FROM internal_transfers WHERE internal_transfer_id = p_internal_transfer_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Update an internal transfer
CREATE OR REPLACE FUNCTION update_internal_transfer(
  p_internal_transfer_id UUID,
  p_status transfer_status,
  p_metadata JSONB
) RETURNS internal_transfers AS $$
DECLARE
  updated_internal_transfer internal_transfers;
BEGIN
  -- Update the internal transfer
  UPDATE internal_transfers
  SET 
    status = p_status,
    metadata = p_metadata,
    updated_at = NOW()
  WHERE internal_transfer_id = p_internal_transfer_id
  RETURNING * INTO updated_internal_transfer;
  
  RETURN updated_internal_transfer;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Soft delete an internal transfer
CREATE OR REPLACE FUNCTION delete_internal_transfer(p_internal_transfer_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  rows_affected INT;
BEGIN
  UPDATE internal_transfers
  SET deleted_at = NOW()
  WHERE internal_transfer_id = p_internal_transfer_id
    AND deleted_at IS NULL;
  
  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  RETURN rows_affected > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;