-- merchants table
INSERT INTO merchants (merchant_id, name, email, phone_number, is_admin, onboarded, verified, country, metadata, avatar_url, preferred_language, referral_code, mrr, arr, merchant_lifetime_value)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Babacar Diop', 'babacar@africanledger.com', '+221987654321', true, true, true, 'Senegal', '{"position": "CEO"}', 'https://example.com/babacar.jpg', 'fr', 'AFLED001', 5000.00, 60000.00, 120000.00),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'John Doe', 'john@telnyx.com', '+1987654321', true, true, true, 'United States', '{"position": "CFO"}', 'https://example.com/john.jpg', 'en', 'TELNYX001', 20000.00, 240000.00, 500000.00);

-- organizations table
INSERT INTO organizations (organization_id, name, email, phone_number, tax_number, website_url, business_platform_url, status, default_currency, total_revenue, total_transactions, total_merchants, total_customers, metadata)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'African Ledger', 'contact@africanledger.com', '+221123456789', 'SN123456789', 'https://africanledger.com', NULL, 'active', 'XOF', 1000000.00, 5000, 100, 1000, '{"industry": "Fintech"}'),
  ('22222222-2222-2222-2222-222222222222', 'Telnyx', 'contact@telnyx.com', '+1234567890', 'US987654321', 'https://telnyx.com', NULL, 'active', 'USD', 5000000.00, 20000, 500, 5000, '{"industry": "Telecommunications"}');

-- organization addresses table
INSERT INTO organization_addresses (organization_id, country, region, city, address, postal_code, default_language, timezone)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Senegal', 'Dakar', 'Dakar', '123 Rue Félix Faure', '12345', 'fr', 'Africa/Dakar'),
  ('22222222-2222-2222-2222-222222222222', 'United States', 'Illinois', 'Chicago', '311 W Superior Street, Suite 504', '60654', 'en', 'America/Chicago');

-- organization KYC table
INSERT INTO organization_kyc (organization_id, document_type, document_url, authorized_signatory, status, kyc_submitted_at, kyc_approved_at, uploaded_at, reviewed_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'business_registration', 'https://example.com/africanledger_reg.pdf', '{"name": "Babacar Diop", "position": "CEO"}', 'approved', NOW() - INTERVAL '30 days', NOW() - INTERVAL '25 days', NOW() - INTERVAL '30 days', NOW() - INTERVAL '25 days'),
  ('22222222-2222-2222-2222-222222222222', 'business_registration', 'https://example.com/telnyx_reg.pdf', '{"name": "John Doe", "position": "CFO"}', 'approved', NOW() - INTERVAL '60 days', NOW() - INTERVAL '55 days', NOW() - INTERVAL '60 days', NOW() - INTERVAL '55 days');

-- merchant-organization links table
INSERT INTO merchant_organization_links (merchant_id, organization_id, role)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'admin'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'admin');

-- Providers table
INSERT INTO providers (name, code, description)
VALUES
    ('Stripe', 'STRIPE', 'Global payment processor'),
    ('Orange', 'ORANGE', 'Mobile money provider'),
    ('MTN', 'MTN', 'Mobile money provider'),
    ('Wave', 'WAVE', 'Mobile money and e-wallet provider'),
    ('Partner', 'PARTNER', 'Generic partner integration'),
    ('Ecobank', 'ECOBANK', 'Bank transfer provider'),
    ('Lomi', 'LOMI', 'Internal payment processor'),
    ('PayPal', 'PAYPAL', 'Global online payment system');

-- payment methods table
INSERT INTO payment_methods (payment_method_code, provider_code)
VALUES
    ('CREDIT_CARD', 'STRIPE'),
    ('DEBIT_CARD', 'STRIPE'),
    ('SEPA', 'STRIPE'),
    ('PAYPAL', 'PAYPAL'),
    ('MOBILE_MONEY', 'ORANGE'),
    ('MOBILE_MONEY', 'MTN'),
    ('MOBILE_MONEY', 'WAVE'),
    ('BANK_TRANSFER', 'ECOBANK'),
    ('CASH', 'LOMI'),
    ('E_WALLET', 'LOMI'),
    ('E_WALLET', 'PARTNER'),
    ('APPLE_PAY', 'STRIPE'),
    ('GOOGLE_PAY', 'STRIPE');

