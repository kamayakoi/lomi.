-- Seed data for merchants table
INSERT INTO merchants (name, email, phone_number, onboarded, country, avatar_url, preferred_language, timezone, referral_code, pin_code, mrr, arr, merchant_lifetime_value, metadata)
VALUES ('Walid Lebbos', 'walid@gmail.com', '+221777777777', TRUE, 'Senegal', 'https://example.com/avatars/walid.jpg', 'en', 'UTC', 'WALID2024', '1234', 1000.00, 12000.00, 50000.00, '{"preferred_contact_method": "email"}')
     , ('Babacar Diop', 'babacar@africanledgertest.com', '+221666666666', TRUE, 'Senegal', 'https://example.com/avatars/babacar.jpg', 'fr', 'UTC', 'BABACAR2024', '5678', 2000.00, 24000.00, 100000.00, '{"preferred_contact_method": "phone"}');


-- Seed data for organizations table
INSERT INTO organizations (name, email, phone_number, verified, website_url, logo_url, status, default_currency, total_revenue, total_transactions, total_merchants, total_customers, employee_number, industry, metadata)
VALUES ('TechInnovate', 'info@techinnovate.com', '+221778901234', TRUE, 'https://techinnovate.com', 'https://example.com/logos/techinnovate.png', 'active', 'XOF', 10000000.00, 5000, 50, 1000, '10-50', 'Technology', '{"founded_year": 2020}')
     , ('African Ledger', 'contact@africanledger.com', '+221339876543', TRUE, 'https://africanledger.com', 'https://example.com/logos/africanledger.png', 'active', 'XOF', 5000000.00, 2500, 30, 500, '5-10', 'Finance', '{"founded_year": 2022}');


-- Seed data for organization_addresses table
INSERT INTO organization_addresses (organization_id, country, region, city, district, street, postal_code)
VALUES 
((SELECT organization_id FROM organizations WHERE name = 'TechInnovate'), 'Senegal', 'Dakar', 'Dakar', 'Plateau', '123 Innovation Street', '12345'),
((SELECT organization_id FROM organizations WHERE name = 'African Ledger'), 'Senegal', 'Dakar', 'Dakar', 'Almadies', '456 Blockchain Avenue', '54321');


-- Seed data for organization_kyc table
INSERT INTO organization_kyc (organization_id, merchant_id, legal_organization_name, tax_number, business_description, legal_country, legal_region, legal_city, legal_postal_code, legal_street, proof_of_business, business_platform_url, authorized_signatory_name, authorized_signatory_email, authorized_signatory_phone_number, legal_representative_ID_url, address_proof_url, business_registration_url, status)
VALUES 
((SELECT organization_id FROM organizations WHERE name = 'TechInnovate'), (SELECT merchant_id FROM merchants WHERE email = 'walid@gmail.com'), 'TechInnovate Inc.', 'TAX123456', 'Innovative technology solutions provider', 'Senegal', 'Dakar', 'Dakar', '12345', '123 Innovation Street', 'https://example.com/proof_of_business_techinnovate.pdf', 'https://techinnovate.com', 'John Doe', 'john.doe@techinnovate.com', '+221777777778', 'https://example.com/legal_representative_id_techinnovate.pdf', 'https://example.com/address_proof_techinnovate.pdf', 'https://example.com/business_registration_techinnovate.pdf', 'approved'),
((SELECT organization_id FROM organizations WHERE name = 'African Ledger'), (SELECT merchant_id FROM merchants WHERE email = 'babacar@africanledgertest.com'), 'African Ledger Ltd.', 'TAX789012', 'Blockchain and financial technology company', 'Senegal', 'Dakar', 'Dakar', '54321', '456 Blockchain Avenue', 'https://example.com/proof_of_business_africanledger.pdf', 'https://africanledger.com', 'Jane Smith', 'jane.smith@africanledger.com', '+221666666667', 'https://example.com/legal_representative_id_africanledger.pdf', 'https://example.com/address_proof_africanledger.pdf', 'https://example.com/business_registration_africanledger.pdf', 'pending');


