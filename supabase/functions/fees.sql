-- Create a new fee
CREATE OR REPLACE FUNCTION create_fee(
  p_transaction_type VARCHAR,
  p_amount NUMERIC(10,2),
  p_currency_code currency_code
) RETURNS fees AS $$
DECLARE
  new_fee fees;
BEGIN
  -- Validate input
  IF p_transaction_type IS NULL OR p_amount IS NULL OR p_currency_code IS NULL THEN
    RAISE EXCEPTION 'Transaction type, amount, and currency code are required';
  END IF;

  -- Insert the new fee
  INSERT INTO fees (transaction_type, amount, currency_code)
  VALUES (p_transaction_type, p_amount, p_currency_code)
  RETURNING * INTO new_fee;
  
  RETURN new_fee;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Read a fee by ID
CREATE OR REPLACE FUNCTION get_fee_by_id(p_fee_id UUID)
RETURNS fees AS $$
  SELECT * FROM fees WHERE fee_id = p_fee_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Update a fee
CREATE OR REPLACE FUNCTION update_fee(
  p_fee_id UUID,
  p_transaction_type VARCHAR,
  p_amount NUMERIC(10,2),
  p_currency_code currency_code
) RETURNS fees AS $$
DECLARE
  updated_fee fees;
BEGIN
  -- Update the fee
  UPDATE fees
  SET 
    transaction_type = p_transaction_type,
    amount = p_amount,
    currency_code = p_currency_code,
    updated_at = NOW()
  WHERE fee_id = p_fee_id
  RETURNING * INTO updated_fee;
  
  RETURN updated_fee;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Soft delete a fee
CREATE OR REPLACE FUNCTION delete_fee(p_fee_id UUID)
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