-- organization-providers settings table
INSERT INTO organization_providers_settings (organization_id, provider_code, is_connected, phone_number, card_number, complementary_information, bank_account_number, bank_account_name, bank_name, bank_code)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'ORANGE', true, '+221123456789', NULL, '{"api_key": "orange_api_key_123"}', NULL, NULL, NULL, NULL),
  ('11111111-1111-1111-1111-111111111111', 'WAVE', true, '+221123456789', NULL, '{"api_key": "wave_api_key_123"}', NULL, NULL, NULL, NULL),
  ('22222222-2222-2222-2222-222222222222', 'STRIPE', true, NULL, '4111111111111111', '{"api_key": "stripe_api_key_123"}', NULL, NULL, NULL, NULL),
  ('22222222-2222-2222-2222-222222222222', 'PAYPAL', true, NULL, NULL, '{"api_key": "paypal_api_key_123"}', NULL, NULL, NULL, NULL);

-- currencies table
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


-- customers table
INSERT INTO customers (merchant_id, organization_id, name, email, phone_number, address, city, country, postal_code, metadata)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Fatou Ndiaye', 'fatou@example.com', '+221555555555', '456 Avenue Léopold Sédar Senghor', 'Dakar', 'Senegal', '12345', '{"preferred_language": "fr"}'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'Jane Smith', 'jane@example.com', '+1555555555', '789 Michigan Ave', 'Chicago', 'United States', '60601', '{"preferred_language": "en"}');

-- accounts table
INSERT INTO accounts (merchant_id, balance, provider_code, currency_code)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 10000.00, 'ORANGE', 'XOF'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 50000.00, 'STRIPE', 'USD');

-- main accounts table
INSERT INTO main_accounts (merchant_id, balance, currency_code)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 15000.00, 'XOF'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 75000.00, 'USD');

-- platform main balance table
INSERT INTO platform_main_balance (platform_main_balance, currency_code, total_transactions, total_fees, total_revenue)
VALUES
  (100000.00, 'XOF', 1000, 5000.00, 10000.00),
  (500000.00, 'USD', 5000, 25000.00, 50000.00);

-- platform payouts table
INSERT INTO platform_payouts (organization_id, amount, from_account_id, from_main_account_id, currency_code, payout_method, payout_details, status, reference_id)
VALUES
  ('11111111-1111-1111-1111-111111111111', 5000.00, (SELECT account_id FROM accounts WHERE merchant_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' LIMIT 1), (SELECT main_account_id FROM main_accounts WHERE merchant_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' LIMIT 1), 'XOF', 'bank_transfer', '{"bank_name": "Bank of Africa", "account_number": "1234567890"}', 'completed', 'PO-001'),
  ('22222222-2222-2222-2222-222222222222', 10000.00, (SELECT account_id FROM accounts WHERE merchant_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' LIMIT 1), (SELECT main_account_id FROM main_accounts WHERE merchant_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' LIMIT 1), 'USD', 'bank_transfer', '{"bank_name": "Chase", "account_number": "0987654321"}', 'completed', 'PO-002');

-- platform provider balances table
INSERT INTO platform_provider_balances (platform_provider_balance, provider_code, currency_code, total_transactions, total_fees, total_revenue)
VALUES
  (10000.00, 'ORANGE', 'XOF', 100, 500.00, 9500.00),
  (20000.00, 'STRIPE', 'USD', 200, 1000.00, 19000.00);

-- merchant products table
INSERT INTO merchant_products (merchant_id, name, description, price, currency_code, frequency, image_url, is_active)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Premium Ledger', 'Advanced ledger service', 9999.00, 'XOF', 'monthly', 'https://example.com/premium_ledger.jpg', true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Enterprise Comms', 'Enterprise communication package', 199.99, 'USD', 'monthly', 'https://example.com/enterprise_comms.jpg', true);

