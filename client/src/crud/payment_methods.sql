-- Create a new payment method
CREATE OR REPLACE FUNCTION create_payment_method(
  p_name VARCHAR,
  p_code payment_method_code,
  p_description TEXT,
  p_metadata JSONB DEFAULT NULL
) RETURNS payment_methods AS $$
DECLARE
  new_payment_method payment_methods;
BEGIN
  -- Insert the new payment method
  INSERT INTO payment_methods (name, code, description, metadata)
  VALUES (p_name, p_code, p_description, p_metadata)
  RETURNING * INTO new_payment_method;
  
  RETURN new_payment_method;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Read a payment method by ID
CREATE OR REPLACE FUNCTION get_payment_method_by_id(p_payment_method_id UUID)
RETURNS payment_methods AS $$
  SELECT * FROM payment_methods WHERE payment_method_id = p_payment_method_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Update a payment method
CREATE OR REPLACE FUNCTION update_payment_method(
  p_payment_method_id UUID,
  p_name VARCHAR,
  p_code payment_method_code,
  p_description TEXT,
  p_metadata JSONB
) RETURNS payment_methods AS $$
DECLARE
  updated_payment_method payment_methods;
BEGIN
  -- Update the payment method
  UPDATE payment_methods
  SET 
    name = p_name,
    code = p_code,
    description = p_description,
    metadata = p_metadata,
    updated_at = NOW()
  WHERE payment_method_id = p_payment_method_id
  RETURNING * INTO updated_payment_method;
  
  RETURN updated_payment_method;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Soft delete a payment method
CREATE OR REPLACE FUNCTION delete_payment_method(p_payment_method_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  rows_affected INT;
BEGIN
  UPDATE payment_methods
  SET deleted_at = NOW()
  WHERE payment_method_id = p_payment_method_id
    AND deleted_at IS NULL;
  
  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  RETURN rows_affected > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;