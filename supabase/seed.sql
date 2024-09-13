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
    ('BANK_TRANSFER', 'PARTNER'),
    ('CRYPTOCURRENCY', 'PARTNER'),
    ('USSD', 'PARTNER'),
    ('E_WALLET', 'PARTNER'),
    ('QR_CODE', 'PARTNER'),
    ('BANK_TRANSFER', 'PARTNER'),

-- Insert fees
INSERT INTO fees (name, transaction_type, fee_type, percentage, fixed_amount, currency_code, payment_method_code, provider_code) VALUES
    -- USD COMPANY FEES
    ('Enterprise Tier Monthly Subscription Fee', 'subscription', 'monthly', 0.0, 29.99, 'USD', NULL, NULL),
    ('Enterprise Tier Yearly Subscription Fee', 'subscription', 'yearly', 0.0, 299.99, 'USD', NULL, NULL),
    ('High Volume Discount', 'payment', 'volume_discount', -0.5, 0.00, 'USD', NULL, NULL),
    ('Referral Discount', 'payment', 'referral_discount', -0.5, 0.00, 'USD', NULL, NULL),
    -- EUR COMPANY FEES
    ('Enterprise Tier Monthly Subscription Fee', 'subscription', 'monthly', 0.0, 26.99, 'EUR', NULL, NULL),
    ('Enterprise Tier Yearly Subscription Fee', 'subscription', 'yearly', 0.0, 269.99, 'EUR', NULL, NULL),
    ('High Volume Discount', 'payment', 'volume_discount', -0.5, 0.00, 'EUR', NULL, NULL),
    ('Referral Discount', 'payment', 'referral_discount', -0.5, 0.00, 'EUR', NULL, NULL),
    -- XOF COMPANY FEES
    ('Enterprise Tier Monthly Subscription Fee', 'subscription', 'monthly', 0.0, 15000.00, 'XOF', NULL, NULL),
    ('Enterprise Tier Yearly Subscription Fee', 'subscription', 'yearly', 0.0, 150000.00, 'XOF', NULL, NULL),
    ('High Volume Discount', 'payment', 'volume_discount', -0.5, 0.00, 'XOF', NULL, NULL),
    ('Referral Discount', 'payment', 'referral_discount', -0.5, 0.00, 'XOF', NULL, NULL),
    -- GHS COMPANY FEES
    ('Enterprise Tier Monthly Subscription Fee', 'subscription', 'monthly', 0.0, 300.99, 'GHS', NULL, NULL),
    ('Enterprise Tier Yearly Subscription Fee', 'subscription', 'yearly', 0.0, 3000.00, 'GHS', NULL, NULL),
    ('High Volume Discount', 'payment', 'volume_discount', -0.5, 0.00, 'GHS', NULL, NULL),
    ('Referral Discount', 'payment', 'referral_discount', -0.5, 0.00, 'GHS', NULL, NULL),

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
    ('LOMI STANDARD FEE', 'payment', 'processing', 3.3, 56.00, 'XOF', 'CASH', 'LOMI'),
    ('LOMI COMMERCE FEE', 'payment', 'processing', 2.9, 0.00, 'XOF', 'E_WALLET', 'LOMI'),

    -- PARTNER FEES
    ('USD/PARTNER Payment Fee', 'payment', 'processing', 2.9, 1.2, 'USD', 'PARTNER', 'PARTNER'),
    ('EUR/PARTNER Payment Fee', 'payment', 'processing', 2.9, 1.2, 'EUR', 'PARTNER', 'PARTNER'),
    ('XOF/PARTNER Payout Fee', 'payout', 'processing', 2.9, 66.00, 'XOF', 'PARTNER', 'PARTNER'),
    ('GHS/PARTNER Payout Fee', 'payout', 'processing', 2.9, 22.00, 'GHS', 'PARTNER', 'PARTNER'),

    -- CURRENCY CONVERSION FEE
    ('USD/Currency Conversion Fee', 'payment', 'conversion', 1.5, 0.00, 'USD', NULL, NULL),
    ('EUR/Currency Conversion Fee', 'payment', 'conversion', 1.5, 0.00, 'EUR', NULL, NULL),
    ('XOF/Currency Conversion Fee', 'payment', 'conversion', 1.5, 0.00, 'XOF', NULL, NULL),
    ('GHS/Currency Conversion Fee', 'payment', 'conversion', 1.5, 0.00, 'GHS', NULL, NULL),

    -- CHARGEBACK FEE
    ('USD/Chargeback Fee', 'payment', 'chargeback', 0.0, 5.00, 'USD', NULL, NULL),
    ('EUR/Chargeback Fee', 'payment', 'chargeback', 0.0, 5.00, 'EUR', NULL, NULL),
    ('XOF/Chargeback Fee', 'payment', 'chargeback', 0.0, 5.00, 'XOF', NULL, NULL),
    ('GHS/Chargeback Fee', 'payment', 'chargeback', 0.0, 5.00, 'GHS', NULL, NULL),

    -- RECURRING PAYMENT SETUP FEE
    ('USD/Recurring Payment Setup Fee', 'payment', 'recurring_setup', 3.0, 0.0, 'USD', NULL, NULL),
    ('EUR/Recurring Payment Setup Fee', 'payment', 'recurring_setup', 3.0, 0.0, 'EUR', NULL, NULL),
    ('XOF/Recurring Payment Setup Fee', 'payment', 'recurring_setup', 3.0, 0.0, 'XOF', NULL, NULL),
    ('GHS/Recurring Payment Setup Fee', 'payment', 'recurring_setup', 3.0, 0.0, 'GHS', NULL, NULL),

    -- EXPRESS PAYOUT FEE
    ('USD/Express Payout Fee', 'payout', 'express', 0.0, 2.00, 'USD', NULL, NULL),
    ('EUR/Express Payout Fee', 'payout', 'express', 0.0, 2.00, 'EUR', NULL, NULL),
    ('XOF/Express Payout Fee', 'payout', 'express', 0.0, 2.00, 'XOF', NULL, NULL),
    ('GHS/Express Payout Fee', 'payout', 'express', 0.0, 2.00, 'GHS', NULL, NULL),

    -- REFUND FEES
    ('USD Refund Processing Fee', 'refund', 'processing', 1.5, 0.00, 'USD', NULL, NULL),
    ('EUR Refund Processing Fee', 'refund', 'processing', 1.5, 0.00, 'EUR', NULL, NULL),
    ('XOF Payout Processing Fee', 'payout', 'processing', 2.2, 0.00, 'XOF', NULL, NULL),
    ('GHS Payout Processing Fee', 'payout', 'processing', 2.2, 0.00, 'GHS', NULL, NULL),

    ('USD Payout Processing Fee', 'payout', 'processing', 2.0, 0.50, 'USD', NULL, NULL),
    ('EUR Payout Processing Fee', 'payout', 'processing', 1.8, 0.40, 'EUR', NULL, NULL),
    ('XOF Payout Processing Fee', 'payout', 'processing', 2.2, 0.00, 'XOF', NULL, NULL),
    ('GHS Payout Processing Fee', 'payout', 'processing', 2.1, 0.00, 'GHS', NULL, NULL),

  -- Insert merchants