-- customer subscriptions table
-- INSERT INTO customer_subscriptions (customer_id, product_id, status, start_date, end_date, billing_frequency, amount, currency_code) VALUES


-- fees table
INSERT INTO fees (name, transaction_type, fee_type, percentage, fixed_amount, currency_code, payment_method_code, provider_code) VALUES
    -- USD COMPANY FEES
    ('USD Enterprise Tier Monthly Subscription Fee', 'subscription', 'monthly', 0.0, 29.99, 'USD', NULL, NULL),
    ('USD Enterprise Tier Yearly Subscription Fee', 'subscription', 'yearly', 0.0, 299.99, 'USD', NULL, NULL),
    ('USD High Volume Discount', 'payment', 'volume_discount', -0.5, 0.00, 'USD', NULL, NULL),
    ('USD Referral Discount', 'payment', 'referral_discount', -0.5, 0.00, 'USD', NULL, NULL),
    -- EUR COMPANY FEES
    ('EUR Enterprise Tier Monthly Subscription Fee', 'subscription', 'monthly', 0.0, 26.99, 'EUR', NULL, NULL),
    ('EUR Enterprise Tier Yearly Subscription Fee', 'subscription', 'yearly', 0.0, 269.99, 'EUR', NULL, NULL),
    ('EUR High Volume Discount', 'payment', 'volume_discount', -0.5, 0.00, 'EUR', NULL, NULL),
    ('EUR Referral Discount', 'payment', 'referral_discount', -0.5, 0.00, 'EUR', NULL, NULL),
    -- XOF COMPANY FEES
    ('XOF Enterprise Tier Monthly Subscription Fee', 'subscription', 'monthly', 0.0, 15000.00, 'XOF', NULL, NULL),
    ('XOF Enterprise Tier Yearly Subscription Fee', 'subscription', 'yearly', 0.0, 150000.00, 'XOF', NULL, NULL),
    ('XOF High Volume Discount', 'payment', 'volume_discount', -0.5, 0.00, 'XOF', NULL, NULL),
    ('XOF Referral Discount', 'payment', 'referral_discount', -0.5, 0.00, 'XOF', NULL, NULL),
    -- GHS COMPANY FEES
    ('GHS Enterprise Tier Monthly Subscription Fee', 'subscription', 'monthly', 0.0, 300.99, 'GHS', NULL, NULL),
    ('GHS Enterprise Tier Yearly Subscription Fee', 'subscription', 'yearly', 0.0, 3000.00, 'GHS', NULL, NULL),
    ('GHS High Volume Discount', 'payment', 'volume_discount', -0.5, 0.00, 'GHS', NULL, NULL),
    ('GHS Referral Discount', 'payment', 'referral_discount', -0.5, 0.00, 'GHS', NULL, NULL),

    -- STRIPE FEES
    ('USD/STRIPE Credit Card Fee', 'payment', 'processing', 2.9, 0.00, 'USD', 'CREDIT_CARD', 'STRIPE'),
    ('USD/STRIPE Debit Card Fee', 'payment', 'processing', 2.9, 0.00, 'USD', 'DEBIT_CARD', 'STRIPE'),
    ('USD/STRIPE SEPA Fee', 'payment', 'processing', 1.4, 1.00, 'USD', 'SEPA', 'STRIPE'),
    ('EUR/STRIPE Credit Card Fee', 'payment', 'processing', 2.9, 0.00, 'EUR', 'CREDIT_CARD', 'STRIPE'),
    ('EUR/STRIPE Debit Card Fee', 'payment', 'processing', 2.9, 0.00, 'EUR', 'DEBIT_CARD', 'STRIPE'),
    ('EUR/STRIPE SEPA Fee', 'payment', 'processing', 1.4, 1.00, 'EUR', 'SEPA', 'STRIPE'),

    -- PAYPAL FEES
    ('USD/PAYPAL Payment Fee', 'payment', 'processing', 3.4, 0.30, 'USD', 'PAYPAL', 'PAYPAL'),
    ('EUR/PAYPAL Payment Fee', 'payment', 'processing', 3.4, 0.30, 'EUR', 'PAYPAL', 'PAYPAL'),

    -- ORANGE FEES
    ('XOF/ORANGE Mobile Money Fee', 'payment', 'processing', 2, 66.00, 'XOF', 'MOBILE_MONEY', 'ORANGE'),

    -- MTN FEES
    ('XOF/MTN Mobile Money Fee', 'payment', 'processing', 2, 66.00, 'XOF', 'MOBILE_MONEY', 'MTN'),
    ('GHS/MTN Mobile Money Fee', 'payment', 'processing', 2, 66.00, 'GHS', 'MOBILE_MONEY', 'MTN'),

    -- WAVE FEES
    ('XOF/WAVE Mobile Money Fee', 'payment', 'processing', 2.9, 66.00, 'XOF', 'MOBILE_MONEY', 'WAVE'),

    -- ECOBANK FEES
    ('USD/ECOBANK Bank Transfer Fee', 'payment', 'processing', 2.5, 1.00, 'USD', 'BANK_TRANSFER', 'ECOBANK'),
    ('XOF/ECOBANK Bank Transfer Fee', 'payment', 'processing', 2.5, 256.00, 'XOF', 'BANK_TRANSFER', 'ECOBANK'),
    ('GHS/ECOBANK Bank Transfer Fee', 'payment', 'processing', 2.5, 20.00, 'GHS', 'BANK_TRANSFER', 'ECOBANK'),
    
    -- LOMI FEES
    ('XOF/LOMI STANDARD FEE', 'payment', 'processing', 3.3, 56.00, 'XOF', 'CASH', 'LOMI'),
    ('XOF/LOMI COMMERCE FEE', 'payment', 'processing', 2.9, 0.00, 'XOF', 'E_WALLET', 'LOMI'),

    -- PARTNER FEES
    ('USD/PARTNER Payment Fee', 'payment', 'processing', 2.9, 1.2, 'USD', 'E_WALLET', 'PARTNER'),
    ('EUR/PARTNER Payment Fee', 'payment', 'processing', 2.9, 1.2, 'EUR', 'E_WALLET', 'PARTNER'),
    ('XOF/PARTNER Payout Fee', 'payout', 'processing', 2.9, 66.00, 'XOF', 'E_WALLET', 'PARTNER'),
    ('GHS/PARTNER Payout Fee', 'payout', 'processing', 2.9, 22.00, 'GHS', 'E_WALLET', 'PARTNER'),

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

    ('USD Payout Processing Fee', 'payout', 'processing', 2.0, 0.50, 'USD', NULL, NULL),
    ('EUR Payout Processing Fee', 'payout', 'processing', 1.8, 0.40, 'EUR', NULL, NULL),
    ('XOF Payout Processing Fee', 'payout', 'processing', 2.2, 0.00, 'XOF', NULL, NULL),
    ('GHS Payout Processing Fee', 'payout', 'processing', 2.1, 0.00, 'GHS', NULL, NULL);


