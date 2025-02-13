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