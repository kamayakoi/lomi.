--------------- ENUM TYPES ---------------

CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE transaction_type AS ENUM ('payment', 'refund', 'transfer', 'payout');
CREATE TYPE organization_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE provider_code AS ENUM ('ORANGE', 'WAVE', 'ECOBANK', 'MTN', 'STRIPE', 'PAYPAL', 'LOMI');
CREATE TYPE recurring_payment_type AS ENUM ('subscription', 'installment', 'debt', 'utility', 'other');
CREATE TYPE transfer_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled');
CREATE TYPE refund_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled');
CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled');
CREATE TYPE frequency AS ENUM ('daily', 'weekly', 'bi-weekly', 'monthly', 'yearly', 'one-time');
CREATE TYPE entry_type AS ENUM ('debit', 'credit');
CREATE TYPE country_code AS ENUM ('+233', '+234', '+225', '+254', '+27', '+20', '+212', '+251', '+256', '+221', '+237', '+255', '+222', '+216', '+250', '+260', '+263', '+213', '+33', '+44', '+49', '+39', '+34', '+31', '+46', '+48', '+351', '+30', '+32', '+43', '+1');
CREATE TYPE payment_method_code AS ENUM (
    'CREDIT_CARD', 'DEBIT_CARD', 'MOBILE_MONEY', 'BANK_TRANSFER', 'SEPA', 'PAYPAL',
    'APPLE_PAY', 'GOOGLE_PAY', 'CASH', 'CRYPTOCURRENCY', 'IDEAL', 'COUNTER', 'WAVE',
    'AIRTEL_MONEY', 'MPESA', 'AIRTIME', 'POS', 'BANK_USSD', 'E_WALLET', 'QR_CODE', 'USSD'
);
CREATE TYPE currency_code AS ENUM (
    'XOF', 'XAF', 'NGN', 'GHS', 'KES', 'ZAR', 'EGP', 'MAD', 'RWF', 'ETB', 'ZMW', 'NAD', 'USD', 'EUR', 'MRO'
);
CREATE TYPE payout_status AS ENUM ('pending', 'processing', 'completed', 'failed');

--------------- TABLES ---------------

