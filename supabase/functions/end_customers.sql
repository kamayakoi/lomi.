-- Create a new end customer
CREATE OR REPLACE FUNCTION create_end_customer(
  p_organization_id UUID,
  p_name VARCHAR,
  p_email VARCHAR,
  p_phone_number VARCHAR,
  p_metadata JSONB DEFAULT NULL
) RETURNS end_customers AS $$
DECLARE
  new_end_customer end_customers;
BEGIN
  -- Insert the new end customer
  INSERT INTO end_customers (organization_id, name, email, phone_number, metadata)
  VALUES (p_organization_id, p_name, p_email, p_phone_number, p_metadata)
  RETURNING * INTO new_end_customer;
  
  RETURN new_end_customer;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Read an end customer by ID
CREATE OR REPLACE FUNCTION get_end_customer_by_id(p_end_customer_id UUID)
RETURNS end_customers AS $$
  SELECT * FROM end_customers WHERE end_customer_id = p_end_customer_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Update an end customer
CREATE OR REPLACE FUNCTION update_end_customer(
  p_end_customer_id UUID,
  p_name VARCHAR,
  p_email VARCHAR,
  p_phone_number VARCHAR,
  p_metadata JSONB
) RETURNS end_customers AS $$
DECLARE
  updated_end_customer end_customers;
BEGIN
  -- Update the end customer
  UPDATE end_customers
  SET 
    name = p_name,
    email = p_email,
    phone_number = p_phone_number,
    metadata = p_metadata,
    updated_at = NOW()
  WHERE end_customer_id = p_end_customer_id
  RETURNING * INTO updated_end_customer;
  
  RETURN updated_end_customer;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Soft delete an end customer
CREATE OR REPLACE FUNCTION delete_end_customer(p_end_customer_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  rows_affected INT;
BEGIN
  UPDATE end_customers
  SET deleted_at = NOW()
  WHERE end_customer_id = p_end_customer_id
    AND deleted_at IS NULL;
  
  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  RETURN rows_affected > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;