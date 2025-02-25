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
INSERT INTO merchant_subscriptions (merchant_id, plan_id, customer_id, status, start_date, end_date, next_billing_date) VALUES
  -- Existing subscriptions
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
   CURRENT_DATE + INTERVAL '1 month'),

  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT plan_id FROM subscription_plans WHERE name = 'Enterprise Hosting Plan'),
   (SELECT customer_id FROM customers WHERE name = 'Global Corp'),
   'active',
   CURRENT_DATE,
   CURRENT_DATE + INTERVAL '1 year',
   CURRENT_DATE + INTERVAL '1 year'),

  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT plan_id FROM subscription_plans WHERE name = 'Business Email Pro'),
   (SELECT customer_id FROM customers WHERE name = 'Digital Agency Pro'),
   'active',
   CURRENT_DATE,
   CURRENT_DATE + INTERVAL '1 year',
   CURRENT_DATE + INTERVAL '1 month'),

  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT plan_id FROM subscription_plans WHERE name = 'Email Enterprise'),
   (SELECT customer_id FROM customers WHERE name = 'StartUp Hub'),
   'active',
   CURRENT_DATE,
   CURRENT_DATE + INTERVAL '1 year',
   CURRENT_DATE + INTERVAL '3 months'),
   
  -- New subscriptions in XOF
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT plan_id FROM subscription_plans WHERE name = 'Website Builder Basic'),
   (SELECT customer_id FROM customers WHERE name = 'Sarah Johnson'),
   'active',
   CURRENT_DATE,
   CURRENT_DATE + INTERVAL '1 year',
   CURRENT_DATE + INTERVAL '1 month'),
   
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT plan_id FROM subscription_plans WHERE name = 'Website Builder Premium'),
   (SELECT customer_id FROM customers WHERE name = 'Innovative Solutions'),
   'active',
   CURRENT_DATE,
   CURRENT_DATE + INTERVAL '1 year',
   CURRENT_DATE + INTERVAL '1 month'),
   
  -- New subscriptions in USD
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT plan_id FROM subscription_plans WHERE name = 'Cloud Storage Basic'),
   (SELECT customer_id FROM customers WHERE name = 'NextGen Retail'),
   'active',
   CURRENT_DATE,
   CURRENT_DATE + INTERVAL '1 year',
   CURRENT_DATE + INTERVAL '1 month'),
   
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT plan_id FROM subscription_plans WHERE name = 'Cloud Storage Pro'),
   (SELECT customer_id FROM customers WHERE name = 'Michael Brown'),
   'active',
   CURRENT_DATE,
   CURRENT_DATE + INTERVAL '1 year',
   CURRENT_DATE + INTERVAL '1 month'),
   
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
   (SELECT plan_id FROM subscription_plans WHERE name = 'VPN Premium'),
   (SELECT customer_id FROM customers WHERE name = 'Emma Wilson'),
   'active',
   CURRENT_DATE,
   CURRENT_DATE + INTERVAL '1 year',
   CURRENT_DATE + INTERVAL '1 year');

-- Create merchant accounts in XOF and USD
INSERT INTO merchant_accounts (merchant_id, balance, currency_code) VALUES
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'), 50000.00, 'XOF'),
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'), 2500.00, 'USD');

-- Create a bank account for the merchant
INSERT INTO merchant_bank_accounts (
  merchant_id, 
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
  '1234567890',
  'Merchant 1 Business Account',
  'Ecobank',
  'ECO123',
  'BRN456',
  'Senegal',
  true,
  true
);

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

-- Add historical transactions for the past 3 months for subscriptions
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

