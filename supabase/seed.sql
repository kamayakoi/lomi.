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

-- Seed data for subscription_plans table
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
   1);

-- Seed data for customers table
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
   'Abidjan');

-- Seed data for merchant_subscriptions table
INSERT INTO merchant_subscriptions (merchant_id, plan_id, customer_id, status, start_date, end_date, next_billing_date) VALUES
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT plan_id FROM subscription_plans WHERE name = 'Basic Hosting Plan'),
   (SELECT customer_id FROM customers WHERE name = 'John Smith'),
   'active',
   CURRENT_DATE,
   CURRENT_DATE + INTERVAL '1 year',
   CURRENT_DATE + INTERVAL '1 month'),
   
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT plan_id FROM subscription_plans WHERE name = 'Premium Hosting Plan'),
   (SELECT customer_id FROM customers WHERE name = 'Tech Solutions Inc'),
   'active',
   CURRENT_DATE,
   CURRENT_DATE + INTERVAL '1 year',
   CURRENT_DATE + INTERVAL '1 month');

-- Seed data for transactions table
INSERT INTO transactions (
    merchant_id, 
    organization_id, 
    customer_id, 
    product_id,
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
) VALUES
  (
    (SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
    (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
    (SELECT customer_id FROM customers WHERE name = 'John Smith'),
    (SELECT product_id FROM merchant_products WHERE name = 'Premium Web Hosting'),
    NULL,
    'payment',
    'completed',
    'Premium Web Hosting Purchase',
    299.99,
    14.99,
    285.00,
    'Wave Processing Fee',
    'XOF',
    'WAVE',
    'E_WALLET'
  ),
  (
    (SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
    (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
    (SELECT customer_id FROM customers WHERE name = 'Tech Solutions Inc'),
    NULL,
    (SELECT subscription_id FROM merchant_subscriptions WHERE customer_id = (SELECT customer_id FROM customers WHERE name = 'Tech Solutions Inc')),
    'payment',
    'completed',
    'Premium Hosting Plan - Monthly Subscription',
    299.99,
    14.99,
    285.00,
    'Orange Processing Fee',
    'XOF',
    'ORANGE',
    'MOBILE_MONEY'
  );

-- Seed data for providers_transactions table
INSERT INTO providers_transactions (
    transaction_id,
    merchant_id,
    provider_code,
    provider_checkout_id,
    provider_payment_status,
    provider_transaction_id,
    checkout_url
) VALUES
  (
    (SELECT transaction_id FROM transactions WHERE description = 'Premium Web Hosting Purchase'),
    (SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
    'WAVE',
    'WAVE_CHECKOUT_001',
    'succeeded',
    'WAVE_TXN_001',
    'https://checkout.wave.com/WAVE_CHECKOUT_001'
  ),
  (
    (SELECT transaction_id FROM transactions WHERE description = 'Premium Hosting Plan - Monthly Subscription'),
    (SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
    'ORANGE',
    'ORANGE_CHECKOUT_001',
    'succeeded',
    'ORANGE_TXN_001',
    'https://checkout.orange.com/ORANGE_CHECKOUT_001'
  );

-- Seed data for merchant_accounts table
INSERT INTO merchant_accounts (merchant_id, balance, currency_code) VALUES
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'), 570.00, 'XOF');

-- Seed data for platform_main_account table
INSERT INTO platform_main_account (total_balance, available_balance, currency_code) VALUES
  (599.98, 570.00, 'XOF');

-- Seed data for platform_provider_balance table
INSERT INTO platform_provider_balance (
    provider_code,
    total_transactions_amount,
    current_balance,
    currency_code,
    provider_fees,
    platform_revenue,
    quarter_start_date
) VALUES
  ('WAVE', 299.99, 285.00, 'XOF', 14.99, 14.99, date_trunc('quarter', CURRENT_DATE)),
  ('ORANGE', 299.99, 285.00, 'XOF', 14.99, 14.99, date_trunc('quarter', CURRENT_DATE));

-- Re-enable triggers
SET session_replication_role = 'origin';

-- Commit transaction
COMMIT;