-- Seed data for merchant_organization_links table
INSERT INTO merchant_organization_links (merchant_id, organization_id, role, workspace_handle, how_did_you_hear_about_us, organization_position)
VALUES 
((SELECT merchant_id FROM merchants WHERE email = 'walid@gmail.com'), (SELECT organization_id FROM organizations WHERE name = 'TechInnovate'), 'Admin', 'techinnovate-walid', 'Online search', 'CEO'),
((SELECT merchant_id FROM merchants WHERE email = 'babacar@africanledgertest.com'), (SELECT organization_id FROM organizations WHERE name = 'African Ledger'), 'Admin', 'africanledger-babacar', 'Referral', 'CTO'),
((SELECT merchant_id FROM merchants WHERE email = 'walid@gmail.com'), (SELECT organization_id FROM organizations WHERE name = 'African Ledger'), 'Member', 'africanledger-walid', NULL, 'Advisor');

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


-- Seed data for organization_providers_settings table



-- Seed data for currencies table
INSERT INTO currencies (code, name) VALUES
  ('XOF', 'West African CFA franc'), 
  ('USD', 'United States dollar'),
  ('EUR', 'Euro');


-- Seed data for customers table
INSERT INTO customers (merchant_id, organization_id, name, email, phone_number, country)
VALUES ((SELECT merchant_id FROM merchants WHERE email = 'walid@gmail.com'), (SELECT organization_id FROM organizations WHERE name = 'TechInnovate'), 'Fatou Diop', 'fatou.diop@example.com', '+221777777780', 'Senegal')
     , ((SELECT merchant_id FROM merchants WHERE email = 'walid@gmail.com'), (SELECT organization_id FROM organizations WHERE name = 'TechInnovate'), 'Moussa Ndiaye', 'moussa.ndiaye@example.com', '+221777777781', 'Senegal')
     , ((SELECT merchant_id FROM merchants WHERE email = 'babacar@africanledgertest.com'), (SELECT organization_id FROM organizations WHERE name = 'African Ledger'), 'Aminata Sow', 'aminata.sow@example.com', '+221666666669', 'Senegal')
     , ((SELECT merchant_id FROM merchants WHERE email = 'babacar@africanledgertest.com'), (SELECT organization_id FROM organizations WHERE name = 'African Ledger'), 'Ibrahima Diallo', 'ibrahima.diallo@example.com', '+221666666670', 'Senegal');


-- Seed data for merchant_accounts table
INSERT INTO merchant_accounts (merchant_id, balance, currency_code)
VALUES ((SELECT merchant_id FROM merchants WHERE email = 'walid@gmail.com'), 1000.00, 'XOF')
     , ((SELECT merchant_id FROM merchants WHERE email = 'walid@gmail.com'), 500.00, 'USD')
     , ((SELECT merchant_id FROM merchants WHERE email = 'babacar@africanledgertest.com'), 2000.00, 'XOF');


-- Seed data for merchant_products table
INSERT INTO merchant_products (merchant_id, name, description, price, currency_code, image_url)
VALUES ((SELECT merchant_id FROM merchants WHERE email = 'walid@gmail.com'), 'Premium Plan', 'Premium subscription plan', 50.00, 'XOF', 'https://example.com/images/premium.jpg')
     , ((SELECT merchant_id FROM merchants WHERE email = 'babacar@africanledgertest.com'), 'Gold Package', 'Gold subscription package', 100.00, 'XOF', 'https://example.com/images/gold.jpg');


-- Seed data for subscriptions table
INSERT INTO merchant_subscriptions (merchant_id, organization_id, customer_id, status, image_url, start_date, billing_frequency, amount, currency_code)
VALUES ((SELECT merchant_id FROM merchants WHERE email = 'walid@gmail.com'), (SELECT organization_id FROM organizations WHERE name = 'TechInnovate'), (SELECT customer_id FROM customers WHERE email = 'fatou.diop@example.com'), 'active', 'https://example.com/images/premium_sub.jpg', NOW(), 'monthly', 50.00, 'XOF')
     , ((SELECT merchant_id FROM merchants WHERE email = 'babacar@africanledgertest.com'), (SELECT organization_id FROM organizations WHERE name = 'African Ledger'), (SELECT customer_id FROM customers WHERE email = 'aminata.sow@example.com'), 'active', 'https://example.com/images/gold_sub.jpg', NOW(), 'yearly', 100.00, 'XOF');


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


