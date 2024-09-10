-- Insert currencies
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

-- Insert providers
INSERT INTO providers (provider_code, is_active) VALUES
    ('ORANGE', true),
    ('WAVE', true),
    ('ECOBANK', true),
    ('MTN', true),
    ('STRIPE', true),
    ('PAYPAL', true),
    ('LOMI', true),
    ('PARTNER', true);

-- Insert payment methods
INSERT INTO payment_methods (payment_method_code, provider_code) VALUES
    ('CREDIT_CARD', 'STRIPE'),
    ('DEBIT_CARD', 'STRIPE'),
    ('MOBILE_MONEY', 'ORANGE'),
    ('E_WALLET', 'WAVE'),
    ('QR_CODE', 'WAVE'),
    ('MOBILE_MONEY', 'MTN'),
    ('BANK_TRANSFER', 'ECOBANK'),
    ('IDEAL', 'STRIPE'),
    ('SEPA', 'STRIPE'),
    ('PAYPAL', 'PAYPAL'),
    ('APPLE_PAY', 'STRIPE'),
    ('GOOGLE_PAY', 'STRIPE'),
    ('CASH', 'LOMI'),
    ('SEPA', 'LOMI'),
    ('COUNTER', 'LOMI'),
    ('CRYPTOCURRENCY', 'PARTNER'),
    ('USSD', 'PARTNER'),
    ('E_WALLET', 'PARTNER'),
    ('QR_CODE', 'PARTNER'),
    ('BANK_TRANSFER', 'PARTNER'),

-- Insert fees
INSERT INTO fees (name, transaction_type, fee_type, percentage, currency_code, payment_method_code) VALUES
    ('USD Credit Card Payment Fee', 'payment', 'processing', 2.9, 'USD', 'CREDIT_CARD'),
    ('USD Debit Card Payment Fee', 'payment', 'processing', 2.9, 'USD', 'DEBIT_CARD'),
    ('USD Mobile Money Payment Fee', 'payment', 'processing', 2.9, 'USD', 'MOBILE_MONEY'),
    ('USD Bank Transfer Payment Fee', 'payment', 'processing', 2.9, 'USD', 'BANK_TRANSFER'),
    ('EUR SEPA Payment Fee', 'payment', 'processing', 2.9, 'EUR', 'SEPA'),
    ('XOF Mobile Money Payment Fee', 'payment', 'processing', 1.2, 'XOF', 'MOBILE_MONEY'),
    ('GHS Mobile Money Payment Fee', 'payment', 'processing', 1.5, 'GHS', 'MOBILE_MONEY'),
    ('USD PayPal Payment Fee', 'payment', 'processing', 3.5, 'USD', 'PAYPAL'),
    ('USD Refund Processing Fee', 'refund', 'processing', 1.5, 'USD', NULL),
    ('EUR Refund Processing Fee', 'refund', 'processing', 1.2, 'EUR', NULL),
    ('USD Payout Processing Fee', 'payout', 'processing', 2.0, 'USD', NULL),
    ('EUR Payout Processing Fee', 'payout', 'processing', 1.8, 'EUR', NULL),
    ('Currency Conversion Fee', 'payment', 'conversion', 1.5, 'USD', NULL),
    ('Chargeback Fee', 'payment', 'chargeback', 15.00, 'USD', NULL),
    ('Recurring Payment Setup Fee', 'payment', 'recurring_setup', 2.0, 'USD', NULL),
    ('Express Payout Fee', 'payout', 'express', 1.0, 'USD', NULL),
    ('Pro Tier Subscription Fee', 'subscription', 'monthly', 29.99, 'USD', NULL),
    ('High Volume Discount', 'payment', 'volume_discount', -0.5, 'USD', NULL);

    ('USD Payment Processing Fee', 'payment', 'processing', 2.9, 'USD'),
    ('USD Payment Service Fee', 'payment', 'service', 0.30, 'USD'),
    ('EUR Payment Processing Fee', 'payment', 'processing', 2.4, 'EUR'),
    ('EUR Payment Service Fee', 'payment', 'service', 0.25, 'EUR'),
    ('XOF Payment Processing Fee', 'payment', 'processing', 3.5, 'XOF'),
    ('XOF Payment Service Fee', 'payment', 'service', 0.40, 'XOF'),
    ('GHS Payment Processing Fee', 'payment', 'processing', 3.2, 'GHS'),
    ('GHS Payment Service Fee', 'payment', 'service', 0.35, 'GHS'),
    ('KES Payment Processing Fee', 'payment', 'processing', 3.0, 'KES'),
    ('KES Payment Service Fee', 'payment', 'service', 0.30, 'KES'),
    ('MRO Payment Processing Fee', 'payment', 'processing', 2.8, 'MRO'),
    ('MRO Payment Service Fee', 'payment', 'service', 0.25, 'MRO'),
    ('USD Refund Processing Fee', 'refund', 'processing', 1.5, 'USD'),
    ('EUR Refund Processing Fee', 'refund', 'processing', 1.2, 'EUR'),
    ('XOF Refund Processing Fee', 'refund', 'processing', 1.8, 'XOF'),
    ('GHS Refund Processing Fee', 'refund', 'processing', 1.6, 'GHS'),
    ('KES Refund Processing Fee', 'refund', 'processing', 1.5, 'KES'),
    ('MRO Refund Processing Fee', 'refund', 'processing', 1.4, 'MRO'),
    ('USD Transfer Fee', 'transfer', 'service', 1.0, 'USD'),
    ('EUR Transfer Fee', 'transfer', 'service', 0.8, 'EUR'),
    ('XOF Transfer Fee', 'transfer', 'service', 1.2, 'XOF'),
    ('GHS Transfer Fee', 'transfer', 'service', 1.1, 'GHS'),
    ('KES Transfer Fee', 'transfer', 'service', 1.0, 'KES'),
    ('MRO Transfer Fee', 'transfer', 'service', 0.9, 'MRO'),
    ('USD Payout Processing Fee', 'payout', 'processing', 2.0, 'USD'),
    ('USD Payout Service Fee', 'payout', 'service', 0.50, 'USD'),
    ('EUR Payout Processing Fee', 'payout', 'processing', 1.8, 'EUR'),
    ('EUR Payout Service Fee', 'payout', 'service', 0.40, 'EUR'),
    ('XOF Payout Processing Fee', 'payout', 'processing', 2.2, 'XOF'),
    ('XOF Payout Service Fee', 'payout', 'service', 0.60, 'XOF'),
    ('GHS Payout Processing Fee', 'payout', 'processing', 2.1, 'GHS'),
    ('GHS Payout Service Fee', 'payout', 'service', 0.55, 'GHS'),
    ('KES Payout Processing Fee', 'payout', 'processing', 2.0, 'KES'),
    ('KES Payout Service Fee', 'payout', 'service', 0.50, 'KES'),
    ('MRO Payout Processing Fee', 'payout', 'processing', 1.9, 'MRO'),
    ('MRO Payout Service Fee', 'payout', 'service', 0.45, 'MRO');
    ('Currency Conversion Fee', 'payment', 'conversion', 1.5, 'USD'),
    ('Chargeback Fee', 'payment', 'chargeback', 15.00, 'USD'),
    ('Recurring Payment Setup Fee', 'payment', 'recurring_setup', 2.0, 'USD'),
    ('Express Payout Fee', 'payout', 'express', 1.0, 'USD'),
    ('Pro Tier Subscription Fee', 'subscription', 'monthly', 29.99, 'USD'),
    ('High Volume Discount', 'payment', 'volume_discount', -0.5, 'USD');

    -- Insert merchants
