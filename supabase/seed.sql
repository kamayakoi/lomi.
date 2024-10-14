-- Seed data for providers table
INSERT INTO providers (name, code, description) VALUES
  ('Stripe', 'STRIPE', 'Global payment processor'),
  ('Orange', 'ORANGE', 'Mobile money and eWallet provider'),
  ('MTN', 'MTN', 'Mobile money provider'),
  ('Wave', 'WAVE', 'Mobile money and eWallet provider'),
  ('Ecobank', 'ECOBANK', 'Bank transfer provider'),
  ('Other', 'OTHER', 'Other payment provider');


-- Seed data for payment_methods table
INSERT INTO payment_methods (payment_method_code, provider_code) VALUES
  ('CARDS', 'STRIPE'), 
  ('BANK_TRANSFER', 'STRIPE'),
  ('MOBILE_MONEY', 'ORANGE'),  
  ('MOBILE_MONEY', 'MTN'),     
  ('MOBILE_MONEY', 'WAVE'),
  ('BANK_TRANSFER', 'ECOBANK'),
  ('USSD', 'OTHER'),
  ('QR_CODE', 'OTHER'),
  ('E_WALLET', 'OTHER');


-- Seed data for currencies table
INSERT INTO currencies (code, name) VALUES
  ('XOF', 'West African CFA franc'), 
  ('USD', 'United States dollar'),
  ('EUR', 'Euro');


-- Seed data for fees table
INSERT INTO fees (name, transaction_type, fee_type, percentage, fixed_amount, currency_code, payment_method_code, provider_code) VALUES
  -- USD COMPANY FEES
  ('USD Enterprise Tier Monthly Subscription Fee', 'instalment', 'monthly', 0.0, 29.99, 'USD', NULL, NULL),
  ('USD Enterprise Tier Yearly Subscription Fee',  'instalment', 'yearly',  0.0, 299.99, 'USD', NULL, NULL),
  ('USD High Volume Discount','payment', 'volume_discount',    -0.5, 0.00, 'USD', NULL, NULL),
  ('USD Referral Discount', 'payment', 'referral_discount',  -0.5, 0.00, 'USD', NULL, NULL),

  -- XOF COMPANY FEES
  ('XOF Enterprise Tier Monthly Subscription Fee', 'instalment', 'monthly', 0.0, 15000.00, 'XOF', NULL, NULL),
  ('XOF Enterprise Tier Yearly Subscription Fee',  'instalment', 'yearly',  0.0, 150000.00, 'XOF', NULL, NULL),
  ('XOF High Volume Discount', 'payment', 'volume_discount',    -0.5, 0.00, 'XOF', NULL, NULL),
  ('XOF Referral Discount', 'payment', 'referral_discount',  -0.5, 0.00, 'XOF', NULL, NULL),

  -- STRIPE FEES
  ('USD/STRIPE CARDS Fee', 'payment', 'processing', 2.9, 0.00, 'USD', 'CARDS', 'STRIPE'),
  ('USD/STRIPE BANK_TRANSFER Fee', 'payment', 'processing', 1.4, 1.00, 'USD', 'BANK_TRANSFER', 'STRIPE'),

  -- ORANGE FEES
  ('XOF/ORANGE Mobile Money Fee', 'payment', 'processing', 2, 66.00, 'XOF', 'MOBILE_MONEY', 'ORANGE'),

  -- MTN FEES
  ('XOF/MTN Mobile Money Fee', 'payment', 'processing', 2, 66.00, 'XOF', 'MOBILE_MONEY', 'MTN'),

  -- WAVE FEES
  ('XOF/WAVE Mobile Money Fee', 'payment', 'processing', 2.9, 66.00, 'XOF', 'MOBILE_MONEY', 'WAVE'),

  -- ECOBANK FEES
  ('USD/ECOBANK Bank Transfer Fee', 'payment', 'processing', 2.5, 1.00, 'USD', 'BANK_TRANSFER', 'ECOBANK'),
  ('XOF/ECOBANK Bank Transfer Fee', 'payment', 'processing', 2.5, 256.00, 'XOF', 'BANK_TRANSFER', 'ECOBANK'),

  -- PARTNER FEES
  ('USD/PARTNER Payment Fee', 'payment', 'processing', 2.9, 1.2, 'USD', 'E_WALLET', 'OTHER'),
  ('XOF/PARTNER Payout Fee',  'payment',  'processing', 2.9, 66.00, 'XOF', 'E_WALLET', 'OTHER'),

  -- CURRENCY CONVERSION FEE
  ('USD Currency Conversion Fee', 'payment', 'conversion', 1.5, 0.00, 'USD', NULL, NULL),
  ('XOF Currency Conversion Fee', 'payment', 'conversion', 1.5, 0.00, 'XOF', NULL, NULL),

  -- CHARGEBACK FEE
  ('USD Chargeback Fee', 'payment', 'chargeback', 0.0, 5.00, 'USD', NULL, NULL),
  ('XOF Chargeback Fee', 'payment', 'chargeback', 0.0, 5.00, 'XOF', NULL, NULL),

  -- RECURRING PAYMENT SETUP FEE
  ('USD Recurring Payment Setup Fee', 'payment', 'recurring_setup', 3.0, 0.0, 'USD', NULL, NULL),
  ('XOF Recurring Payment Setup Fee', 'payment', 'recurring_setup', 3.0, 0.0, 'XOF', NULL, NULL),

  -- EXPRESS PAYOUT FEE
  ('USD Express Payout Fee', 'payment', 'express', 0.0, 2.00, 'USD', NULL, NULL),
  ('XOF Express Payout Fee', 'payment', 'express', 0.0, 2.00, 'XOF', NULL, NULL),

  -- REFUND FEES
  ('USD Refund Processing Fee', 'payment', 'processing', 1.5, 0.00, 'USD', NULL, NULL),
  ('XOF Refund Processing Fee', 'payment', 'processing', 2.2, 0.00, 'XOF', NULL, NULL),

  -- PAYOUT PROCESSING FEES
  ('USD Payout Processing Fee', 'payment', 'processing', 2.0, 0.50, 'USD', NULL, NULL),
  ('XOF Payout Processing Fee', 'payment', 'processing', 2.2, 0.00, 'XOF', NULL, NULL);