-- Add transactions for one-time product purchases
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
    fee_reference,
    currency_code,
    provider_code,
    payment_method_code,
    created_at
)
SELECT
    m.merchant_id,
    o.organization_id,
    c.customer_id,
    p.product_id,
    'payment'::transaction_type,
    'completed'::transaction_status,
    'Purchase of ' || p.name,
    p.price,
    p.price * 0.05,
    p.price * 0.95,
    'Processing Fee',
    p.currency_code,
    (ARRAY['ORANGE', 'WAVE', 'MTN', 'MOOV', 'ECOBANK']::provider_code[])[floor(random() * 5 + 1)],
    (ARRAY['MOBILE_MONEY', 'E_WALLET', 'CARDS', 'BANK_TRANSFER']::payment_method_code[])[floor(random() * 4 + 1)],
    CURRENT_DATE - (floor(random() * 60) || ' days')::interval
FROM merchant_products p
JOIN merchants m ON p.merchant_id = m.merchant_id
JOIN organizations o ON p.organization_id = o.organization_id
CROSS JOIN customers c
WHERE c.merchant_id = m.merchant_id
AND c.organization_id = o.organization_id
ORDER BY random()
LIMIT 50;  -- Create 50 random product transactions

-- Create payment links for products
INSERT INTO payment_links (
    merchant_id,
    organization_id,
    link_type,
    url,
    product_id,
    title,
    public_description,
    private_description,
    currency_code,
    allowed_providers,
    is_active,
    success_url,
    cancel_url
)
SELECT
    m.merchant_id,
    o.organization_id,
    'product'::link_type,
    'https://pay.lomi.africa/p/' || encode(gen_random_bytes(8), 'hex'),
    p.product_id,
    'Pay for ' || p.name,
    'Purchase ' || p.name,
    'Internal payment link for ' || p.name,
    p.currency_code,
    ARRAY['ORANGE', 'WAVE', 'MTN']::provider_code[],
    true,
    'https://example.com/success',
    'https://example.com/cancel'
FROM merchant_products p
JOIN merchants m ON p.merchant_id = m.merchant_id
JOIN organizations o ON p.organization_id = o.organization_id
WHERE p.name IN ('Premium Web Hosting', 'Business Email Suite', 'Website Builder Pro', 'SEO Optimization Package', 'Cloud Storage Premium');

-- Create payment links for subscription plans
INSERT INTO payment_links (
    merchant_id,
    organization_id,
    link_type,
    url,
    plan_id,
    title,
    public_description,
    private_description,
    currency_code,
    allowed_providers,
    is_active,
    success_url,
    cancel_url
)
SELECT
    m.merchant_id,
    o.organization_id,
    'plan'::link_type,
    'https://pay.lomi.africa/s/' || encode(gen_random_bytes(8), 'hex'),
    sp.plan_id,
    'Subscribe to ' || sp.name,
    'Subscribe to our ' || sp.name,
    'Internal subscription link for ' || sp.name,
    sp.currency_code,
    ARRAY['ORANGE', 'WAVE', 'MTN', 'MOOV']::provider_code[],
    true,
    'https://example.com/success',
    'https://example.com/cancel'
FROM subscription_plans sp
JOIN merchants m ON sp.merchant_id = m.merchant_id
JOIN organizations o ON sp.organization_id = o.organization_id
WHERE sp.name IN ('Basic Hosting Plan', 'Premium Hosting Plan', 'Website Builder Premium', 'Cloud Storage Pro', 'VPN Premium');

