-- Providers table
INSERT INTO providers (name, code, description)
VALUES
    ('Stripe', 'STRIPE', 'Global payment processor'),
    ('Orange', 'ORANGE', 'Mobile money provider'),
    ('MTN', 'MTN', 'Mobile money provider'),
    ('Wave', 'WAVE', 'Mobile money and e-wallet provider'),
    ('Partner', 'PARTNER', 'Generic partner provider'),
    ('Ecobank', 'ECOBANK', 'Bank transfer provider'),
    ('Lomi', 'LOMI', 'Internal payment processor');

-- payment methods table
INSERT INTO payment_methods (payment_method_code, provider_code)
VALUES
    ('CREDIT_CARD', 'STRIPE'),
    ('DEBIT_CARD', 'STRIPE'),
    ('SEPA', 'STRIPE'),
    ('PAYPAL', 'STRIPE'),
    ('MOBILE_MONEY', 'ORANGE'),
    ('MOBILE_MONEY', 'MTN'),
    ('MOBILE_MONEY', 'WAVE'),
    ('BANK_TRANSFER', 'ECOBANK'),
    ('CASH', 'LOMI'),
    ('E_WALLET', 'LOMI'),
    ('E_WALLET', 'PARTNER'),
    ('APPLE_PAY', 'STRIPE'),
    ('GOOGLE_PAY', 'STRIPE');

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
    ('USD/PAYPAL Payment Fee', 'payment', 'processing', 3.4, 0.30, 'USD', 'PAYPAL', 'STRIPE'),
    ('EUR/PAYPAL Payment Fee', 'payment', 'processing', 3.4, 0.30, 'EUR', 'PAYPAL', 'STRIPE'),

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
