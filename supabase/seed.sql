-- Seed data for merchants table
INSERT INTO merchants (name, email, phone_number, onboarded, country, metadata, avatar_url, preferred_language, timezone, referral_code, pin_code, mrr, arr, merchant_lifetime_value)
VALUES ('Walid Lebbos', 'walid@gmail.com', '+221777777777', TRUE, 'Senegal', NULL, 'https://example.com/avatars/walid.jpg', 'en', 'UTCr', 'WALID2024', '1234', 1000.00, 12000.00, 50000.00)
     , ('Babacar Diop', 'babacar@africanledgertest.com', '+221666666666', TRUE, 'Senegal', NULL, 'https://example.com/avatars/babacar.jpg', 'fr', 'UTC', 'BABACAR2024', '5678', 2000.00, 24000.00, 100000.00);


-- Seed data for organizations table
INSERT INTO organizations (name, email, phone_number, verified, website_url, logo_url, status, default_currency, total_revenue, total_transactions, total_merchants, total_customers, metadata, employee_number, industry)
VALUES ('TechInnovate', 'info@techinnovate.com', '+221778901234', TRUE, 'https://techinnovate.com', 'https://example.com/logos/techinnovate.png', 'active', 'XOF', 10000000.00, 5000, 50, 1000, '{"founded_year": 2020}', '10-50', 'Technology')
     , ('African Ledger', 'contact@africanledger.com', '+221339876543', TRUE, 'https://africanledger.com', 'https://example.com/logos/africanledger.png', 'active', 'XOF', 5000000.00, 2500, 30, 500, '{"founded_year": 2022}', '5-10', 'Finance');


-- Seed data for organization_addresses table
INSERT INTO organization_addresses (organization_id, country, region, city, district, postal_code, street)
VALUES ((SELECT organization_id FROM organizations WHERE name = 'TechInnovate'), 'Senegal', 'Dakar', 'Dakar', 'Plateau', '12345', '123 Innovation Street')

     , ((SELECT organization_id FROM organizations WHERE name = 'African Ledger'), 'Senegal', 'Dakar', 'Dakar', 'Almadies', '54321', '456 Blockchain Avenue');


-- Seed data for organization_kyc table
INSERT INTO organization_kyc (organization_id, legal_organization_name, legal_country, legal_region, legal_city, legal_postal_code, legal_street, proof_of_business, business_platform_url, authorized_signatory_name, authorized_signatory_email, authorized_signatory_phone_number, registration_certificate, tax_number, legal_representative_ID_url, business_license_url, status)
VALUES ((SELECT organization_id FROM organizations WHERE name = 'TechInnovate'), 'TechInnovate LLC', 'Senegal', 'Dakar', 'Dakar', '12345', '123 Innovation Street', 'https://example.com/proofs/techinnovate.pdf', 'https://techinnovate.com', 'Amadou Diallo', 'amadou.diallo@techinnovate.com', '+221770123456', 'https://example.com/certificates/techinnovate.pdf', 'TIN123456', 'https://example.com/ids/amadou_diallo.jpg', 'https://example.com/licenses/techinnovate.pdf', 'approved')
     , ((SELECT organization_id FROM organizations WHERE name = 'African Ledger'), 'African Ledger Inc', 'Senegal', 'Dakar', 'Dakar', '54321', '456 Blockchain Avenue', 'https://example.com/proofs/africanledger.pdf', 'https://africanledger.com', 'Fatou Ndiaye', 'fatou.ndiaye@africanledger.com', '+221339012345', 'https://example.com/certificates/africanledger.pdf', 'TIN654321', 'https://example.com/ids/fatou_ndiaye.jpg', 'https://example.com/licenses/africanledger.pdf', 'approved');


-- Seed data for merchant_organization_links table
INSERT INTO merchant_organization_links (merchant_id, organization_id, workspace_handle, how_did_you_hear_about_us, role, organization_position)
VALUES ((SELECT merchant_id FROM merchants WHERE email = 'walid@gmail.com'), (SELECT organization_id FROM organizations WHERE name = 'TechInnovate'), 'techinnovate-workspace', 'Online Search', 'Admin', 'CEO')
     , ((SELECT merchant_id FROM merchants WHERE email = 'babacar@africanledgertest.com'), (SELECT organization_id FROM organizations WHERE name = 'African Ledger'), 'africanledger-workspace', 'Referral', 'Admin', 'CTO');


