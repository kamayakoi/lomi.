-- Create a new recurring payment
CREATE OR REPLACE FUNCTION create_recurring_payment(
  p_end_customer_id UUID,
  p_payment_method_id UUID,
  p_amount NUMERIC(10,2),
  p_currency_code currency_code,
  p_frequency frequency,
  p_start_date DATE,
  p_end_date DATE,
  p_type recurring_payment_type,
  p_metadata JSONB DEFAULT NULL
) RETURNS recurring_payments AS $$
DECLARE
  new_recurring_payment recurring_payments;
BEGIN
  -- Insert the new recurring payment
  INSERT INTO recurring_payments (
    end_customer_id, payment_method_id, amount, currency_code, frequency,
    start_date, end_date, type, metadata
  )
  VALUES (
    p_end_customer_id, p_payment_method_id, p_amount, p_currency_code, p_frequency,
    p_start_date, p_end_date, p_type, p_metadata
  )
  RETURNING * INTO new_recurring_payment;
  
  RETURN new_recurring_payment;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Read a recurring payment by ID
CREATE OR REPLACE FUNCTION get_recurring_payment_by_id(p_recurring_payment_id UUID)
RETURNS recurring_payments AS $$
  SELECT * FROM recurring_payments WHERE recurring_payment_id = p_recurring_payment_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Update a recurring payment
CREATE OR REPLACE FUNCTION update_recurring_payment(
  p_recurring_payment_id UUID,
  p_amount NUMERIC(10,2),
  p_currency_code currency_code,
  p_frequency frequency,
  p_start_date DATE,
  p_end_date DATE,
  p_type recurring_payment_type,
  p_metadata JSONB
) RETURNS recurring_payments AS $$
DECLARE
  updated_recurring_payment recurring_payments;
BEGIN
  -- Update the recurring payment
  UPDATE recurring_payments
  SET 
    amount = p_amount,
    currency_code = p_currency_code,
    frequency = p_frequency,
    start_date = p_start_date,
    end_date = p_end_date,
    type = p_type,
    metadata = p_metadata,
    updated_at = NOW()
  WHERE recurring_payment_id = p_recurring_payment_id
  RETURNING * INTO updated_recurring_payment;
  
  RETURN updated_recurring_payment;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Soft delete a recurring payment
CREATE OR REPLACE FUNCTION delete_recurring_payment(p_recurring_payment_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  rows_affected INT;
BEGIN
  UPDATE recurring_payments
  SET deleted_at = NOW()
  WHERE recurring_payment_id = p_recurring_payment_id
    AND deleted_at IS NULL;
  
  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  RETURN rows_affected > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;