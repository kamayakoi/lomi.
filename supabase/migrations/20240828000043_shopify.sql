-- Create Shopify schema
CREATE SCHEMA IF NOT EXISTS shopify;

-- Create Shopify tables in the new schema
CREATE TABLE shopify.stores (
    store_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(organization_id),
    shop_domain VARCHAR NOT NULL,
    access_token VARCHAR NOT NULL,
    scope VARCHAR[] NOT NULL,
    installed_at TIMESTAMPTZ DEFAULT NOW(),
    uninstalled_at TIMESTAMPTZ,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(organization_id, shop_domain)
);

CREATE INDEX idx_shopify_stores_organization ON shopify.stores(organization_id);
CREATE INDEX idx_shopify_stores_domain ON shopify.stores(shop_domain);

CREATE TABLE shopify.webhooks (
    webhook_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES shopify.stores(store_id),
    topic VARCHAR NOT NULL,
    address VARCHAR NOT NULL,
    shopify_webhook_id VARCHAR NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(store_id, topic)
);

CREATE INDEX idx_shopify_webhooks_store ON shopify.webhooks(store_id);

CREATE TABLE shopify.products (
    product_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES shopify.stores(store_id),
    shopify_product_id VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    currency_code public.currency_code NOT NULL REFERENCES public.currencies(code),
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(store_id, shopify_product_id)
);

CREATE INDEX idx_shopify_products_store ON shopify.products(store_id);

CREATE TABLE shopify.orders (
    order_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES shopify.stores(store_id),
    shopify_order_id VARCHAR NOT NULL,
    transaction_id UUID REFERENCES public.transactions(transaction_id),
    total_price NUMERIC(10,2) NOT NULL,
    currency_code public.currency_code NOT NULL REFERENCES public.currencies(code),
    status VARCHAR NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(store_id, shopify_order_id)
);

CREATE INDEX idx_shopify_orders_store ON shopify.orders(store_id);
CREATE INDEX idx_shopify_orders_transaction ON shopify.orders(transaction_id);

CREATE TABLE shopify.shop_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop VARCHAR NOT NULL UNIQUE,
    api_key VARCHAR NOT NULL,
    api_secret VARCHAR NOT NULL,
    merchant_id VARCHAR NOT NULL,
    webhook_url VARCHAR,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_shopify_shop_settings_shop ON shopify.shop_settings(shop);

COMMENT ON TABLE shopify.shop_settings IS 'Stores Shopify shop integration settings and credentials';