-- transactions table
INSERT INTO transactions (merchant_id, organization_id, customer_id, transaction_type, status, description, reference_id, metadata, gross_amount, fee_amount, net_amount, fee_reference, currency_code, provider_code, payment_method_code)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', (SELECT customer_id FROM customers WHERE email = 'fatou@example.com'), 'payment', 'completed', 'Premium Ledger Subscription', 'REF001', '{"product": "Premium Ledger"}', 9999.00, 299.97, 9699.03, 'XOF/ORANGE Mobile Money Fee', 'XOF', 'ORANGE', 'MOBILE_MONEY'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', (SELECT customer_id FROM customers WHERE email = 'jane@example.com'), 'payment', 'completed', 'Enterprise Comms Subscription', 'REF002', '{"product": "Enterprise Comms"}', 199.99, 5.80, 194.19, 'USD/STRIPE Credit Card Fee', 'USD', 'STRIPE', 'CREDIT_CARD');

-- recurring transactions table
INSERT INTO recurring_transactions (merchant_id, organization_id, amount, currency_code, payment_method_code, provider_code, payment_type, frequency, start_date, end_date, next_payment_date, status, total_cycles, retry_payment_every, total_retries, failed_payment_action, email_notifications, charge_immediately, follow_up_subscriber, description, is_active)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 9999.00, 'XOF', 'MOBILE_MONEY', 'ORANGE', 'subscription', 'monthly', CURRENT_DATE, CURRENT_DATE + INTERVAL '1 year', CURRENT_DATE + INTERVAL '1 month', 'active', 12, 3, 3, 'cancel', '{"payment_success": true, "payment_failed": true}', true, true, 'Premium Ledger Monthly Subscription', true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 199.99, 'USD', 'CREDIT_CARD', 'STRIPE', 'subscription', 'monthly', CURRENT_DATE, CURRENT_DATE + INTERVAL '1 year', CURRENT_DATE + INTERVAL '1 month', 'active', 12, 3, 3, 'cancel', '{"payment_success": true, "payment_failed": true}', true, true, 'Enterprise Comms Monthly Subscription', true);

