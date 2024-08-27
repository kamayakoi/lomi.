-- Create a new end customer payment method
CREATE OR REPLACE FUNCTION create_end_customer_payment_method(
  p_end_customer_id UUID,
  p_payment_method_id UUID
) RETURNS end_customer_payment_methods AS $$
DECLARE
  new_ec_payment_method end_customer_payment_methods;
BEGIN
  -- Validate input
  IF p_end_customer_id IS NULL OR p_payment_method_id IS NULL THEN
    RAISE EXCEPTION 'End customer ID and payment method ID are required';
  END IF;

  -- Insert the new end customer payment method
  INSERT INTO end_customer_payment_methods (end_customer_id, payment_method_id)
  VALUES (p_end_customer_id, p_payment_method_id)
  RETURNING * INTO new_ec_payment_method;
  
  RETURN new_ec_payment_method;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Read an end customer payment method by ID
CREATE OR REPLACE FUNCTION get_end_customer_payment_method_by_id(p_ec_payment_method_id UUID)
RETURNS end_customer_payment_methods AS $$
  SELECT * FROM end_customer_payment_methods WHERE ec_payment_method_id = p_ec_payment_method_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Update an end customer payment method
CREATE OR REPLACE FUNCTION update_end_customer_payment_method(
  p_ec_payment_method_id UUID,
  p_payment_method_id UUID
) RETURNS end_customer_payment_methods AS $$
DECLARE
  updated_ec_payment_method end_customer_payment_methods;
BEGIN
  -- Update the end customer payment method
  UPDATE end_customer_payment_methods
  SET 
    payment_method_id = p_payment_method_id,
    updated_at = NOW()
  WHERE ec_payment_method_id = p_ec_payment_method_id
  RETURNING * INTO updated_ec_payment_method;
  
  RETURN updated_ec_payment_method;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Soft delete an end customer payment method
CREATE OR REPLACE FUNCTION delete_end_customer_payment_method(p_ec_payment_method_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  rows_affected INT;
BEGIN
  UPDATE end_customer_payment_methods
  SET deleted_at = NOW()
  WHERE ec_payment_method_id = p_ec_payment_method_id
    AND deleted_at IS NULL;
  
  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  RETURN rows_affected > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;