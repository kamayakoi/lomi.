-- Start transaction
BEGIN;

-- Disable all triggers temporarily
SET session_replication_role = 'replica';

-- Seed data for merchants table
INSERT INTO merchants (name, email, phone_number, country)
VALUES 
  ('Merchant 1', 'merchant1@example.com', '+1234567890', 'Country 1');

-- Seed data for organizations table  
INSERT INTO organizations (name, email, phone_number, website_url)
VALUES
  ('Organization 1', 'org1@example.com', '+1234567890', 'https://org1.com');

-- Seed data for organization_addresses table
INSERT INTO organization_addresses (organization_id, country, region, city, postal_code)
VALUES
  ((SELECT organization_id FROM organizations WHERE name = 'Organization 1'), 'Country 1', 'Region 1', 'City 1', '12345');

-- Seed data for merchant_organization_links table
INSERT INTO merchant_organization_links (merchant_id, organization_id, role, category, action, store_handle)
VALUES
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'), (SELECT organization_id FROM organizations WHERE name = 'Organization 1'), 'Admin', 'accounts', 'view', 'store1');

-- Seed data for merchant_products table with more products
INSERT INTO merchant_products (merchant_id, organization_id, name, description, price, currency_code, image_url) VALUES
  -- Existing products
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'), 
   (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
   'Premium Web Hosting', 
   'Enterprise-grade web hosting with 99.9% uptime guarantee',
   299.99,
   'XOF',
   'https://example.com/images/hosting.png'),
   
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
   'Business Email Suite',
   'Professional email hosting with advanced security features',
   149.99,
   'XOF',
   'https://example.com/images/email.png'),
   
  -- New products in XOF
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
   'Website Builder Pro',
   'Drag-and-drop website builder with premium templates',
   199.99,
   'XOF',
   'https://example.com/images/website-builder.png'),
   
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
   'SEO Optimization Package',
   'Complete SEO optimization service for your website',
   499.99,
   'XOF',
   'https://example.com/images/seo.png'),
   
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
   'E-commerce Platform',
   'Full-featured e-commerce solution with payment processing',
   899.99,
   'XOF',
   'https://example.com/images/ecommerce.png'),
   
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
   'Domain Registration',
   'Premium domain registration with privacy protection',
   59.99,
   'XOF',
   'https://example.com/images/domain.png'),
   
  -- New products in USD
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
   'Cloud Storage Premium',
   'Secure cloud storage with advanced encryption',
   49.99,
   'USD',
   'https://example.com/images/cloud-storage.png'),
   
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
   'VPN Service',
   'High-speed VPN service with global server network',
   29.99,
   'USD',
   'https://example.com/images/vpn.png'),
   
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
   'Digital Marketing Consultation',
   'One-hour consultation with a digital marketing expert',
   99.99,
   'USD',
   'https://example.com/images/marketing.png');

-- Seed data for subscription_plans table with more plans
INSERT INTO subscription_plans (merchant_id, organization_id, name, description, billing_frequency, amount, currency_code, failed_payment_action, charge_day) VALUES
  -- Existing plans
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
   'Basic Hosting Plan',
   'Entry-level web hosting with essential features',
   'monthly',
   99.99,
   'XOF',
   'pause',
   1),
   
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
   'Premium Hosting Plan',
   'Advanced hosting with dedicated resources',
   'monthly',
   299.99,
   'XOF',
   'pause',
   1),

  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
   'Enterprise Hosting Plan',
   'Enterprise hosting with unlimited resources',
   'yearly',
   5999.99,
   'XOF',
   'pause',
   1),

  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
   'Business Email Pro',
   'Professional email hosting for teams',
   'monthly',
   199.99,
   'XOF',
   'pause',
   1),

  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
   'Email Enterprise',
   'Enterprise email solution with advanced security',
   'quarterly',
   899.99,
   'XOF',
   'pause',
   1),
   
  -- New plans in XOF
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
   'Website Builder Basic',
   'Basic website builder subscription',
   'monthly',
   79.99,
   'XOF',
   'pause',
   1),
   
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
   'Website Builder Premium',
   'Premium website builder with advanced features',
   'monthly',
   149.99,
   'XOF',
   'pause',
   1),
   
  -- New plans in USD
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
   'Cloud Storage Basic',
   'Basic cloud storage subscription',
   'monthly',
   9.99,
   'USD',
   'pause',
   1),
   
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
   'Cloud Storage Pro',
   'Professional cloud storage with advanced features',
   'monthly',
   19.99,
   'USD',
   'pause',
   1),
   
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
   'VPN Basic',
   'Basic VPN service subscription',
   'monthly',
   4.99,
   'USD',
   'pause',
   1),
   
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
   'VPN Premium',
   'Premium VPN service with advanced features',
   'yearly',
   49.99,
   'USD',
   'pause',
   1);