-- payouts table
INSERT INTO payouts (account_id, organization_id, amount, currency_code, payout_method, status)
VALUES
  ((SELECT account_id FROM accounts WHERE merchant_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' LIMIT 1), '11111111-1111-1111-1111-111111111111', 5000.00, 'XOF', 'bank_transfer', 'completed'),
  ((SELECT account_id FROM accounts WHERE merchant_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' LIMIT 1), '22222222-2222-2222-2222-222222222222', 10000.00, 'USD', 'bank_transfer', 'completed');

-- entries table
INSERT INTO entries (account_id, transaction_id, transfer_id, internal_transfer_id, payout_id, amount, entry_type)
VALUES
  ((SELECT account_id FROM accounts WHERE merchant_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' LIMIT 1), (SELECT transaction_id FROM transactions WHERE reference_id = 'REF001'), NULL, NULL, NULL, 9699.03, 'credit'),
  ((SELECT account_id FROM accounts WHERE merchant_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' LIMIT 1), (SELECT transaction_id FROM transactions WHERE reference_id = 'REF002'), NULL, NULL, NULL, 194.19, 'credit');

-- api keys table
INSERT INTO api_keys (organization_id, api_key, name, is_active, expiration_date, last_used_at, created_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'ak_live_africanledger_123456789', 'Production API Key', true, CURRENT_DATE + INTERVAL '1 year', NOW(), NOW()),
  ('22222222-2222-2222-2222-222222222222', 'ak_live_telnyx_987654321', 'Production API Key', true, CURRENT_DATE + INTERVAL '1 year', NOW(), NOW());

-- api usage tracking table
INSERT INTO api_usage (api_key_id, endpoint, request_count, last_request_at, created_at)
VALUES
  ((SELECT key_id FROM api_keys WHERE api_key = 'ak_live_africanledger_123456789'), '/v1/transactions', 100, NOW(), NOW()),
  ((SELECT key_id FROM api_keys WHERE api_key = 'ak_live_telnyx_987654321'), '/v1/transactions', 500, NOW(), NOW());

-- webhooks table
INSERT INTO webhooks (merchant_id, url, events, secret, is_active, created_at, updated_at, last_triggered_at)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'https://africanledger.com/webhooks', ARRAY['payment.success', 'payment.failed'], 'whsec_africanledger_123456789', true, NOW(), NOW(), NOW()),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'https://telnyx.com/webhooks', ARRAY['payment.success', 'payment.failed'], 'whsec_telnyx_987654321', true, NOW(), NOW(), NOW());

-- logs table
INSERT INTO logs (merchant_id, action, details, severity, created_at)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'payment_received', '{"amount": 9999.00, "currency": "XOF"}', 'INFO', NOW()),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'payment_received', '{"amount": 199.99, "currency": "USD"}', 'INFO', NOW());

-- platform invoices table
INSERT INTO invoices (merchant_id, organization_id, amount, description, currency_code, due_date, status, created_at)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 299.97, 'Monthly platform fee', 'XOF', CURRENT_DATE + INTERVAL '30 days', 'sent', NOW()),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 5.80, 'Monthly platform fee', 'USD', CURRENT_DATE + INTERVAL '30 days', 'sent', NOW());

-- customer invoices table
INSERT INTO customer_invoices (merchant_id, organization_id, customer_id, amount, description, currency_code, due_date, status, created_at)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', (SELECT customer_id FROM customers WHERE email = 'fatou@example.com'), 9999.00, 'Premium Ledger Subscription', 'XOF', CURRENT_DATE + INTERVAL '30 days', 'sent', NOW()),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', (SELECT customer_id FROM customers WHERE email = 'jane@example.com'), 199.99, 'Enterprise Comms Subscription', 'USD', CURRENT_DATE + INTERVAL '30 days', 'sent', NOW());

-- notifications table
INSERT INTO notifications (notification_id, merchant_id, organization_id, type, message, is_read, created_at)
VALUES
  (uuid_generate_v4(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'payment_success', 'Payment of 9999.00 XOF completed for REF001', false, NOW()),
  (uuid_generate_v4(), 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'payment_success', 'Payment of 199.99 USD completed for REF002', false, NOW());

-- disputes table
INSERT INTO disputes (dispute_id, transaction_id, customer_id, amount, fee_amount, reason, metadata, status, currency_code, resolution_date, resolution_details, created_at)
VALUES
  (uuid_generate_v4(), (SELECT transaction_id FROM transactions WHERE reference_id = 'REF001'), (SELECT customer_id FROM customers WHERE email = 'fatou@example.com'), 9999.00, 50.00, 'Service not received', '{"dispute_category": "quality"}', 'open', 'XOF', NULL, NULL, NOW()),
  (uuid_generate_v4(), (SELECT transaction_id FROM transactions WHERE reference_id = 'REF002'), (SELECT customer_id FROM customers WHERE email = 'jane@example.com'), 199.99, 10.00, 'Unauthorized transaction', '{"dispute_category": "fraud"}', 'under_review', 'USD', NULL, NULL, NOW());

-- metrics table
INSERT INTO metrics (metric_id, entity_type, metric_name, metric_value, metric_date, created_at, updated_at)
VALUES
  (uuid_generate_v4(), 'merchant', 'total_transactions', 100, CURRENT_DATE, NOW(), NOW()),
  (uuid_generate_v4(), 'merchant', 'total_revenue', 999900.00, CURRENT_DATE, NOW(), NOW()),
  (uuid_generate_v4(), 'organization', 'total_customers', 1000, CURRENT_DATE, NOW(), NOW()),
  (uuid_generate_v4(), 'organization', 'total_revenue', 5000000.00, CURRENT_DATE, NOW(), NOW()),
  (uuid_generate_v4(), 'platform', 'total_merchants', 600, CURRENT_DATE, NOW(), NOW()),
  (uuid_generate_v4(), 'platform', 'total_transactions', 25000, CURRENT_DATE, NOW(), NOW());

-- merchant preferences
INSERT INTO merchant_preferences (merchant_id, theme, language, notification_settings)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'dark', 'fr', '{"email": true, "sms": false}'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'light', 'en', '{"email": true, "sms": true}');

-- merchant sessions
INSERT INTO merchant_sessions (merchant_id, session_data, expires_at)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '{"user_agent": "Mozilla/5.0"}', NOW() + INTERVAL '1 day'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '{"user_agent": "Chrome/93.0.4577.82"}', NOW() + INTERVAL '1 day');

