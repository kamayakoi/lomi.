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
INSERT INTO merchant_organization_links (merchant_id, organization_id, role, store_handle)
VALUES
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'), (SELECT organization_id FROM organizations WHERE name = 'Organization 1'), 'Admin', 'store1');

-- Seed data for merchant_products table
INSERT INTO merchant_products (merchant_id, organization_id, name, description, price, currency_code, image_url) VALUES
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
   'https://example.com/images/email.png');

-- Seed data for subscription_plans table with more plans
INSERT INTO subscription_plans (merchant_id, organization_id, name, description, billing_frequency, amount, currency_code, failed_payment_action, charge_day) VALUES
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
   1);

-- Seed data for customers table with more customers
INSERT INTO customers (merchant_id, organization_id, name, email, phone_number, country, city) VALUES
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
   'Ouagadougou');

-- Seed data for merchant_subscriptions table with more active subscriptions
INSERT INTO merchant_subscriptions (merchant_id, plan_id, customer_id, status, start_date, end_date, next_billing_date) VALUES
  -- Basic Hosting Plan Subscriptions
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT plan_id FROM subscription_plans WHERE name = 'Basic Hosting Plan'),
   (SELECT customer_id FROM customers WHERE name = 'John Smith'),
   'active',
   CURRENT_DATE,
   CURRENT_DATE + INTERVAL '1 year',
   CURRENT_DATE + INTERVAL '1 month'),

  -- Premium Hosting Plan Subscriptions
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT plan_id FROM subscription_plans WHERE name = 'Premium Hosting Plan'),
   (SELECT customer_id FROM customers WHERE name = 'Tech Solutions Inc'),
   'active',
   CURRENT_DATE,
   CURRENT_DATE + INTERVAL '1 year',
   CURRENT_DATE + INTERVAL '1 month'),

  -- Enterprise Hosting Plan Subscriptions (Yearly)
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT plan_id FROM subscription_plans WHERE name = 'Enterprise Hosting Plan'),
   (SELECT customer_id FROM customers WHERE name = 'Global Corp'),
   'active',
   CURRENT_DATE,
   CURRENT_DATE + INTERVAL '1 year',
   CURRENT_DATE + INTERVAL '1 year'),

  -- Business Email Pro Subscriptions
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT plan_id FROM subscription_plans WHERE name = 'Business Email Pro'),
   (SELECT customer_id FROM customers WHERE name = 'Digital Agency Pro'),
   'active',
   CURRENT_DATE,
   CURRENT_DATE + INTERVAL '1 year',
   CURRENT_DATE + INTERVAL '1 month'),

  -- Email Enterprise Subscriptions (Quarterly)
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT plan_id FROM subscription_plans WHERE name = 'Email Enterprise'),
   (SELECT customer_id FROM customers WHERE name = 'StartUp Hub'),
   'active',
   CURRENT_DATE,
   CURRENT_DATE + INTERVAL '1 year',
   CURRENT_DATE + INTERVAL '3 months');

-- Seed data for transactions table with more transactions
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
    fee_reference,
    currency_code,
    provider_code,
    payment_method_code
) 
SELECT
    m.merchant_id,
    o.organization_id,
    ms.customer_id,
    ms.subscription_id,
    'payment'::transaction_type,
    'completed'::transaction_status,
    sp.name || ' - Monthly Subscription',
    sp.amount,
    sp.amount * 0.05,  -- 5% fee
    sp.amount * 0.95,  -- net amount after fee
    'Processing Fee',
    sp.currency_code,
    (ARRAY['ORANGE', 'WAVE', 'MTN', 'MOOV']::provider_code[])[floor(random() * 4 + 1)],
    (ARRAY['MOBILE_MONEY', 'E_WALLET', 'CARDS']::payment_method_code[])[floor(random() * 3 + 1)]
FROM merchant_subscriptions ms
JOIN subscription_plans sp ON ms.plan_id = sp.plan_id
JOIN merchants m ON ms.merchant_id = m.merchant_id
JOIN organizations o ON sp.organization_id = o.organization_id
WHERE ms.status = 'active';

-- Add historical transactions for the past 3 months
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
    fee_reference,
    currency_code,
    provider_code,
    payment_method_code,
    created_at
)
SELECT
    m.merchant_id,
    o.organization_id,
    ms.customer_id,
    ms.subscription_id,
    'payment'::transaction_type,
    'completed'::transaction_status,
    sp.name || ' - Monthly Subscription',
    sp.amount,
    sp.amount * 0.05,
    sp.amount * 0.95,
    'Processing Fee',
    sp.currency_code,
    (ARRAY['ORANGE', 'WAVE', 'MTN', 'MOOV']::provider_code[])[floor(random() * 4 + 1)],
    (ARRAY['MOBILE_MONEY', 'E_WALLET', 'CARDS']::payment_method_code[])[floor(random() * 3 + 1)],
    CURRENT_DATE - (n || ' days')::interval
FROM merchant_subscriptions ms
JOIN subscription_plans sp ON ms.plan_id = sp.plan_id
JOIN merchants m ON ms.merchant_id = m.merchant_id
JOIN organizations o ON sp.organization_id = o.organization_id
CROSS JOIN generate_series(1, 90) n
WHERE ms.status = 'active'
AND n % 30 = 0;  -- Create a transaction every 30 days

-- Re-enable triggers
SET session_replication_role = 'origin';

-- This will trigger the MRR calculation
UPDATE merchant_subscriptions
SET updated_at = NOW()
WHERE merchant_id = (SELECT merchant_id FROM merchants WHERE name = 'Merchant 1');

-- Commit transaction
COMMIT;