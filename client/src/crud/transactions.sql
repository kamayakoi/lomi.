-- Create a new transaction
CREATE OR REPLACE FUNCTION create_transaction(
  p_end_customer_id UUID,
  p_payment_method_id UUID,
  p_organization_id UUID,
  p_user_id UUID,
  p_amount NUMERIC(10,2),
  p_fee_amount NUMERIC(10,2),
  p_fee_id UUID,
  p_currency_code currency_code,
  p_status transaction_status,
  p_transaction_type transaction_type,
  p_payment_info TEXT,
  p_metadata JSONB DEFAULT NULL
) RETURNS transactions AS $$
DECLARE
  new_transaction transactions;
BEGIN
  -- Validate input
  IF p_end_customer_id IS NULL OR p_payment_method_id IS NULL OR p_organization_id IS NULL OR 
     p_user_id IS NULL OR p_amount IS NULL OR p_fee_amount IS NULL OR p_fee_id IS NULL OR
     p_currency_code IS NULL OR p_status IS NULL OR p_transaction_type IS NULL OR p_payment_info IS NULL THEN
    RAISE EXCEPTION 'All required fields must be provided';
  END IF;

  -- Insert the new transaction
  INSERT INTO transactions (
    end_customer_id, payment_method_id, organization_id, user_id,
    amount, fee_amount, fee_id, currency_code, status, transaction_type,
    payment_info, metadata
  )
  VALUES (
    p_end_customer_id, p_payment_method_id, p_organization_id, p_user_id,
    p_amount, p_fee_amount, p_fee_id, p_currency_code, p_status, p_transaction_type,
    p_payment_info, p_metadata
  )
  RETURNING * INTO new_transaction;
  
  RETURN new_transaction;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Read a transaction by ID
CREATE OR REPLACE FUNCTION get_transaction_by_id(p_transaction_id UUID)
RETURNS transactions AS $$
  SELECT * FROM transactions WHERE transaction_id = p_transaction_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Update a transaction
CREATE OR REPLACE FUNCTION update_transaction(
  p_transaction_id UUID,
  p_status transaction_status,
  p_metadata JSONB
) RETURNS transactions AS $$
DECLARE
  updated_transaction transactions;
BEGIN
  -- Update the transaction
  UPDATE transactions
  SET 
    status = p_status,
    metadata = p_metadata,
    updated_at = NOW()
  WHERE transaction_id = p_transaction_id
  RETURNING * INTO updated_transaction;
  
  RETURN updated_transaction;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Soft delete a transaction
CREATE OR REPLACE FUNCTION delete_transaction(p_transaction_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  rows_affected INT;
BEGIN
  UPDATE transactions
  SET deleted_at = NOW()
  WHERE transaction_id = p_transaction_id
    AND deleted_at IS NULL;
  
  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  RETURN rows_affected > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;