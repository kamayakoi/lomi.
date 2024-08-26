-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum Types
CREATE TYPE user_type AS ENUM ('user', 'admin');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE transaction_type AS ENUM ('payment', 'refund', 'transfer', 'payout');

-- Users table
CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  phone_number VARCHAR NOT NULL,
  password_hash VARCHAR NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  verified BOOLEAN NOT NULL DEFAULT false,
  user_type user_type NOT NULL DEFAULT 'user',
  country VARCHAR,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(user_id),
  updated_by UUID REFERENCES users(user_id)
);

CREATE INDEX idx_users_email ON users(email);

COMMENT ON TABLE users IS 'Stores information about all users of the system, including users and admins';

-- Organizations table
CREATE TABLE organizations (
  organization_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  phone_number VARCHAR NOT NULL,
  country VARCHAR NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'active',
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(user_id),
  updated_by UUID REFERENCES users(user_id)
);

CREATE INDEX idx_organizations_email ON organizations(email);

COMMENT ON TABLE organizations IS 'Represents businesses or entities using our application';

-- User-Organization links table
CREATE TABLE user_organization_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(user_id),
  organization_id UUID NOT NULL REFERENCES organizations(organization_id),
  role VARCHAR NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_org_links_user_id ON user_organization_links(user_id);
CREATE INDEX idx_user_org_links_org_id ON user_organization_links(organization_id);

COMMENT ON TABLE user_organization_links IS 'Links users to organizations, defining their roles within each organization';