-- Seed data for customers table with more customers
INSERT INTO customers (merchant_id, organization_id, name, email, phone_number, country, city) VALUES
  -- Existing customers
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
   'John Smith',
   'john.smith@example.com',
   '+1234567890',
   'Senegal',
   'Dakar'),
   
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
   'Tech Solutions Inc',
   'contact@techsolutions.com',
   '+2345678901',
   'Ivory Coast',
   'Abidjan'),

  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
   'Global Corp',
   'billing@globalcorp.com',
   '+3456789012',
   'Senegal',
   'Dakar'),

  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
   'Digital Agency Pro',
   'finance@digitalagency.com',
   '+4567890123',
   'Mali',
   'Bamako'),

  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
   'StartUp Hub',
   'accounts@startuphub.com',
   '+5678901234',
   'Burkina Faso',
   'Ouagadougou'),
   
  -- New customers
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
   'Sarah Johnson',
   'sarah.johnson@example.com',
   '+6789012345',
   'Senegal',
   'Dakar'),
   
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
   'Innovative Solutions',
   'info@innovativesolutions.com',
   '+7890123456',
   'Ghana',
   'Accra'),
   
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
   'NextGen Retail',
   'support@nextgenretail.com',
   '+8901234567',
   'Nigeria',
   'Lagos'),
   
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
   'Michael Brown',
   'michael.brown@example.com',
   '+9012345678',
   'Senegal',
   'Dakar'),
   
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
   'Emma Wilson',
   'emma.wilson@example.com',
   '+0123456789',
   'Ivory Coast',
   'Abidjan');

-- Seed data for merchant_subscriptions table with more active subscriptions
INSERT INTO merchant_subscriptions (merchant_id, organization_id, plan_id, customer_id, status, start_date, end_date, next_billing_date) VALUES
  -- Existing subscriptions
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
   (SELECT plan_id FROM subscription_plans WHERE name = 'Basic Hosting Plan'),
   (SELECT customer_id FROM customers WHERE name = 'John Smith'),
   'active',
   CURRENT_DATE,
   CURRENT_DATE + INTERVAL '1 year',
   CURRENT_DATE + INTERVAL '1 month'),

  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
   (SELECT plan_id FROM subscription_plans WHERE name = 'Premium Hosting Plan'),
   (SELECT customer_id FROM customers WHERE name = 'Tech Solutions Inc'),
   'active',
   CURRENT_DATE,
   CURRENT_DATE + INTERVAL '1 year',
   CURRENT_DATE + INTERVAL '1 month'),

  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
   (SELECT plan_id FROM subscription_plans WHERE name = 'Enterprise Hosting Plan'),
   (SELECT customer_id FROM customers WHERE name = 'Global Corp'),
   'active',
   CURRENT_DATE,
   CURRENT_DATE + INTERVAL '1 year',
   CURRENT_DATE + INTERVAL '1 year'),

  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
   (SELECT plan_id FROM subscription_plans WHERE name = 'Business Email Pro'),
   (SELECT customer_id FROM customers WHERE name = 'Digital Agency Pro'),
   'active',
   CURRENT_DATE,
   CURRENT_DATE + INTERVAL '1 year',
   CURRENT_DATE + INTERVAL '1 month'),

  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
   (SELECT plan_id FROM subscription_plans WHERE name = 'Email Enterprise'),
   (SELECT customer_id FROM customers WHERE name = 'StartUp Hub'),
   'active',
   CURRENT_DATE,
   CURRENT_DATE + INTERVAL '1 year',
   CURRENT_DATE + INTERVAL '3 months'),
   
  -- New subscriptions in XOF
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
   (SELECT plan_id FROM subscription_plans WHERE name = 'Website Builder Basic'),
   (SELECT customer_id FROM customers WHERE name = 'Sarah Johnson'),
   'active',
   CURRENT_DATE,
   CURRENT_DATE + INTERVAL '1 year',
   CURRENT_DATE + INTERVAL '1 month'),
   
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
   (SELECT plan_id FROM subscription_plans WHERE name = 'Website Builder Premium'),
   (SELECT customer_id FROM customers WHERE name = 'Innovative Solutions'),
   'active',
   CURRENT_DATE,
   CURRENT_DATE + INTERVAL '1 year',
   CURRENT_DATE + INTERVAL '1 month'),
   
  -- New subscriptions in USD
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
   (SELECT plan_id FROM subscription_plans WHERE name = 'Cloud Storage Basic'),
   (SELECT customer_id FROM customers WHERE name = 'NextGen Retail'),
   'active',
   CURRENT_DATE,
   CURRENT_DATE + INTERVAL '1 year',
   CURRENT_DATE + INTERVAL '1 month'),
   
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
   (SELECT plan_id FROM subscription_plans WHERE name = 'Cloud Storage Pro'),
   (SELECT customer_id FROM customers WHERE name = 'Michael Brown'),
   'active',
   CURRENT_DATE,
   CURRENT_DATE + INTERVAL '1 year',
   CURRENT_DATE + INTERVAL '1 month'),
   
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
   (SELECT plan_id FROM subscription_plans WHERE name = 'VPN Premium'),
   (SELECT customer_id FROM customers WHERE name = 'Emma Wilson'),
   'active',
   CURRENT_DATE,
   CURRENT_DATE + INTERVAL '1 year',
   CURRENT_DATE + INTERVAL '1 year');

