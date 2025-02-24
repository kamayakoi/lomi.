-- Disable all email-related triggers before seeding
ALTER TABLE merchants DISABLE TRIGGER notify_new_signup_trigger;
ALTER TABLE organization_kyc DISABLE TRIGGER notify_new_activation_request_trigger;
ALTER TABLE merchant_organization_links DISABLE TRIGGER generate_onboarding_api_key_trigger;
ALTER TABLE organization_providers_settings DISABLE TRIGGER notify_provider_connected_trigger;

-- Seed data for providers table
INSERT INTO providers (name, code, description) VALUES
  ('NOWPAYMENTS', 'NOWPAYMENTS', 'Crypto payment processor'),
  ('Orange', 'ORANGE', 'Mobile money and eWallet provider'),
  ('MTN', 'MTN', 'Mobile money provider'),
  ('Wave', 'WAVE', 'Mobile money and eWallet provider'),
  ('Ecobank', 'ECOBANK', 'Bank transfer and card payment provider'),
  ('Apple Pay', 'APPLE', 'Digital wallet provider'),
  ('Google Pay', 'GOOGLE', 'Digital wallet provider'),
  ('Moov', 'MOOV', 'Mobile money provider in West Africa'),
  ('Airtel-Tigo Money', 'AIRTEL', 'Mobile money provider in Africa'),
  ('M-Pesa', 'MPESA', 'Mobile money provider in East Africa'),
  ('Wizall', 'WIZALL', 'eWallet provider in Senegal'),
  ('OPay', 'OPAY', 'eWallet provider in Nigeria'),
  ('OZOW', 'OZOW', 'eWallet provider in South Africa'),
  ('Paypal', 'PAYPAL', 'Global payment solution'),
  ('Other', 'OTHER', 'Other payment provider');

-- Seed data for payment_methods table
INSERT INTO payment_methods (payment_method_code, provider_code) VALUES
  ('CARDS', 'ECOBANK'),
  ('MOBILE_MONEY', 'ORANGE'),
  ('MOBILE_MONEY', 'MTN'),
  ('MOBILE_MONEY', 'MOOV'),
  ('MOBILE_MONEY', 'AIRTEL'),
  ('MOBILE_MONEY', 'MPESA'),
  ('E_WALLET', 'WAVE'),
  ('E_WALLET', 'WIZALL'),
  ('E_WALLET', 'OPAY'),
  ('E_WALLET', 'OZOW'),
  ('E_WALLET', 'OTHER'),
  ('APPLE_PAY', 'APPLE'),
  ('USSD', 'OTHER'),
  ('QR_CODE', 'OTHER'),
  ('PAYPAL', 'PAYPAL'),
  ('GOOGLE_PAY', 'GOOGLE'),
  ('BANK_TRANSFER', 'ECOBANK'),
  ('CRYPTO', 'NOWPAYMENTS');

-- Seed data for currencies table
INSERT INTO currencies (code, name) VALUES
  ('XOF', 'West African CFA franc'), 
  ('USD', 'United States dollar'),
  ('EUR', 'Euro');