-- Seed data for providers table
INSERT INTO providers (name, code, description) VALUES
  ('Stripe', 'STRIPE', 'Global payment processor'),
  ('Orange', 'ORANGE', 'Mobile money and eWallet provider'),
  ('MTN', 'MTN', 'Mobile money provider'),
  ('Wave', 'WAVE', 'Mobile money and eWallet provider'),
  ('Ecobank', 'ECOBANK', 'Bank transfer provider'),
  ('PayPal', 'PAYPAL', 'Online payment provider'),
  ('Partner', 'PARTNER', 'Partner payment provider');


-- Seed data for payment_methods table
INSERT INTO payment_methods (payment_method_code, provider_code) VALUES
  ('CREDIT_CARD', 'STRIPE'), 
  ('BANK_TRANSFER', 'STRIPE'),
  ('PAYPAL', 'PAYPAL'),
  ('MOBILE_MONEY', 'ORANGE'),  
  ('MOBILE_MONEY', 'MTN'),     
  ('MOBILE_MONEY', 'WAVE'),
  ('BANK_TRANSFER', 'ECOBANK'),
  ('E_WALLET', 'PARTNER');


-- Seed data for organization_providers_settings table
INSERT INTO organization_providers_settings (organization_id, provider_code, is_connected, phone_number, complementary_information)
VALUES ((SELECT organization_id FROM organizations WHERE name = 'TechInnovate'), 'ORANGE', TRUE, '+221777777779', NULL)
     , ((SELECT organization_id FROM organizations WHERE name = 'TechInnovate'), 'STRIPE', TRUE, NULL, '{"stripe_account_id": "acct_1234567890"}')
     , ((SELECT organization_id FROM organizations WHERE name = 'African Ledger'), 'WAVE', TRUE, '+221666666668', NULL);


-- Seed data for currencies table
INSERT INTO currencies (code, name) VALUES
  ('XOF', 'West African CFA franc'), 
  ('NGN', 'Nigerian naira'),     
  ('GHS', 'Ghanaian cedi'),
  ('KES', 'Kenyan shilling'),       
  ('ZAR', 'South African rand'), 
  ('EGP', 'Egyptian pound'),
  ('MAD', 'Moroccan dirham'),       
  ('RWF', 'Rwandan franc'),     
  ('ETB', 'Ethiopian birr'),
  ('ZMW', 'Zambian kwacha'),        
  ('NAD', 'Namibian dollar'),   
  ('USD', 'United States dollar'),
  ('EUR', 'Euro'),                  
  ('MRO', 'Mauritanian ouguiya'),
  ('XAF', 'Central African CFA franc');


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
     , ((SELECT merchant_id FROM merchants WHERE email = 'babacar@africanledgertest.com'), 2000.00, 'XOF')
     , ((SELECT merchant_id FROM merchants WHERE email = 'babacar@africanledgertest.com'), 1000.00, 'EUR');


-- Seed data for merchant_products table
INSERT INTO merchant_products (merchant_id, name, description, price, currency_code, frequency, image_url)
VALUES ((SELECT merchant_id FROM merchants WHERE email = 'walid@gmail.com'), 'Premium Plan', 'Premium subscription plan', 50.00, 'USD', 'monthly', 'https://example.com/images/premium.jpg')
     , ((SELECT merchant_id FROM merchants WHERE email = 'babacar@africanledgertest.com'), 'Gold Package', 'Gold subscription package', 100.00, 'EUR', 'yearly', 'https://example.com/images/gold.jpg');


-- Seed data for subscriptions table
INSERT INTO subscriptions (merchant_id, organization_id, customer_id, product_id, status, start_date, billing_frequency, amount, currency_code, payment_method_code, provider_code)
VALUES ((SELECT merchant_id FROM merchants WHERE email = 'walid@gmail.com'), (SELECT organization_id FROM organizations WHERE name = 'TechInnovate'), (SELECT customer_id FROM customers WHERE email = 'fatou.diop@example.com'), (SELECT product_id FROM merchant_products WHERE name = 'Premium Plan'), 'active', NOW(), 'monthly', 50.00, 'USD', 'CREDIT_CARD', 'STRIPE')
     , ((SELECT merchant_id FROM merchants WHERE email = 'babacar@africanledgertest.com'), (SELECT organization_id FROM organizations WHERE name = 'African Ledger'), (SELECT customer_id FROM customers WHERE email = 'aminata.sow@example.com'), (SELECT product_id FROM merchant_products WHERE name = 'Gold Package'), 'active', NOW(), 'yearly', 100.00, 'EUR', 'CREDIT_CARD', 'STRIPE');