-- Seed data for merchants table
INSERT INTO merchants (name, email, phone_number, country)
VALUES 
  ('Merchant 1', 'merchant1@example.com', '+1234567890', 'Country 1'),
  ('Merchant 2', 'merchant2@example.com', '+2345678901', 'Country 2');

-- Seed data for organizations table  
INSERT INTO organizations (name, email, phone_number, website_url)
VALUES
  ('Organization 1', 'org1@example.com', '+1234567890', 'https://org1.com'),
  ('Organization 2', 'org2@example.com', '+2345678901', 'https://org2.com');


-- Seed data for organization_addresses table
INSERT INTO organization_addresses (organization_id, country, region, city, postal_code)
VALUES
  ((SELECT organization_id FROM organizations WHERE name = 'Organization 1'), 'Country 1', 'Region 1', 'City 1', '12345'),
  ((SELECT organization_id FROM organizations WHERE name = 'Organization 2'), 'Country 2', 'Region 2', 'City 2', '67890');


-- Seed data for merchant_organization_links table
INSERT INTO merchant_organization_links (merchant_id, organization_id, role, workspace_handle)
VALUES
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'), (SELECT organization_id FROM organizations WHERE name = 'Organization 1'), 'Admin', 'workspace1'),
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 2'), (SELECT organization_id FROM organizations WHERE name = 'Organization 2'), 'Member', 'workspace2');


