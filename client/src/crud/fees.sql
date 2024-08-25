-- Create a new fee
CREATE OR REPLACE FUNCTION create_fee(
  p_transaction_type VARCHAR,
  p_fee_percentage NUMERIC,
  p_fee_fixed NUMERIC
) RETURNS fees AS $$
DECLARE
  new_fee fees;
BEGIN
  -- Validate input
  IF p_transaction_type IS NULL OR p_fee_percentage IS NULL OR p_fee_fixed IS NULL THEN
    RAISE EXCEPTION 'Transaction type, fee percentage, and fee fixed are required';
  END IF;

  -- Insert the new fee
  INSERT INTO fees (transaction_type, fee_percentage, fee_fixed)
  VALUES (p_transaction_type, p_fee_percentage, p_fee_fixed)
  RETURNING * INTO new_fee;
  
  RETURN new_fee;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Read a fee by ID
CREATE OR REPLACE FUNCTION get_fee_by_id(p_fee_id BIGINT)
RETURNS fees AS $$
  SELECT * FROM fees WHERE fee_id = p_fee_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Update a fee
CREATE OR REPLACE FUNCTION update_fee(
  p_fee_id BIGINT,
  p_transaction_type VARCHAR,
  p_fee_percentage NUMERIC,
  p_fee_fixed NUMERIC
) RETURNS fees AS $$
DECLARE
  updated_fee fees;
BEGIN
  -- Update the fee
  UPDATE fees
  SET 
    transaction_type = p_transaction_type,
    fee_percentage = p_fee_percentage,
    fee_fixed = p_fee_fixed,
    updated_at = NOW()
  WHERE fee_id = p_fee_id
  RETURNING * INTO updated_fee;
  
  RETURN updated_fee;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Soft delete a fee
CREATE OR REPLACE FUNCTION delete_fee(p_fee_id BIGINT)
RETURNS BOOLEAN AS $$
DECLARE
  rows_affected INT;
BEGIN
  UPDATE fees
  SET deleted_at = NOW()
  WHERE fee_id = p_fee_id
    AND deleted_at IS NULL;
  
  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  RETURN rows_affected > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;