-- Seed data for fees table
INSERT INTO fees (name, transaction_type, fee_type, percentage, fixed_amount, currency_code, payment_method_code, provider_code) VALUES
  -- USD COMPANY FEES
  ('USD Enterprise Tier Monthly Subscription Fee', 'subscription', 'monthly', 0.0, 29.99, 'USD', NULL, NULL),
  ('USD Enterprise Tier Yearly Subscription Fee',  'subscription', 'yearly',  0.0, 299.99, 'USD', NULL, NULL),
  ('USD High Volume Discount','payment', 'volume_discount',    -0.5, 0.00, 'USD', NULL, NULL),
  ('USD Referral Discount', 'payment', 'referral_discount',  -0.5, 0.00, 'USD', NULL, NULL),

  -- EUR COMPANY FEES
  ('EUR Enterprise Tier Monthly Subscription Fee', 'subscription', 'monthly', 0.0, 26.99, 'EUR', NULL, NULL),
  ('EUR Enterprise Tier Yearly Subscription Fee',  'subscription', 'yearly',  0.0, 269.99, 'EUR', NULL, NULL),
  ('EUR High Volume Discount', 'payment', 'volume_discount',    -0.5, 0.00, 'EUR', NULL, NULL),
  ('EUR Referral Discount','payment', 'referral_discount',  -0.5, 0.00, 'EUR', NULL, NULL),

  -- XOF COMPANY FEES
  ('XOF Enterprise Tier Monthly Subscription Fee', 'subscription', 'monthly', 0.0, 15000.00, 'XOF', NULL, NULL),
  ('XOF Enterprise Tier Yearly Subscription Fee',  'subscription', 'yearly',  0.0, 150000.00, 'XOF', NULL, NULL),
  ('XOF High Volume Discount', 'payment', 'volume_discount',    -0.5, 0.00, 'XOF', NULL, NULL),
  ('XOF Referral Discount', 'payment', 'referral_discount',  -0.5, 0.00, 'XOF', NULL, NULL),

  -- GHS COMPANY FEES
  ('GHS Enterprise Tier Monthly Subscription Fee', 'subscription', 'monthly', 0.0, 300.99, 'GHS', NULL, NULL),
  ('GHS Enterprise Tier Yearly Subscription Fee',  'subscription', 'yearly',  0.0, 3000.00, 'GHS', NULL, NULL),
  ('GHS High Volume Discount','payment', 'volume_discount',    -0.5, 0.00, 'GHS', NULL, NULL),
  ('GHS Referral Discount', 'payment', 'referral_discount',  -0.5, 0.00, 'GHS', NULL, NULL),

  -- STRIPE FEES
  ('USD/STRIPE CARDS Fee', 'payment', 'processing', 2.9, 0.00, 'USD', 'CREDIT_CARD', 'STRIPE'),
  ('USD/STRIPE BANK_TRANSFER Fee', 'payment', 'processing', 1.4, 1.00, 'USD', 'BANK_TRANSFER', 'STRIPE'),
  ('EUR/STRIPE CARDS Fee', 'payment', 'processing', 2.9, 0.00, 'EUR', 'CREDIT_CARD', 'STRIPE'),
  ('EUR/STRIPE BANK_TRANSFER Fee', 'payment', 'processing', 1.4, 1.00, 'EUR', 'BANK_TRANSFER', 'STRIPE'),

  -- PAYPAL FEES
  ('USD/PAYPAL Payment Fee', 'payment', 'processing', 3.4, 0.30, 'USD', 'PAYPAL', 'PAYPAL'),
  ('EUR/PAYPAL Payment Fee', 'payment', 'processing', 3.4, 0.30, 'EUR', 'PAYPAL', 'PAYPAL'),

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
  ('USD/PARTNER Payment Fee', 'payment', 'processing', 2.9, 1.2, 'USD', 'E_WALLET', 'PARTNER'),
  ('EUR/PARTNER Payment Fee', 'payment', 'processing', 2.9, 1.2, 'EUR', 'E_WALLET', 'PARTNER'),
  ('XOF/PARTNER Payout Fee',  'payout',  'processing', 2.9, 66.00, 'XOF', 'E_WALLET', 'PARTNER'),
  ('GHS/PARTNER Payout Fee',  'payout',  'processing', 2.9, 22.00, 'GHS', 'E_WALLET', 'PARTNER'),

  -- CURRENCY CONVERSION FEE
  ('USD Currency Conversion Fee', 'payment', 'conversion', 1.5, 0.00, 'USD', NULL, NULL),
  ('EUR Currency Conversion Fee', 'payment', 'conversion', 1.5, 0.00, 'EUR', NULL, NULL),
  ('XOF Currency Conversion Fee', 'payment', 'conversion', 1.5, 0.00, 'XOF', NULL, NULL),
  ('GHS Currency Conversion Fee', 'payment', 'conversion', 1.5, 0.00, 'GHS', NULL, NULL),

  -- CHARGEBACK FEE
  ('USD Chargeback Fee', 'payment', 'chargeback', 0.0, 5.00, 'USD', NULL, NULL),
  ('EUR Chargeback Fee', 'payment', 'chargeback', 0.0, 5.00, 'EUR', NULL, NULL),
  ('XOF Chargeback Fee', 'payment', 'chargeback', 0.0, 5.00, 'XOF', NULL, NULL),
  ('GHS Chargeback Fee', 'payment', 'chargeback', 0.0, 5.00, 'GHS', NULL, NULL),

  -- RECURRING PAYMENT SETUP FEE
  ('USD Recurring Payment Setup Fee', 'payment', 'recurring_setup', 3.0, 0.0, 'USD', NULL, NULL),
  ('EUR Recurring Payment Setup Fee', 'payment', 'recurring_setup', 3.0, 0.0, 'EUR', NULL, NULL),
  ('XOF Recurring Payment Setup Fee', 'payment', 'recurring_setup', 3.0, 0.0, 'XOF', NULL, NULL),
  ('GHS Recurring Payment Setup Fee', 'payment', 'recurring_setup', 3.0, 0.0, 'GHS', NULL, NULL),

  -- EXPRESS PAYOUT FEE
  ('USD Express Payout Fee', 'payout', 'express', 0.0, 2.00, 'USD', NULL, NULL),
  ('EUR Express Payout Fee', 'payout', 'express', 0.0, 2.00, 'EUR', NULL, NULL),
  ('XOF Express Payout Fee', 'payout', 'express', 0.0, 2.00, 'XOF', NULL, NULL),
  ('GHS Express Payout Fee', 'payout', 'express', 0.0, 2.00, 'GHS', NULL, NULL),

  -- REFUND FEES
  ('USD Refund Processing Fee', 'refund', 'processing', 1.5, 0.00, 'USD', NULL, NULL),
  ('EUR Refund Processing Fee', 'refund', 'processing', 1.5, 0.00, 'EUR', NULL, NULL),
  ('XOF Refund Processing Fee', 'refund', 'processing', 2.2, 0.00, 'XOF', NULL, NULL),
  ('GHS Refund Processing Fee', 'refund', 'processing', 2.2, 0.00, 'GHS', NULL, NULL),

  -- PAYOUT PROCESSING FEES
  ('USD Payout Processing Fee', 'payout', 'processing', 2.0, 0.50, 'USD', NULL, NULL),
  ('EUR Payout Processing Fee', 'payout', 'processing', 1.8, 0.40, 'EUR', NULL, NULL),
  ('XOF Payout Processing Fee', 'payout', 'processing', 2.2, 0.00, 'XOF', NULL, NULL),
  ('GHS Payout Processing Fee', 'payout', 'processing', 2.1, 0.00, 'GHS', NULL, NULL);