INSERT INTO merchants (name, email, phone_number, is_admin, onboarded, verified, country, metadata, avatar_url, preferred_language)
VALUES
    ('Acme Inc.', 'info@acme.com', '+1234567890', false, true, true, 'USA', '{"industry": "E-commerce"}', 'https://example.com/acme_avatar.jpg', 'en'),
    ('Global Traders', 'contact@globaltraders.com', '+44987654321', true, true, true, 'UK', '{"industry": "Import/Export"}', 'https://example.com/gt_avatar.jpg', 'en'),
    ('Tech Innovators', 'hello@techinnovators.com', '+233123456789', false, true, true, 'Ghana', '{"industry": "Technology"}', 'https://example.com/ti_avatar.jpg', 'en'),
    ('Niche Boutique', 'info@nicheboutique.com', '+33123456789', false, true, true, 'France', '{"industry": "Fashion"}', 'https://example.com/nb_avatar.jpg', 'fr'),
    ('Artisanal Creations', 'contact@artisanalcreations.com', '+221987654321', false, true, true, 'Senegal', '{"industry": "Handcrafted Goods"}', 'https://example.com/ac_avatar.jpg', 'fr');

-- Insert organizations
INSERT INTO organizations (name, email, phone_number, tax_id, country, city, address, postal_code, status, kyc_status, industry, website_url)
VALUES
    ('Acme Corp', 'corp@acme.com', '+1234567890', 'AC123456', 'USA', 'New York', '123 Main St', '10001', 'active', 'approved', 'Technology', 'https://acmecorp.com'),
    ('Global Enterprises', 'info@globalenterprises.com', '+44987654321', 'GE789012', 'UK', 'London', '456 Oxford St', 'W1A 1AB', 'active', 'pending', 'Finance', 'https://globalenterprises.com'),
    ('Innovate Ltd', 'contact@innovate.com', '+233123456789', 'IL345678', 'Ghana', 'Accra', '789 Tech Rd', '00233', 'active', 'approved', 'Technology', 'https://innovate.com'),
    ('Boutique SAS', 'info@boutique.fr', '+33123456789', 'BS901234', 'France', 'Paris', '321 Rue de la Mode', '75001', 'active', 'approved', 'Fashion', 'https://boutique.fr'),
    ('Artisans SARL', 'contact@artisans.sn', '+221987654321', 'AS567890', 'Senegal', 'Dakar', '654 Avenue des Artisans', '12345', 'active', 'approved', 'Handcrafted Goods', 'https://artisans.sn');