-- ui configuration
INSERT INTO ui_configuration (config_name, config_value)
VALUES
  ('dashboard_layout', '{"widgets": ["revenue", "transactions", "customers"]}'),
  ('report_settings', '{"default_currency": "USD", "date_range": "last_30_days"}');

-- merchant feedback
INSERT INTO merchant_feedback (merchant_id, feedback_type, message)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bug', 'The dashboard is not loading properly'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'feature_request', 'Please add support for more payment methods');

-- customer feedback
INSERT INTO customer_feedback (customer_id, feedback_type, message)
VALUES
  ((SELECT customer_id FROM customers WHERE email = 'fatou@example.com'), 'complaint', 'The payment failed but I was still charged'),
  ((SELECT customer_id FROM customers WHERE email = 'jane@example.com'), 'suggestion', 'The checkout process could be more user-friendly');

-- support tickets
INSERT INTO support_tickets (merchant_id, customer_id, message)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (SELECT customer_id FROM customers WHERE email = 'fatou@example.com'), 'I need help with a refund request'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', (SELECT customer_id FROM customers WHERE email = 'jane@example.com'), 'I have a question about my subscription');


  -- Customer Subscriptions table
INSERT INTO customer_subscriptions (customer_id, product_id, status, start_date, end_date, next_billing_date, billing_frequency, amount, currency_code, metadata)
VALUES
  ((SELECT customer_id FROM customers WHERE email = 'fatou@example.com'),
   (SELECT product_id FROM merchant_products WHERE name = 'Premium Ledger'),
   'active',
   CURRENT_DATE,
   CURRENT_DATE + INTERVAL '1 year',
   CURRENT_DATE + INTERVAL '1 month',
   'monthly',
   9999.00,
   'XOF',
   '{"auto_renew": true}'),
  ((SELECT customer_id FROM customers WHERE email = 'jane@example.com'),
   (SELECT product_id FROM merchant_products WHERE name = 'Enterprise Comms'),
   'active',
   CURRENT_DATE,
   CURRENT_DATE + INTERVAL '1 year',
   CURRENT_DATE + INTERVAL '1 month',
   'monthly',
   199.99,
   'USD',
   '{"auto_renew": true}');

