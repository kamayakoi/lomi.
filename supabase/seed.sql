-- Insert merchants
INSERT INTO merchants (name, email, phone_number, is_admin, onboarded, verified, country, metadata, avatar_url, preferred_language, referral_code, status, mrr, arr, merchant_lifetime_value)
VALUES

-- Insert organizations
INSERT INTO organizations (name, email, phone_number, tax_id, country, city, address, postal_code, status, kyc_status, industry, website_url, total_revenue, total_transactions, total_merchants, default_currency, created_at)
VALUES

-- Insert organization addresses
INSERT INTO organization_addresses (organization_id, country, region, city, address, postal_code, default_language, timezone)
VALUES

-- Insert organization KYC
INSERT INTO organization_kyc (organization_id, document_type, document_url, authorized_signatory, status, kyc_submitted_at, kyc_approved_at, uploaded_at, reviewed_at)
VALUES

-- Insert merchant-organization links
INSERT INTO merchant_organization_links (merchant_id, organization_id, role)
VALUES


-- Providers table
INSERT INTO providers (name, code, description, logo_url, website_url, api_base_url, api_key, api_secret, webhook_url)
VALUES
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
    ('BANK_TRANSFER', 'PARTNER');

-- Insert organization-providers settings
INSERT INTO organization_providers_settings (organization_id, provider_code, is_connected, phone_number, card_number, complementary_information, bank_account_number, bank_account_name, bank_name, bank_code)
VALUES

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


-- Insert customers
INSERT INTO customers (merchant_id, organization_id, name, email, phone_number, address, city, country, postal_code, metadata)
VALUES

-- Insert accounts
INSERT INTO accounts (merchant_id, organization_id, customer_id, balance, currency_code, payment_method_code, account_type, status)
VALUES

-- Insert main accounts
INSERT INTO main_accounts (merchant_id, balance, currency_code)
VALUES

-- Insert platform main balance
INSERT INTO platform_main_balance (balance, currency_code, total_transactions, total_fees, total_revenue)
VALUES

-- Insert platform payouts
INSERT INTO platform_payouts (organization_id, amount, from_account_id, from_main_account_id, currency_code, payout_method, payout_details, status, reference_id)
VALUES

-- Insert platform provider balances
INSERT INTO platform_provider_balances (provider_code, currency_code, balance, total_transactions, total_fees, total_revenue, last_transaction_at)
VALUES

-- Insert merchant products
INSERT INTO merchant_products (merchant_id, name, description, price, currency_code, frequency, image_url, is_active)
VALUES

-- Insert customer subscriptions
INSERT INTO customer_subscriptions (customer_id, product_id, status, start_date, end_date, payment_method_code)
VALUES

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

-- Insert transactions
INSERT INTO transactions (merchant_id, organization_id, customer_id, transaction_type, status, description, reference_id, metadata, gross_amount, fee_amount, net_amount, fee_reference, currency_code, provider_code, payment_method_code)
VALUES

-- Insert recurring transactions
INSERT INTO recurring_transactions (merchant_id, organization_id, amount, currency_code, payment_method_code, payment_type, frequency, start_date, end_date, next_payment_date, status, total_cycles, retry_payment_every, total_retries, failed_payment_action, email_notifications, charge_immediately, follow_up_subscriber, description, is_active)
VALUES

-- Insert payouts
INSERT INTO payouts (account_id, organization_id, amount, currency_code, payout_method, status, reference_id)
VALUES

-- Insert entries
INSERT INTO entries (account_id, transaction_id, transfer_id, internal_transfer_id, payout_id, amount, entry_type)
VALUES

-- Insert API keys
INSERT INTO api_keys (organization_id, api_key, name, is_active, expiration_date, last_used_at, created_at)
VALUES

-- Insert API usage tracking
INSERT INTO api_usage (api_key_id, endpoint, request_count, last_request_at, created_at)
VALUES

-- Insert webhooks
INSERT INTO webhooks (merchant_id, url, events, secret, is_active, created_at, updated_at, last_triggered_at)
VALUES

-- Insert logs
INSERT INTO logs (merchant_id, action, details, severity, created_at)
VALUES

-- Insert platform invoices
INSERT INTO platform_invoices (merchant_id, organization_id, amount, description, currency_code, due_date, status, created_at)
VALUES

-- Insert customer invoices
INSERT INTO customer_invoices (merchant_id, organization_id, customer_id, amount, description, currency_code, due_date, status, created_at)
VALUES

-- Insert Notifications
INSERT INTO notifications (merchant_id, organization_id, type, message, is_read, created_at)
VALUES

-- Insert disputes
INSERT INTO disputes (transaction_id, customer_id, amount, fee_amount, reason, metadata, status, currency_code, resolution_date, resolution_details, created_at)
VALUES

-- Insert metrics
INSERT INTO metrics (entity_type, metric_name, metric_value, metric_date, created_at)
VALUES

-- Merchant Preferences table
INSERT INTO merchant_preferences (merchant_id, theme, language, notification_settings, created_at)
VALUES

-- Merchant Sessions table
INSERT INTO merchant_sessions (merchant_id, session_data, created_at, expires_at)
VALUES

-- UI Configuration table
INSERT INTO ui_configuration (config_name, config_value, created_at)
VALUES

-- Merchant Feedback table
INSERT INTO merchant_feedback (merchant_id, feedback_type, message, created_at, status)
VALUES

-- Customer Feedback table
INSERT INTO customer_feedback (customer_id, feedback_type, message, created_at, status)
VALUES

-- Support tickets table
INSERT INTO support_tickets (merchant_id, customer_id, message, created_at, resolution_date, resolution_details, status)
VALUES