-- Seed data for transactions table
INSERT INTO transactions (merchant_id, organization_id, customer_id, product_id, subscription_id, transaction_type, status, description, reference_id, metadata, gross_amount, fee_amount, net_amount, fee_reference, currency_code, provider_code, payment_method_code)
VALUES 
    ((SELECT merchant_id FROM merchants WHERE email = 'walid@gmail.com'), 
     (SELECT organization_id FROM organizations WHERE name = 'TechInnovate'),
     (SELECT customer_id FROM customers WHERE email = 'fatou.diop@example.com'),
     (SELECT product_id FROM merchant_products WHERE name = 'Premium Plan'),
     'payment', 'completed', 'Sample transaction 1', 'REF1001', '{}', 50.00, 5.00, 45.00, 'XOF/ORANGE Mobile Money Fee', 'XOF', 'ORANGE', 'MOBILE_MONEY'),
    ((SELECT merchant_id FROM merchants WHERE email = 'walid@gmail.com'), 
     (SELECT organization_id FROM organizations WHERE name = 'TechInnovate'),
     (SELECT customer_id FROM customers WHERE email = 'moussa.ndiaye@example.com'),
     NULL,
     NULL,
     'payment', 'pending', 'Sample transaction 2', 'REF1002', '{}', 50.00, 5.00, 45.00, 'XOF/WAVE Mobile Money Fee', 'XOF', 'WAVE', 'MOBILE_MONEY'),
    ((SELECT merchant_id FROM merchants WHERE email = 'babacar@africanledgertest.com'), 
     (SELECT organization_id FROM organizations WHERE name = 'African Ledger'),
     (SELECT customer_id FROM customers WHERE email = 'aminata.sow@example.com'),
     (SELECT subscription_id FROM merchant_subscriptions WHERE customer_id = (SELECT customer_id FROM customers WHERE email = 'aminata.sow@example.com')),
     'payment', 'completed', 'Sample transaction 3', 'REF1003', '{}', 100.00, 5.00, 95.00, 'XOF/MTN Mobile Money Fee', 'XOF', 'MTN', 'MOBILE_MONEY'),
    ((SELECT merchant_id FROM merchants WHERE email = 'babacar@africanledgertest.com'), 
     (SELECT organization_id FROM organizations WHERE name = 'African Ledger'),
     (SELECT customer_id FROM customers WHERE email = 'ibrahima.diallo@example.com'),
     NULL,
     NULL,
     'payment', 'failed', 'Sample transaction 4', 'REF1004', '{}', 75.00, 5.00, 70.00, 'XOF/ECOBANK Bank Transfer Fee', 'XOF', 'ECOBANK', 'BANK_TRANSFER'),
    ((SELECT merchant_id FROM merchants WHERE email = 'walid@gmail.com'), 
     (SELECT organization_id FROM organizations WHERE name = 'TechInnovate'),
     (SELECT customer_id FROM customers WHERE email = 'fatou.diop@example.com'),
     NULL,
     NULL,
     'payment', 'completed', 'Sample transaction 5', 'REF1005', '{}', 150.00, 5.00, 145.00, 'XOF/ORANGE Mobile Money Fee', 'XOF', 'ORANGE', 'MOBILE_MONEY'),
    ((SELECT merchant_id FROM merchants WHERE email = 'walid@gmail.com'), 
     (SELECT organization_id FROM organizations WHERE name = 'TechInnovate'),
     (SELECT customer_id FROM customers WHERE email = 'moussa.ndiaye@example.com'),
     NULL,
     NULL,
     'instalment', 'completed', 'Sample transaction 6', 'REF1006', '{}', 200.00, 5.00, 195.00, 'XOF/WAVE Mobile Money Fee', 'XOF', 'WAVE', 'MOBILE_MONEY');

-- Seed data for refunds table
INSERT INTO refunds (transaction_id, amount, refunded_amount, fee_amount, reason, status)
VALUES 
    ((SELECT transaction_id FROM transactions WHERE reference_id = 'REF1003'), 100, 90.00, 5.00, 'Customer request', 'completed'),
    ((SELECT transaction_id FROM transactions WHERE reference_id = 'REF1006'), 200, 190.00, 5.00, 'Customer request', 'completed');


-- Seed data for payouts table
INSERT INTO payouts (account_id, organization_id, amount, currency_code, payout_method, status, provider_code)
VALUES ((SELECT account_id FROM merchant_accounts WHERE merchant_id = (SELECT merchant_id FROM merchants WHERE email = 'walid@gmail.com') AND currency_code = 'XOF'), (SELECT organization_id FROM organizations WHERE name = 'TechInnovate'), 1000.00, 'XOF', 'bank_transfer', 'completed', 'ECOBANK')
     , ((SELECT account_id FROM merchant_accounts WHERE merchant_id = (SELECT merchant_id FROM merchants WHERE email = 'babacar@africanledgertest.com') AND currency_code = 'XOF'), (SELECT organization_id FROM organizations WHERE name = 'African Ledger'), 500000.00, 'XOF', 'mobile_money', 'pending', 'ORANGE');


