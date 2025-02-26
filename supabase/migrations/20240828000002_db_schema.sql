--------------- ENUM TYPES ---------------

CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE transaction_type AS ENUM ('payment', 'instalment');
CREATE TYPE organization_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE provider_code AS ENUM ('ORANGE', 'WAVE', 'ECOBANK', 'MTN', 'NOWPAYMENTS', 'APPLE', 'GOOGLE', 'MOOV', 'AIRTEL', 'MPESA', 'WIZALL', 'OPAY', 'PAYPAL', 'OZOW', 'OTHER');
CREATE TYPE refund_status AS ENUM ('pending', 'completed', 'failed');
CREATE TYPE invoice_status AS ENUM ('sent', 'paid', 'overdue', 'cancelled');
CREATE TYPE frequency AS ENUM ('weekly', 'bi-weekly', 'monthly', 'bi-monthly', 'quarterly', 'semi-annual', 'yearly', 'one-time');
CREATE TYPE subscription_status AS ENUM ('pending', 'active', 'paused', 'cancelled', 'expired', 'past_due', 'trial');
CREATE TYPE kyc_status AS ENUM ('not_submitted', 'pending', 'not_authorized', 'approved', 'rejected');
CREATE TYPE payment_method_code AS ENUM ('CARDS', 'MOBILE_MONEY', 'E_WALLET', 'APPLE_PAY', 'GOOGLE_PAY', 'USSD', 'QR_CODE', 'BANK_TRANSFER', 'CRYPTO', 'PAYPAL', 'OTHER');
CREATE TYPE currency_code AS ENUM ('XOF', 'USD', 'EUR', 'GHS', 'NGN', 'KES', 'MRO');
CREATE TYPE payout_status AS ENUM ('pending', 'processing', 'completed', 'failed');
CREATE TYPE dispute_status AS ENUM ('pending', 'resolved', 'closed');
CREATE TYPE entity_type AS ENUM ('merchant', 'organization', 'platform');
CREATE TYPE feedback_status AS ENUM ('open', 'reviewed', 'implemented', 'closed');
CREATE TYPE ticket_status AS ENUM ('open', 'resolved', 'closed');
CREATE TYPE link_type AS ENUM ('product', 'plan', 'instant');
CREATE TYPE notification_type AS ENUM ('onboarding', 'tip', 'transaction', 'payout', 'provider_status', 'alert', 'billing', 'compliance', 'update', 'security_alert', 'maintenance', 'dispute', 'refund', 'invoice', 'subscription', 'webhook', 'chargeback');
CREATE TYPE support_category AS ENUM ('account', 'billing', 'technical', 'feature', 'other');
CREATE TYPE support_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE support_priority AS ENUM ('low', 'normal', 'high', 'urgent');
CREATE TYPE fee_type AS ENUM ('platform', 'processing', 'conversion', 'payout', 'refund');
CREATE TYPE team_status AS ENUM ('active', 'invited', 'inactive');
CREATE TYPE member_role AS ENUM ('Admin', 'Member');
CREATE TYPE event_type AS ENUM (
    -- Authentication & Security
    'create_api_key',
    'edit_api_key',
    'remove_api_key',
    'user_login',
    'edit_user_password',
    'create_pin',
    'edit_pin',
    'edit_user_details',
    'authorize_user_2fa',
    'create_user_2fa',
    'remove_user_2fa',
    'edit_user_phone',
    
    -- Settings & Configuration
    'set_callback_url',
    'update_webhook',
    
    -- Banking & Payouts
    'add_bank_account',
    'remove_bank_account',
    'create_payout',
    'payout_status_change',
    
    -- Payments & Transactions
    'process_payment',
    'payment_status_change',
    'create_refund',
    'refund_status_change',
    'create_dispute',
    'dispute_status_change',
    
    -- Subscriptions
    'create_subscription',
    'cancel_subscription',
    'subscription_status_change',
    'subscription_payment_failed',
    
    -- Products & Services
    'create_product',
    'update_product',
    'delete_product',
    
    -- Provider Integration
    'provider_status_change',
    'provider_connection_error',
    'provider_integration_success',
    
    -- System & Maintenance
    'system_maintenance',
    'system_update',
    'compliance_update',
    'api_status_change',
    
    -- Customer Management
    'customer_verification_required',
    'customer_verification_success',
    'customer_verification_failed'
);
CREATE TYPE webhook_event AS ENUM (
    'new_payment',
    'new_subscription',
    'payment_status_change',
    'subscription_status_change',
    'payout_status_change',
    'payment_session_completed',
    'payment_session_expired',
    'invoice_paid',
    'payment_succeeded',
    'payment_pending',
    'payment_failed',
    'payment_token_status',
    'recurring'
);
CREATE TYPE failed_payment_action AS ENUM ('cancel', 'pause', 'continue');
CREATE TYPE first_payment_type AS ENUM ('initial', 'non_initial');
CREATE TYPE provider_payment_status AS ENUM ('processing', 'cancelled', 'succeeded');
CREATE TYPE provider_business_type AS ENUM ('fintech', 'other');
CREATE TYPE permission_category AS ENUM ('payments', 'accounts', 'products', 'subscriptions', 'customers');
CREATE TYPE permission_action AS ENUM ('view', 'create', 'edit', 'delete', 'approve');
CREATE TYPE reconciliation_status AS ENUM ('pending', 'matched', 'partial_match', 'mismatch', 'resolved');
CREATE TYPE conversion_type AS ENUM ('payment', 'withdrawal', 'refund', 'manual');

--------------- TABLES ---------------

