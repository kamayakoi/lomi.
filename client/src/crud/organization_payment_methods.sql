-- Create a new organization payment method
CREATE OR REPLACE FUNCTION create_organization_payment_method(
  p_organization_id BIGINT,
  p_payment_method_id BIGINT
) RETURNS organization_payment_methods AS $$
DECLARE
  new_org_payment_method organization_payment_methods;
BEGIN
  -- Validate input
  IF p_organization_id IS NULL OR p_payment_method_id IS NULL THEN
    RAISE EXCEPTION 'Organization ID and payment method ID are required';
  END IF;

  -- Insert the new organization payment method
  INSERT INTO organization_payment_methods (organization_id, payment_method_id)
  VALUES (p_organization_id, p_payment_method_id)
  RETURNING * INTO new_org_payment_method;
  
  RETURN new_org_payment_method;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Read an organization payment method by ID
CREATE OR REPLACE FUNCTION get_organization_payment_method_by_id(p_org_payment_method_id BIGINT)
RETURNS organization_payment_methods AS $$
  SELECT * FROM organization_payment_methods WHERE org_payment_method_id = p_org_payment_method_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Update an organization payment method
CREATE OR REPLACE FUNCTION update_organization_payment_method(
  p_org_payment_method_id BIGINT,
  p_payment_method_id BIGINT
) RETURNS organization_payment_methods AS $$
DECLARE
  updated_org_payment_method organization_payment_methods;
BEGIN
  -- Update the organization payment method
  UPDATE organization_payment_methods
  SET 
    payment_method_id = p_payment_method_id,
    updated_at = NOW()
  WHERE org_payment_method_id = p_org_payment_method_id
  RETURNING * INTO updated_org_payment_method;
  
  RETURN updated_org_payment_method;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Soft delete an organization payment method
CREATE OR REPLACE FUNCTION delete_organization_payment_method(p_org_payment_method_id BIGINT)
RETURNS BOOLEAN AS $$
DECLARE
  rows_affected INT;
BEGIN
  UPDATE organization_payment_methods
  SET deleted_at = NOW()
  WHERE org_payment_method_id = p_org_payment_method_id
    AND deleted_at IS NULL;
  
  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  RETURN rows_affected > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;