-- Seed data for customers table
INSERT INTO customers (merchant_id, organization_id, name, email, phone_number, country)
VALUES
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'), (SELECT organization_id FROM organizations WHERE name = 'Organization 1'), 'Customer 1', 'customer1@example.com', '+1234567890', 'Country 1'),
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'), (SELECT organization_id FROM organizations WHERE name = 'Organization 1'), 'Customer 2', 'customer2@example.com', '+2345678901', 'Country 1'),
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'), (SELECT organization_id FROM organizations WHERE name = 'Organization 1'), 'Customer 3', 'customer3@example.com', '+3456789012', 'Country 1'),
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'), (SELECT organization_id FROM organizations WHERE name = 'Organization 1'), 'Customer 4', 'customer4@example.com', '+4567890123', 'Country 1'),
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'), (SELECT organization_id FROM organizations WHERE name = 'Organization 1'), 'Customer 5', 'customer5@example.com', '+5678901234', 'Country 1'),
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 2'), (SELECT organization_id FROM organizations WHERE name = 'Organization 2'), 'Customer 6', 'customer6@example.com', '+6789012345', 'Country 2'),
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 2'), (SELECT organization_id FROM organizations WHERE name = 'Organization 2'), 'Customer 7', 'customer7@example.com', '+7890123456', 'Country 2'),
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 2'), (SELECT organization_id FROM organizations WHERE name = 'Organization 2'), 'Customer 8', 'customer8@example.com', '+8901234567', 'Country 2'),
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 2'), (SELECT organization_id FROM organizations WHERE name = 'Organization 2'), 'Customer 9', 'customer9@example.com', '+9012345678', 'Country 2'),
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 2'), (SELECT organization_id FROM organizations WHERE name = 'Organization 2'), 'Customer 10', 'customer10@example.com', '+0123456789', 'Country 2'),
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'), (SELECT organization_id FROM organizations WHERE name = 'Organization 1'), 'Customer 11', 'customer11@example.com', '+1234567890', 'Country 1'),
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'), (SELECT organization_id FROM organizations WHERE name = 'Organization 1'), 'Customer 12', 'customer12@example.com', '+2345678901', 'Country 1'),
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'), (SELECT organization_id FROM organizations WHERE name = 'Organization 1'), 'Customer 13', 'customer13@example.com', '+3456789012', 'Country 1'),
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 2'), (SELECT organization_id FROM organizations WHERE name = 'Organization 2'), 'Customer 14', 'customer14@example.com', '+4567890123', 'Country 2'),
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 2'), (SELECT organization_id FROM organizations WHERE name = 'Organization 2'), 'Customer 15', 'customer15@example.com', '+5678901234', 'Country 2'),
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'), (SELECT organization_id FROM organizations WHERE name = 'Organization 1'), 'Customer 16', 'customer16@example.com', '+6789012345', 'Country 1');


-- Seed data for merchant_products table
INSERT INTO merchant_products (merchant_id, name, description, price, currency_code, image_url, is_active)
VALUES
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'), 'Product 1', 'Description 1', 50.00, 'XOF', NULL, true),
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'), 'Product 2', 'Description 2', 25.00, 'XOF', NULL, true),
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'), 'Product 3', 'Description 3', 75.00, 'XOF', NULL, true),
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 2'), 'Product 4', 'Description 4', 100.00, 'XOF', NULL, true),
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 2'), 'Product 5', 'Description 5', 200.00, 'XOF', NULL, true),
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'), 'Product 6', 'Description 6', 150.00, 'XOF', NULL, true);


