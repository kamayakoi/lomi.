-- Users table
CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  phone_number VARCHAR NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  verified BOOLEAN NOT NULL DEFAULT false,
  user_type user_type NOT NULL DEFAULT 'user',
  country VARCHAR,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(user_id),
  updated_by UUID REFERENCES users(user_id),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_active_users ON users(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_created_by ON users(created_by);
CREATE INDEX idx_users_updated_by ON users(updated_by);

COMMENT ON TABLE users IS 'Stores information about all users of the system, including users and admins';

-- Organizations table
CREATE TABLE organizations (
  organization_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  phone_number VARCHAR NOT NULL,
  country VARCHAR NOT NULL,
  status organization_status NOT NULL DEFAULT 'active',
  metadata JSONB,
  max_transactions_per_day INT,
  max_providers INT,
  max_transaction_amount NUMERIC(15,2),
  max_monthly_volume NUMERIC(15,2),
  max_api_calls_per_minute INT,
  max_webhooks INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES users(user_id),
  updated_by UUID REFERENCES users(user_id),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_organizations_email ON organizations(email);
CREATE INDEX idx_organizations_created_by ON organizations(created_by);
CREATE INDEX idx_organizations_updated_by ON organizations(updated_by);

COMMENT ON TABLE organizations IS 'Represents businesses or entities using our application';

-- User-Organization links table
CREATE TABLE user_organization_links (
  user_orgid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  provider_code provider_code PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE providers IS 'Examples: MTN, WAVE, ORANGE, STRIPE, PAYPAL';

-- Payment methods table
CREATE TABLE payment_methods (
  payment_method_code payment_method_code PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  provider_code provider_code REFERENCES providers(provider_code),
  phone_number VARCHAR,
  card_number VARCHAR,
  country_code VARCHAR(4) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payment_methods_provider_code ON payment_methods(provider_code);

COMMENT ON TABLE payment_methods IS 'Examples: CARD, MOBILE_MONEY, CASH, BANK_TRANSFER';

-- Organization providers table
CREATE TABLE organization_providers (
    org_provider_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    provider_code provider_code NOT NULL REFERENCES providers(provider_code),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, provider_code)
);

CREATE INDEX idx_org_providers_org_id ON organization_providers(organization_id);
CREATE INDEX idx_org_providers_provider_code ON organization_providers(provider_code);

COMMENT ON TABLE organization_providers IS 'Links organizations to their chosen payment providers';

-- Currencies table
CREATE TABLE currencies (
  code currency_code PRIMARY KEY,
  name VARCHAR NOT NULL
);

COMMENT ON TABLE currencies IS 'Examples: USD, EUR, XOF, GHS, NGN, etc.';

-- Accounts table
CREATE TABLE accounts (
    account_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id),
    balance NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (balance >= 0),
    payment_method_code payment_method_code NOT NULL REFERENCES payment_methods(payment_method_code),
    currency_code currency_code NOT NULL REFERENCES currencies(code),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_active BOOLEAN NOT NULL DEFAULT true,
    UNIQUE (user_id, payment_method_code, currency_code)
);

CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_accounts_payment_method_code ON accounts(payment_method_code);
CREATE INDEX idx_accounts_currency_code ON accounts(currency_code);

COMMENT ON TABLE accounts IS 'Represents financial accounts for users, linked to specific payment methods and currencies';

-- Main accounts table
CREATE TABLE main_accounts (
    main_account_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id),
    balance NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (balance >= 0),
    currency_code currency_code NOT NULL REFERENCES currencies(code),
    account_id UUID NOT NULL REFERENCES accounts(account_id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, currency_code)
);

CREATE INDEX idx_main_accounts_user_id ON main_accounts(user_id);

COMMENT ON TABLE main_accounts IS 'Identifies the primary account for each user in each currency';

-- End customers table
CREATE TABLE end_customers (
    end_customer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id),
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    name VARCHAR NOT NULL,
    email VARCHAR,
    phone_number VARCHAR,
    card_number VARCHAR,
    country_code VARCHAR(4) NOT NULL,
    data JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_end_customers_user_id ON end_customers(user_id);
CREATE INDEX idx_end_customers_organization_id ON end_customers(organization_id);

COMMENT ON TABLE end_customers IS 'Stores information about the customers of our users';

-- End customer payment methods table
CREATE TABLE end_customer_payment_methods (
    ecpm_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    end_customer_id UUID NOT NULL REFERENCES end_customers(end_customer_id),
    payment_method_code payment_method_code NOT NULL REFERENCES payment_methods(payment_method_code),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (end_customer_id, payment_method_code)
);

CREATE INDEX idx_end_customer_payment_methods_end_customer_id ON end_customer_payment_methods(end_customer_id);
CREATE INDEX idx_end_customer_payment_methods_payment_method_code ON end_customer_payment_methods(payment_method_code);

COMMENT ON TABLE end_customer_payment_methods IS 'Links end customers to their preferred payment methods';

-- Fees table
CREATE TABLE fees (
    fee_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_type transaction_type NOT NULL,
    amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
    currency_code currency_code NOT NULL REFERENCES currencies(code),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_fees_transaction_type ON fees(transaction_type);
CREATE INDEX idx_fees_currency_code ON fees(currency_code);

COMMENT ON TABLE fees IS 'Defines fee structures for different transaction types';

-- Transactions table
CREATE TABLE transactions (
    transaction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id),
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    end_customer_id UUID REFERENCES end_customers(end_customer_id),
    transaction_type transaction_type NOT NULL,
    status transaction_status NOT NULL DEFAULT 'pending',
    description TEXT,
    metadata JSONB,
    amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
    currency_code currency_code NOT NULL REFERENCES currencies(code),
    payment_method_code payment_method_code NOT NULL REFERENCES payment_methods(payment_method_code),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_organization_id ON transactions(organization_id);
CREATE INDEX idx_transactions_end_customer_id ON transactions(end_customer_id);
CREATE INDEX idx_transactions_transaction_type ON transactions(transaction_type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_currency_code ON transactions(currency_code);
CREATE INDEX idx_transactions_payment_method_code ON transactions(payment_method_code);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_transactions_amount ON transactions(amount);
CREATE INDEX idx_transactions_pending ON transactions(transaction_id) WHERE status = 'pending';
CREATE INDEX idx_transactions_completed ON transactions(transaction_id) WHERE status = 'completed';

COMMENT ON TABLE transactions IS 'Records all financial transactions in the system';

-- Refunds table
CREATE TABLE refunds (
    refund_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES transactions(transaction_id),
    amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
    reason TEXT,
    status refund_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_refunds_transaction_id ON refunds(transaction_id);

COMMENT ON TABLE refunds IS 'Tracks refund transactions linked to original transactions';

-- Entries table
CREATE TABLE entries (
    entry_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES accounts(account_id),
    transaction_id UUID REFERENCES transactions(transaction_id),
    amount NUMERIC(10,2) NOT NULL CHECK (amount != 0),
    entry_type VARCHAR(20),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_entries_account_id ON entries(account_id);
CREATE INDEX idx_entries_transaction_id ON entries(transaction_id);
CREATE INDEX idx_entries_created_at ON entries(created_at);

COMMENT ON TABLE entries IS 'Ledger entries for tracking account balance changes';

-- Transfers table
CREATE TABLE transfers (
    transfer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_account_id UUID NOT NULL REFERENCES accounts(account_id),
    to_account_id UUID NOT NULL REFERENCES accounts(account_id),
    transaction_id UUID NOT NULL REFERENCES transactions(transaction_id),
    amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
    status transfer_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transfers_from_account_id ON transfers(from_account_id);
CREATE INDEX idx_transfers_to_account_id ON transfers(to_account_id);
CREATE INDEX idx_transfers_transaction_id ON transfers(transaction_id);
CREATE INDEX idx_transfers_created_at ON transfers(created_at);

COMMENT ON TABLE transfers IS 'Records transfers between accounts within the system';

-- Payouts table
CREATE TABLE payouts (
    payout_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES transactions(transaction_id),
    account_id UUID NOT NULL REFERENCES accounts(account_id),
    amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
    currency_code currency_code NOT NULL REFERENCES currencies(code),
    destination VARCHAR NOT NULL,
    metadata JSONB,
    status payout_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payouts_account_id ON payouts(account_id);
CREATE INDEX idx_payouts_currency_code ON payouts(currency_code);
CREATE INDEX idx_payouts_created_at ON payouts(created_at);

COMMENT ON COLUMN payouts.destination IS 'Phone number or IBAN';
COMMENT ON TABLE payouts IS 'Tracks payouts from the system to external accounts or services';

-- API Keys table
CREATE TABLE api_keys (
    key_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id),
    api_key VARCHAR NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    expiration_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
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
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_triggered_at TIMESTAMPTZ
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

-- Recurring Payments table
CREATE TABLE recurring_payments (
    recurring_payment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id),
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
    currency_code currency_code NOT NULL REFERENCES currencies(code),
    payment_method_code payment_method_code NOT NULL REFERENCES payment_methods(payment_method_code),
    payment_type recurring_payment_type NOT NULL,
    frequency INTERVAL NOT NULL,
    next_payment_date DATE NOT NULL,
    end_date DATE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_recurring_payments_user_id ON recurring_payments(user_id);
CREATE INDEX idx_recurring_payments_organization_id ON recurring_payments(organization_id);

COMMENT ON TABLE recurring_payments IS 'Stores information for recurring payment schedules';

-- Invoices table
CREATE TABLE invoices (
    invoice_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id),
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
    description TEXT,
    currency_code currency_code NOT NULL REFERENCES currencies(code),
    due_date DATE NOT NULL,
    status invoice_status NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_organization_id ON invoices(organization_id);

COMMENT ON TABLE invoices IS 'Stores invoice information for users and organizations';

-- Exchange Rates table
CREATE TABLE exchange_rates (
    xr_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_currency currency_code NOT NULL,
    to_currency currency_code NOT NULL,
    rate NUMERIC(10,6) NOT NULL CHECK (rate > 0),
    effective_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_exchange_rates_currencies ON exchange_rates(from_currency, to_currency);
CREATE INDEX idx_exchange_rates_effective_date ON exchange_rates(effective_date);

COMMENT ON TABLE exchange_rates IS 'Tracks exchange rates between different currencies';