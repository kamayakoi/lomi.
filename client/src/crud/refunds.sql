-- Create a new refund
CREATE OR REPLACE FUNCTION create_refund(
  p_transaction_id UUID,
  p_amount NUMERIC(10,2),
  p_currency_code currency_code,
  p_reason TEXT,
  p_metadata JSONB DEFAULT NULL
) RETURNS refunds AS $$
DECLARE
  new_refund refunds;
BEGIN
  -- Insert the new refund
  INSERT INTO refunds (transaction_id, amount, currency_code, reason, metadata)
  VALUES (p_transaction_id, p_amount, p_currency_code, p_reason, p_metadata)
  RETURNING * INTO new_refund;
  
  RETURN new_refund;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Read a refund by ID
CREATE OR REPLACE FUNCTION get_refund_by_id(p_refund_id UUID)
RETURNS refunds AS $$
  SELECT * FROM refunds WHERE refund_id = p_refund_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Update a refund
CREATE OR REPLACE FUNCTION update_refund(
  p_refund_id UUID,
  p_status refund_status,
  p_metadata JSONB
) RETURNS refunds AS $$
DECLARE
  updated_refund refunds;
BEGIN
  -- Update the refund
  UPDATE refunds
  SET 
    status = p_status,
    metadata = p_metadata,
    updated_at = NOW()
  WHERE refund_id = p_refund_id
  RETURNING * INTO updated_refund;
  
  RETURN updated_refund;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Soft delete a refund
CREATE OR REPLACE FUNCTION delete_refund(p_refund_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  rows_affected INT;
BEGIN
  UPDATE refunds
  SET deleted_at = NOW()
  WHERE refund_id = p_refund_id
    AND deleted_at IS NULL;
  
  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  RETURN rows_affected > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;