CREATE TABLE shopify.sessions (
    id TEXT PRIMARY KEY,
    shop TEXT NOT NULL,
    state TEXT NOT NULL,
    isOnline BOOLEAN NOT NULL DEFAULT false,
    scope TEXT,
    expires TIMESTAMPTZ,
    accessToken TEXT NOT NULL,
    userId BIGINT,
    firstName TEXT,
    lastName TEXT,
    email TEXT,
    accountOwner BOOLEAN NOT NULL DEFAULT false,
    locale TEXT,
    collaborator BOOLEAN DEFAULT false,
    emailVerified BOOLEAN DEFAULT false,
    expires_in INTEGER,
    associated_user_scope TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_shopify_sessions_shop ON shopify.sessions(shop);
CREATE INDEX idx_shopify_sessions_state ON shopify.sessions(state);

COMMENT ON TABLE shopify.sessions IS 'Stores Shopify session data for authentication';

-- Add RLS policies
ALTER TABLE shopify.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopify.webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopify.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopify.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopify.sessions ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for stores
CREATE POLICY "Organizations can manage their own stores"
    ON shopify.stores
    FOR ALL
    TO authenticated
    USING (organization_id IN (
        SELECT mol.organization_id 
        FROM merchant_organization_links mol 
        WHERE mol.merchant_id = (SELECT auth.uid()::uuid)
    ));

-- Add RLS policies for webhooks
CREATE POLICY "Organizations can manage their store webhooks"
    ON shopify.webhooks
    FOR ALL
    TO authenticated
    USING (store_id IN (
        SELECT s.store_id 
        FROM shopify.stores s 
        WHERE s.organization_id IN (
            SELECT mol.organization_id 
            FROM merchant_organization_links mol 
            WHERE mol.merchant_id = (SELECT auth.uid()::uuid)
        )
    ));

-- Add RLS policies for products
CREATE POLICY "Organizations can manage their store products"
    ON shopify.products
    FOR ALL
    TO authenticated
    USING (store_id IN (
        SELECT s.store_id 
        FROM shopify.stores s 
        WHERE s.organization_id IN (
            SELECT mol.organization_id 
            FROM merchant_organization_links mol 
            WHERE mol.merchant_id = (SELECT auth.uid()::uuid)
        )
    ));

-- Add RLS policies for orders
CREATE POLICY "Organizations can manage their store orders"
    ON shopify.orders
    FOR ALL
    TO authenticated
    USING (store_id IN (
        SELECT s.store_id 
        FROM shopify.stores s 
        WHERE s.organization_id IN (
            SELECT mol.organization_id 
            FROM merchant_organization_links mol 
            WHERE mol.merchant_id = (SELECT auth.uid()::uuid)
        )
    ));

-- Add RLS policies for sessions
CREATE POLICY "Organizations can manage their store sessions"
    ON shopify.sessions
    FOR ALL
    TO authenticated
    USING (shop IN (
        SELECT s.shop_domain 
        FROM shopify.stores s 
        WHERE s.organization_id IN (
            SELECT mol.organization_id 
            FROM merchant_organization_links mol 
            WHERE mol.merchant_id = (SELECT auth.uid()::uuid)
        )
    ));

-- Allow service role to bypass RLS
ALTER TABLE shopify.stores FORCE ROW LEVEL SECURITY;
ALTER TABLE shopify.webhooks FORCE ROW LEVEL SECURITY;
ALTER TABLE shopify.products FORCE ROW LEVEL SECURITY;
ALTER TABLE shopify.orders FORCE ROW LEVEL SECURITY;
ALTER TABLE shopify.sessions FORCE ROW LEVEL SECURITY;

-- Create RPC functions in the shopify schema
CREATE OR REPLACE FUNCTION shopify.install_store(
    p_organization_id UUID,
    p_shop_domain VARCHAR,
    p_access_token VARCHAR,
    p_scope VARCHAR[]
) RETURNS UUID AS $$
DECLARE
    v_store_id UUID;
BEGIN
    INSERT INTO shopify.stores (
        organization_id,
        shop_domain,
        access_token,
        scope
    ) VALUES (
        p_organization_id,
        p_shop_domain,
        p_access_token,
        p_scope
    )
    RETURNING store_id INTO v_store_id;
    
    RETURN v_store_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = shopify, public, pg_temp;

CREATE OR REPLACE FUNCTION shopify.manage_session(
    p_id TEXT,
    p_shop TEXT,
    p_state TEXT,
    p_is_online BOOLEAN,
    p_scope TEXT,
    p_expires TIMESTAMPTZ,
    p_access_token TEXT,
    p_user_id BIGINT,
    p_first_name TEXT,
    p_last_name TEXT,
    p_email TEXT,
    p_account_owner BOOLEAN,
    p_locale TEXT,
    p_collaborator BOOLEAN,
    p_email_verified BOOLEAN,
    p_expires_in INTEGER,
    p_associated_user_scope TEXT
) RETURNS TEXT AS $$
BEGIN
    INSERT INTO shopify.sessions (
        id,
        shop,
        state,
        isOnline,
        scope,
        expires,
        accessToken,
        userId,
        firstName,
        lastName,
        email,
        accountOwner,
        locale,
        collaborator,
        emailVerified,
        expires_in,
        associated_user_scope
    ) VALUES (
        p_id,
        p_shop,
        p_state,
        p_is_online,
        p_scope,
        p_expires,
        p_access_token,
        p_user_id,
        p_first_name,
        p_last_name,
        p_email,
        p_account_owner,
        p_locale,
        p_collaborator,
        p_email_verified,
        p_expires_in,
        p_associated_user_scope
    )
    ON CONFLICT (id) DO UPDATE
    SET
        shop = EXCLUDED.shop,
        state = EXCLUDED.state,
        isOnline = EXCLUDED.isOnline,
        scope = EXCLUDED.scope,
        expires = EXCLUDED.expires,
        accessToken = EXCLUDED.accessToken,
        userId = EXCLUDED.userId,
        firstName = EXCLUDED.firstName,
        lastName = EXCLUDED.lastName,
        email = EXCLUDED.email,
        accountOwner = EXCLUDED.accountOwner,
        locale = EXCLUDED.locale,
        collaborator = EXCLUDED.collaborator,
        emailVerified = EXCLUDED.emailVerified,
        expires_in = EXCLUDED.expires_in,
        associated_user_scope = EXCLUDED.associated_user_scope,
        updated_at = NOW();
    
    RETURN p_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = shopify, public, pg_temp;

CREATE OR REPLACE FUNCTION shopify.delete_session(p_id TEXT) RETURNS BOOLEAN AS $$
BEGIN
    DELETE FROM shopify.sessions WHERE id = p_id;
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = shopify, public, pg_temp;

CREATE OR REPLACE FUNCTION shopify.delete_sessions(p_ids TEXT[]) RETURNS BOOLEAN AS $$
BEGIN
    DELETE FROM shopify.sessions WHERE id = ANY(p_ids);
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = shopify, public, pg_temp;

CREATE OR REPLACE FUNCTION shopify.find_sessions_by_shop(p_shop TEXT) RETURNS SETOF shopify.sessions AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM shopify.sessions WHERE shop = p_shop;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = shopify, public, pg_temp;

CREATE OR REPLACE FUNCTION shopify.register_webhook(
    p_store_id UUID,
    p_topic VARCHAR,
    p_address VARCHAR,
    p_shopify_webhook_id VARCHAR
) RETURNS UUID AS $$
DECLARE
    v_webhook_id UUID;
BEGIN
    INSERT INTO shopify.webhooks (
        store_id,
        topic,
        address,
        shopify_webhook_id
    ) VALUES (
        p_store_id,
        p_topic,
        p_address,
        p_shopify_webhook_id
    )
    RETURNING webhook_id INTO v_webhook_id;
    
    RETURN v_webhook_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = shopify, public, pg_temp;

CREATE OR REPLACE FUNCTION shopify.sync_order(
    p_store_id UUID,
    p_shopify_order_id VARCHAR,
    p_transaction_id UUID,
    p_total_price NUMERIC,
    p_currency_code public.currency_code,
    p_status VARCHAR,
    p_metadata JSONB
) RETURNS UUID AS $$
DECLARE
    v_order_id UUID;
BEGIN
    INSERT INTO shopify.orders (
        store_id,
        shopify_order_id,
        transaction_id,
        total_price,
        currency_code,
        status,
        metadata
    ) VALUES (
        p_store_id,
        p_shopify_order_id,
        p_transaction_id,
        p_total_price,
        p_currency_code,
        p_status,
        p_metadata
    )
    ON CONFLICT (store_id, shopify_order_id) DO UPDATE
    SET
        transaction_id = EXCLUDED.transaction_id,
        total_price = EXCLUDED.total_price,
        status = EXCLUDED.status,
        metadata = EXCLUDED.metadata,
        updated_at = NOW()
    RETURNING order_id INTO v_order_id;
    
    RETURN v_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = shopify, public, pg_temp;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA shopify TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA shopify TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA shopify TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA shopify TO service_role;