-- Seed data for entries table
INSERT INTO entries (account_id, transaction_id, amount, entry_type)
VALUES ((SELECT account_id FROM merchant_accounts WHERE merchant_id = (SELECT merchant_id FROM merchants WHERE email = 'walid@gmail.com') AND currency_code = 'XOF'), (SELECT transaction_id FROM transactions WHERE reference_id = 'REF1001'), 48.25, 'credit')
     , ((SELECT account_id FROM merchant_accounts WHERE merchant_id = (SELECT merchant_id FROM merchants WHERE email = 'babacar@africanledgertest.com') AND currency_code = 'XOF'), (SELECT transaction_id FROM transactions WHERE reference_id = 'REF1002'), 73.87, 'credit');


-- Seed data for entries table
INSERT INTO entries (account_id, payout_id, amount, entry_type)
VALUES ((SELECT account_id FROM merchant_accounts WHERE merchant_id = (SELECT merchant_id FROM merchants WHERE email = 'walid@gmail.com') AND currency_code = 'XOF'), (SELECT payout_id FROM payouts WHERE amount = 1000.00 AND currency_code = 'XOF'), -1000.00, 'debit')
     , ((SELECT account_id FROM merchant_accounts WHERE merchant_id = (SELECT merchant_id FROM merchants WHERE email = 'babacar@africanledgertest.com') AND currency_code = 'XOF'), (SELECT payout_id FROM payouts WHERE amount = 500000.00 AND currency_code = 'XOF'), -500000.00, 'debit');


