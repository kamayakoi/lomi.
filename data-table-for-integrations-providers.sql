-- ## This file is only to display the table that needs to be referenced and used for the integration of providers; the original table are in another file. All those tables are already created in the database.

-- Relevant ENUMS
TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
TYPE transaction_type AS ENUM ('payment', 'instalment');
TYPE provider_code AS ENUM ('ORANGE', 'WAVE', 'ECOBANK', 'MTN', 'STRIPE', 'OTHER');
TYPE refund_status AS ENUM ('pending', 'completed', 'failed');
TYPE frequency AS ENUM ('weekly', 'bi-weekly', 'monthly', 'bi-monthly', 'quaterly' , 'semi-annual', 'yearly', 'one-time');
TYPE subscription_status AS ENUM ('pending', 'active', 'paused', 'cancelled', 'expired', 'past_due', 'trial');
TYPE payment_method_code AS ENUM ('CARDS', 'MOBILE_MONEY', 'E_WALLET', 'BANK_TRANSFER', 'APPLE_PAY', 'GOOGLE_PAY', 'USSD', 'QR_CODE');
TYPE link_type AS ENUM ('product', 'plan', 'instant');
TYPE currency_code AS ENUM ('XOF', 'USD', 'EUR');
TYPE webhook_event AS ENUM ('new_payment', 'new_subscription', 'payment_status_change', 'subscription_status_change');
TYPE failed_payment_action AS ENUM ('cancel', 'pause', 'continue');
TYPE first_payment_type AS ENUM ('initial', 'non_initial');

---------

-- Merchants table
TABLE merchants (
  merchant_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR,
  email VARCHAR UNIQUE NOT NULL,
  phone_number VARCHAR UNIQUE,
  onboarded BOOLEAN NOT NULL DEFAULT false,
  country VARCHAR,
  avatar_url TEXT,
  preferred_language VARCHAR(10),
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


-- Transactions table
TABLE transactions (
    transaction_id UUID PRIMARY KEY UNIQUE DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    customer_id UUID NOT NULL REFERENCES customers(customer_id),
    product_id UUID REFERENCES merchant_products(product_id),
    subscription_id UUID REFERENCES merchant_subscriptions(subscription_id),
    transaction_type transaction_type NOT NULL,
    status transaction_status NOT NULL DEFAULT 'pending',
    description TEXT,
    reference_id VARCHAR(8) NOT NULL,
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
    FOREIGN KEY (payment_method_code, provider_code) REFERENCES payment_methods(payment_method_code, provider_code)
);

-- Providers Transactions table
CREATE TABLE providers_transactions (
    transaction_id UUID PRIMARY KEY REFERENCES transactions(transaction_id),
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
    provider_code provider_code NOT NULL REFERENCES providers(code),
    wave_checkout_id VARCHAR(255),
    wave_payment_status VARCHAR(50),
    wave_transaction_id VARCHAR(255),
    orange_transaction_id VARCHAR(255),
    orange_payment_status VARCHAR(50),
    mtn_transaction_id VARCHAR(255),
    mtn_payment_status VARCHAR(50),
    stripe_transaction_id VARCHAR(255),
    stripe_payment_status VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (transaction_id, provider_code)
);

-- Organizations table
TABLE organizations (
  organization_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
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


-- Merchant-Organization links table
TABLE merchant_organization_links (
  merchant_org_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
  organization_id UUID NOT NULL REFERENCES organizations(organization_id),
  role VARCHAR NOT NULL CHECK (role IN ('Admin', 'Member')),
  workspace_handle VARCHAR UNIQUE NOT NULL,
  how_did_you_hear_about_us VARCHAR,
  organization_position VARCHAR,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (merchant_id, organization_id)
);


-- Customers table
TABLE customers (
    customer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    name VARCHAR NOT NULL,
    email VARCHAR,
    phone_number VARCHAR,
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


-- Merchant Accounts table
TABLE merchant_accounts (
    account_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
    balance NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (balance >= 0),
    currency_code currency_code NOT NULL REFERENCES currencies(code) DEFAULT 'XOF',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (merchant_id, currency_code)
);


-- Merchant Products table
TABLE merchant_products (
    product_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    currency_code currency_code NOT NULL REFERENCES currencies(code),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- Plans table
TABLE subscription_plans (
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
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    first_payment_type first_payment_type NOT NULL DEFAULT 'initial',
    FOREIGN KEY (currency_code) REFERENCES currencies(code)
);


-- Subscriptions table
TABLE merchant_subscriptions (
    subscription_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
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


-- Fees table
TABLE fees (
    name VARCHAR NOT NULL UNIQUE,
    transaction_type transaction_type NOT NULL,
    fee_type VARCHAR NOT NULL,
    percentage NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (percentage >= -100 AND percentage <= 100),
    fixed_amount NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (fixed_amount >= 0),
    currency_code currency_code NOT NULL REFERENCES currencies(code),
    payment_method_code payment_method_code,
    provider_code provider_code,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (payment_method_code, provider_code) REFERENCES payment_methods(payment_method_code, provider_code)
);


-- Providers table
TABLE providers (
  name VARCHAR NOT NULL PRIMARY KEY,
  code provider_code NOT NULL UNIQUE,
  description TEXT
);


-- Organization-Providers Settings table
TABLE organization_providers_settings (
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    provider_code provider_code NOT NULL REFERENCES providers(code),
    is_connected BOOLEAN NOT NULL DEFAULT false,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (organization_id, provider_code),
    UNIQUE (organization_id, provider_code)
);

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
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (
        (link_type = 'product' AND product_id IS NOT NULL AND plan_id IS NULL AND price IS NULL) OR
        (link_type = 'plan' AND product_id IS NULL AND plan_id IS NOT NULL AND price IS NULL) OR
        (link_type = 'instant' AND product_id IS NULL AND plan_id IS NULL AND price IS NOT NULL)
    )
);
