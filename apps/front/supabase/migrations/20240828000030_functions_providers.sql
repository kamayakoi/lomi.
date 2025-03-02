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
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN QUERY
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
END;
$$;


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
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN QUERY
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
END;
$$;