INSERT INTO merchants (name, email, phone_number, is_admin, onboarded, verified, country, metadata, avatar_url, preferred_language)
VALUES
    ('John Doe', 'john@example.com', '+1234567890', false, true, true, 'USA', '{"company_size": "small"}', 'https://example.com/avatar1.jpg', 'en'),
    ('Jane Smith', 'jane@example.com', '+2345678901', true, true, true, 'UK', '{"company_size": "medium"}', 'https://example.com/avatar2.jpg', 'en'),
    ('Kofi Annan', 'kofi@example.com', '+2337654321', false, true, true, 'Ghana', '{"company_size": "large"}', 'https://example.com/avatar3.jpg', 'en');

-- Insert organizations
INSERT INTO organizations (name, email, phone_number, tax_id, country, city, address, postal_code, status, kyc_status, industry, website_url)
VALUES
    ('Tech Innovators', 'info@techinnovators.com', '+1987654321', 'TI123456', 'USA', 'San Francisco', '123 Tech St', '94105', 'active', 'approved', 'Technology', 'https://techinnovators.com'),
    ('Global Traders', 'contact@globaltraders.com', '+44123456789', 'GT789012', 'UK', 'London', '456 Trade Ave', 'EC1A 1BB', 'active', 'pending', 'Finance', 'https://globaltraders.com'),
    ('AfriTech Solutions', 'hello@afritech.com', '+233123456789', 'AT345678', 'Ghana', 'Accra', '789 Innovation Rd', '00233', 'active', 'approved', 'Technology', 'https://afritech.com');