-- Seed data for transactions table
INSERT INTO transactions (merchant_id, organization_id, customer_id, transaction_type, status, description, reference_id, metadata, gross_amount, fee_amount, net_amount, fee_reference, currency_code, provider_code, payment_method_code)
VALUES ((SELECT merchant_id FROM merchants WHERE email = 'walid@gmail.com'), (SELECT organization_id FROM organizations WHERE name = 'TechInnovate'), (SELECT customer_id FROM customers WHERE email = 'fatou.diop@example.com'), 'payment', 'completed', 'Premium plan subscription', 'REF1001', NULL, 50.00, 1.75, 48.25, 'USD/STRIPE CARDS Fee', 'USD', 'STRIPE', 'CREDIT_CARD')
     , ((SELECT merchant_id FROM merchants WHERE email = 'babacar@africanledgertest.com'), (SELECT organization_id FROM organizations WHERE name = 'African Ledger'), (SELECT customer_id FROM customers WHERE email = 'ibrahima.diallo@example.com'), 'payment', 'completed', 'Product purchase', 'REF1002', NULL, 75.00, 1.13, 73.87, 'XOF/ORANGE Mobile Money Fee', 'XOF', 'ORANGE', 'MOBILE_MONEY');


-- Seed data for refunds table
INSERT INTO refunds (transaction_id, amount, refunded_amount, fee_amount, reason, status)
VALUES ((SELECT transaction_id FROM transactions WHERE reference_id = 'REF1001'), 50.00, 48.25, 5.00, 'Customer request', 'completed');


