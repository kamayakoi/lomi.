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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Get a transaction by ID
CREATE OR REPLACE FUNCTION get_transaction_by_id(transaction_id UUID)
RETURNS transactions AS $$
  SELECT * FROM transactions WHERE transaction_id = $1;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Update transaction status
CREATE OR REPLACE FUNCTION update_transaction_status(transaction_id UUID, new_status transaction_status)
RETURNS transactions AS $$
  UPDATE transactions
  SET status = new_status
  WHERE transaction_id = $1
  RETURNING *;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Get merchant details
CREATE OR REPLACE FUNCTION get_merchant_details(merchant_id UUID)
RETURNS TABLE (
  id UUID,
  name VARCHAR
) AS $$
  SELECT
    m.merchant_id AS id,
    m.name
  FROM merchants m
  WHERE m.merchant_id = $1;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Get product details by ID
CREATE OR REPLACE FUNCTION get_product_by_id(prod_id UUID)
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  description TEXT,
  price NUMERIC(10,2),
  currency_code currency_code,
  merchant_id UUID,
  organization_id UUID
) AS $$
  SELECT
    p.product_id AS id,
    p.name,
    p.description,
    p.price,
    p.currency_code,
    p.merchant_id,
    p.organization_id
  FROM merchant_products p
  JOIN merchants m ON p.merchant_id = m.merchant_id
  JOIN organizations o ON p.organization_id = o.organization_id
  WHERE p.product_id = $1;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Get available providers for an organization
CREATE OR REPLACE FUNCTION get_available_providers(organization_id UUID)
RETURNS TABLE (
  code provider_code,
  name VARCHAR
) AS $$
  SELECT
    p.code,
    p.name
  FROM providers p
  JOIN organization_providers_settings ops ON p.code = ops.provider_code
  WHERE ops.organization_id = $1 AND ops.is_connected = true;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Get organization details
CREATE OR REPLACE FUNCTION get_organization_details(org_id UUID)
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  logo_url VARCHAR
) AS $$
  SELECT
    o.organization_id AS id,
    o.name,
    o.logo_url
  FROM organizations o
  WHERE o.organization_id = $1;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Get product details by ID
CREATE OR REPLACE FUNCTION get_product_by_id(prod_id UUID)
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  description TEXT,
  price NUMERIC(10,2),
  currency_code currency_code,
  merchant_id UUID,
  organization_id UUID
) AS $$
  SELECT
    p.product_id AS id,
    p.name,
    p.description,
    p.price,
    p.currency_code,
    p.merchant_id,
    p.organization_id
  FROM merchant_products p
  JOIN merchants m ON p.merchant_id = m.merchant_id
  JOIN organizations o ON p.organization_id = o.organization_id
  WHERE p.product_id = $1;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;


-- Get payment link details by ID
CREATE OR REPLACE FUNCTION get_payment_link_by_id(link_id UUID)
RETURNS TABLE (
  id UUID,
  merchant_id UUID,
  organization_id UUID,
  link_type link_type,
  url VARCHAR(2048),
  product_id UUID,
  plan_id UUID,
  title VARCHAR(255),
  public_description TEXT,
  private_description TEXT,
  price NUMERIC(10,2),
  currency_code currency_code,
  allowed_providers provider_code[],
  allow_coupon_code BOOLEAN,
  is_active BOOLEAN,
  expires_at TIMESTAMPTZ,
  success_url VARCHAR(2048),
  metadata JSONB,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
  SELECT
    pl.link_id AS id,
    pl.merchant_id,
    pl.organization_id,
    pl.link_type,
    pl.url,
    pl.product_id,
    pl.plan_id,
    pl.title,
    pl.public_description,
    pl.private_description,
    pl.price,
    pl.currency_code,
    pl.allowed_providers,
    pl.allow_coupon_code,
    pl.is_active,
    pl.expires_at,
    pl.success_url,
    pl.metadata,
    pl.created_at,
    pl.updated_at
  FROM payment_links pl
  WHERE pl.link_id = $1;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Get plan details by ID
CREATE OR REPLACE FUNCTION get_plan_by_id(plan_id UUID)
RETURNS TABLE (
  id UUID,
  merchant_id UUID,
  organization_id UUID,
  name VARCHAR(255),
  description TEXT,
  billing_frequency frequency,
  amount NUMERIC(10,2),
  currency_code currency_code,
  failed_payment_action failed_payment_action,
  charge_day INT,
  metadata JSONB,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  first_payment_type first_payment_type
) AS $$
  SELECT
    sp.plan_id AS id,
    sp.merchant_id,
    sp.organization_id,
    sp.name,
    sp.description,
    sp.billing_frequency,
    sp.amount,
    sp.currency_code,
    sp.failed_payment_action,
    sp.charge_day,
    sp.metadata,
    sp.created_at,
    sp.updated_at,
    sp.first_payment_type
  FROM subscription_plans sp
  WHERE sp.plan_id = $1;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Create a transaction with provider details
CREATE OR REPLACE FUNCTION create_transaction_with_provider(
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
  payment_method_code payment_method_code,
  provider_transaction_id VARCHAR(255),
  provider_payment_status VARCHAR(50)
)
RETURNS transactions AS $$
DECLARE
  v_transaction transactions;
BEGIN
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
  RETURNING * INTO v_transaction;

INSERT INTO providers_transactions (
  transaction_id,
  merchant_id,
  provider_code,
  provider_transaction_id,
  provider_payment_status
)
VALUES (
  v_transaction.transaction_id,
  merchant_id,
  provider_code,
  provider_transaction_id,
  provider_payment_status
);

  RETURN v_transaction;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;