-- Merchants table
CREATE TABLE merchants (
  merchant_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR,
  email VARCHAR UNIQUE NOT NULL,
  phone_number VARCHAR,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  onboarded BOOLEAN NOT NULL DEFAULT false,
  verified BOOLEAN NOT NULL DEFAULT false,
  country VARCHAR,
  metadata JSONB,
  avatar_url TEXT,
  preferred_language VARCHAR(5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_merchants_email ON merchants(email);
CREATE INDEX idx_active_merchants ON merchants(merchant_id) WHERE deleted_at IS NULL;

COMMENT ON TABLE merchants IS 'Stores information about all merchants using the system';

-- Organizations table
CREATE TABLE organizations (
  organization_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  phone_number VARCHAR NOT NULL,
  country VARCHAR NOT NULL,
  city VARCHAR NOT NULL,
  address VARCHAR NOT NULL, 
  postal_code VARCHAR NOT NULL, 
  status organization_status NOT NULL DEFAULT 'active',
  metadata JSONB,
  max_transactions_per_day INT,
  max_providers INT,
  max_transaction_amount NUMERIC(15,2),
  max_monthly_volume NUMERIC(15,2),
  max_api_calls_per_hour INT,
  max_webhooks INT,
  logo_url TEXT,
  industry VARCHAR, 
  website_url VARCHAR,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES merchants(merchant_id),
  updated_by UUID REFERENCES merchants(merchant_id),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_organizations_email ON organizations(email);
CREATE INDEX idx_organizations_created_by ON organizations(created_by);
CREATE INDEX idx_organizations_updated_by ON organizations(updated_by);

COMMENT ON TABLE organizations IS 'Represents businesses or entities using our application';

-- Merchant-Organization links table
CREATE TABLE merchant_organization_links (
  merchant_org_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
  organization_id UUID NOT NULL REFERENCES organizations(organization_id),
  role VARCHAR NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_merchant_org_links_merchant_id ON merchant_organization_links(merchant_id);
CREATE INDEX idx_merchant_org_links_org_id ON merchant_organization_links(organization_id);

COMMENT ON TABLE merchant_organization_links IS 'Links merchants to organizations, defining their roles within each organization';

-- Providers table
CREATE TABLE providers (
  provider_code provider_code PRIMARY KEY,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE providers IS 'Examples: MTN, WAVE, ORANGE, STRIPE, PAYPAL';
COMMENT ON COLUMN providers.is_active IS 'Indicates if the provider is currently active and available for use in the system';

-- Payment methods table
CREATE TABLE payment_methods (
  payment_method_code payment_method_code PRIMARY KEY,
  provider_code provider_code REFERENCES providers(provider_code),
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
    is_connected BOOLEAN NOT NULL DEFAULT false,
    country_code country_code NOT NULL,
    phone_number VARCHAR,
    card_number VARCHAR,
    bank_account_number VARCHAR,
    bank_account_name VARCHAR,
    bank_name VARCHAR,
    bank_code VARCHAR,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, provider_code)
);

CREATE INDEX idx_org_providers_org_id ON organization_providers(organization_id);
CREATE INDEX idx_org_providers_provider_code ON organization_providers(provider_code);

COMMENT ON TABLE organization_providers IS 'Links organizations to their chosen payment providers';
COMMENT ON COLUMN organization_providers.is_connected IS 'Indicates if the organization has successfully connected and set up the provider';

-- Currencies table
CREATE TABLE currencies (
  code currency_code PRIMARY KEY,
  name VARCHAR NOT NULL
);

COMMENT ON TABLE currencies IS 'Examples: USD, EUR, XOF, GHS, NGN, etc.';

-- lomi/Admin Balances table
CREATE TABLE lomi_balances (
  balance_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  currency_code currency_code NOT NULL REFERENCES currencies(code),
  balance NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (balance >= 0),
  total_transactions INT NOT NULL DEFAULT 0 CHECK (total_transactions >= 0),
  total_fees NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (total_fees >= 0),
  total_amount NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
  last_transaction_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (currency_code)
);

CREATE INDEX idx_lomi_balances_currency_code ON lomi_balances(currency_code);
CREATE INDEX idx_lomi_balances_last_transaction_at ON lomi_balances(last_transaction_at);

COMMENT ON TABLE lomi_balances IS 'Stores Lomi''s balance, total transactions, total fees, and total amount for each currency after deducting fees from users'' end customers transactions';

-- lomi/Admin Payouts table
CREATE TABLE lomi_payouts (
  payout_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(organization_id),
  amount NUMERIC(15,2) NOT NULL CHECK (amount > 0),
  currency_code currency_code NOT NULL REFERENCES currencies(code),
  payout_method VARCHAR NOT NULL,
  payout_details JSONB,
  status payout_status NOT NULL DEFAULT 'pending',
  created_by UUID REFERENCES merchants(merchant_id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lomi_payouts_organization_id ON lomi_payouts(organization_id);
CREATE INDEX idx_lomi_payouts_currency_code ON lomi_payouts(currency_code);
CREATE INDEX idx_lomi_payouts_status ON lomi_payouts(status);
CREATE INDEX idx_lomi_payouts_created_by ON lomi_payouts(created_by);
CREATE INDEX idx_lomi_payouts_created_at ON lomi_payouts(created_at);

COMMENT ON TABLE lomi_payouts IS 'Stores information about the payouts made by Lomi to organizations';


-- lomi/Admin Balances table
CREATE TABLE provider_balances (
  balance_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_code provider_code NOT NULL REFERENCES providers(provider_code),
  currency_code currency_code NOT NULL REFERENCES currencies(code),
  balance NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (balance >= 0),
  total_transactions INT NOT NULL DEFAULT 0 CHECK (total_transactions >= 0),
  total_fees NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (total_fees >= 0),
  total_amount NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
  last_transaction_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (provider_code, currency_code)
);

CREATE INDEX idx_provider_balances_provider_code ON provider_balances(provider_code);
CREATE INDEX idx_provider_balances_currency_code ON provider_balances(currency_code);
CREATE INDEX idx_provider_balances_last_transaction_at ON provider_balances(last_transaction_at);

COMMENT ON TABLE provider_balances IS 'Stores the balance, total transactions, total fees, and total amount for each provider and currency';

-- Accounts table
CREATE TABLE accounts (
    account_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
    balance NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (balance >= 0),
    payment_method_code payment_method_code NOT NULL REFERENCES payment_methods(payment_method_code),
    currency_code currency_code NOT NULL REFERENCES currencies(code),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_active BOOLEAN NOT NULL DEFAULT true,
    UNIQUE (merchant_id, payment_method_code, currency_code)
);

CREATE INDEX idx_accounts_merchant_id ON accounts(merchant_id);
CREATE INDEX idx_accounts_payment_method_code ON accounts(payment_method_code);
CREATE INDEX idx_accounts_currency_code ON accounts(currency_code);

COMMENT ON TABLE accounts IS 'Represents financial accounts for merchants, linked to specific payment methods and currencies';

-- Main accounts table
CREATE TABLE main_accounts (
    main_account_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
    balance NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (balance >= 0),
    currency_code currency_code NOT NULL REFERENCES currencies(code),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (merchant_id, currency_code)
);

CREATE INDEX idx_main_accounts_merchant_id ON main_accounts(merchant_id);

COMMENT ON TABLE main_accounts IS 'Identifies the primary account for each merchant in each currency';

-- Customers table
CREATE TABLE customers (
    customer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    name VARCHAR NOT NULL,
    email VARCHAR,
    phone_number VARCHAR,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_customers_merchant_id ON customers(merchant_id);
CREATE INDEX idx_customers_organization_id ON customers(organization_id);

COMMENT ON TABLE customers IS 'Stores information about the customers of our merchants';

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
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    customer_id UUID REFERENCES customers(customer_id),
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

CREATE INDEX idx_transactions_merchant_id ON transactions(merchant_id);
CREATE INDEX idx_transactions_organization_id ON transactions(organization_id);
CREATE INDEX idx_transactions_customer_id ON transactions(customer_id);
CREATE INDEX idx_transactions_transaction_type ON transactions(transaction_type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_currency_code ON transactions(currency_code);
CREATE INDEX idx_transactions_payment_method_code ON transactions(payment_method_code);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_transactions_amount ON transactions(amount);
CREATE INDEX idx_transactions_pending ON transactions(transaction_id) WHERE status = 'pending';
CREATE INDEX idx_transactions_completed ON transactions(transaction_id) WHERE status = 'completed';

COMMENT ON TABLE transactions IS 'Records all financial transactions in the system';

-- Recurring Payments table
CREATE TABLE recurring_payments (
    recurring_payment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
    currency_code currency_code NOT NULL REFERENCES currencies(code),
    payment_method_code payment_method_code NOT NULL REFERENCES payment_methods(payment_method_code),
    payment_type recurring_payment_type NOT NULL,
    frequency VARCHAR NOT NULL CHECK (frequency IN ('daily', 'weekly', 'bi-weekly', 'monthly', 'yearly', 'one-time')),
    start_date DATE NOT NULL,
    end_date DATE,
    total_cycles INT,
    retry_payment_every INT,
    total_retries INT,
    failed_payment_action VARCHAR,
    email_notifications JSONB,
    charge_immediately BOOLEAN NOT NULL DEFAULT true,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_recurring_payments_merchant_id ON recurring_payments(merchant_id);
CREATE INDEX idx_recurring_payments_organization_id ON recurring_payments(organization_id);

COMMENT ON TABLE recurring_payments IS 'Stores information for recurring payment schedules';

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

COMMENT ON TABLE refunds IS 'Tracks refunds linked to transactions';

-- Entries table
CREATE TABLE entries (
    entry_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES accounts(account_id),
    transaction_id UUID REFERENCES transactions(transaction_id),
    amount NUMERIC(10,2) NOT NULL CHECK (amount != 0),
    entry_type entry_type NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_entries_account_id ON entries(account_id);
CREATE INDEX idx_entries_transaction_id ON entries(transaction_id);
CREATE INDEX idx_entries_created_at ON entries(created_at);

COMMENT ON TABLE entries IS 'Ledger entries for tracking account balance changes';

-- [EXPERIMENTAL] Transfers table
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

COMMENT ON TABLE transfers IS 'Records transfers between merchants accounts within the system';

-- Internal Transfers table
CREATE TABLE internal_transfers (
    internal_transfer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_account_id UUID NOT NULL REFERENCES accounts(account_id),
    to_main_account_id UUID NOT NULL REFERENCES main_accounts(main_account_id),
    amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
    currency_code currency_code NOT NULL REFERENCES currencies(code),
    status transfer_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_internal_transfers_from_account_id ON internal_transfers(from_account_id);
CREATE INDEX idx_internal_transfers_to_main_account_id ON internal_transfers(to_main_account_id);

COMMENT ON TABLE internal_transfers IS 'Records transfers from individual accounts to main accounts';

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
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    api_key VARCHAR NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    expiration_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_used_at TIMESTAMPTZ
);

CREATE INDEX idx_api_keys_merchant_id ON api_keys(merchant_id);
CREATE INDEX idx_api_keys_api_key ON api_keys(api_key);

COMMENT ON TABLE api_keys IS 'Stores API keys for authenticated access to the system';

-- Webhooks table
CREATE TABLE webhooks (
  webhook_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
  url VARCHAR NOT NULL,
  events VARCHAR[] NOT NULL,
  secret VARCHAR NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_triggered_at TIMESTAMPTZ
);

CREATE INDEX idx_webhooks_merchant_id ON webhooks(merchant_id);

COMMENT ON TABLE webhooks IS 'Configures webhook endpoints for real-time event notifications';

-- Logs table
CREATE TABLE logs (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID REFERENCES merchants(merchant_id),
    action VARCHAR NOT NULL,
    details JSONB,
    severity VARCHAR NOT NULL CHECK (severity IN ('INFO', 'WARNING', 'ERROR', 'CRITICAL')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_logs_merchant_id ON logs(merchant_id);
CREATE INDEX idx_logs_created_at ON logs(created_at);

COMMENT ON TABLE logs IS 'Audit log for tracking important actions and events in the system';

-- Invoices table
CREATE TABLE invoices (
    invoice_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
    description TEXT,
    currency_code currency_code NOT NULL REFERENCES currencies(code),
    due_date DATE NOT NULL,
    status invoice_status NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_invoices_merchant_id ON invoices(merchant_id);
CREATE INDEX idx_invoices_organization_id ON invoices(organization_id);

COMMENT ON TABLE invoices IS 'Stores invoice information for merchants and organizations';

-- Metrics table
CREATE TABLE metrics (
    metric_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    value NUMERIC NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    labels JSONB,
    organization_id UUID REFERENCES organizations(organization_id)
);

CREATE INDEX idx_metrics_name ON metrics(name);
CREATE INDEX idx_metrics_timestamp ON metrics(timestamp);
CREATE INDEX idx_metrics_organization_id ON metrics(organization_id);

COMMENT ON TABLE metrics IS 'Stores metrics for monitoring and observability';