-- Insert merchant-organization links
INSERT INTO merchant_organization_links (merchant_id, organization_id, role)
VALUES
    ((SELECT merchant_id FROM merchants WHERE email = 'info@acme.com'), (SELECT organization_id FROM organizations WHERE email = 'corp@acme.com'), 'admin'),
    ((SELECT merchant_id FROM merchants WHERE email = 'contact@globaltraders.com'), (SELECT organization_id FROM organizations WHERE email = 'info@globalenterprises.com'), 'admin'),
    ((SELECT merchant_id FROM merchants WHERE email = 'hello@techinnovators.com'), (SELECT organization_id FROM organizations WHERE email = 'contact@innovate.com'), 'admin'),
    ((SELECT merchant_id FROM merchants WHERE email = 'info@nicheboutique.com'), (SELECT organization_id FROM organizations WHERE email = 'info@boutique.fr'), 'admin'),
    ((SELECT merchant_id FROM merchants WHERE email = 'contact@artisanalcreations.com'), (SELECT organization_id FROM organizations WHERE email = 'contact@artisans.sn'), 'admin');

-- Insert customers
INSERT INTO customers (merchant_id, organization_id, name, email, phone_number, address, city, country, postal_code, metadata)
VALUES
    ((SELECT merchant_id FROM merchants WHERE email = 'info@acme.com'), (SELECT organization_id FROM organizations WHERE email = 'corp@acme.com'), 'John Doe', 'john@example.com', '+1234567890', '123 Main St', 'New York', 'USA', '10001', '{"loyalty_points": 100}'),
    ((SELECT merchant_id FROM merchants WHERE email = 'contact@globaltraders.com'), (SELECT organization_id FROM organizations WHERE email = 'info@globalenterprises.com'), 'Jane Smith', 'jane@example.com', '+44987654321', '456 Oxford St', 'London', 'UK', 'W1A 1AB', '{"loyalty_points": 200}'),
    ((SELECT merchant_id FROM merchants WHERE email = 'hello@techinnovators.com'), (SELECT organization_id FROM organizations WHERE email = 'contact@innovate.com'), 'Kofi Mensah', 'kofi@example.com', '+233123456789', '789 Tech Rd', 'Accra', 'Ghana', '00233', '{"loyalty_points": 150}'),
    ((SELECT merchant_id FROM merchants WHERE email = 'info@nicheboutique.com'), (SELECT organization_id FROM organizations WHERE email = 'info@boutique.fr'), 'Marie Dubois', 'marie@example.com', '+33123456789', '321 Rue de la Mode', 'Paris', 'France', '75001', '{"loyalty_points": 300}'),
    ((SELECT merchant_id FROM merchants WHERE email = 'contact@artisanalcreations.com'), (SELECT organization_id FROM organizations WHERE email = 'contact@artisans.sn'), 'Fatou Diop', 'fatou@example.com', '+221987654321', '654 Avenue des Artisans', 'Dakar', 'Senegal', '12345', '{"loyalty_points": 250}');