-- Create instant payment links
INSERT INTO payment_links (
    merchant_id,
    organization_id,
    link_type,
    url,
    title,
    public_description,
    private_description,
    price,
    currency_code,
    allowed_providers,
    is_active,
    success_url,
    cancel_url
)
VALUES
    (
        (SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
        (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
        'instant'::link_type,
        'https://pay.lomi.africa/i/' || encode(gen_random_bytes(8), 'hex'),
        'Custom Website Development',
        'Custom website development service',
        'One-time payment for custom website development',
        1499.99,
        'XOF',
        ARRAY['ORANGE', 'WAVE', 'MTN', 'MOOV']::provider_code[],
        true,
        'https://example.com/success',
        'https://example.com/cancel'
    ),
    (
        (SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
        (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
        'instant'::link_type,
        'https://pay.lomi.africa/i/' || encode(gen_random_bytes(8), 'hex'),
        'Logo Design Service',
        'Professional logo design service',
        'One-time payment for logo design',
        299.99,
        'XOF',
        ARRAY['ORANGE', 'WAVE', 'MTN', 'MOOV']::provider_code[],
        true,
        'https://example.com/success',
        'https://example.com/cancel'
    ),
    (
        (SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
        (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
        'instant'::link_type,
        'https://pay.lomi.africa/i/' || encode(gen_random_bytes(8), 'hex'),
        'Premium Support Package',
        'One-time premium support package',
        'One-time payment for premium support',
        199.99,
        'USD',
        ARRAY['ORANGE', 'WAVE', 'MTN', 'MOOV', 'PAYPAL']::provider_code[],
        true,
        'https://example.com/success',
        'https://example.com/cancel'
    );

-- Create payouts for the merchant
INSERT INTO payouts (
    account_id,
    merchant_id,
    organization_id,
    bank_account_id,
    amount,
    currency_code,
    status,
    created_at
)
VALUES
    (
        (SELECT account_id FROM merchant_accounts WHERE merchant_id = (SELECT merchant_id FROM merchants WHERE name = 'Merchant 1') AND currency_code = 'XOF'),
        (SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
        (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
        (SELECT bank_account_id FROM merchant_bank_accounts WHERE merchant_id = (SELECT merchant_id FROM merchants WHERE name = 'Merchant 1')),
        10000.00,
        'XOF',
        'completed',
        CURRENT_DATE - INTERVAL '30 days'
    ),
    (
        (SELECT account_id FROM merchant_accounts WHERE merchant_id = (SELECT merchant_id FROM merchants WHERE name = 'Merchant 1') AND currency_code = 'XOF'),
        (SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
        (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
        (SELECT bank_account_id FROM merchant_bank_accounts WHERE merchant_id = (SELECT merchant_id FROM merchants WHERE name = 'Merchant 1')),
        15000.00,
        'XOF',
        'completed',
        CURRENT_DATE - INTERVAL '15 days'
    ),
    (
        (SELECT account_id FROM merchant_accounts WHERE merchant_id = (SELECT merchant_id FROM merchants WHERE name = 'Merchant 1') AND currency_code = 'XOF'),
        (SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
        (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
        (SELECT bank_account_id FROM merchant_bank_accounts WHERE merchant_id = (SELECT merchant_id FROM merchants WHERE name = 'Merchant 1')),
        5000.00,
        'XOF',
        'pending',
        CURRENT_DATE - INTERVAL '2 days'
    ),
    (
        (SELECT account_id FROM merchant_accounts WHERE merchant_id = (SELECT merchant_id FROM merchants WHERE name = 'Merchant 1') AND currency_code = 'USD'),
        (SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
        (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
        (SELECT bank_account_id FROM merchant_bank_accounts WHERE merchant_id = (SELECT merchant_id FROM merchants WHERE name = 'Merchant 1')),
        500.00,
        'USD',
        'completed',
        CURRENT_DATE - INTERVAL '20 days'
    ),
    (
        (SELECT account_id FROM merchant_accounts WHERE merchant_id = (SELECT merchant_id FROM merchants WHERE name = 'Merchant 1') AND currency_code = 'USD'),
        (SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'),
        (SELECT organization_id FROM organizations WHERE name = 'Organization 1'),
        (SELECT bank_account_id FROM merchant_bank_accounts WHERE merchant_id = (SELECT merchant_id FROM merchants WHERE name = 'Merchant 1')),
        750.00,
        'USD',
        'processing',
        CURRENT_DATE - INTERVAL '5 days'
    );

-- Re-enable triggers
SET session_replication_role = 'origin';

-- This will trigger the MRR calculation
UPDATE merchant_subscriptions
SET updated_at = NOW()
WHERE merchant_id = (SELECT merchant_id FROM merchants WHERE name = 'Merchant 1');

-- Commit transaction
COMMIT;