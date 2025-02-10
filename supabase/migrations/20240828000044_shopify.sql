-- Add RLS policies
ALTER TABLE shopify_stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopify_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopify_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopify_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopify_sessions ENABLE ROW LEVEL SECURITY;

-- Create RPC functions for Shopify operations
CREATE OR REPLACE FUNCTION install_shopify_store(
    p_organization_id UUID,
    p_shop_domain VARCHAR,
    p_access_token VARCHAR,
    p_scope VARCHAR[]
) RETURNS UUID AS $$
DECLARE
    v_store_id UUID;
BEGIN
    INSERT INTO shopify_stores (
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to manage Shopify sessions
CREATE OR REPLACE FUNCTION manage_shopify_session(
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
    INSERT INTO shopify_sessions (
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete Shopify session
CREATE OR REPLACE FUNCTION delete_shopify_session(p_id TEXT) RETURNS BOOLEAN AS $$
BEGIN
    DELETE FROM shopify_sessions WHERE id = p_id;
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete multiple Shopify sessions
CREATE OR REPLACE FUNCTION delete_shopify_sessions(p_ids TEXT[]) RETURNS BOOLEAN AS $$
BEGIN
    DELETE FROM shopify_sessions WHERE id = ANY(p_ids);
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to find Shopify sessions by shop
CREATE OR REPLACE FUNCTION find_shopify_sessions_by_shop(p_shop TEXT) RETURNS SETOF shopify_sessions AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM shopify_sessions WHERE shop = p_shop;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to register webhook
CREATE OR REPLACE FUNCTION register_shopify_webhook(
    p_store_id UUID,
    p_topic VARCHAR,
    p_address VARCHAR,
    p_shopify_webhook_id VARCHAR
) RETURNS UUID AS $$
DECLARE
    v_webhook_id UUID;
BEGIN
    INSERT INTO shopify_webhooks (
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to sync Shopify order
CREATE OR REPLACE FUNCTION sync_shopify_order(
    p_store_id UUID,
    p_shopify_order_id VARCHAR,
    p_transaction_id UUID,
    p_total_price NUMERIC,
    p_currency_code currency_code,
    p_status VARCHAR,
    p_metadata JSONB
) RETURNS UUID AS $$
DECLARE
    v_order_id UUID;
BEGIN
    INSERT INTO shopify_orders (
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
$$ LANGUAGE plpgsql SECURITY DEFINER;