-- Insert accounts
INSERT INTO accounts (merchant_id, organization_id, customer_id, balance, currency_code, payment_method_code, account_type, status)
VALUES
    ((SELECT merchant_id FROM merchants WHERE email = 'info@acme.com'),
     (SELECT organization_id FROM organizations WHERE email = 'corp@acme.com'),
     (SELECT customer_id FROM customers WHERE email = 'john@example.com'),
     1000, 'USD', 'CREDIT_CARD', 'standard', 'active'),
    ((SELECT merchant_id FROM merchants WHERE email = 'contact@globaltraders.com'),
     (SELECT organization_id FROM organizations WHERE email = 'info@globalenterprises.com'),
     (SELECT customer_id FROM customers WHERE email = 'jane@example.com'),
     2000, 'GBP', 'BANK_TRANSFER', 'standard', 'active'),
    ((SELECT merchant_id FROM merchants WHERE email = 'hello@techinnovators.com'),
     (SELECT organization_id FROM organizations WHERE email = 'contact@innovate.com'),
     (SELECT customer_id FROM customers WHERE email = 'kofi@example.com'),
     1500, 'GHS', 'MOBILE_MONEY', 'standard', 'active'),
    ((SELECT merchant_id FROM merchants WHERE email = 'info@nicheboutique.com'),
     (SELECT organization_id FROM organizations WHERE email = 'info@boutique.fr'),
     (SELECT customer_id FROM customers WHERE email = 'marie@example.com'),
     3000, 'EUR', 'SEPA', 'standard', 'active'),
    ((SELECT merchant_id FROM merchants WHERE email = 'contact@artisanalcreations.com'),
     (SELECT organization_id FROM organizations WHERE email = 'contact@artisans.sn'),
     (SELECT customer_id FROM customers WHERE email = 'fatou@example.com'),
     2500, 'XOF', 'MOBILE_MONEY', 'standard', 'active');

-- Insert main accounts
INSERT INTO main_accounts (merchant_id, balance, currency_code)
VALUES
    ((SELECT merchant_id FROM merchants WHERE email = 'info@acme.com'), 10000, 'USD'),
    ((SELECT merchant_id FROM merchants WHERE email = 'contact@globaltraders.com'), 20000, 'GBP'),
    ((SELECT merchant_id FROM merchants WHERE email = 'hello@techinnovators.com'), 15000, 'GHS'),
    ((SELECT merchant_id FROM merchants WHERE email = 'info@nicheboutique.com'), 30000, 'EUR'),
    ((SELECT merchant_id FROM merchants WHERE email = 'contact@artisanalcreations.com'), 25000, 'XOF');

