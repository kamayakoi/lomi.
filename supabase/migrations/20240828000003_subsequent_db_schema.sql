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
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_merchant_sessions_merchant_id ON merchant_sessions(merchant_id);
CREATE INDEX idx_merchant_sessions_expires_at ON merchant_sessions(expires_at);

COMMENT ON TABLE merchant_sessions IS 'Stores merchant session information for authentication and session management';

-- UI Configuration table
CREATE TABLE ui_configuration (
  config_name VARCHAR(100) NOT NULL,
  config_value JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ui_configuration_config_name ON ui_configuration(config_name);

COMMENT ON TABLE ui_configuration IS 'Stores configuration options for the UI';

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