-- Seed data for merchant_subscriptions table
INSERT INTO merchant_subscriptions (merchant_id, organization_id, customer_id, name, description, status, start_date, billing_frequency, amount, currency_code, retry_payment_every, total_retries, failed_payment_action, email_notifications, metadata)
VALUES
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'), (SELECT organization_id FROM organizations WHERE name = 'Organization 1'), (SELECT customer_id FROM customers WHERE name = 'Customer 1'), 'Subscription 1', 'Description 1', 'active', '2024-01-01', 'monthly', 50.00, 'XOF', 3, 0, 'cancel', '{"enabled": true, "frequency": "weekly"}', '{}'),
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'), (SELECT organization_id FROM organizations WHERE name = 'Organization 1'), (SELECT customer_id FROM customers WHERE name = 'Customer 2'), 'Subscription 2', 'Description 2', 'active', '2024-01-01', 'yearly', 100.00, 'XOF', 0, 0, 'retry', '{"enabled": false}', '{}'),
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 2'), (SELECT organization_id FROM organizations WHERE name = 'Organization 2'), (SELECT customer_id FROM customers WHERE name = 'Customer 6'), 'Subscription 3', 'Description 3', 'active', '2024-07-01', 'monthly', 75.00, 'XOF', 2, 0, 'cancel', '{"enabled": true, "frequency": "monthly"}', '{}'),
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'), (SELECT organization_id FROM organizations WHERE name = 'Organization 1'), (SELECT customer_id FROM customers WHERE name = 'Customer 3'), 'Subscription 4', 'Description 4', 'active', '2024-01-01', 'yearly', 200.00, 'XOF', 0, 0, 'retry', '{"enabled": true, "frequency": "daily"}', '{}');