-- Insert transactions
INSERT INTO transactions (merchant_id, organization_id, customer_id, transaction_type, status, description, metadata, amount, currency_code, provider_code, payment_method_code)
VALUES
    ((SELECT merchant_id FROM merchants WHERE email = 'info@acme.com'),
     (SELECT organization_id FROM organizations WHERE email = 'corp@acme.com'),
     (SELECT customer_id FROM customers WHERE email = 'john@example.com'),
     'payment', 'completed', 'Payment for order #1234', '{"order_id": "1234"}', 100, 'USD', 'STRIPE', 'CREDIT_CARD'),
    ((SELECT merchant_id FROM merchants WHERE email = 'contact@globaltraders.com'),
     (SELECT organization_id FROM organizations WHERE email = 'info@globalenterprises.com'),
     (SELECT customer_id FROM customers WHERE email = 'jane@example.com'),
     'payment', 'completed', 'Payment for order #5678', '{"order_id": "5678"}', 200, 'GBP', 'STRIPE', 'BANK_TRANSFER'),
    ((SELECT merchant_id FROM merchants WHERE email = 'hello@techinnovators.com'),
     (SELECT organization_id FROM organizations WHERE email = 'contact@innovate.com'),
     (SELECT customer_id FROM customers WHERE email = 'kofi@example.com'),
     'payment', 'completed', 'Payment for order #9012', '{"order_id": "9012"}', 150, 'GHS', 'MTN', 'MOBILE_MONEY'),
    ((SELECT merchant_id FROM merchants WHERE email = 'info@nicheboutique.com'),
     (SELECT organization_id FROM organizations WHERE email = 'info@boutique.fr'),
     (SELECT customer_id FROM customers WHERE email = 'marie@example.com'),
     'payment', 'completed', 'Payment for order #3456', '{"order_id": "3456"}', 300, 'EUR', 'STRIPE', 'SEPA'),
    ((SELECT merchant_id FROM merchants WHERE email = 'contact@artisanalcreations.com'),
     (SELECT organization_id FROM organizations WHERE email = 'contact@artisans.sn'),
     (SELECT customer_id FROM customers WHERE email = 'fatou@example.com'),
     'payment', 'completed', 'Payment for order #7890', '{"order_id": "7890"}', 250, 'XOF', 'ORANGE', 'MOBILE_MONEY');

-- Insert recurring transactions
INSERT INTO recurring_transactions (merchant_id, organization_id, amount, currency_code, payment_method_code, payment_type, frequency, start_date)
VALUES
    ((SELECT merchant_id FROM merchants WHERE email = 'info@acme.com'),
     (SELECT organization_id FROM organizations WHERE email = 'corp@acme.com'),
     50, 'USD', 'CREDIT_CARD', 'subscription', 'monthly', '2023-06-01'),
    ((SELECT merchant_id FROM merchants WHERE email = 'contact@globaltraders.com'),
     (SELECT organization_id FROM organizations WHERE email = 'info@globalenterprises.com'),
     100, 'GBP', 'BANK_TRANSFER', 'subscription', 'monthly', '2023-06-01'),
    ((SELECT merchant_id FROM merchants WHERE email = 'hello@techinnovators.com'),
     (SELECT organization_id FROM organizations WHERE email = 'contact@innovate.com'),
     75, 'GHS', 'MOBILE_MONEY', 'subscription', 'monthly', '2023-06-01'),
    ((SELECT merchant_id FROM merchants WHERE email = 'info@nicheboutique.com'),
     (SELECT organization_id FROM organizations WHERE email = 'info@boutique.fr'),
     150, 'EUR', 'SEPA', 'subscription', 'monthly', '2023-06-01'),
    ((SELECT merchant_id FROM merchants WHERE email = 'contact@artisanalcreations.com'),
     (SELECT organization_id FROM organizations WHERE email = 'contact@artisans.sn'),
     125, 'XOF', 'MOBILE_MONEY', 'subscription', 'monthly', '2023-06-01');

-- Insert payouts
INSERT INTO payouts (account_id, organization_id, amount, currency_code, payout_method, status)
VALUES
    ((SELECT account_id FROM accounts WHERE merchant_id = (SELECT merchant_id FROM merchants WHERE email = 'info@acme.com') LIMIT 1),
     (SELECT organization_id FROM organizations WHERE email = 'corp@acme.com'),
     1000, 'USD', 'BANK_TRANSFER', 'completed'),
    ((SELECT account_id FROM accounts WHERE merchant_id = (SELECT merchant_id FROM merchants WHERE email = 'contact@globaltraders.com') LIMIT 1),
     (SELECT organization_id FROM organizations WHERE email = 'info@globalenterprises.com'),
     2000, 'GBP', 'BANK_TRANSFER', 'completed'),
    ((SELECT account_id FROM accounts WHERE merchant_id = (SELECT merchant_id FROM merchants WHERE email = 'hello@techinnovators.com') LIMIT 1),
     (SELECT organization_id FROM organizations WHERE email = 'contact@innovate.com'),
     1500, 'GHS', 'MOBILE_MONEY', 'completed'),
    ((SELECT account_id FROM accounts WHERE merchant_id = (SELECT merchant_id FROM merchants WHERE email = 'info@nicheboutique.com') LIMIT 1),
     (SELECT organization_id FROM organizations WHERE email = 'info@boutique.fr'),
     3000, 'EUR', 'BANK_TRANSFER', 'completed'),
    ((SELECT account_id FROM accounts WHERE merchant_id = (SELECT merchant_id FROM merchants WHERE email = 'contact@artisanalcreations.com') LIMIT 1),
     (SELECT organization_id FROM organizations WHERE email = 'contact@artisans.sn'),
     2500, 'XOF', 'MOBILE_MONEY', 'completed');

