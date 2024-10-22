-- Create a transaction
CREATE OR REPLACE FUNCTION create_transaction(
  merchant_id UUID,
  organization_id UUID,
  customer_id UUID,
  product_id UUID,
  subscription_id UUID,
  transaction_type transaction_type,
  description TEXT,
  reference_id VARCHAR(8),
  metadata JSONB,
  gross_amount NUMERIC(10,2),
  fee_amount NUMERIC(15,2),
  net_amount NUMERIC(10,2),
  fee_reference TEXT,
  currency_code currency_code,
  provider_code provider_code,
  payment_method_code payment_method_code
)
RETURNS transactions AS $$
  INSERT INTO transactions (
    merchant_id,
    organization_id,
    customer_id,
    product_id,
    subscription_id,
    transaction_type,
    description,
    reference_id,
    metadata,
    gross_amount,
    fee_amount,
    net_amount,
    fee_reference,
    currency_code,
    provider_code,
    payment_method_code
  )
  VALUES (
    merchant_id,
    organization_id,
    customer_id,
    product_id,
    subscription_id,
    transaction_type,
    description,
    reference_id,
    metadata,
    gross_amount,
    fee_amount,
    net_amount,
    fee_reference,
    currency_code,
    provider_code,
    payment_method_code
  )
  RETURNING *;
$$ LANGUAGE sql;

-- Get a transaction by ID
CREATE OR REPLACE FUNCTION get_transaction_by_id(transaction_id UUID)
RETURNS transactions AS $$
  SELECT * FROM transactions WHERE transaction_id = $1;
$$ LANGUAGE sql;

-- Update transaction status
CREATE OR REPLACE FUNCTION update_transaction_status(transaction_id UUID, new_status transaction_status)
RETURNS transactions AS $$
  UPDATE transactions
  SET status = new_status
  WHERE transaction_id = $1
  RETURNING *;
$$ LANGUAGE sql;