-- Seed data for api_keys table
INSERT INTO api_keys (organization_id, api_key, name)
VALUES ((SELECT organization_id FROM organizations WHERE name = 'TechInnovate'), 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6', 'Main API Key')
     , ((SELECT organization_id FROM organizations WHERE name = 'African Ledger'), 'p6o5n4m3-l2k1-j0i9-h8g7-f6e5d4c3b2a1', 'Test API Key');


-- Seed data for api_usage table
INSERT INTO api_usage (organization_id, api_key, endpoint, request_count, last_request_at, request_method, response_status, response_time)
VALUES ((SELECT organization_id FROM organizations WHERE name = 'TechInnovate'), 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6', '/api/v1/transactions', 100, NOW(), 'GET', 200, 150.5)
     , ((SELECT organization_id FROM organizations WHERE name = 'African Ledger'), 'p6o5n4m3-l2k1-j0i9-h8g7-f6e5d4c3b2a1', '/api/v1/payouts', 50, NOW(), 'POST', 201, 250.8);


-- Seed data for webhooks table

-- Seed data for logs table
INSERT INTO logs (merchant_id, action, details, severity)
VALUES ((SELECT merchant_id FROM merchants WHERE email = 'walid@gmail.com'), 'transaction.created', '{"transaction_id": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6"}', 'INFO')
     , ((SELECT merchant_id FROM merchants WHERE email = 'babacar@africanledgertest.com'), 'payout.failed', '{"payout_id": "p6o5n4m3-l2k1-j0i9-h8g7-f6e5d4c3b2a1"}', 'ERROR');


-- Seed data for platform_invoices table
INSERT INTO platform_invoices (merchant_id, organization_id, amount, description, currency_code, due_date, status)
VALUES ((SELECT merchant_id FROM merchants WHERE email = 'walid@gmail.com'), (SELECT organization_id FROM organizations WHERE name = 'TechInnovate'), 1000.00, 'Monthly platform fees', 'XOF', NOW() + INTERVAL '30 days', 'sent')
     , ((SELECT merchant_id FROM merchants WHERE email = 'babacar@africanledgertest.com'), (SELECT organization_id FROM organizations WHERE name = 'African Ledger'), 500000.00, 'Annual platform subscription', 'XOF', NOW() + INTERVAL '1 year', 'sent');


-- Seed data for customer_api_interactions table
INSERT INTO customer_api_interactions (organization_id, endpoint, request_method, request_payload, response_status, response_payload, response_time, api_key)
VALUES ((SELECT organization_id FROM organizations WHERE name = 'TechInnovate'), '/api/v1/transactions', 'POST', '{"amount": 100.00, "currency": "XOF"}', 201, '{"transaction_id": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6"}', 250.0, 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6')
     , ((SELECT organization_id FROM organizations WHERE name = 'African Ledger'), '/api/v1/payouts', 'GET', NULL, 200, '[{"payout_id": "p6o5n4m3-l2k1-j0i9-h8g7-f6e5d4c3b2a1", "amount": 500000.00, "currency": "XOF", "status": "pending"}]', 150.0, 'p6o5n4m3-l2k1-j0i9-h8g7-f6e5d4c3b2a1');


-- Seed data for api_rate_limits table
INSERT INTO api_rate_limits (organization_id, api_key, endpoint, requests_limit, time_window)
VALUES ((SELECT organization_id FROM organizations WHERE name = 'TechInnovate'), 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6', '/api/v1/transactions', 100, INTERVAL '1 minute')
     , ((SELECT organization_id FROM organizations WHERE name = 'African Ledger'), 'p6o5n4m3-l2k1-j0i9-h8g7-f6e5d4c3b2a1', '/api/v1/payouts', 50, INTERVAL '1 hour');


-- Seed data for platform_metrics table
INSERT INTO platform_metrics (entity_type, metric_name, metric_value, metric_date)
VALUES ('merchant', 'total_transactions', 1000, NOW() - INTERVAL '1 month')
     , ('organization', 'total_revenue', 5000000.00, NOW() - INTERVAL '1 month')
     , ('platform', 'total_merchants', 100, NOW() - INTERVAL '1 month');


-- Seed data for error_logs table
INSERT INTO api_error_logs (error_type, error_message, stack_trace, context)
VALUES ('PayoutFailedError', 'Payout failed for transaction: REF1002', 'Error: Payout failed for transaction: REF1002\n    at processPayouts (payouts.ts:50:11)\n    at ...',  '{"payout_id": "p6o5n4m3-l2k1-j0i9-h8g7-f6e5d4c3b2a1", "transaction_id": "REF1002"}')
     , ('InvalidRequestError', 'Invalid request payload', 'Error: Invalid request payload\n    at validateRequest (validation.ts:20:5)\n    at ...', '{"endpoint": "/api/v1/transactions", "payload": {"amount": -100.00}}');


-- Seed data for pages table
INSERT INTO pages (merchant_id, organization_id, title, description, slug, content, theme, is_active)
VALUES ((SELECT merchant_id FROM merchants WHERE email = 'walid@gmail.com'), (SELECT organization_id FROM organizations WHERE name = 'TechInnovate'), 'Premium Subscription', 'Subscribe to our premium plan', 'premium-subscription', '{"heading": "Premium Plan", "features": ["Feature 1", "Feature 2", "Feature 3"], "price": 50.00}', 'default', TRUE)
     , ((SELECT merchant_id FROM merchants WHERE email = 'babacar@africanledgertest.com'), (SELECT organization_id FROM organizations WHERE name = 'African Ledger'), 'Gold Package', 'Upgrade to our gold package', 'gold-package', '{"heading": "Gold Package", "features": ["Feature A", "Feature B", "Feature C"], "price": 100.00}', 'custom', TRUE);


-- Seed data for payment_links table



-- Seed data for customer_invoices table
INSERT INTO customer_invoices (merchant_id, customer_id, amount, description, currency_code, due_date, status)
VALUES ((SELECT merchant_id FROM merchants WHERE email = 'walid@gmail.com'), (SELECT customer_id FROM customers WHERE email = 'fatou.diop@example.com'), 100.00, 'Product purchase invoice', 'XOF', NOW() + INTERVAL '15 days', 'sent')
     , ((SELECT merchant_id FROM merchants WHERE email = 'babacar@africanledgertest.com'), (SELECT customer_id FROM customers WHERE email = 'aminata.sow@example.com'), 75000.00, 'Service invoice', 'XOF', NOW() + INTERVAL '30 days', 'sent');


-- Seed data for disputes table
INSERT INTO disputes (transaction_id, customer_id, amount, fee_amount, reason, status, currency_code)
VALUES ((SELECT transaction_id FROM transactions WHERE reference_id = 'REF1001'), (SELECT customer_id FROM customers WHERE email = 'fatou.diop@example.com'), 50.00, 5.00, 'Product not received', 'pending', 'XOF')
     , ((SELECT transaction_id FROM transactions WHERE reference_id = 'REF1002'), (SELECT customer_id FROM customers WHERE email = 'ibrahima.diallo@example.com'), 75.00, 7.50, 'Incorrect amount charged', 'resolved', 'XOF');
