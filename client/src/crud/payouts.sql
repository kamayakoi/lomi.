-- Create a new payout
CREATE OR REPLACE FUNCTION create_payout(
  p_organization_id UUID,
  p_amount NUMERIC(10,2),
  p_currency_code currency_code,
  p_status payout_status,
  p_metadata JSONB DEFAULT NULL
) RETURNS payouts AS $$
DECLARE
  new_payout payouts;
BEGIN
  -- Validate input
  IF p_organization_id IS NULL OR p_amount IS NULL OR p_currency_code IS NULL OR p_status IS NULL THEN
    RAISE EXCEPTION 'Organization ID, amount, currency code, and status are required';
  END IF;

  -- Insert the new payout
  INSERT INTO payouts (organization_id, amount, currency_code, status, metadata)
  VALUES (p_organization_id, p_amount, p_currency_code, p_status, p_metadata)
  RETURNING * INTO new_payout;
  
  RETURN new_payout;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Read a payout by ID
CREATE OR REPLACE FUNCTION get_payout_by_id(p_payout_id UUID)
RETURNS payouts AS $$
  SELECT * FROM payouts WHERE payout_id = p_payout_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Update a payout
CREATE OR REPLACE FUNCTION update_payout(
  p_payout_id UUID,
  p_status payout_status,
  p_metadata JSONB
) RETURNS payouts AS $$
DECLARE
  updated_payout payouts;
BEGIN
  -- Update the payout
  UPDATE payouts
  SET 
    status = p_status,
    metadata = p_metadata,
    updated_at = NOW()
  WHERE payout_id = p_payout_id
  RETURNING * INTO updated_payout;
  
  RETURN updated_payout;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Soft delete a payout
CREATE OR REPLACE FUNCTION delete_payout(p_payout_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  rows_affected INT;
BEGIN
  UPDATE payouts
  SET deleted_at = NOW()
  WHERE payout_id = p_payout_id
    AND deleted_at IS NULL;
  
  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  RETURN rows_affected > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;