-- Create merchant accounts in XOF and USD
INSERT INTO merchant_accounts (merchant_id, organization_id, balance, currency_code) VALUES
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'), (SELECT organization_id FROM organizations WHERE name = 'Organization 1'), 50000.00, 'XOF'),
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'), (SELECT organization_id FROM organizations WHERE name = 'Organization 1'), 2500.00, 'USD');

-- Create a bank account for the merchant
INSERT INTO merchant_bank_accounts (
  merchant_id,
  organization_id,
  account_number, 
  account_name, 
  bank_name, 
  bank_code, 
  branch_code, 
  country, 
  is_default, 
  is_valid
) VALUES (
  (SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
  (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
  '1234567890',
  'Merchant 1 Business Account',
  'Ecobank',
  'ECO123',
  'BRN456',
  'Senegal',
  true,
  true
);

-- Update subscription amounts to more realistic values
UPDATE subscription_plans SET amount = 29999.99 WHERE name = 'Basic Hosting Plan' AND currency_code = 'XOF';
UPDATE subscription_plans SET amount = 59999.99 WHERE name = 'Premium Hosting Plan' AND currency_code = 'XOF';
UPDATE subscription_plans SET amount = 299999.99 WHERE name = 'Enterprise Hosting Plan' AND currency_code = 'XOF';
UPDATE subscription_plans SET amount = 39999.99 WHERE name = 'Business Email Pro' AND currency_code = 'XOF';
UPDATE subscription_plans SET amount = 89999.99 WHERE name = 'Email Enterprise' AND currency_code = 'XOF';
UPDATE subscription_plans SET amount = 19999.99 WHERE name = 'Website Builder Basic' AND currency_code = 'XOF';
UPDATE subscription_plans SET amount = 49999.99 WHERE name = 'Website Builder Premium' AND currency_code = 'XOF';

UPDATE subscription_plans SET amount = 49.99 WHERE name = 'Cloud Storage Basic' AND currency_code = 'USD';
UPDATE subscription_plans SET amount = 99.99 WHERE name = 'Cloud Storage Pro' AND currency_code = 'USD';
UPDATE subscription_plans SET amount = 9.99 WHERE name = 'VPN Basic' AND currency_code = 'USD';
UPDATE subscription_plans SET amount = 99.99 WHERE name = 'VPN Premium' AND currency_code = 'USD';

-- Clear existing transactions to rebuild them
TRUNCATE TABLE transactions CASCADE;

-- Insert subscription transactions (last 3 months, monthly payments)
WITH subscription_data AS (
  SELECT 
    ms.merchant_id,
    ms.organization_id,
    ms.customer_id,
    ms.subscription_id,
    sp.amount,
    sp.currency_code,
    generate_series(1, 3) as month
  FROM merchant_subscriptions ms
  JOIN subscription_plans sp ON ms.plan_id = sp.plan_id
  WHERE ms.status = 'active'
)
INSERT INTO transactions (
    merchant_id,
    organization_id,
    customer_id,
    subscription_id,
    transaction_type,
    status,
    description,
    gross_amount,
    fee_amount,
    net_amount,
    currency_code,
    provider_code,
    payment_method_code,
    fee_reference,
    created_at
)
SELECT 
    merchant_id,
    organization_id,
    customer_id,
    subscription_id,
    'payment',
    'completed',
    'Monthly subscription payment',
    amount,
    amount * 0.035, -- 3.5% fee
    amount * 0.965, -- Net amount after fee
    currency_code,
    (ARRAY['ORANGE'::provider_code, 'WAVE'::provider_code, 'MTN'::provider_code, 'MOOV'::provider_code])[floor(random() * 4 + 1)],
    'MOBILE_MONEY',
    CASE 
        WHEN currency_code = 'XOF' THEN 'Platform Processing Fee'
        WHEN currency_code = 'USD' THEN 'Platform Processing Fee'
        ELSE 'Platform Processing Fee'
    END,
    CURRENT_DATE - ((month - 1) || ' months')::interval
FROM subscription_data;

-- Insert one-time product purchases
INSERT INTO transactions (
    merchant_id,
    organization_id,
    customer_id,
    product_id,
    transaction_type,
    status,
    description,
    gross_amount,
    fee_amount,
    net_amount,
    currency_code,
    provider_code,
    payment_method_code,
    fee_reference,
    created_at
)
SELECT
    m.merchant_id,
    o.organization_id,
    c.customer_id,
    p.product_id,
    'payment',
    'completed',
    'Purchase of ' || p.name,
    p.price,
    p.price * 0.035, -- 3.5% fee
    p.price * 0.965, -- Net amount after fee
    p.currency_code,
    (ARRAY['ORANGE'::provider_code, 'WAVE'::provider_code, 'MTN'::provider_code, 'MOOV'::provider_code])[floor(random() * 4 + 1)],
    'MOBILE_MONEY',
    CASE 
        WHEN p.currency_code = 'XOF' THEN 'Platform Processing Fee'
        WHEN p.currency_code = 'USD' THEN 'Platform Processing Fee'
        ELSE 'Platform Processing Fee'
    END,
    CURRENT_DATE - (floor(random() * 90) || ' days')::interval
FROM merchant_products p
CROSS JOIN LATERAL (
    SELECT customer_id 
    FROM customers 
    WHERE merchant_id = p.merchant_id 
    ORDER BY random() 
    LIMIT 1
) c
JOIN merchants m ON p.merchant_id = m.merchant_id
JOIN organizations o ON p.organization_id = o.organization_id
LIMIT 50;

-- Add some refunded transactions
INSERT INTO transactions (
    merchant_id,
    organization_id,
    customer_id,
    product_id,
    transaction_type,
    status,
    description,
    gross_amount,
    fee_amount,
    net_amount,
    currency_code,
    provider_code,
    payment_method_code,
    fee_reference,
    created_at
)
SELECT
    m.merchant_id,
    o.organization_id,
    c.customer_id,
    p.product_id,
    'payment',
    'refunded',
    'Purchase of ' || p.name || ' (Refunded)',
    p.price,
    p.price * 0.035,
    p.price * 0.965,
    p.currency_code,
    (ARRAY['ORANGE'::provider_code, 'WAVE'::provider_code, 'MTN'::provider_code, 'MOOV'::provider_code])[floor(random() * 4 + 1)],
    'MOBILE_MONEY',
    CASE 
        WHEN p.currency_code = 'XOF' THEN 'Platform Processing Fee'
        WHEN p.currency_code = 'USD' THEN 'Platform Processing Fee'
        ELSE 'Platform Processing Fee'
    END,
    CURRENT_DATE - (floor(random() * 60) || ' days')::interval
FROM merchant_products p
CROSS JOIN LATERAL (
    SELECT customer_id 
    FROM customers 
    WHERE merchant_id = p.merchant_id 
    ORDER BY random() 
    LIMIT 1
) c
JOIN merchants m ON p.merchant_id = m.merchant_id
JOIN organizations o ON p.organization_id = o.organization_id
LIMIT 10;

-- Insert refund records for refunded transactions
INSERT INTO refunds (
    transaction_id,
    amount,
    refunded_amount,
    fee_amount,
    reason,
    status,
    created_at
)
SELECT
    t.transaction_id,
    t.gross_amount,
    t.gross_amount,
    t.fee_amount,
    'Customer requested refund',
    'completed',
    t.created_at + interval '2 days'
FROM transactions t
WHERE t.status = 'refunded';

-- Calculate total inflow for each currency
WITH transaction_totals AS (
    SELECT 
        currency_code,
        SUM(CASE 
            WHEN status = 'completed' THEN net_amount
            WHEN status = 'refunded' THEN -net_amount
            ELSE 0
        END) as net_total
    FROM transactions
    GROUP BY currency_code
)
-- Update merchant account balances based on transaction history minus payouts
UPDATE merchant_accounts ma
SET balance = tt.net_total - COALESCE(
    (SELECT SUM(amount)
     FROM payouts p
     WHERE p.currency_code = ma.currency_code
     AND p.status = 'completed'),
    0
)
FROM transaction_totals tt
WHERE ma.currency_code = tt.currency_code;

-- Re-enable triggers
SET session_replication_role = 'origin';

-- Commit transaction
COMMIT;