-- Insert organization KYC documents
INSERT INTO organization_kyc_documents (organization_id, document_type, document_url, status)
VALUES
    ((SELECT organization_id FROM organizations WHERE name = 'Tech Innovators'), 'business_registration', 'https://example.com/docs/ti_registration.pdf', 'approved'),
    ((SELECT organization_id FROM organizations WHERE name = 'Tech Innovators'), 'tax_certificate', 'https://example.com/docs/ti_tax.pdf', 'approved'),
    ((SELECT organization_id FROM organizations WHERE name = 'Global Traders'), 'business_registration', 'https://example.com/docs/gt_registration.pdf', 'pending'),
    ((SELECT organization_id FROM organizations WHERE name = 'AfriTech Solutions'), 'business_registration', 'https://example.com/docs/at_registration.pdf', 'approved'),
    ((SELECT organization_id FROM organizations WHERE name = 'AfriTech Solutions'), 'tax_certificate', 'https://example.com/docs/at_tax.pdf', 'approved');

-- Insert merchant-organization links
INSERT INTO merchant_organization_links (merchant_id, organization_id, role)
VALUES
    ((SELECT merchant_id FROM merchants WHERE email = 'john@example.com'), (SELECT organization_id FROM organizations WHERE name = 'Tech Innovators'), 'admin'),
    ((SELECT merchant_id FROM merchants WHERE email = 'jane@example.com'), (SELECT organization_id FROM organizations WHERE name = 'Global Traders'), 'admin'),
    ((SELECT merchant_id FROM merchants WHERE email = 'kofi@example.com'), (SELECT organization_id FROM organizations WHERE name = 'AfriTech Solutions'), 'admin');

-- Insert organization providers
INSERT INTO organization_providers (organization_id, provider_code, is_connected, country_code, phone_number)
VALUES
    ((SELECT organization_id FROM organizations WHERE name = 'Tech Innovators'), 'STRIPE', true, '+1987654321'),
    ((SELECT organization_id FROM organizations WHERE name = 'Global Traders'), 'PAYPAL', true, '+44123456789'),
    ((SELECT organization_id FROM organizations WHERE name = 'AfriTech Solutions'), 'WAVE', false, '+233123456789');

-- Insert accounts
INSERT INTO accounts (merchant_id, balance, provider_code, currency_code)
VALUES
    ((SELECT merchant_id FROM merchants WHERE email = 'john@example.com'), 1000.00, 'STRIPE', 'XOF'),
    ((SELECT merchant_id FROM merchants WHERE email = 'john@example.com'), 555.00, 'WAVE', 'XOF'),
    ((SELECT merchant_id FROM merchants WHERE email = 'john@example.com'), 10000.00, 'ORANGE', 'XOF'),
    ((SELECT merchant_id FROM merchants WHERE email = 'jane@example.com'), 15000.00, 'WAVE', 'XOF'),
    ((SELECT merchant_id FROM merchants WHERE email = 'kofi@example.com'), 5000.00, 'MTN', 'GHS');
    ((SELECT merchant_id FROM merchants WHERE email = 'kofi@example.com'), 10000.00, 'ECOBANK', 'GHS');


-- Insert main accounts
INSERT INTO main_accounts (merchant_id, balance, currency_code)
VALUES
    ((SELECT merchant_id FROM merchants WHERE email = 'john@example.com'), 1555.00, 'XOF'),
    ((SELECT merchant_id FROM merchants WHERE email = 'jane@example.com'), 0, 'XOF'),
    ((SELECT merchant_id FROM merchants WHERE email = 'kofi@example.com'), 15000.00, 'GHS');

-- Insert customers
INSERT INTO customers (merchant_id, organization_id, name, email, phone_number, metadata)
VALUES
    ((SELECT merchant_id FROM merchants WHERE email = 'john@example.com'), (SELECT organization_id FROM organizations WHERE name = 'Tech Innovators'), 'Alice Johnson', 'alice@example.com', '+1122334455', '{"loyalty_points": 100}'),
    ((SELECT merchant_id FROM merchants WHERE email = 'jane@example.com'), (SELECT organization_id FROM organizations WHERE name = 'Global Traders'), 'Bob Williams', 'bob@example.com', '+2233445566', '{"loyalty_points": 50}'),
    ((SELECT merchant_id FROM merchants WHERE email = 'kofi@example.com'), (SELECT organization_id FROM organizations WHERE name = 'AfriTech Solutions'), 'Kwame Nkrumah', 'kwame@example.com', '+233987654321', '{"loyalty_points": 75}');

