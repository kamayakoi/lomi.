-- Create a new currency
CREATE OR REPLACE FUNCTION create_currency(
  p_code VARCHAR,
  p_name VARCHAR,
  p_symbol VARCHAR
) RETURNS currencies AS $$
DECLARE
  new_currency currencies;
BEGIN
  -- Validate input
  IF p_code IS NULL OR p_name IS NULL OR p_symbol IS NULL THEN
    RAISE EXCEPTION 'Code, name, and symbol are required';
  END IF;

  -- Insert the new currency
  INSERT INTO currencies (code, name, symbol)
  VALUES (p_code, p_name, p_symbol)
  RETURNING * INTO new_currency;
  
  RETURN new_currency;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Read a currency by ID
CREATE OR REPLACE FUNCTION get_currency_by_id(p_currency_id INTEGER)
RETURNS currencies AS $$
  SELECT * FROM currencies WHERE currency_id = p_currency_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Update a currency
CREATE OR REPLACE FUNCTION update_currency(
  p_currency_id INTEGER,
  p_code VARCHAR,
  p_name VARCHAR,
  p_symbol VARCHAR
) RETURNS currencies AS $$
DECLARE
  updated_currency currencies;
BEGIN
  -- Update the currency
  UPDATE currencies
  SET 
    code = p_code,
    name = p_name,
    symbol = p_symbol,
    updated_at = NOW()
  WHERE currency_id = p_currency_id
  RETURNING * INTO updated_currency;
  
  RETURN updated_currency;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Soft delete a currency
CREATE OR REPLACE FUNCTION delete_currency(p_currency_id INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  rows_affected INT;
BEGIN
  UPDATE currencies
  SET deleted_at = NOW()
  WHERE currency_id = p_currency_id
    AND deleted_at IS NULL;
  
  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  RETURN rows_affected > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;