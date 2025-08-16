-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- Create custom types
CREATE TYPE deal_status AS ENUM ('pending', 'funded', 'completed', 'disputed', 'cancelled', 'expired');
CREATE TYPE currency_code AS ENUM ('XOF', 'USD', 'EUR', 'GHS', 'NGN', 'KES');
CREATE TYPE notification_type AS ENUM ('sms', 'whatsapp', 'email');
CREATE TYPE dispute_status AS ENUM ('pending', 'resolved', 'closed');
CREATE TYPE user_role AS ENUM ('buyer', 'seller', 'admin');

-- Users table (for reputation and preferences)
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100),
    email VARCHAR(255),
    verified_at TIMESTAMPTZ,
    reputation_rating DECIMAL(3,2) DEFAULT 0.0 CHECK (reputation_rating >= 0.0 AND reputation_rating <= 5.0),
    total_deals INTEGER DEFAULT 0,
    completed_deals INTEGER DEFAULT 0,
    enable_sms_notifications BOOLEAN DEFAULT true,
    enable_whatsapp_notifications BOOLEAN DEFAULT true,
    enable_email_notifications BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

-- Deals table (core escrow transactions)
CREATE TABLE deals (
    deal_id VARCHAR(10) PRIMARY KEY, -- Human-readable ID like "A7B2C9"
    status deal_status NOT NULL DEFAULT 'pending',
    item_description TEXT NOT NULL,
    price DECIMAL(15,2) NOT NULL CHECK (price > 0),
    currency currency_code NOT NULL DEFAULT 'XOF',
    seller_phone VARCHAR(20) NOT NULL,
    buyer_phone VARCHAR(20) NOT NULL,
    seller_user_id UUID REFERENCES users(user_id),
    buyer_user_id UUID REFERENCES users(user_id),
    
    -- Lomi integration fields
    lomi_merchant_id UUID, -- Link to lomi merchant
    lomi_organization_id UUID, -- Link to lomi organization
    lomi_transaction_id UUID, -- Link to lomi transaction when payment made
    lomi_payment_link_id UUID, -- Link to lomi payment link
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    funded_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    expired_at TIMESTAMPTZ,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    -- Constraints
    CHECK (seller_phone != buyer_phone),
    CHECK (
        (status = 'funded' AND funded_at IS NOT NULL) OR
        (status != 'funded' AND (funded_at IS NULL OR status IN ('completed', 'disputed')))
    ),
    CHECK (
        (status = 'completed' AND completed_at IS NOT NULL) OR
        (status != 'completed')
    )
);

-- Payment sessions table (tracks payment attempts)
CREATE TABLE payment_sessions (
    session_id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    deal_id VARCHAR(10) NOT NULL REFERENCES deals(deal_id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    currency currency_code NOT NULL,
    provider_code VARCHAR(20) NOT NULL, -- 'ORANGE', 'WAVE', 'MTN', etc.
    provider_session_id VARCHAR(255), -- External provider session ID
    checkout_url TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'expired'
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ,
    
    -- Provider-specific metadata
    provider_metadata JSONB DEFAULT '{}'
);

-- Disputes table
CREATE TABLE disputes (
    dispute_id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    deal_id VARCHAR(10) NOT NULL REFERENCES deals(deal_id) ON DELETE CASCADE,
    opened_by_phone VARCHAR(20) NOT NULL,
    opened_by_user_id UUID REFERENCES users(user_id),
    reason VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    status dispute_status DEFAULT 'pending',
    evidence_urls TEXT[], -- Array of URLs to uploaded evidence
    resolution_notes TEXT,
    resolved_at TIMESTAMPTZ,
    resolved_by UUID, -- Admin user who resolved
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Notifications log table
CREATE TABLE notifications (
    notification_id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    deal_id VARCHAR(10) REFERENCES deals(deal_id) ON DELETE CASCADE,
    recipient_phone VARCHAR(20) NOT NULL,
    recipient_user_id UUID REFERENCES users(user_id),
    type notification_type NOT NULL,
    message TEXT NOT NULL,
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ,
    error_message TEXT,
    provider_message_id VARCHAR(255), -- External provider message ID
    created_at TIMESTAMPTZ DEFAULT now(),
    
    -- Metadata for tracking
    metadata JSONB DEFAULT '{}'
);

-- Audit log for important actions
CREATE TABLE audit_log (
    log_id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    deal_id VARCHAR(10) REFERENCES deals(deal_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(user_id),
    action VARCHAR(50) NOT NULL, -- 'deal_created', 'payment_made', 'funds_released', etc.
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_deals_status ON deals(status);
CREATE INDEX idx_deals_seller_phone ON deals(seller_phone);
CREATE INDEX idx_deals_buyer_phone ON deals(buyer_phone);
CREATE INDEX idx_deals_created_at ON deals(created_at DESC);
CREATE INDEX idx_deals_lomi_transaction_id ON deals(lomi_transaction_id);

CREATE INDEX idx_users_phone_number ON users(phone_number);
CREATE INDEX idx_users_email ON users(email);

CREATE INDEX idx_payment_sessions_deal_id ON payment_sessions(deal_id);
CREATE INDEX idx_payment_sessions_status ON payment_sessions(status);
CREATE INDEX idx_payment_sessions_expires_at ON payment_sessions(expires_at);

CREATE INDEX idx_disputes_deal_id ON disputes(deal_id);
CREATE INDEX idx_disputes_status ON disputes(status);

CREATE INDEX idx_notifications_deal_id ON notifications(deal_id);
CREATE INDEX idx_notifications_recipient_phone ON notifications(recipient_phone);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

CREATE INDEX idx_audit_log_deal_id ON audit_log(deal_id);
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at DESC);

-- Row Level Security (RLS) policies
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can read own data" ON users
    FOR SELECT USING (phone_number = current_setting('request.jwt.claims', true)::json->>'phone');

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (phone_number = current_setting('request.jwt.claims', true)::json->>'phone');

-- Deals can be read by buyer or seller
CREATE POLICY "Deals readable by participants" ON deals
    FOR SELECT USING (
        seller_phone = current_setting('request.jwt.claims', true)::json->>'phone' OR
        buyer_phone = current_setting('request.jwt.claims', true)::json->>'phone'
    );

-- Only sellers can update deal status to completed (when buyer confirms)
CREATE POLICY "Sellers can update deals" ON deals
    FOR UPDATE USING (
        seller_phone = current_setting('request.jwt.claims', true)::json->>'phone'
    );

-- Payment sessions readable by deal participants
CREATE POLICY "Payment sessions readable by deal participants" ON payment_sessions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM deals 
            WHERE deals.deal_id = payment_sessions.deal_id 
            AND (
                deals.seller_phone = current_setting('request.jwt.claims', true)::json->>'phone' OR
                deals.buyer_phone = current_setting('request.jwt.claims', true)::json->>'phone'
            )
        )
    );

-- Disputes readable by deal participants
CREATE POLICY "Disputes readable by deal participants" ON disputes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM deals 
            WHERE deals.deal_id = disputes.deal_id 
            AND (
                deals.seller_phone = current_setting('request.jwt.claims', true)::json->>'phone' OR
                deals.buyer_phone = current_setting('request.jwt.claims', true)::json->>'phone'
            )
        )
    );

-- Notifications readable by recipient
CREATE POLICY "Notifications readable by recipient" ON notifications
    FOR SELECT USING (
        recipient_phone = current_setting('request.jwt.claims', true)::json->>'phone'
    );

-- Update triggers for updated_at fields
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON deals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_disputes_updated_at BEFORE UPDATE ON disputes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