-- Seed data for payouts table
INSERT INTO payouts (account_id, organization_id, amount, currency_code, payout_method, status, provider_code)
VALUES ((SELECT account_id FROM merchant_accounts WHERE merchant_id = (SELECT merchant_id FROM merchants WHERE email = 'walid@gmail.com') AND currency_code = 'USD'), (SELECT organization_id FROM organizations WHERE name = 'TechInnovate'), 1000.00, 'USD', 'bank_transfer', 'completed', 'ECOBANK')
     , ((SELECT account_id FROM merchant_accounts WHERE merchant_id = (SELECT merchant_id FROM merchants WHERE email = 'babacar@africanledgertest.com') AND currency_code = 'XOF'), (SELECT organization_id FROM organizations WHERE name = 'African Ledger'), 500000.00, 'XOF', 'mobile_money', 'pending', 'ORANGE');


-- Seed data for entries table
INSERT INTO entries (account_id, transaction_id, amount, entry_type)
VALUES ((SELECT account_id FROM merchant_accounts WHERE merchant_id = (SELECT merchant_id FROM merchants WHERE email = 'walid@gmail.com') AND currency_code = 'USD'), (SELECT transaction_id FROM transactions WHERE reference_id = 'REF1001'), 48.25, 'credit')
     , ((SELECT account_id FROM merchant_accounts WHERE merchant_id = (SELECT merchant_id FROM merchants WHERE email = 'babacar@africanledgertest.com') AND currency_code = 'XOF'), (SELECT transaction_id FROM transactions WHERE reference_id = 'REF1002'), 73.87, 'credit');


-- Seed data for entries table
INSERT INTO entries (account_id, payout_id, amount, entry_type)
VALUES ((SELECT account_id FROM merchant_accounts WHERE merchant_id = (SELECT merchant_id FROM merchants WHERE email = 'walid@gmail.com') AND currency_code = 'USD'), (SELECT payout_id FROM payouts WHERE amount = 1000.00 AND currency_code = 'USD'), -1000.00, 'debit')
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
INSERT INTO webhooks (merchant_id, organization_id, url, events)
VALUES ((SELECT merchant_id FROM merchants WHERE email = 'walid@gmail.com'), (SELECT organization_id FROM organizations WHERE name = 'TechInnovate'), 'https://techinnovate.com/webhooks/transactions', ARRAY['transaction.created', 'transaction.updated'])
     , ((SELECT merchant_id FROM merchants WHERE email = 'babacar@africanledgertest.com'), (SELECT organization_id FROM organizations WHERE name = 'African Ledger'), 'https://africanledger.com/webhooks/payouts', ARRAY['payout.created', 'payout.failed']);

-- Seed data for webhooks table
UPDATE webhooks 
SET last_payload = '{"event": "transaction.created", "transaction_id": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6"}',
    last_response_status = 200,
    last_response_body = 'OK',
    last_delivery_time = 50.0
WHERE url = 'https://techinnovate.com/webhooks/transactions';

UPDATE webhooks
SET last_payload = '{"event": "payout.failed", "payout_id": "p6o5n4m3-l2k1-j0i9-h8g7-f6e5d4c3b2a1"}',
    last_response_status = 500,
    last_response_body = 'Internal Server Error',
    last_delivery_time = 100.0
WHERE url = 'https://africanledger.com/webhooks/payouts';

-- Seed data for logs table
INSERT INTO logs (merchant_id, action, details, severity)
VALUES ((SELECT merchant_id FROM merchants WHERE email = 'walid@gmail.com'), 'transaction.created', '{"transaction_id": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6"}', 'INFO')
     , ((SELECT merchant_id FROM merchants WHERE email = 'babacar@africanledgertest.com'), 'payout.failed', '{"payout_id": "p6o5n4m3-l2k1-j0i9-h8g7-f6e5d4c3b2a1"}', 'ERROR');