-- Internal Transfers table
INSERT INTO internal_transfers (from_account_id, to_main_account_id, amount, currency_code, status)
VALUES
  ((SELECT account_id FROM accounts WHERE merchant_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' LIMIT 1),
   (SELECT main_account_id FROM main_accounts WHERE merchant_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' LIMIT 1),
   5000.00,
   'XOF',
   'completed'),
  ((SELECT account_id FROM accounts WHERE merchant_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' LIMIT 1),
   (SELECT main_account_id FROM main_accounts WHERE merchant_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' LIMIT 1),
   10000.00,
   'USD',
   'completed');

-- Refunds table
INSERT INTO refunds (transaction_id, amount, refunded_amount, fee_amount, reason, metadata, status)
VALUES
  ((SELECT transaction_id FROM transactions WHERE reference_id = 'REF001'),
   9999.00,
   9699.03,
   299.97,
   'Customer request',
   '{"refund_method": "original_payment_method"}',
   'completed'),
  ((SELECT transaction_id FROM transactions WHERE reference_id = 'REF002'),
   199.99,
   194.19,
   5.80,
   'Product not as described',
   '{"refund_method": "original_payment_method"}',
   'pending');

-- [EXPERIMENTAL & NOT USED] Transfers table
INSERT INTO transfers (from_account_id, to_account_id, transaction_id, amount, status)
VALUES
  ((SELECT account_id FROM accounts WHERE merchant_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' LIMIT 1),
   (SELECT account_id FROM accounts WHERE merchant_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' LIMIT 1),
   (SELECT transaction_id FROM transactions WHERE reference_id = 'REF001'),
   5000.00,
   'completed'),
  ((SELECT account_id FROM accounts WHERE merchant_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' LIMIT 1),
   (SELECT account_id FROM accounts WHERE merchant_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' LIMIT 1),
   (SELECT transaction_id FROM transactions WHERE reference_id = 'REF002'),
   100.00,
   'pending');