-- Insert API keys
INSERT INTO api_keys (organization_id, api_key, name)
VALUES
    ((SELECT organization_id FROM organizations WHERE email = 'corp@acme.com'), 'acme_api_key_1', 'Acme API Key 1'),
    ((SELECT organization_id FROM organizations WHERE email = 'info@globalenterprises.com'), 'global_api_key_1', 'Global Enterprises API Key 1'),
    ((SELECT organization_id FROM organizations WHERE email = 'contact@innovate.com'), 'innovate_api_key_1', 'Innovate API Key 1'),
    ((SELECT organization_id FROM organizations WHERE email = 'info@boutique.fr'), 'boutique_api_key_1', 'Boutique API Key 1'),
    ((SELECT organization_id FROM organizations WHERE email = 'contact@artisans.sn'), 'artisans_api_key_1', 'Artisans API Key 1');

-- Insert webhooks
INSERT INTO webhooks (merchant_id, url, events, secret)
VALUES
    ((SELECT merchant_id FROM merchants WHERE email = 'info@acme.com'), 'https://acme.com/webhooks', ARRAY['payment.success', 'payout.success'], 'acme_webhook_secret'),
    ((SELECT merchant_id FROM merchants WHERE email = 'contact@globaltraders.com'), 'https://globaltraders.com/webhooks', ARRAY['payment.success', 'payout.success'], 'global_webhook_secret'),
    ((SELECT merchant_id FROM merchants WHERE email = 'hello@techinnovators.com'), 'https://techinnovators.com/webhooks', ARRAY['payment.success', 'payout.success'], 'innovate_webhook_secret'),
    ((SELECT merchant_id FROM merchants WHERE email = 'info@nicheboutique.com'), 'https://nicheboutique.com/webhooks', ARRAY['payment.success', 'payout.success'], 'boutique_webhook_secret'),
    ((SELECT merchant_id FROM merchants WHERE email = 'contact@artisanalcreations.com'), 'https://artisanalcreations.com/webhooks', ARRAY['payment.success', 'payout.success'], 'artisans_webhook_secret');

-- Insert disputes
INSERT INTO disputes (transaction_id, reason, description, status, amount, fee_amount, currency_code)
VALUES
    ((SELECT transaction_id FROM transactions WHERE merchant_id = (SELECT merchant_id FROM merchants WHERE email = 'info@acme.com') LIMIT 1), 'Unauthorized transaction', 'Customer claims they did not authorize this transaction', 'open', 100, 15, 'USD'),
    ((SELECT transaction_id FROM transactions WHERE merchant_id = (SELECT merchant_id FROM merchants WHERE email = 'contact@globaltraders.com') LIMIT 1), 'Item not received', 'Customer claims they did not receive the item', 'under_review', 200, 30, 'GBP'),
    ((SELECT transaction_id FROM transactions WHERE merchant_id = (SELECT merchant_id FROM merchants WHERE email = 'hello@techinnovators.com') LIMIT 1), 'Defective product', 'Customer claims the product is defective', 'resolved', 150, 22.5, 'GHS'),
    ((SELECT transaction_id FROM transactions WHERE merchant_id = (SELECT merchant_id FROM merchants WHERE email = 'info@nicheboutique.com') LIMIT 1), 'Wrong item received', 'Customer claims they received the wrong item', 'closed', 300, 45, 'EUR'),
    ((SELECT transaction_id FROM transactions WHERE merchant_id = (SELECT merchant_id FROM merchants WHERE email = 'contact@artisanalcreations.com') LIMIT 1), 'Item not as described', 'Customer claims the item is not as described', 'open', 250, 37.5, 'XOF');