-- Merchants table
CREATE TABLE merchants (
  merchant_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR,
  email VARCHAR UNIQUE NOT NULL,
  phone_number VARCHAR UNIQUE,
  onboarded BOOLEAN NOT NULL DEFAULT false,
  country VARCHAR,
  avatar_url TEXT,
  preferred_language VARCHAR(10) NOT NULL DEFAULT 'en',
  timezone VARCHAR NOT NULL DEFAULT 'UTC',
  referral_code VARCHAR,
  pin_code VARCHAR(4),
  mrr NUMERIC(15,2) NOT NULL DEFAULT 0.00,
  arr NUMERIC(15,2) NOT NULL DEFAULT 0.00,
  merchant_lifetime_value NUMERIC(15,2) NOT NULL DEFAULT 0.00,
  retry_payment_every INT DEFAULT 0,
  total_retries INT DEFAULT 0,
  subscription_notifications JSONB,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE merchants IS 'Stores information about all merchants using the system';
COMMENT ON COLUMN merchants.mrr IS 'Monthly Recurring Revenue: Total recurring revenue generated by the merchant in the current month';
COMMENT ON COLUMN merchants.arr IS 'Annual Recurring Revenue: Total recurring revenue generated by the merchant in the current year';
COMMENT ON COLUMN merchants.merchant_lifetime_value IS 'Estimated total revenue a merchant will generate over their lifetime';

-- Organizations table
CREATE TABLE organizations (
  organization_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  phone_number VARCHAR NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  website_url VARCHAR,
  logo_url VARCHAR,
  status organization_status NOT NULL DEFAULT 'active',
  default_currency currency_code NOT NULL DEFAULT 'XOF',
  total_revenue NUMERIC(15,2) DEFAULT 0.00,
  total_transactions INT DEFAULT 0,
  total_merchants INT DEFAULT 0,
  total_customers INT DEFAULT 0,
  employee_number VARCHAR,
  industry VARCHAR,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE organizations IS 'Represents businesses or entities using our application';
COMMENT ON COLUMN organizations.status IS 'Current status of the organization account';


-- Organization Addresses table
CREATE TABLE organization_addresses (
  organization_id UUID NOT NULL PRIMARY KEY REFERENCES organizations(organization_id),
  country VARCHAR NOT NULL,
  region VARCHAR,
  city VARCHAR,
  district VARCHAR,
  street VARCHAR,
  postal_code VARCHAR,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE organization_addresses IS 'Stores address information for organizations';

-- Organization KYC table
CREATE TABLE organization_kyc (
  organization_id UUID NOT NULL REFERENCES organizations(organization_id),
  merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
  legal_organization_name VARCHAR,
  tax_number VARCHAR,
  business_description VARCHAR,
  legal_country VARCHAR,
  legal_region VARCHAR,
  legal_city VARCHAR,
  legal_postal_code VARCHAR,
  legal_street VARCHAR,
  proof_of_business VARCHAR,
  business_platform_url VARCHAR,
  authorized_signatory_name VARCHAR,
  authorized_signatory_email VARCHAR,
  authorized_signatory_phone_number VARCHAR,
  legal_representative_ID_url VARCHAR,
  address_proof_url VARCHAR,
  business_registration_url VARCHAR,
  status kyc_status NOT NULL DEFAULT 'pending',
  kyc_submitted_at TIMESTAMPTZ,
  kyc_approved_at TIMESTAMPTZ,
  PRIMARY KEY (organization_id, merchant_id)
);

CREATE INDEX idx_organization_kyc_organization_id ON organization_kyc(organization_id);
CREATE INDEX idx_organization_kyc_merchant_id ON organization_kyc(merchant_id);

COMMENT ON TABLE organization_kyc IS 'Stores KYC information for organizations';


-- Merchant-Organization links table
CREATE TABLE merchant_organization_links (
  merchant_org_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  merchant_id UUID REFERENCES merchants(merchant_id),
  organization_id UUID NOT NULL REFERENCES organizations(organization_id),
  role member_role NOT NULL,
  team_status team_status NOT NULL DEFAULT 'active',
  category permission_category,
  action permission_action,
  store_handle VARCHAR NOT NULL,
  organization_position VARCHAR,
  invitation_email VARCHAR,
  how_did_you_hear_about_us VARCHAR,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT valid_member CHECK (
    (team_status = 'invited' AND merchant_id IS NULL AND invitation_email IS NOT NULL) OR
    (team_status IN ('active', 'inactive') AND merchant_id IS NOT NULL AND invitation_email IS NULL)
  ),
  UNIQUE (organization_id, store_handle),
  UNIQUE (merchant_id, organization_id),
  UNIQUE (organization_id, invitation_email)
);

COMMENT ON TABLE merchant_organization_links IS 'Links merchants to organizations, defining their roles (Admin or Member) and managing team membership. Handles both active members and pending invitations.';

-- Providers table
CREATE TABLE providers (
  name VARCHAR NOT NULL PRIMARY KEY,
  code provider_code NOT NULL UNIQUE,
  description TEXT
);

COMMENT ON TABLE providers IS 'Examples: MTN, WAVE, ORANGE, PAYPAL';

-- Payment methods table
CREATE TABLE payment_methods (
  payment_method_code payment_method_code,
  provider_code provider_code REFERENCES providers(code),
  PRIMARY KEY (payment_method_code, provider_code)
);

CREATE INDEX idx_payment_methods_provider_code ON payment_methods(provider_code);

COMMENT ON TABLE payment_methods IS 'Examples: CARD, MOBILE_MONEY, CASH, BANK_TRANSFER';

-- Organization-Providers Settings table
CREATE TABLE organization_providers_settings (
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    provider_code provider_code NOT NULL REFERENCES providers(code),
    provider_merchant_id VARCHAR(255),
    provider_business_type provider_business_type DEFAULT 'other',
    is_connected BOOLEAN NOT NULL DEFAULT false,
    phone_number VARCHAR,
    is_phone_verified BOOLEAN NOT NULL DEFAULT false,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    email_sent BOOLEAN NOT NULL DEFAULT false,
    PRIMARY KEY (organization_id, provider_code),
    UNIQUE (organization_id, provider_code)
);

CREATE INDEX idx_org_providers_provider_code ON organization_providers_settings(provider_code);

COMMENT ON TABLE organization_providers_settings IS 'Links organizations to their chosen payment providers';
COMMENT ON COLUMN organization_providers_settings.is_connected IS 'Indicates if the organization has successfully connected and set up the provider';
COMMENT ON COLUMN organization_providers_settings.phone_number IS 'The phone number associated with the provider account';
COMMENT ON COLUMN organization_providers_settings.is_phone_verified IS 'Indicates if the phone number has been verified';
COMMENT ON COLUMN organization_providers_settings.metadata IS 'Save Organizations / Providers crucial information such as partner account ID or other settings';

-- Currencies table
CREATE TABLE currencies (
  code currency_code PRIMARY KEY,
  name VARCHAR NOT NULL
);

COMMENT ON TABLE currencies IS 'Examples: USD, EUR, XOF, GHS, NGN, etc.';


-- Customers table
CREATE TABLE customers (
    customer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    name VARCHAR NOT NULL,
    email VARCHAR,
    phone_number VARCHAR,
    whatsapp_number VARCHAR,
    country VARCHAR,
    city VARCHAR,
    address VARCHAR,
    postal_code VARCHAR,
    is_business BOOLEAN NOT NULL DEFAULT false,
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    deleted_at TIMESTAMPTZ,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE customers IS 'Stores information about the customers of our merchants, including both individual and business customers';
COMMENT ON COLUMN customers.is_business IS 'Indicates whether the customer is a business (true) or an individual (false)';
COMMENT ON COLUMN customers.metadata IS 'Additional customer-specific data in JSON format, can include business details if needed';

CREATE INDEX idx_customers_merchant_id ON customers(merchant_id);
CREATE INDEX idx_customers_organization_id ON customers(organization_id);

-- Merchant Accounts table
CREATE TABLE merchant_accounts (
    account_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID REFERENCES merchants(merchant_id),
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    balance NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (balance >= 0),
    currency_code currency_code NOT NULL REFERENCES currencies(code) DEFAULT 'XOF',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, currency_code),
    CHECK (merchant_id IS NOT NULL OR organization_id IS NOT NULL)
);

COMMENT ON TABLE merchant_accounts IS 'Represents the account for each merchant, storing their balance in each currency';

CREATE INDEX idx_merchant_accounts_currency_code ON merchant_accounts(currency_code);
CREATE INDEX idx_merchant_accounts_merchant_id ON merchant_accounts(merchant_id);

-- Balance access rules
CREATE TABLE team_balance_access_rules (
    rule_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    merchant_id UUID REFERENCES merchants(merchant_id),
    account_id UUID REFERENCES merchant_accounts(account_id),
    role member_role NOT NULL,
    can_view BOOLEAN NOT NULL DEFAULT FALSE,
    can_withdraw BOOLEAN NOT NULL DEFAULT FALSE,
    approval_required BOOLEAN NOT NULL DEFAULT FALSE,
    withdraw_limit NUMERIC(15,2),
    currency_code currency_code,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_limit CHECK (
        NOT can_withdraw OR 
        (can_withdraw AND (withdraw_limit IS NULL OR (withdraw_limit IS NOT NULL AND currency_code IS NOT NULL)))
    )
);

CREATE INDEX idx_team_balance_access_rules_organization_id ON team_balance_access_rules(organization_id);
CREATE INDEX idx_team_balance_access_rules_merchant_id ON team_balance_access_rules(merchant_id);
CREATE INDEX idx_team_balance_access_rules_account_id ON team_balance_access_rules(account_id);
CREATE INDEX idx_team_balance_access_rules_role ON team_balance_access_rules(role);

-- Merchant Outstanding Balance table
CREATE TABLE merchant_outstanding_balance (
    balance_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    amount NUMERIC(15,2) NOT NULL DEFAULT 0,
    currency_code currency_code NOT NULL REFERENCES currencies(code) DEFAULT 'XOF',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metadata JSONB,
    UNIQUE (merchant_id, organization_id, currency_code)
);

COMMENT ON TABLE merchant_outstanding_balance IS 'Tracks outstanding balances that merchants owe to the platform (e.g., from chargebacks)';
COMMENT ON COLUMN merchant_outstanding_balance.amount IS 'Current outstanding balance amount';
COMMENT ON COLUMN merchant_outstanding_balance.metadata IS 'Additional information about the outstanding balance, including history of changes';

CREATE INDEX idx_merchant_outstanding_balance_currency_code ON merchant_outstanding_balance(currency_code);
CREATE INDEX idx_merchant_outstanding_balance_organization_id ON merchant_outstanding_balance(organization_id);

-- Platform Main account table
CREATE TABLE platform_main_account (
    balance_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    total_balance NUMERIC(15,2) NOT NULL DEFAULT 0,
    available_balance NUMERIC(15,2) NOT NULL DEFAULT 0,
    currency_code currency_code NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (currency_code)
);

COMMENT ON TABLE platform_main_account IS 'Tracks the overall platform balance across all currencies';

-- Platform Provider Balance table
CREATE TABLE platform_provider_balance (
    provider_code provider_code NOT NULL,
    total_transactions_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
    current_balance NUMERIC(15,2) NOT NULL DEFAULT 0,
    currency_code currency_code NOT NULL,
    provider_fees NUMERIC(15,2) NOT NULL DEFAULT 0,
    platform_revenue NUMERIC(15,2) NOT NULL DEFAULT 0,
    quarter_start_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (provider_code, currency_code, quarter_start_date)
);

COMMENT ON TABLE platform_provider_balance IS 'Tracks the balance for each provider in each currency';

-- Platform Provider Balance History table
CREATE TABLE platform_provider_balance_history (
    history_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_code provider_code NOT NULL,
    total_transactions_amount NUMERIC(15,2) NOT NULL,
    final_balance NUMERIC(15,2) NOT NULL,
    currency_code currency_code NOT NULL,
    provider_fees NUMERIC(15,2) NOT NULL,
    platform_revenue NUMERIC(15,2) NOT NULL,
    quarter_start_date DATE NOT NULL,
    quarter_end_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE platform_provider_balance_history IS 'Tracks historical balance changes for each provider';


-- Merchant Products table
CREATE TABLE merchant_products (
    product_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    currency_code currency_code NOT NULL REFERENCES currencies(code),
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_on_storefront BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE merchant_products IS 'Stores products and services offered by merchants';

CREATE INDEX idx_merchant_products_currency_code ON merchant_products(currency_code);
CREATE INDEX idx_merchant_products_merchant_id ON merchant_products(merchant_id);
CREATE INDEX idx_merchant_products_organization_id ON merchant_products(organization_id);

-- Plans table
CREATE TABLE subscription_plans (
    plan_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    billing_frequency frequency NOT NULL,
    amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
    currency_code currency_code NOT NULL DEFAULT 'XOF',
    failed_payment_action failed_payment_action,
    charge_day INT CHECK (charge_day >= 1 AND charge_day <= 31 OR charge_day IS NULL),
    metadata JSONB,
    display_on_storefront BOOLEAN NOT NULL DEFAULT true,
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    first_payment_type first_payment_type NOT NULL DEFAULT 'initial',
    FOREIGN KEY (currency_code) REFERENCES currencies(code)
);

COMMENT ON TABLE subscription_plans IS 'Stores information about available subscription plans';
COMMENT ON COLUMN subscription_plans.billing_frequency IS 'Frequency of billing for the subscription plan';
COMMENT ON COLUMN subscription_plans.amount IS 'Amount to be charged per billing cycle';
COMMENT ON COLUMN subscription_plans.failed_payment_action IS 'Action to take when payment fails after all retry attempts';

CREATE INDEX idx_subscription_plans_currency_code ON subscription_plans(currency_code);
CREATE INDEX idx_subscription_plans_merchant_id ON subscription_plans(merchant_id);
CREATE INDEX idx_subscription_plans_organization_id ON subscription_plans(organization_id);

-- Subscriptions table
CREATE TABLE merchant_subscriptions (
    subscription_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    plan_id UUID NOT NULL REFERENCES subscription_plans(plan_id),
    customer_id UUID NOT NULL REFERENCES customers(customer_id),
    status subscription_status NOT NULL DEFAULT 'pending',
    start_date DATE NOT NULL,
    end_date DATE,
    next_billing_date DATE,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


COMMENT ON TABLE merchant_subscriptions IS 'Stores information for recurring payments and subscriptions, including status and visual representation';
COMMENT ON COLUMN merchant_subscriptions.next_billing_date IS 'The next billing date of the subscription';
COMMENT ON COLUMN merchant_subscriptions.status IS 'Current status of the subscription (active, paused, cancelled, expired)';
COMMENT ON TYPE subscription_status IS 'Enum for subscription statuses:
- active: Subscription is currently active and payments are up-to-date
- paused: Subscription is temporarily paused (e.g., at customer''s request)
- cancelled: Subscription has been cancelled but may still be active until the end of the current billing period
- expired: Subscription has reached its end date or maximum number of billing cycles
- past_due: Payment is overdue but the subscription is still active
- pending: Subscription has been created but is not yet active (e.g., waiting for initial payment)
- trial: Subscription is in a trial period';

CREATE INDEX idx_merchant_subscriptions_customer_id ON merchant_subscriptions(customer_id);
CREATE INDEX idx_merchant_subscriptions_merchant_id ON merchant_subscriptions(merchant_id);
CREATE INDEX idx_merchant_subscriptions_plan_id ON merchant_subscriptions(plan_id);
CREATE INDEX idx_merchant_subscriptions_organization_id ON merchant_subscriptions(organization_id);

-- Fees table
CREATE TABLE fees (
    fee_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL UNIQUE,
    transaction_type transaction_type NOT NULL,
    fee_type fee_type NOT NULL,
    percentage NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (percentage >= -100 AND percentage <= 100),
    fixed_amount NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (fixed_amount >= 0),
    currency_code currency_code NOT NULL REFERENCES currencies(code),
    payment_method_code payment_method_code,
    provider_code provider_code,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (payment_method_code, provider_code) REFERENCES payment_methods(payment_method_code, provider_code)
);

COMMENT ON TABLE fees IS 'Defines fee structures for different transaction types and payment methods';

CREATE INDEX idx_fees_currency_code ON fees(currency_code);
CREATE INDEX idx_fees_payment_method_provider ON fees(payment_method_code, provider_code);

-- Transactions table
CREATE TABLE transactions (
    transaction_id UUID PRIMARY KEY UNIQUE DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    customer_id UUID NOT NULL REFERENCES customers(customer_id),
    product_id UUID REFERENCES merchant_products(product_id),
    subscription_id UUID REFERENCES merchant_subscriptions(subscription_id),
    transaction_type transaction_type NOT NULL,
    status transaction_status NOT NULL DEFAULT 'pending',
    description TEXT,
    metadata JSONB,
    gross_amount NUMERIC(10,2) NOT NULL CHECK (gross_amount > 0),
    fee_amount NUMERIC(15,2) NOT NULL,
    net_amount NUMERIC(10,2) NOT NULL CHECK (net_amount > 0),
    fee_reference TEXT NOT NULL REFERENCES fees(name),
    currency_code currency_code NOT NULL REFERENCES currencies(code) DEFAULT 'XOF',
    provider_code provider_code NOT NULL REFERENCES providers(code),
    payment_method_code payment_method_code NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (payment_method_code, provider_code) REFERENCES payment_methods(payment_method_code, provider_code),
    additional_fees JSONB DEFAULT '[]'::jsonb
);

COMMENT ON TABLE transactions IS 'Records all financial transactions in the system';
COMMENT ON COLUMN transactions.metadata IS 'Additional transaction-specific data in JSON format';
COMMENT ON COLUMN transactions.gross_amount IS 'Total transaction amount including fees';
COMMENT ON COLUMN transactions.fee_amount IS 'Total fees charged for the transaction';
COMMENT ON COLUMN transactions.net_amount IS 'Amount received by the merchant after deducting fees';

CREATE INDEX idx_transactions_currency_code ON transactions(currency_code);
CREATE INDEX idx_transactions_customer_id ON transactions(customer_id);
CREATE INDEX idx_transactions_fee_reference ON transactions(fee_reference);
CREATE INDEX idx_transactions_merchant_id ON transactions(merchant_id);
CREATE INDEX idx_transactions_organization_id ON transactions(organization_id);
CREATE INDEX idx_transactions_payment_method_provider ON transactions(payment_method_code, provider_code);
CREATE INDEX idx_transactions_product_id ON transactions(product_id);
CREATE INDEX idx_transactions_provider_code ON transactions(provider_code);
CREATE INDEX idx_transactions_subscription_id ON transactions(subscription_id);

-- Multi-payment transactions
CREATE TABLE payment_groups (
    group_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
    customer_id UUID REFERENCES customers(customer_id),
    product_id UUID REFERENCES merchant_products(product_id),
    subscription_id UUID REFERENCES merchant_subscriptions(subscription_id),
    total_amount NUMERIC(15,2) NOT NULL,
    currency_code currency_code NOT NULL REFERENCES currencies(code),
    status transaction_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT product_or_subscription CHECK (
        (product_id IS NOT NULL AND subscription_id IS NULL) OR 
        (product_id IS NULL AND subscription_id IS NOT NULL)
    )
);

CREATE INDEX idx_payment_groups_organization_id ON payment_groups(organization_id);
CREATE INDEX idx_payment_groups_merchant_id ON payment_groups(merchant_id);
CREATE INDEX idx_payment_groups_customer_id ON payment_groups(customer_id);
CREATE INDEX idx_payment_groups_product_id ON payment_groups(product_id);
CREATE INDEX idx_payment_groups_subscription_id ON payment_groups(subscription_id);
CREATE INDEX idx_payment_groups_status ON payment_groups(status);
CREATE INDEX idx_payment_groups_currency_code ON payment_groups(currency_code);

-- Individual payments within a group
CREATE TABLE payment_group_items (
    item_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES payment_groups(group_id) ON DELETE CASCADE,
    amount NUMERIC(15,2) NOT NULL,
    provider_code provider_code,
    payment_method_code payment_method_code,
    transaction_id UUID REFERENCES transactions(transaction_id),
    status transaction_status NOT NULL DEFAULT 'pending',
    payment_link VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE INDEX idx_payment_group_items_group_id ON payment_group_items(group_id);
CREATE INDEX idx_payment_group_items_transaction_id ON payment_group_items(transaction_id);
CREATE INDEX idx_payment_group_items_status ON payment_group_items(status);

-- Create a table for payment group configuration
CREATE TABLE payment_group_config (
    config_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    max_split_count INT NOT NULL DEFAULT 3 CHECK (max_split_count >= 1 AND max_split_count <= 10),
    min_payment_percentage NUMERIC(5,2) NOT NULL DEFAULT 10 CHECK (min_payment_percentage > 0 AND min_payment_percentage <= 100),
    split_expiry_hours INT NOT NULL DEFAULT 24 CHECK (split_expiry_hours > 0),
    allow_different_providers BOOLEAN NOT NULL DEFAULT TRUE,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id)
);

CREATE INDEX idx_payment_group_config_organization_id ON payment_group_config(organization_id);

-- Providers Transactions table
CREATE TABLE providers_transactions (
    transaction_id UUID PRIMARY KEY REFERENCES transactions(transaction_id),
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
    provider_code provider_code NOT NULL REFERENCES providers(code),
    provider_checkout_id VARCHAR(255),
    provider_payment_status provider_payment_status NOT NULL DEFAULT 'processing',
    provider_transaction_id VARCHAR(255),
    checkout_url TEXT,
    error_url TEXT,
    success_url TEXT,
    error_code VARCHAR(100),
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (provider_code, provider_checkout_id),
    UNIQUE (provider_code, provider_transaction_id)
);

COMMENT ON TABLE providers_transactions IS 'Stores provider-specific transaction data including Wave checkout sessions';

CREATE INDEX idx_providers_transactions_merchant_id ON providers_transactions(merchant_id);

-- Refunds table
CREATE TABLE refunds (
    refund_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES transactions(transaction_id),
    amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
    refunded_amount NUMERIC(10,2) NOT NULL CHECK (refunded_amount > 0),
    fee_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    reason TEXT,
    metadata JSONB,
    status refund_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE refunds IS 'Tracks refunds linked to transactions';
COMMENT ON COLUMN refunds.amount IS 'Original transaction amount';
COMMENT ON COLUMN refunds.refunded_amount IS 'Amount refunded to the customer';
COMMENT ON COLUMN refunds.fee_amount IS 'Fee charged for processing the refund';

CREATE INDEX idx_refunds_transaction_id ON refunds(transaction_id);

-- Merchant Bank Accounts table
CREATE TABLE merchant_bank_accounts (
    bank_account_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    account_number VARCHAR NOT NULL,
    account_name VARCHAR NOT NULL,
    bank_name VARCHAR NOT NULL,
    bank_code VARCHAR,
    branch_code VARCHAR,
    country VARCHAR,
    is_default BOOLEAN NOT NULL DEFAULT false,
    is_valid BOOLEAN NOT NULL DEFAULT false,
    auto_withdrawal_enabled BOOLEAN NOT NULL DEFAULT false,
    auto_withdrawal_day INT CHECK (auto_withdrawal_day >= 1 AND auto_withdrawal_day <= 31),
    auto_withdrawal_last_run TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (merchant_id, account_number)
);

COMMENT ON TABLE merchant_bank_accounts IS 'Stores bank account information for merchants';
CREATE INDEX idx_merchant_bank_accounts_organization_id ON merchant_bank_accounts(organization_id);

-- Payouts table
CREATE TABLE payouts (
    payout_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES merchant_accounts(account_id),
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
    organization_id UUID REFERENCES organizations(organization_id),
    bank_account_id UUID REFERENCES merchant_bank_accounts(bank_account_id),
    amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
    currency_code currency_code NOT NULL REFERENCES currencies(code),
    status payout_status NOT NULL DEFAULT 'pending',
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE payouts IS 'Tracks payouts from the system to merchant bank accounts';

CREATE INDEX idx_payouts_account_id ON payouts(account_id);
CREATE INDEX idx_payouts_bank_account_id ON payouts(bank_account_id);
CREATE INDEX idx_payouts_currency_code ON payouts(currency_code);
CREATE INDEX idx_payouts_merchant_id ON payouts(merchant_id);
CREATE INDEX idx_payouts_organization_id ON payouts(organization_id);

-- API Keys table
CREATE TABLE api_keys (
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    api_key VARCHAR NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    expiration_date TIMESTAMPTZ,
    environment VARCHAR NOT NULL DEFAULT 'live' CHECK (environment IN ('test', 'live')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (organization_id, api_key)
);

COMMENT ON TABLE api_keys IS 'Stores API keys for authenticated access to the system';

CREATE INDEX idx_api_keys_merchant_id ON api_keys(merchant_id);

-- API Usage table
CREATE TABLE api_usage (
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    api_key VARCHAR PRIMARY KEY NOT NULL REFERENCES api_keys(api_key),
    endpoint VARCHAR(255) NOT NULL,
    request_count INT NOT NULL DEFAULT 0,
    last_request_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    request_method VARCHAR(10),
    response_status INT,
    response_time FLOAT,
    ip_address VARCHAR(45),
    FOREIGN KEY (organization_id, api_key) REFERENCES api_keys(organization_id, api_key),
    UNIQUE (organization_id, api_key, endpoint)
);

COMMENT ON TABLE api_usage IS 'Tracks API usage statistics for each organization and API key';

-- Webhooks table
CREATE TABLE webhooks (
    webhook_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    url VARCHAR NOT NULL,
    authorized_events webhook_event[] NOT NULL DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    verification_token TEXT NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
    last_triggered_at TIMESTAMPTZ,
    last_payload JSONB,
    last_response_status INT,
    last_response_body TEXT,
    retry_count INT DEFAULT 0,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (merchant_id, url)
);

COMMENT ON TABLE webhooks IS 'Configures webhook endpoints for real-time event notifications';
CREATE INDEX idx_webhooks_organization_id ON webhooks(organization_id);

-- Logs table
CREATE TABLE logs (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID REFERENCES merchants(merchant_id),
    event event_type NOT NULL,
    ip_address VARCHAR,
    operating_system VARCHAR,
    browser VARCHAR,
    details JSONB,
    severity VARCHAR NOT NULL CHECK (severity IN ('NOTICE', 'WARNING', 'ERROR', 'CRITICAL')),
    request_url VARCHAR,
    request_method VARCHAR(10),
    response_status INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE logs IS 'Audit log for tracking important events in the system';

CREATE INDEX idx_logs_merchant_id ON logs(merchant_id);

-- Platform Invoices table
CREATE TABLE platform_invoices (
    platform_invoice_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
    description TEXT,
    currency_code currency_code NOT NULL REFERENCES currencies(code),
    due_date DATE NOT NULL,
    status invoice_status NOT NULL DEFAULT 'sent',
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE platform_invoices IS 'Stores invoice information for merchants and 
organizations';

CREATE INDEX idx_platform_invoices_currency_code ON platform_invoices(currency_code);
CREATE INDEX idx_platform_invoices_merchant_id ON platform_invoices(merchant_id);
CREATE INDEX idx_platform_invoices_organization_id ON platform_invoices(organization_id);

-- Customer Invoices tables
CREATE TABLE customer_invoices (
    customer_invoice_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    customer_id UUID NOT NULL REFERENCES customers(customer_id),
    amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
    description TEXT,
    currency_code currency_code NOT NULL REFERENCES currencies(code),
    due_date DATE NOT NULL,
    status invoice_status NOT NULL DEFAULT 'sent',
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE customer_invoices IS 'Stores invoice information for customers of merchants';

CREATE INDEX idx_customer_invoices_currency_code ON customer_invoices(currency_code);
CREATE INDEX idx_customer_invoices_customer_id ON customer_invoices(customer_id);
CREATE INDEX idx_customer_invoices_merchant_id ON customer_invoices(merchant_id);
CREATE INDEX idx_customer_invoices_organization_id ON customer_invoices(organization_id);

-- Disputes table
CREATE TABLE disputes (
    dispute_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES transactions(transaction_id),
    customer_id UUID NOT NULL REFERENCES customers(customer_id),   
    amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
    fee_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    reason TEXT NOT NULL,
    status dispute_status NOT NULL DEFAULT 'pending',
    currency_code currency_code NOT NULL REFERENCES currencies(code) DEFAULT 'XOF',
    resolution_date DATE,
    resolution_details TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE disputes IS 'Stores dispute information for transactions';
COMMENT ON COLUMN disputes.amount IS 'Disputed transaction amount';
COMMENT ON COLUMN disputes.fee_amount IS 'Fee charged for processing the dispute';

CREATE INDEX idx_disputes_currency_code ON disputes(currency_code);
CREATE INDEX idx_disputes_customer_id ON disputes(customer_id);
CREATE INDEX idx_disputes_transaction_id ON disputes(transaction_id);

-- Metrics table
CREATE TABLE platform_metrics (
    metric_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type entity_type NOT NULL,
    metric_name VARCHAR NOT NULL,
    metric_value NUMERIC(10,2) NOT NULL,
    metric_date DATE NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE platform_metrics IS 'Stores metrics for merchants, organizations, and the platform';

-- Merchant Feedback table
CREATE TABLE merchant_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
    sentiment VARCHAR(30),
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status feedback_status NOT NULL DEFAULT 'open'
);

COMMENT ON TABLE merchant_feedback IS 'Stores merchant feedback, bug reports, or feature requests';

CREATE INDEX idx_merchant_feedback_merchant_id ON merchant_feedback(merchant_id);

-- Support Requests table
CREATE TABLE support_requests (
    support_requests_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    category support_category NOT NULL,
    message TEXT NOT NULL,
    image_url TEXT,
    status support_status NOT NULL DEFAULT 'open',
    priority support_priority NOT NULL DEFAULT 'normal',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE support_requests IS 'Stores support requests submitted by merchants';

CREATE INDEX idx_support_requests_merchant_id ON support_requests(merchant_id);
CREATE INDEX idx_support_requests_organization_id ON support_requests(organization_id);

-- Notifications table
CREATE TABLE notifications (
    notification_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    merchant_id UUID REFERENCES merchants(merchant_id),
    type notification_type NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE notifications IS 'Stores notifications for merchants and organizations';

CREATE INDEX idx_notifications_merchant_id ON notifications(merchant_id);

-- API Interactions table
CREATE TABLE api_interactions (
    interaction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    endpoint VARCHAR(255) NOT NULL,
    request_method VARCHAR(10) NOT NULL,
    request_payload JSONB,
    response_status INT,
    response_payload JSONB,
    response_time FLOAT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    api_key VARCHAR NOT NULL REFERENCES api_keys(api_key)
);

COMMENT ON TABLE api_interactions IS 'Logs customer interactions with the API for debugging and analysis';

CREATE INDEX idx_api_interactions_api_key ON api_interactions(api_key);
CREATE INDEX idx_api_interactions_organization_id ON api_interactions(organization_id);

-- API Rate Limits table
CREATE TABLE api_rate_limits (
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    api_key VARCHAR NOT NULL REFERENCES api_keys(api_key),
    endpoint VARCHAR(255) NOT NULL,
    requests_limit INT NOT NULL,
    time_window INTERVAL NOT NULL,
    current_usage INT NOT NULL DEFAULT 0,
    last_reset_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (organization_id, api_key, endpoint)
);

COMMENT ON TABLE api_rate_limits IS 'Stores rate limiting information for API endpoints per organization and API key';

CREATE INDEX idx_api_rate_limits_api_key ON api_rate_limits(api_key);

-- API Error Logs table
CREATE TABLE api_error_logs (
    error_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    error_type VARCHAR(50) NOT NULL,
    error_message TEXT NOT NULL,
    stack_trace TEXT,
    context JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE api_error_logs IS 'Records system errors for debugging and monitoring purposes';

-- Payment Links table
CREATE TABLE payment_links (
    link_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    link_type link_type NOT NULL,
    url VARCHAR(2048) NOT NULL,
    product_id UUID REFERENCES merchant_products(product_id),
    plan_id UUID REFERENCES subscription_plans(plan_id),
    title VARCHAR(255) NOT NULL,
    public_description TEXT,
    private_description TEXT,
    price NUMERIC(10,2),
    currency_code currency_code NOT NULL REFERENCES currencies(code),
    allowed_providers provider_code[] NOT NULL DEFAULT ARRAY[]::provider_code[],
    allow_coupon_code BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    expires_at TIMESTAMPTZ,
    success_url VARCHAR(2048),
    cancel_url VARCHAR(2048),
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (
        (link_type = 'product' AND product_id IS NOT NULL AND plan_id IS NULL AND price IS NULL) OR
        (link_type = 'plan' AND product_id IS NULL AND plan_id IS NOT NULL AND price IS NULL) OR
        (link_type = 'instant' AND product_id IS NULL AND plan_id IS NULL AND price IS NOT NULL)
    )
);

COMMENT ON TABLE payment_links IS 'Stores payment links for one-time payments, subscriptions, and instant links';

CREATE INDEX idx_payment_links_currency_code ON payment_links(currency_code);
CREATE INDEX idx_payment_links_merchant_id ON payment_links(merchant_id);
CREATE INDEX idx_payment_links_organization_id ON payment_links(organization_id);
CREATE INDEX idx_payment_links_plan_id ON payment_links(plan_id);
CREATE INDEX idx_payment_links_product_id ON payment_links(product_id);

-- Create a table for payment requests
CREATE TABLE payment_requests (
    request_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    customer_id UUID REFERENCES customers(customer_id),
    amount NUMERIC(15,2) NOT NULL,
    currency_code currency_code NOT NULL REFERENCES currencies(code),
    description TEXT,
    status transaction_status NOT NULL DEFAULT 'pending',
    expiry_date TIMESTAMPTZ NOT NULL,
    payment_link VARCHAR(255),
    payment_reference VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payment_requests_organization_id ON payment_requests(organization_id);
CREATE INDEX idx_payment_requests_merchant_id ON payment_requests(merchant_id);
CREATE INDEX idx_payment_requests_customer_id ON payment_requests(customer_id);
CREATE INDEX idx_payment_requests_status ON payment_requests(status);
CREATE INDEX idx_payment_requests_currency_code ON payment_requests(currency_code);

-- Create a table for installment plans
CREATE TABLE installment_plans (
    plan_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    customer_id UUID NOT NULL REFERENCES customers(customer_id),
    product_id UUID REFERENCES merchant_products(product_id),
    subscription_id UUID REFERENCES merchant_subscriptions(subscription_id),
    total_amount NUMERIC(15,2) NOT NULL,
    currency_code currency_code NOT NULL REFERENCES currencies(code),
    installment_count INT NOT NULL CHECK (installment_count >= 2),
    status transaction_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT product_or_subscription CHECK (
        (product_id IS NOT NULL AND subscription_id IS NULL) OR 
        (product_id IS NULL AND subscription_id IS NOT NULL) OR
        (product_id IS NULL AND subscription_id IS NULL)
    )
);

CREATE INDEX idx_installment_plans_organization_id ON installment_plans(organization_id);
CREATE INDEX idx_installment_plans_merchant_id ON installment_plans(merchant_id);
CREATE INDEX idx_installment_plans_customer_id ON installment_plans(customer_id);
CREATE INDEX idx_installment_plans_product_id ON installment_plans(product_id);
CREATE INDEX idx_installment_plans_subscription_id ON installment_plans(subscription_id);
CREATE INDEX idx_installment_plans_status ON installment_plans(status);
CREATE INDEX idx_installment_plans_currency_code ON installment_plans(currency_code);

-- Create a table for individual installments
CREATE TABLE installment_payments (
    installment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID NOT NULL REFERENCES installment_plans(plan_id) ON DELETE CASCADE,
    amount NUMERIC(15,2) NOT NULL,
    due_date TIMESTAMPTZ NOT NULL,
    transaction_id UUID REFERENCES transactions(transaction_id),
    status transaction_status NOT NULL DEFAULT 'pending',
    payment_link VARCHAR(255),
    sequence_number INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (plan_id, sequence_number)
);

CREATE INDEX idx_installment_payments_plan_id ON installment_payments(plan_id);
CREATE INDEX idx_installment_payments_transaction_id ON installment_payments(transaction_id);
CREATE INDEX idx_installment_payments_status ON installment_payments(status);
CREATE INDEX idx_installment_payments_due_date ON installment_payments(due_date);


-- Storefronts table
CREATE TABLE storefronts (
    storefront_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    theme_color VARCHAR(7) NOT NULL DEFAULT '#3B82F6',
    slug VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (merchant_id, organization_id),
    UNIQUE (slug)
);

COMMENT ON TABLE storefronts IS 'Stores storefront settings and configurations for each merchant';

CREATE INDEX idx_storefronts_organization_id ON storefronts(organization_id);

-- Organization Checkout Settings table
CREATE TABLE organization_checkout_settings (
    organization_id UUID PRIMARY KEY REFERENCES organizations(organization_id),
    default_language VARCHAR(10) NOT NULL DEFAULT 'en',
    display_currency currency_code NOT NULL DEFAULT 'XOF',
    payment_link_duration INTEGER NOT NULL DEFAULT 1,
    customer_notifications JSONB NOT NULL DEFAULT '{
        "new_payment_links": {"email": true, "whatsapp": false},
        "payment_reminders": {"email": true, "whatsapp": false},
        "successful_payment_attempts": {"email": true, "whatsapp": false}
    }'::jsonb,
    merchant_recipients JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE organization_checkout_settings IS 'Stores checkout settings for organizations';

-- Organization Fees table
CREATE TABLE organization_fees (
    fee_type_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    name VARCHAR(255) NOT NULL,
    percentage NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (percentage >= 0 AND percentage <= 100),
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, name)
);

COMMENT ON TABLE organization_fees IS 'Stores custom fees defined by organizations';

-- Organization Fee Links table
CREATE TABLE organization_fee_links (
    fee_link_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    fee_type_id UUID NOT NULL REFERENCES organization_fees(fee_type_id),
    product_id UUID REFERENCES merchant_products(product_id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE organization_fee_links IS 'Links organization fees to specific products';

CREATE INDEX idx_organization_fee_links_fee_type_id ON organization_fee_links(fee_type_id);
CREATE INDEX idx_organization_fee_links_organization_id ON organization_fee_links(organization_id);
CREATE INDEX idx_organization_fee_links_product_id ON organization_fee_links(product_id);

-- Currency Conversion Rates
CREATE TABLE IF NOT EXISTS public.currency_conversion_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_currency currency_code NOT NULL,
    to_currency currency_code NOT NULL,
    rate NUMERIC(20,8) NOT NULL,
    inverse_rate NUMERIC(20,8) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(from_currency, to_currency)
);

-- Enable RLS for currency_conversion_rates
ALTER TABLE public.currency_conversion_rates ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for currency_conversion_rates
CREATE POLICY "Allow authenticated users to read currency_conversion_rates"
    ON public.currency_conversion_rates
    FOR SELECT
    TO authenticated
    USING (true);

CREATE INDEX idx_currency_conversion_rates_pair ON currency_conversion_rates(from_currency, to_currency);

-- Currency Conversion History
CREATE TABLE IF NOT EXISTS public.currency_conversion_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    from_currency currency_code NOT NULL,
    to_currency currency_code NOT NULL,
    original_amount NUMERIC(10,2) NOT NULL,
    converted_amount NUMERIC(10,2) NOT NULL,
    conversion_rate NUMERIC(10,8) NOT NULL,
    conversion_type conversion_type NOT NULL,
    payout_id UUID REFERENCES payouts(payout_id),
    transaction_id UUID REFERENCES transactions(transaction_id),
    refund_id UUID REFERENCES refunds(refund_id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS for currency_conversion_history
ALTER TABLE public.currency_conversion_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for currency_conversion_history
CREATE POLICY "Allow merchants to read their own currency_conversion_history"
    ON public.currency_conversion_history
    FOR SELECT
    TO authenticated
    USING (
        (SELECT auth.uid()) = merchant_id OR
        EXISTS (
            SELECT 1 FROM merchant_organization_links
            WHERE merchant_organization_links.organization_id = currency_conversion_history.organization_id
            AND merchant_organization_links.merchant_id = (SELECT auth.uid())
        )
    );

CREATE INDEX IF NOT EXISTS idx_currency_conversion_history_merchant ON currency_conversion_history(merchant_id);
CREATE INDEX IF NOT EXISTS idx_currency_conversion_history_organization ON currency_conversion_history(organization_id);
CREATE INDEX IF NOT EXISTS idx_currency_conversion_history_payout ON currency_conversion_history(payout_id);
CREATE INDEX IF NOT EXISTS idx_currency_conversion_history_transaction ON currency_conversion_history(transaction_id);
CREATE INDEX IF NOT EXISTS idx_currency_conversion_history_refund ON currency_conversion_history(refund_id);
CREATE INDEX IF NOT EXISTS idx_currency_conversion_history_created_at ON currency_conversion_history(created_at);