-- Insert transactions
INSERT INTO transactions (merchant_id, organization_id, customer_id, transaction_type, status, description, amount, currency_code, payment_method_code)
VALUES
    ((SELECT merchant_id FROM merchants WHERE email = 'john@example.com'), (SELECT organization_id FROM organizations WHERE name = 'Tech Innovators'), (SELECT customer_id FROM customers WHERE email = 'alice@example.com'), 'payment', 'completed', 'Product purchase', 100.00, 'USD', 'CREDIT_CARD'),
    ((SELECT merchant_id FROM merchants WHERE email = 'jane@example.com'), (SELECT organization_id FROM organizations WHERE name = 'Global Traders'), (SELECT customer_id FROM customers WHERE email = 'bob@example.com'), 'payment', 'completed', 'Service fee', 50.00, 'GBP', 'BANK_TRANSFER'),
    ((SELECT merchant_id FROM merchants WHERE email = 'kofi@example.com'), (SELECT organization_id FROM organizations WHERE name = 'AfriTech Solutions'), (SELECT customer_id FROM customers WHERE email = 'kwame@example.com'), 'payment', 'completed', 'Subscription', 20.00, 'GHS', 'MOBILE_MONEY');

-- Insert recurring payments
INSERT INTO recurring_payments (merchant_id, organization_id, amount, currency_code, payment_method_code, payment_type, frequency, start_date, description)
VALUES
    ((SELECT merchant_id FROM merchants WHERE email = 'john@example.com'), (SELECT organization_id FROM organizations WHERE name = 'Tech Innovators'), 19.99, 'USD', 'CREDIT_CARD', 'subscription', 'monthly', '2023-01-01', 'Premium Plan'),
    ((SELECT merchant_id FROM merchants WHERE email = 'jane@example.com'), (SELECT organization_id FROM organizations WHERE name = 'Global Traders'), 99.99, 'GBP', 'BANK_TRANSFER', 'subscription', 'yearly', '2023-02-01', 'Enterprise Plan'),
    ((SELECT merchant_id FROM merchants WHERE email = 'kofi@example.com'), (SELECT organization_id FROM organizations WHERE name = 'AfriTech Solutions'), 5.99, 'GHS', 'MOBILE_MONEY', 'subscription', 'monthly', '2023-03-01', 'Basic Plan');

-- Insert refunds
INSERT INTO refunds (transaction_id, amount, reason, status)
VALUES
    ((SELECT transaction_id FROM transactions WHERE amount = 50.00), 50.00, 'Customer dissatisfaction', 'completed');

-- Insert entries
INSERT INTO entries (account_id, transaction_id, amount, entry_type)
VALUES
    ((SELECT account_id FROM accounts WHERE merchant_id = (SELECT merchant_id FROM merchants WHERE email = 'john@example.com')), (SELECT transaction_id FROM transactions WHERE amount = 100.00), 100.00, 'credit'),
    ((SELECT account_id FROM accounts WHERE merchant_id = (SELECT merchant_id FROM merchants WHERE email = 'jane@example.com')), (SELECT transaction_id FROM transactions WHERE amount = 50.00), 50.00, 'credit'),
    ((SELECT account_id FROM accounts WHERE merchant_id = (SELECT merchant_id FROM merchants WHERE email = 'kofi@example.com')), (SELECT transaction_id FROM transactions WHERE amount = 20.00), 20.00, 'credit');

-- Insert internal transfers
INSERT INTO internal_transfers (from_account_id, to_main_account_id, amount, currency_code, status)
VALUES
    ((SELECT account_id FROM accounts WHERE merchant_id = (SELECT merchant_id FROM merchants WHERE email = 'john@example.com')),
     (SELECT main_account_id FROM main_accounts WHERE merchant_id = (SELECT merchant_id FROM merchants WHERE email = 'john@example.com')),
     555.00, 'XOF', 'completed');

-- Insert payouts
INSERT INTO payouts (transaction_id, account_id, amount, currency_code, destination, status)
VALUES
    ((SELECT transaction_id FROM transactions WHERE amount = 100.00),
     (SELECT account_id FROM accounts WHERE merchant_id = (SELECT merchant_id FROM merchants WHERE email = 'john@example.com')),
     1000.00, 'XOF', '+1987654321', 'completed');

-- Insert API keys
INSERT INTO api_keys (merchant_id, organization_id, api_key)
VALUES
    ((SELECT merchant_id FROM merchants WHERE email = 'john@example.com'), (SELECT organization_id FROM organizations WHERE name = 'Tech Innovators'), 'sk_test_abcdefghijklmnopqrstuvwxyz123456'),
    ((SELECT merchant_id FROM merchants WHERE email = 'jane@example.com'), (SELECT organization_id FROM organizations WHERE name = 'Global Traders'), 'sk_test_bcdefghijklmnopqrstuvwxyz234567'),
    ((SELECT merchant_id FROM merchants WHERE email = 'kofi@example.com'), (SELECT organization_id FROM organizations WHERE name = 'AfriTech Solutions'), 'sk_test_cdefghijklmnopqrstuvwxyz345678');

