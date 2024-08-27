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