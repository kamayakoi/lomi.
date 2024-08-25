-- Create a new account
CREATE OR REPLACE FUNCTION create_account(
  p_user_id BIGINT,
  p_payment_method_id BIGINT,
  p_currency_id INTEGER
) RETURNS accounts AS $$
DECLARE
  new_account accounts;
BEGIN
  -- Validate input
  IF p_user_id IS NULL OR p_payment_method_id IS NULL OR p_currency_id IS NULL THEN
    RAISE EXCEPTION 'User ID, payment method ID, and currency ID are required';
  END IF;

  -- Insert the new account
  INSERT INTO accounts (user_id, payment_method_id, currency_id)
  VALUES (p_user_id, p_payment_method_id, p_currency_id)
  RETURNING * INTO new_account;
  
  RETURN new_account;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Read an account by ID
CREATE OR REPLACE FUNCTION get_account_by_id(p_account_id BIGINT)
RETURNS accounts AS $$
  SELECT * FROM accounts WHERE account_id = p_account_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Update an account
CREATE OR REPLACE FUNCTION update_account(
  p_account_id BIGINT,
  p_payment_method_id BIGINT,
  p_currency_id INTEGER
) RETURNS accounts AS $$
DECLARE
  updated_account accounts;
BEGIN
  -- Update the account
  UPDATE accounts
  SET 
    payment_method_id = p_payment_method_id,
    currency_id = p_currency_id
  WHERE account_id = p_account_id
  RETURNING * INTO updated_account;
  
  RETURN updated_account;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Soft delete an account
CREATE OR REPLACE FUNCTION delete_account(p_account_id BIGINT)
RETURNS BOOLEAN AS $$
DECLARE
  rows_affected INT;
BEGIN
  UPDATE accounts
  SET delete