-- Seed data for platform_invoices table
INSERT INTO platform_invoices (merchant_id, organization_id, amount, description, currency_code, due_date, status)
VALUES ((SELECT merchant_id FROM merchants WHERE email = 'walid@gmail.com'), (SELECT organization_id FROM organizations WHERE name = 'TechInnovate'), 1000.00, 'Monthly platform fees', 'USD', NOW() + INTERVAL '30 days', 'sent')
     , ((SELECT merchant_id FROM merchants WHERE email = 'babacar@africanledgertest.com'), (SELECT organization_id FROM organizations WHERE name = 'African Ledger'), 500000.00, 'Annual platform subscription', 'XOF', NOW() + INTERVAL '1 year', 'draft');


-- Seed data for notifications table
INSERT INTO notifications (merchant_id, organization_id, type, message, is_read)
VALUES ((SELECT merchant_id FROM merchants WHERE email = 'walid@gmail.com'), (SELECT organization_id FROM organizations WHERE name = 'TechInnovate'), 'transaction.created', 'New transaction created: REF1001', FALSE)
     , ((SELECT merchant_id FROM merchants WHERE email = 'babacar@africanledgertest.com'), (SELECT organization_id FROM organizations WHERE name = 'African Ledger'), 'payout.failed', 'Payout failed for transaction: REF1002', FALSE);


-- Seed data for customer_api_interactions table
INSERT INTO customer_api_interactions (organization_id, endpoint, request_method, request_payload, response_status, response_payload, response_time, api_key)
VALUES ((SELECT organization_id FROM organizations WHERE name = 'TechInnovate'), '/api/v1/transactions', 'POST', '{"amount": 100.00, "currency": "USD"}', 201, '{"transaction_id": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6"}', 250.0, 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6')
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
INSERT INTO payment_links (merchant_id, organization_id, page_id, product_id, subscription_id, title, public_description, price, currency_code, frequency, is_active)
VALUES ((SELECT merchant_id FROM merchants WHERE email = 'walid@gmail.com'), (SELECT organization_id FROM organizations WHERE name = 'TechInnovate'), (SELECT page_id FROM pages WHERE slug = 'premium-subscription'), (SELECT product_id FROM merchant_products WHERE name = 'Premium Plan'), (SELECT subscription_id FROM subscriptions WHERE product_id = (SELECT product_id FROM merchant_products WHERE name = 'Premium Plan')), 'Premium Plan Payment Link', 'Pay for your premium plan subscription', 50.00, 'USD', 'monthly', TRUE)
     , ((SELECT merchant_id FROM merchants WHERE email = 'babacar@africanledgertest.com'), (SELECT organization_id FROM organizations WHERE name = 'African Ledger'), (SELECT page_id FROM pages WHERE slug = 'gold-package'), (SELECT product_id FROM merchant_products WHERE name = 'Gold Package'), (SELECT subscription_id FROM subscriptions WHERE product_id = (SELECT product_id FROM merchant_products WHERE name = 'Gold Package')), 'Gold Package Payment Link', 'Pay for your gold package upgrade', 100.00, 'EUR', 'yearly', TRUE);


-- Seed data for customer_invoices table
INSERT INTO customer_invoices (merchant_id, customer_id, amount, description, currency_code, due_date, status)
VALUES ((SELECT merchant_id FROM merchants WHERE email = 'walid@gmail.com'), (SELECT customer_id FROM customers WHERE email = 'fatou.diop@example.com'), 100.00, 'Product purchase invoice', 'USD', NOW() + INTERVAL '15 days', 'sent')
     , ((SELECT merchant_id FROM merchants WHERE email = 'babacar@africanledgertest.com'), (SELECT customer_id FROM customers WHERE email = 'aminata.sow@example.com'), 75000.00, 'Service invoice', 'XOF', NOW() + INTERVAL '30 days', 'draft');


-- Seed data for disputes table
INSERT INTO disputes (transaction_id, customer_id, amount, fee_amount, reason, status, currency_code)
VALUES ((SELECT transaction_id FROM transactions WHERE reference_id = 'REF1001'), (SELECT customer_id FROM customers WHERE email = 'fatou.diop@example.com'), 50.00, 5.00, 'Product not received', 'open', 'USD')
     , ((SELECT transaction_id FROM transactions WHERE reference_id = 'REF1002'), (SELECT customer_id FROM customers WHERE email = 'ibrahima.diallo@example.com'), 75.00, 7.50, 'Incorrect amount charged', 'resolved', 'XOF');