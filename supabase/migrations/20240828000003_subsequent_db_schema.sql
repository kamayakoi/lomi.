--------------- ENUM TYPES ---------------

CREATE TYPE feedback_status AS ENUM ('open', 'reviewed', 'implemented', 'closed');
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');

--------------- TABLES ---------------

-- Merchant Preferences table
CREATE TABLE merchant_preferences (
  merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
  theme VARCHAR(50),
  language VARCHAR(10),
  notification_settings JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_merchant_preferences_merchant_id ON merchant_preferences(merchant_id);

COMMENT ON TABLE merchant_preferences IS 'Stores merchant-specific settings and preferences';

-- Merchant Sessions table
CREATE TABLE merchant_sessions (
  session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
  session_data JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_merchant_sessions_merchant_id ON merchant_sessions(merchant_id);
CREATE INDEX idx_merchant_sessions_expires_at ON merchant_sessions(expires_at);

COMMENT ON TABLE merchant_sessions IS 'Stores merchant session information for authentication and session management';

-- Merchant Feedback table
CREATE TABLE merchant_feedback (
  merchant_feedback_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
  feedback_type VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status feedback_status NOT NULL DEFAULT 'open'
);

CREATE INDEX idx_merchant_feedback_merchant_id ON merchant_feedback(merchant_id);
CREATE INDEX idx_merchant_feedback_status ON merchant_feedback(status);

COMMENT ON TABLE merchant_feedback IS 'Stores merchant feedback, bug reports, or feature requests';

-- Customer Feedback table
CREATE TABLE customer_feedback (
  customer_feedback_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(customer_id),
  feedback_type VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status feedback_status NOT NULL DEFAULT 'open'
);

CREATE INDEX idx_customer_feedback_customer_id ON customer_feedback(customer_id);
CREATE INDEX idx_customer_feedback_status ON customer_feedback(status);

COMMENT ON TABLE customer_feedback IS 'Stores customer feedback, bug reports, or feature requests';

-- Support tickets table
CREATE TABLE support_tickets (
  ticket_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
  customer_id UUID REFERENCES customers(customer_id),
  organization_id UUID REFERENCES organizations(organization_id),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolution_date TIMESTAMPTZ,
  resolution_details TEXT,
  status ticket_status NOT NULL DEFAULT 'open'
);

CREATE INDEX idx_support_tickets_merchant_id ON support_tickets(merchant_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);

COMMENT ON TABLE support_tickets IS 'Stores merchant support tickets';

-- Notifications table
CREATE TABLE notifications (
    notification_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
    organization_id UUID REFERENCES organizations(organization_id),
    type VARCHAR NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_merchant_id ON notifications(merchant_id);
CREATE INDEX idx_notifications_organization_id ON notifications(organization_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

COMMENT ON TABLE notifications IS 'Stores notifications for merchants and organizations';

-- Customer API Interactions table
CREATE TABLE customer_api_interactions (
    interaction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    endpoint VARCHAR(255) NOT NULL,
    request_method VARCHAR(10) NOT NULL,
    request_payload JSONB,
    response_status INT,
    response_payload JSONB,
    response_time FLOAT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_customer_api_interactions_organization_id ON customer_api_interactions(organization_id);

-- Webhook Delivery Logs table
CREATE TABLE webhook_delivery_logs (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    webhook_id UUID NOT NULL REFERENCES webhooks(webhook_id),
    payload JSONB,
    response_status INT,
    response_body TEXT,
    delivery_time FLOAT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_webhook_delivery_logs_webhook_id ON webhook_delivery_logs(webhook_id);

-- API Rate Limits table
CREATE TABLE api_rate_limits (
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    api_key VARCHAR NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    requests_limit INT NOT NULL,
    time_window INTERVAL NOT NULL,
    current_usage INT NOT NULL DEFAULT 0,
    last_reset_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (organization_id, api_key, endpoint)
);

CREATE INDEX idx_api_rate_limits_organization_id ON api_rate_limits(organization_id);

-- Cache Entries table
CREATE TABLE cache_entries (
    cache_key VARCHAR(255) PRIMARY KEY,
    cache_value JSONB NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_cache_entries_expires_at ON cache_entries(expires_at);

-- Error Logs table
CREATE TABLE error_logs (
    error_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    error_type VARCHAR(50) NOT NULL,
    error_message TEXT NOT NULL,
    stack_trace TEXT,
    context JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_error_logs_error_type ON error_logs(error_type);
CREATE INDEX idx_error_logs_created_at ON error_logs(created_at);


-- Pages table
CREATE TABLE pages (
    page_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    slug VARCHAR(255) NOT NULL,
    content JSONB NOT NULL,
    theme VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (merchant_id, slug)
);

CREATE INDEX idx_pages_merchant_id ON pages(merchant_id);
CREATE INDEX idx_pages_organization_id ON pages(organization_id);
CREATE INDEX idx_pages_slug ON pages(slug);

COMMENT ON TABLE pages IS 'Stores custom checkout pages created by merchants';

-- Payment Links table (updated version)
CREATE TABLE payment_links (
    link_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(merchant_id),
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    page_id UUID REFERENCES pages(page_id),
    product_id UUID REFERENCES merchant_products(product_id),
    subscription_id UUID REFERENCES customer_subscriptions(subscription_id),
    title VARCHAR(255) NOT NULL,
    public_description TEXT,
    private_description TEXT,
    price NUMERIC(10,2),
    currency_code currency_code NOT NULL REFERENCES currencies(code),
    frequency frequency,
    billing_cycles INT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    expires_at TIMESTAMPTZ,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payment_links_merchant_id ON payment_links(merchant_id);
CREATE INDEX idx_payment_links_organization_id ON payment_links(organization_id);
CREATE INDEX idx_payment_links_page_id ON payment_links(page_id);
CREATE INDEX idx_payment_links_product_id ON payment_links(product_id);
CREATE INDEX idx_payment_links_subscription_id ON payment_links(subscription_id);

COMMENT ON TABLE payment_links IS 'Stores payment links for one-time payments, subscriptions, and instant links';