-- Insert webhooks
INSERT INTO webhooks (merchant_id, url, events, secret)
VALUES
    ((SELECT merchant_id FROM merchants WHERE email = 'john@example.com'), 'https://techinnovators.com/webhook', ARRAY['payment.success', 'payment.failed'], 'whsec_abcdefghijklmnopqrstuvwxyz123456'),
    ((SELECT merchant_id FROM merchants WHERE email = 'jane@example.com'), 'https://globaltraders.com/webhook', ARRAY['payout.success', 'payout.failed'], 'whsec_bcdefghijklmnopqrstuvwxyz234567'),
    ((SELECT merchant_id FROM merchants WHERE email = 'kofi@example.com'), 'https://afritech.com/webhook', ARRAY['refund.success', 'refund.failed'], 'whsec_cdefghijklmnopqrstuvwxyz345678');

-- Insert logs
INSERT INTO logs (merchant_id, action, details, severity)
VALUES
    ((SELECT merchant_id FROM merchants WHERE email = 'john@example.com'), 'API_REQUEST', '{"endpoint": "/v1/payments", "method": "POST"}', 'INFO'),
    ((SELECT merchant_id FROM merchants WHERE email = 'jane@example.com'), 'WEBHOOK_DELIVERY', '{"event": "payment.success", "attempt": 1}', 'INFO'),
    ((SELECT merchant_id FROM merchants WHERE email = 'kofi@example.com'), 'AUTHENTICATION_FAILED', '{"ip_address": "192.168.1.1", "reason": "Invalid API key"}', 'ERROR');

-- Insert invoices
INSERT INTO invoices (merchant_id, organization_id, amount, description, currency_code, due_date, status)
VALUES
    ((SELECT merchant_id FROM merchants WHERE email = 'john@example.com'), (SELECT organization_id FROM organizations WHERE name = 'Tech Innovators'), 1000.00, 'Monthly service fee', 'XOF', '2023-05-01', 'paid'),
    ((SELECT merchant_id FROM merchants WHERE email = 'jane@example.com'), (SELECT organization_id FROM organizations WHERE name = 'Global Traders'), 5000.00, 'Monthly service fee', 'XOF', '2023-06-01', 'paid'),
    ((SELECT merchant_id FROM merchants WHERE email = 'kofi@example.com'), (SELECT organization_id FROM organizations WHERE name = 'AfriTech Solutions'), 500.00, 'Monthly service fee', 'GHS', '2023-07-01', 'paid');

-- Insert metrics
INSERT INTO metrics (name, value, labels, organization_id)
VALUES
    ('total_transactions', 1000, '{"currency": "USD"}', (SELECT organization_id FROM organizations WHERE name = 'Tech Innovators')),
    ('average_transaction_value', 75.50, '{"currency": "GBP"}', (SELECT organization_id FROM organizations WHERE name = 'Global Traders')),
    ('active_customers', 500, '{"country": "Ghana"}', (SELECT organization_id FROM organizations WHERE name = 'AfriTech Solutions'));

-- Insert notifications
INSERT INTO notifications (merchant_id, organization_id, type, message, is_read)
VALUES
    ((SELECT merchant_id FROM merchants WHERE email = 'john@example.com'), (SELECT organization_id FROM organizations WHERE name = 'Tech Innovators'), 'PAYMENT_RECEIVED', 'You have received a payment of $100.00', false),
    ((SELECT merchant_id FROM merchants WHERE email = 'jane@example.com'), (SELECT organization_id FROM organizations WHERE name = 'Global Traders'), 'PAYOUT_COMPLETED', 'Your payout of £500.00 has been completed', false),
    ((SELECT merchant_id FROM merchants WHERE email = 'kofi@example.com'), (SELECT organization_id FROM organizations WHERE name = 'AfriTech Solutions'), 'KYC_APPROVED', 'Your KYC documents have been approved', true);

-- Insert disputes
INSERT INTO disputes (transaction_id, reason, status, amount, currency_code)
VALUES
    ((SELECT transaction_id FROM transactions WHERE amount = 100.00), 'Product not received', 'open', 100.00, 'USD'),
    ((SELECT transaction_id FROM transactions WHERE amount = 50.00), 'Unauthorized transaction', 'resolved', 50.00, 'GBP');