-- Providers table
CREATE TABLE providers (
  provider_id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE providers IS 'Examples: MTN, Wave, Orange, Stripe, PayPal';

-- Payment methods table
CREATE TABLE payment_methods (
  payment_method_id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  provider_id INT REFERENCES providers(provider_id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payment_methods_provider_id ON payment_methods(provider_id);

COMMENT ON TABLE payment_methods IS 'Examples: Card, Mobile Money, Cash, Bank Transfer';

-- Organization payment methods table
CREATE TABLE organization_payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(organization_id),
  payment_method_id INT NOT NULL REFERENCES payment_methods(payment_method_id),
  phone_number VARCHAR,
  card_number VARCHAR,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_org_payment_methods_org_id ON organization_payment_methods(organization_id);
CREATE INDEX idx_org_payment_methods_payment_method_id ON organization_payment_methods(payment_method_id);

COMMENT ON TABLE organization_payment_methods IS 'Links organizations to their available payment methods';

-- Currencies table
CREATE TABLE currencies (
  code VARCHAR(3) PRIMARY KEY,
  name VARCHAR NOT NULL
);

COMMENT ON TABLE currencies IS 'Examples: USD, EUR, XOF, GHS, NGN, etc.';

-- Accounts table
CREATE TABLE accounts (
  account_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(user_id),
  payment_method_id INT NOT NULL REFERENCES payment_methods(payment_method_id),
  currency_code VARCHAR(3) NOT NULL REFERENCES currencies(code),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_accounts_payment_method_id ON accounts(payment_method_id);
CREATE INDEX idx_accounts_currency_code ON accounts(currency_code);

COMMENT ON TABLE accounts IS 'Represents financial accounts for users, linked to specific payment methods and currencies';

-- Main accounts table
CREATE TABLE main_accounts (
  main_account_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(user_id),
  currency_code VARCHAR(3) NOT NULL REFERENCES currencies(code),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_main_accounts_user_id ON main_accounts(user_id);
CREATE INDEX idx_main_accounts_currency_code ON main_accounts(currency_code);

COMMENT ON TABLE main_accounts IS 'Primary accounts for users, typically one per currency';

-- End customers table
CREATE TABLE end_customers (
  end_customer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(user_id),
  name VARCHAR NOT NULL,
  email VARCHAR,
  phone_number VARCHAR,
  card_number VARCHAR,
  country_code VARCHAR NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_end_customers_user_id ON end_customers(user_id);

COMMENT ON TABLE end_customers IS 'Stores information about the customers of our users';

-- End customer payment methods table
CREATE TABLE end_customer_payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  end_customer_id UUID NOT NULL REFERENCES end_customers(end_customer_id),
  payment_method_id INT NOT NULL REFERENCES payment_methods(payment_method_id),
  card_number VARCHAR,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_end_customer_payment_methods_end_customer_id ON end_customer_payment_methods(end_customer_id);
CREATE INDEX idx_end_customer_payment_methods_payment_method_id ON end_customer_payment_methods(payment_method_id);

COMMENT ON TABLE end_customer_payment_methods IS 'Links end-customers to their preferred payment methods';

-- Fees table
CREATE TABLE fees (
  fee_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_type transaction_type NOT NULL,
  fee_percentage DECIMAL(5, 2) NOT NULL,
  fee_fixed BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_fees_transaction_type ON fees(transaction_type);

COMMENT ON TABLE fees IS 'Defines fee structures for different transaction types';

-- Transactions table
CREATE TABLE transactions (
  transaction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  end_customer_id UUID NOT NULL REFERENCES end_customers(end_customer_id),
  payment_method_id INT NOT NULL REFERENCES payment_methods(payment_method_id),
  organization_id UUID NOT NULL REFERENCES organizations(organization_id),
  user_id UUID NOT NULL REFERENCES users(user_id),
  amount BIGINT NOT NULL,
  fee_amount BIGINT NOT NULL,
  fee_id UUID REFERENCES fees(fee_id),
  currency_code VARCHAR(3) NOT NULL REFERENCES currencies(code),
  status transaction_status NOT NULL,
  transaction_type transaction_type NOT NULL,
  payment_info TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transactions_end_customer_id ON transactions(end_customer_id);
CREATE INDEX idx_transactions_payment_method_id ON transactions(payment_method_id);
CREATE INDEX idx_transactions_organization_id ON transactions(organization_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_currency_code ON transactions(currency_code);
CREATE INDEX idx_transactions_fee_id ON transactions(fee_id);

COMMENT ON COLUMN transactions.payment_info IS 'Details like phone number, card number, etc.';
COMMENT ON COLUMN transactions.fee_amount IS 'Actual fee amount charged for this transaction';

COMMENT ON TABLE transactions IS 'Records all financial transactions in the system';

-- Refunds table
CREATE TABLE refunds (
  refund_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID NOT NULL REFERENCES transactions(transaction_id),
  user_id UUID NOT NULL REFERENCES users(user_id),
  amount BIGINT NOT NULL,
  currency_code VARCHAR(3) NOT NULL REFERENCES currencies(code),
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_refunds_transaction_id ON refunds(transaction_id);
CREATE INDEX idx_refunds_user_id ON refunds(user_id);
CREATE INDEX idx_refunds_currency_code ON refunds(currency_code);

COMMENT ON TABLE refunds IS 'Tracks refund transactions linked to original transactions';

-- Entries table
CREATE TABLE entries (
  entry_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES accounts(account_id),
  amount BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_entries_account_id ON entries(account_id);

COMMENT ON COLUMN entries.amount IS 'can be positive or negative';

COMMENT ON TABLE entries IS 'Ledger entries for tracking account balance changes';

-- Transfers table
CREATE TABLE transfers (
  transfer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_account_id UUID NOT NULL REFERENCES accounts(account_id),
  to_account_id UUID NOT NULL REFERENCES accounts(account_id),
  amount BIGINT NOT NULL CHECK (amount > 0),
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transfers_from_account_id ON transfers(from_account_id);
CREATE INDEX idx_transfers_to_account_id ON transfers(to_account_id);
CREATE INDEX idx_transfers_from_to_account_id ON transfers(from_account_id, to_account_id);

COMMENT ON COLUMN transfers.amount IS 'Must be positive';
COMMENT ON TABLE transfers IS 'Records transfers between accounts within the system';

-- Payouts table
CREATE TABLE payouts (
  payout_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES accounts(account_id),
  amount BIGINT NOT NULL,
  currency_code VARCHAR(3) NOT NULL REFERENCES currencies(code),
  destination VARCHAR NOT NULL,
  status VARCHAR NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payouts_account_id ON payouts(account_id);
CREATE INDEX idx_payouts_currency_code ON payouts(currency_code);

COMMENT ON COLUMN payouts.destination IS 'Phone number or IBAN';
COMMENT ON TABLE payouts IS 'Tracks payouts from the system to external accounts or services';

-- API Keys table
CREATE TABLE api_keys (
  key_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(user_id),
  api_key VARCHAR UNIQUE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  expiration_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_used_at TIMESTAMPTZ
);

CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_api_key ON api_keys(api_key);

COMMENT ON TABLE api_keys IS 'Stores API keys for authenticated access to the system';

-- Webhooks table
CREATE TABLE webhooks (
  webhook_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(user_id),
  url VARCHAR NOT NULL,
  events VARCHAR[] NOT NULL,
  secret VARCHAR NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_webhooks_user_id ON webhooks(user_id);

COMMENT ON TABLE webhooks IS 'Configures webhook endpoints for real-time event notifications';

-- Logs table
CREATE TABLE logs (
  log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(user_id),
  action VARCHAR NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_logs_user_id ON logs(user_id);
CREATE INDEX idx_logs_created_at ON logs(created_at);

COMMENT ON TABLE logs IS 'Audit log for tracking important actions and events in the system';

-- Add UNIQUE constraints
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_phone_number_unique') THEN
    ALTER TABLE users ADD CONSTRAINT users_phone_number_unique UNIQUE (phone_number);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'organizations_phone_number_unique') THEN
    ALTER TABLE organizations ADD CONSTRAINT organizations_phone_number_unique UNIQUE (phone_number);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'end_customers_phone_number_unique') THEN
    ALTER TABLE end_customers ADD CONSTRAINT end_customers_phone_number_unique UNIQUE (phone_number);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'end_customers_email_unique') THEN
    ALTER TABLE end_customers ADD CONSTRAINT end_customers_email_unique UNIQUE (email);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'end_customers_card_number_unique') THEN
    ALTER TABLE end_customers ADD CONSTRAINT end_customers_card_number_unique UNIQUE (card_number);
  END IF;
END $$;

-- Create UNIQUE indexes for combinations that should be unique
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_org_links_unique ON user_organization_links(user_id, organization_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_org_payment_methods_unique ON organization_payment_methods(organization_id, payment_method_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_accounts_unique ON accounts(user_id, payment_method_id, currency_code);
CREATE UNIQUE INDEX IF NOT EXISTS idx_main_accounts_unique ON main_accounts(user_id, currency_code);
CREATE UNIQUE INDEX IF NOT EXISTS idx_end_customer_payment_methods_unique ON end_customer_payment_methods(end_customer_id, payment_method_id);

-- Partial Indexes
CREATE INDEX idx_transactions_pending ON transactions(transaction_id) WHERE status = 'pending';
CREATE INDEX idx_transactions_completed ON transactions(transaction_id) WHERE status = 'completed';