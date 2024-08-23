-- Users table
CREATE TABLE users (
  user_id BIGSERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  phone_number VARCHAR NOT NULL,
  password_hash VARCHAR NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  verified BOOLEAN NOT NULL DEFAULT false,
  user_type VARCHAR NOT NULL DEFAULT 'merchant',
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- Organizations table
CREATE TABLE organizations (
  organization_id BIGSERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  phone_number VARCHAR NOT NULL,
  country VARCHAR NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'active',
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_organizations_email ON organizations(email);

-- User-Organization links table
CREATE TABLE user_organization_links (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(user_id),
  organization_id BIGINT NOT NULL REFERENCES organizations(organization_id),
  role VARCHAR NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_org_links_user_id ON user_organization_links(user_id);
CREATE INDEX idx_user_org_links_org_id ON user_organization_links(organization_id);

-- Providers table
CREATE TABLE providers (
  provider_id BIGSERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE providers IS 'Examples: MTN, Wave, UBA Bank, Mastercard';

-- Payment methods table
CREATE TABLE payment_methods (
  payment_method_id BIGSERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  provider_id BIGINT NOT NULL REFERENCES providers(provider_id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payment_methods_provider_id ON payment_methods(provider_id);

COMMENT ON TABLE payment_methods IS 'Examples: Card, Mobile Money, Cash';

-- Organization payment methods table
CREATE TABLE organization_payment_methods (
  id BIGSERIAL PRIMARY KEY,
  organization_id BIGINT NOT NULL REFERENCES organizations(organization_id),
  payment_method_id BIGINT NOT NULL REFERENCES payment_methods(payment_method_id),
  phone_number VARCHAR NOT NULL,
  card_number VARCHAR NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_org_payment_methods_org_id ON organization_payment_methods(organization_id);
CREATE INDEX idx_org_payment_methods_payment_method_id ON organization_payment_methods(payment_method_id);

-- Currencies table
CREATE TABLE currencies (
  currency_id SERIAL PRIMARY KEY,
  code VARCHAR(3) UNIQUE NOT NULL,
  name VARCHAR NOT NULL
);

-- Accounts table
CREATE TABLE accounts (
  account_id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(user_id),
  payment_method_id BIGINT NOT NULL REFERENCES payment_methods(payment_method_id),
  balance BIGINT NOT NULL DEFAULT 0,
  currency_id INTEGER NOT NULL REFERENCES currencies(currency_id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_accounts_payment_method_id ON accounts(payment_method_id);
CREATE INDEX idx_accounts_currency_id ON accounts(currency_id);

-- Main accounts table
CREATE TABLE main_accounts (
  main_account_id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(user_id),
  balance BIGINT NOT NULL DEFAULT 0,
  currency_id INTEGER NOT NULL REFERENCES currencies(currency_id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_main_accounts_user_id ON main_accounts(user_id);
CREATE INDEX idx_main_accounts_currency_id ON main_accounts(currency_id);

-- End customers table
CREATE TABLE end_customers (
  end_customer_id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(user_id),
  name VARCHAR NOT NULL,
  email VARCHAR,
  phone_number VARCHAR NOT NULL,
  card_number VARCHAR,
  country_code VARCHAR NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_end_customers_user_id ON end_customers(user_id);

-- Transactions table
CREATE TABLE transactions (
  transaction_id BIGSERIAL PRIMARY KEY,
  end_customer_id BIGINT NOT NULL REFERENCES end_customers(end_customer_id),
  payment_method_id BIGINT NOT NULL REFERENCES payment_methods(payment_method_id),
  organization_id BIGINT NOT NULL REFERENCES organizations(organization_id),
  user_id BIGINT NOT NULL REFERENCES users(user_id),
  amount BIGINT NOT NULL,
  fee BIGINT NOT NULL DEFAULT 0,
  currency_id INTEGER NOT NULL REFERENCES currencies(currency_id),
  status VARCHAR NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_type VARCHAR NOT NULL,
  payment_info TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transactions_end_customer_id ON transactions(end_customer_id);
CREATE INDEX idx_transactions_payment_method_id ON transactions(payment_method_id);
CREATE INDEX idx_transactions_organization_id ON transactions(organization_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_currency_id ON transactions(currency_id);

COMMENT ON COLUMN transactions.payment_info IS 'Details like phone number, card number, etc.';

-- Fees table
CREATE TABLE fees (
  fee_id BIGSERIAL PRIMARY KEY,
  transaction_type VARCHAR NOT NULL,
  fee_percentage DECIMAL(5, 2) NOT NULL,
  fee_fixed BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_fees_transaction_type ON fees(transaction_type);

-- Refunds table
CREATE TABLE refunds (
  refund_id BIGSERIAL PRIMARY KEY,
  transaction_id BIGINT NOT NULL REFERENCES transactions(transaction_id),
  user_id BIGINT NOT NULL REFERENCES users(user_id),
  amount BIGINT NOT NULL,
  currency_id INTEGER NOT NULL REFERENCES currencies(currency_id),
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Entries table
CREATE TABLE entries (
  entry_id BIGSERIAL PRIMARY KEY,
  account_id BIGINT NOT NULL REFERENCES accounts(account_id),
  amount BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_entries_account_id ON entries(account_id);

COMMENT ON COLUMN entries.amount IS 'can be positive or negative';

-- Transfers table
CREATE TABLE transfers (
  transfer_id BIGSERIAL PRIMARY KEY,
  from_account_id BIGINT NOT NULL REFERENCES accounts(account_id),
  to_account_id BIGINT NOT NULL REFERENCES accounts(account_id),
  amount BIGINT NOT NULL CHECK (amount > 0),
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transfers_from_account_id ON transfers(from_account_id);
CREATE INDEX idx_transfers_to_account_id ON transfers(to_account_id);
CREATE INDEX idx_transfers_from_to_account_id ON transfers(from_account_id, to_account_id);

COMMENT ON COLUMN transfers.amount IS 'Must be positive';

-- Payouts table
CREATE TABLE payouts (
  payout_id BIGSERIAL PRIMARY KEY,
  account_id BIGINT NOT NULL REFERENCES accounts(account_id),
  amount BIGINT NOT NULL,
  currency_id INTEGER NOT NULL REFERENCES currencies(currency_id),
  destination VARCHAR NOT NULL,
  status VARCHAR NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payouts_account_id ON payouts(account_id);
CREATE INDEX idx_payouts_currency_id ON payouts(currency_id);

COMMENT ON COLUMN payouts.destination IS 'Phone number or IBAN';

-- API Keys table
CREATE TABLE api_keys (
  key_id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(user_id),
  api_key VARCHAR UNIQUE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  expiration_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_used_at TIMESTAMPTZ
);

CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_api_key ON api_keys(api_key);

-- API Providers table
CREATE TABLE api_providers (
  provider_id BIGSERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  base_url VARCHAR NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- API Credentials table
CREATE TABLE api_credentials (
  credential_id BIGSERIAL PRIMARY KEY,
  provider_id BIGINT NOT NULL REFERENCES api_providers(provider_id),
  api_key VARCHAR NOT NULL,
  api_secret VARCHAR NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_api_credentials_provider_id ON api_credentials(provider_id);

-- Webhooks table
CREATE TABLE webhooks (
  webhook_id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(user_id),
  url VARCHAR NOT NULL,
  events VARCHAR[] NOT NULL,
  secret VARCHAR NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_webhooks_user_id ON webhooks(user_id);

-- Logs table
CREATE TABLE logs (
  log_id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(user_id),
  action VARCHAR NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_logs_user_id ON logs(user_id);
CREATE INDEX idx_logs_created_at ON logs(created_at);