-- Seed data for transactions table
INSERT INTO transactions (merchant_id, organization_id, customer_id, product_id, subscription_id, transaction_type, status, description, reference_id, metadata, gross_amount, fee_amount, net_amount, fee_reference, currency_code, provider_code, payment_method_code, created_at)
VALUES 
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'), (SELECT organization_id FROM organizations WHERE name = 'Organization 1'), (SELECT customer_id FROM customers WHERE name = 'Customer 1'), (SELECT product_id FROM merchant_products WHERE name = 'Product 1'), NULL, 'payment', 'refunded', 'Transaction 1', 'REF1', '{}', 50.00, 5.00, 45.00, 'XOF/ORANGE Mobile Money Fee', 'XOF', 'WAVE', 'MOBILE_MONEY', '2024-07-15 09:30:00'),
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'), (SELECT organization_id FROM organizations WHERE name = 'Organization 1'), (SELECT customer_id FROM customers WHERE name = 'Customer 2'), NULL, (SELECT subscription_id FROM merchant_subscriptions WHERE name = 'Subscription 1'), 'instalment', 'refunded', 'Transaction 2', 'REF2', '{}', 50.00, 5.00, 45.00, 'XOF/ORANGE Mobile Money Fee', 'XOF', 'WAVE', 'MOBILE_MONEY', '2024-08-01 14:45:00'),
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'), (SELECT organization_id FROM organizations WHERE name = 'Organization 1'), (SELECT customer_id FROM customers WHERE name = 'Customer 3'), (SELECT product_id FROM merchant_products WHERE name = 'Product 1'), NULL, 'payment', 'refunded', 'Transaction 3', 'REF3', '{}', 25.00, 5.00, 20.00, 'XOF/ORANGE Mobile Money Fee', 'XOF', 'ORANGE', 'MOBILE_MONEY', '2024-08-15 11:20:00'),
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'), (SELECT organization_id FROM organizations WHERE name = 'Organization 1'), (SELECT customer_id FROM customers WHERE name = 'Customer 4'), (SELECT product_id FROM merchant_products WHERE name = 'Product 1'), NULL, 'payment', 'refunded', 'Transaction 4', 'REF4', '{}', 75.00, 5.00, 70.00, 'XOF/ORANGE Mobile Money Fee', 'XOF', 'MTN', 'MOBILE_MONEY', '2024-09-02 16:10:00'),
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'), (SELECT organization_id FROM organizations WHERE name = 'Organization 1'), (SELECT customer_id FROM customers WHERE name = 'Customer 5'), NULL, (SELECT subscription_id FROM merchant_subscriptions WHERE name = 'Subscription 2'), 'instalment', 'completed', 'Transaction 5', 'REF5', '{}', 100.00, 5.00, 95.00, 'XOF/ORANGE Mobile Money Fee', 'XOF', 'MTN', 'MOBILE_MONEY', '2024-09-10 08:55:00'),
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 2'), (SELECT organization_id FROM organizations WHERE name = 'Organization 2'), (SELECT customer_id FROM customers WHERE name = 'Customer 6'), (SELECT product_id FROM merchant_products WHERE name = 'Product 1'), NULL, 'payment', 'completed', 'Transaction 6', 'REF6', '{}', 100.00, 5.00, 95.00, 'XOF/ORANGE Mobile Money Fee', 'XOF', 'WAVE', 'MOBILE_MONEY', '2024-09-20 13:40:00'),
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 2'), (SELECT organization_id FROM organizations WHERE name = 'Organization 2'), (SELECT customer_id FROM customers WHERE name = 'Customer 7'), (SELECT product_id FROM merchant_products WHERE name = 'Product 1'), NULL, 'payment', 'completed', 'Transaction 7', 'REF7', '{}', 200.00, 5.00, 195.00, 'XOF/ORANGE Mobile Money Fee', 'XOF', 'ORANGE', 'MOBILE_MONEY', '2024-09-25 10:15:00'),
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 2'), (SELECT organization_id FROM organizations WHERE name = 'Organization 2'), (SELECT customer_id FROM customers WHERE name = 'Customer 8'), NULL, (SELECT subscription_id FROM merchant_subscriptions WHERE name = 'Subscription 3'), 'instalment', 'completed', 'Transaction 8', 'REF8', '{}', 75.00, 5.00, 70.00, 'XOF/ORANGE Mobile Money Fee', 'XOF', 'MTN', 'MOBILE_MONEY', '2024-10-01 17:30:00'),
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 2'), (SELECT organization_id FROM organizations WHERE name = 'Organization 2'), (SELECT customer_id FROM customers WHERE name = 'Customer 9'), (SELECT product_id FROM merchant_products WHERE name = 'Product 4'), NULL, 'payment', 'completed', 'Transaction 9', 'REF9', '{}', 100.00, 5.00, 95.00, 'XOF/ORANGE Mobile Money Fee', 'XOF', 'STRIPE', 'CARDS', '2024-10-05 12:05:00'),
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 2'), (SELECT organization_id FROM organizations WHERE name = 'Organization 2'), (SELECT customer_id FROM customers WHERE name = 'Customer 10'), (SELECT product_id FROM merchant_products WHERE name = 'Product 4'), NULL, 'payment', 'completed', 'Transaction 10', 'REF10', '{}', 200.00, 5.00, 195.00, 'XOF/ORANGE Mobile Money Fee', 'XOF', 'ECOBANK', 'BANK_TRANSFER', '2024-10-10 09:50:00'),
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'), (SELECT organization_id FROM organizations WHERE name = 'Organization 1'), (SELECT customer_id FROM customers WHERE name = 'Customer 11'), (SELECT product_id FROM merchant_products WHERE name = 'Product 4'), NULL, 'payment', 'completed', 'Transaction 11', 'REF11', '{}', 50.00, 5.00, 45.00, 'XOF/ORANGE Mobile Money Fee', 'XOF', 'ORANGE', 'MOBILE_MONEY', '2024-10-12 14:35:00'),
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'), (SELECT organization_id FROM organizations WHERE name = 'Organization 1'), (SELECT customer_id FROM customers WHERE name = 'Customer 12'), (SELECT product_id FROM merchant_products WHERE name = 'Product 2'), NULL, 'payment', 'pending', 'Transaction 12', 'REF12', '{}', 25.00, 5.00, 20.00, 'XOF/ORANGE Mobile Money Fee', 'XOF', 'ORANGE', 'MOBILE_MONEY', '2024-10-13 11:20:00'),
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'), (SELECT organization_id FROM organizations WHERE name = 'Organization 1'), (SELECT customer_id FROM customers WHERE name = 'Customer 13'), (SELECT product_id FROM merchant_products WHERE name = 'Product 3'), NULL, 'payment', 'completed', 'Transaction 13', 'REF13', '{}', 75.00, 5.00, 70.00, 'XOF/ORANGE Mobile Money Fee', 'XOF', 'WAVE', 'MOBILE_MONEY', '2024-10-13 16:05:00'),
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'), (SELECT organization_id FROM organizations WHERE name = 'Organization 1'), (SELECT customer_id FROM customers WHERE name = 'Customer 14'), NULL, (SELECT subscription_id FROM merchant_subscriptions WHERE name = 'Subscription 1'), 'instalment', 'completed', 'Transaction 14', 'REF14', '{}', 200.00, 5.00, 195.00, 'XOF/ORANGE Mobile Money Fee', 'XOF', 'ORANGE', 'MOBILE_MONEY', '2024-10-13 19:50:00'),
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 2'), (SELECT organization_id FROM organizations WHERE name = 'Organization 2'), (SELECT customer_id FROM customers WHERE name = 'Customer 15'), (SELECT product_id FROM merchant_products WHERE name = 'Product 4'), NULL, 'payment', 'failed', 'Transaction 15', 'REF15', '{}', 100.00, 5.00, 95.00, 'XOF/ORANGE Mobile Money Fee', 'XOF', 'ORANGE', 'MOBILE_MONEY', '2024-10-13 22:35:00');

