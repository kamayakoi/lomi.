INSERT INTO currencies (code, name) VALUES
  ('USD', 'United States Dollar'),
  ('EUR', 'Euro'),
  ('GBP', 'British Pound Sterling');

INSERT INTO providers (name, description) VALUES
  ('MTN', 'MTN Mobile Money'),
  ('Wave', 'Wave Mobile Money'),
  ('Paypal', 'Paypal'),
  ('UBA Bank', 'United Bank for Africa'),
  ('Mastercard', 'Mastercard');

INSERT INTO payment_methods (name, description, provider_id) VALUES
  ('Card', 'Credit/Debit Card', (SELECT provider_id FROM providers WHERE name = 'Mastercard')),
  ('Mobile Money', 'MTN Mobile Money', (SELECT provider_id FROM providers WHERE name = 'MTN')),
  ('Cash', 'Cash Payment', NULL);