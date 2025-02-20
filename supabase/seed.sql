-- Seed data for merchants
INSERT INTO merchants (merchant_id, name, email, phone_number, is_deleted, created_at, updated_at)
VALUES 
  ('m1', 'Test Merchant 1', 'merchant1@test.com', '+221777777771', false, NOW(), NOW()),
  ('m2', 'Test Merchant 2', 'merchant2@test.com', '+221777777772', false, NOW(), NOW());

-- Seed data for merchant bank accounts
INSERT INTO merchant_bank_accounts (bank_account_id, merchant_id, bank_name, account_number, is_valid, created_at, updated_at)
VALUES 
  ('ba1', 'm1', 'Wave Senegal', '221777777771', true, NOW(), NOW()),
  ('ba2', 'm1', 'Orange Money', '221777777772', true, NOW(), NOW());

-- Seed data for products
INSERT INTO merchant_products (product_id, merchant_id, name, description, price, currency, is_active, created_at, updated_at)
VALUES 
  ('p1', 'm1', 'Basic Plan', 'Basic subscription plan', 5000, 'XOF', true, NOW(), NOW()),
  ('p2', 'm1', 'Premium Plan', 'Premium subscription plan', 10000, 'XOF', true, NOW(), NOW());

-- Seed data for subscription plans
INSERT INTO subscription_plans (plan_id, merchant_id, name, description, price, billing_interval, currency, display_on_storefront, created_at, updated_at)
VALUES 
  ('sp1', 'm1', 'Monthly Basic', 'Monthly basic subscription', 5000, 'month', 'XOF', true, NOW(), NOW()),
  ('sp2', 'm1', 'Monthly Premium', 'Monthly premium subscription', 10000, 'month', 'XOF', true, NOW(), NOW());

-- Seed data for customers
INSERT INTO customers (customer_id, merchant_id, first_name, last_name, email, phone_number, is_deleted, created_at, updated_at)
VALUES 
  ('c1', 'm1', 'John', 'Doe', 'john@example.com', '+221777777773', false, NOW(), NOW()),
  ('c2', 'm1', 'Jane', 'Smith', 'jane@example.com', '+221777777774', false, NOW(), NOW());

-- Seed data for transactions (last 30 days)
WITH dates AS (
  SELECT generate_series(
    NOW() - INTERVAL '30 days',
    NOW(),
    INTERVAL '1 day'
  ) AS date
)
INSERT INTO transactions (
  transaction_id,
  merchant_id,
  customer_id,
  amount,
  currency,
  status,
  provider,
  created_at,
  updated_at
)
SELECT 
  'tx-' || FLOOR(RANDOM() * 1000000)::text,
  'm1',
  CASE WHEN RANDOM() > 0.5 THEN 'c1' ELSE 'c2' END,
  CASE 
    WHEN RANDOM() > 0.7 THEN 10000
    WHEN RANDOM() > 0.4 THEN 5000
    ELSE 2500
  END,
  'XOF',
  'completed',
  CASE 
    WHEN RANDOM() > 0.6 THEN 'wave'
    WHEN RANDOM() > 0.3 THEN 'orange_money'
    ELSE 'free_money'
  END,
  date + (RANDOM() * INTERVAL '24 hours'),
  date + (RANDOM() * INTERVAL '24 hours')
FROM dates
CROSS JOIN generate_series(1, 5); -- 5 transactions per day

-- Seed data for subscriptions
INSERT INTO merchant_subscriptions (
  subscription_id,
  merchant_id,
  customer_id,
  plan_id,
  subscription_status,
  current_period_start,
  current_period_end,
  created_at,
  updated_at
)
SELECT 
  'sub-' || FLOOR(RANDOM() * 1000000)::text,
  'm1',
  CASE WHEN RANDOM() > 0.5 THEN 'c1' ELSE 'c2' END,
  CASE WHEN RANDOM() > 0.5 THEN 'sp1' ELSE 'sp2' END,
  'active',
  NOW() - INTERVAL '1 month',
  NOW() + INTERVAL '1 month',
  NOW() - INTERVAL '1 month',
  NOW()
FROM generate_series(1, 10); -- 10 active subscriptions