-- Seed data for refunds table
INSERT INTO refunds (transaction_id, amount, refunded_amount, fee_amount, reason, status)
VALUES 
  ((SELECT transaction_id FROM transactions WHERE reference_id = 'REF1'), 50.00, 45.00, 5.00, 'Refund Reason 1', 'completed'),
  ((SELECT transaction_id FROM transactions WHERE reference_id = 'REF2'), 50.00, 45.00, 5.00, 'Refund Reason 2', 'completed'),
  ((SELECT transaction_id FROM transactions WHERE reference_id = 'REF3'), 25.00, 20.00, 5.00, 'Refund Reason 3', 'completed'),
  ((SELECT transaction_id FROM transactions WHERE reference_id = 'REF4'), 75.00, 70.00, 5.00, 'Refund Reason 4', 'completed');


-- Seed data for merchant_accounts table
INSERT INTO merchant_accounts (merchant_id, balance, currency_code)
VALUES
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 1'), 2000.00, 'XOF'),
  ((SELECT merchant_id FROM merchants WHERE name = 'Merchant 2'), 1800.00, 'XOF');

-- Seed data for payouts table
INSERT INTO payouts (account_id, organization_id, amount, currency_code, payout_method, status)
VALUES 
  ((SELECT account_id FROM merchant_accounts WHERE merchant_id = (SELECT merchant_id FROM merchants WHERE name = 'Merchant 1')), (SELECT organization_id FROM organizations WHERE name = 'Organization 1'), 1685.00, 'XOF', 'Bank Transfer', 'completed'),
  ((SELECT account_id FROM merchant_accounts WHERE merchant_id = (SELECT merchant_id FROM merchants WHERE name = 'Merchant 2')), (SELECT organization_id FROM organizations WHERE name = 'Organization 2'), 1650.00, 'XOF', 'Mobile Money', 'completed');

-- Seed data for organization_kyc table

-- Seed data for entries table

-- Seed data for api_keys table

-- Seed data for api_usage table

-- Seed data for webhooks table

-- Seed data for logs table

-- Seed data for platform_invoices table

-- Seed data for customer_api_interactions table

-- Seed data for api_rate_limits table

-- Seed data for platform_metrics table

-- Seed data for error_logs table

-- Seed data for pages table

-- Seed data for payment_links table

-- Seed data for customer_invoices table

-- Seed data for disputes table

-- Seed data for organization_providers_settings table

-- Seed data for platform_main_account table

-- Seed data for platform_provider_balance table

-- Seed data for merchant_feedback table

-- Seed data for notifications table