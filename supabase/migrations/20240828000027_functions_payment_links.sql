-- Function to fetch payment links for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_payment_links(
    p_merchant_id UUID,
    p_link_type link_type DEFAULT NULL,
    p_currency_code currency_code DEFAULT NULL,
    p_is_active BOOLEAN DEFAULT NULL,
    p_page INTEGER DEFAULT 1,
    p_page_size INTEGER DEFAULT 50
)
RETURNS TABLE (
    link_id UUID,
    merchant_id UUID,
    organization_id UUID,
    link_type link_type,
    url VARCHAR(2048),
    product_id UUID,
    product_name VARCHAR(255),
    product_price NUMERIC(10,2),
    plan_id UUID,
    plan_name VARCHAR(255),
    plan_amount NUMERIC(10,2),
    title VARCHAR(255),
    public_description TEXT,
    private_description TEXT,
    price NUMERIC(10,2),
    currency_code currency_code,
    allowed_providers provider_code[],
    allow_coupon_code BOOLEAN,
    is_active BOOLEAN,
    expires_at TIMESTAMPTZ,
    success_url VARCHAR(2048),
    metadata JSONB,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pl.link_id,
        pl.merchant_id,
        pl.organization_id,
        pl.link_type,
        pl.url,
        pl.product_id,
        mp.name AS product_name,
        mp.price AS product_price,
        pl.plan_id,
        sp.name AS plan_name,
        sp.amount AS plan_amount,
        pl.title,
        pl.public_description,
        pl.private_description,
        pl.price,
        pl.currency_code,
        pl.allowed_providers,
        pl.allow_coupon_code,
        pl.is_active,
        pl.expires_at,
        pl.success_url,
        pl.metadata,
        pl.created_at,
        pl.updated_at
    FROM 
        payment_links pl
        LEFT JOIN merchant_products mp ON pl.product_id = mp.product_id
        LEFT JOIN subscription_plans sp ON pl.plan_id = sp.plan_id
    WHERE 
        pl.merchant_id = p_merchant_id AND
        (p_link_type IS NULL OR pl.link_type = p_link_type) AND
        (p_currency_code IS NULL OR pl.currency_code = p_currency_code) AND
        (p_is_active IS NULL OR pl.is_active = p_is_active)
    ORDER BY
        pl.created_at DESC
    LIMIT p_page_size
    OFFSET ((p_page - 1) * p_page_size);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to create a new payment link
CREATE OR REPLACE FUNCTION public.create_payment_link(
    p_merchant_id UUID,
    p_organization_id UUID,
    p_link_type link_type,
    p_title VARCHAR(255),
    p_currency_code currency_code,
    p_public_description TEXT DEFAULT NULL,
    p_private_description TEXT DEFAULT NULL,
    p_price NUMERIC(10,2) DEFAULT NULL,
    p_allowed_providers provider_code[] DEFAULT ARRAY[]::provider_code[],
    p_allow_coupon_code BOOLEAN DEFAULT false,
    p_expires_at TIMESTAMPTZ DEFAULT NULL,
    p_success_url VARCHAR(2048) DEFAULT NULL,
    p_plan_id UUID DEFAULT NULL,
    p_product_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_link_id UUID;
    v_plan_amount NUMERIC(10,2);
    v_product_price NUMERIC(10,2);
    v_plan_currency_code currency_code;
    v_product_currency_code currency_code;
BEGIN
    -- Get the plan amount and currency code if a plan ID is provided
    IF p_plan_id IS NOT NULL THEN
        SELECT amount, currency_code INTO v_plan_amount, v_plan_currency_code
        FROM subscription_plans
        WHERE plan_id = p_plan_id;
    END IF;

    -- Get the product price and currency code if a product ID is provided
    IF p_product_id IS NOT NULL THEN
        SELECT price, currency_code INTO v_product_price, v_product_currency_code
        FROM merchant_products
        WHERE product_id = p_product_id;
    END IF;

    INSERT INTO payment_links (
        merchant_id,
        organization_id,
        link_type,
        currency_code,
        title,
        product_id,
        plan_id,
        public_description,
        private_description,
        price,
        allowed_providers,
        allow_coupon_code,
        expires_at,
        success_url,
        metadata
    )
    VALUES (
        p_merchant_id,
        p_organization_id,
        p_link_type,
        CASE
            WHEN p_link_type = 'instant' THEN p_currency_code
            WHEN p_link_type = 'plan' THEN v_plan_currency_code
            WHEN p_link_type = 'product' THEN v_product_currency_code
            ELSE p_currency_code
        END,
        p_title,
        p_product_id,
        p_plan_id,
        p_public_description,
        p_private_description,
        CASE
            WHEN p_link_type = 'instant' THEN p_price
            ELSE NULL
        END,
        p_allowed_providers,
        p_allow_coupon_code,
        p_expires_at,
        p_success_url,
        NULL
    )
    RETURNING link_id INTO v_link_id;

    RETURN v_link_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to update a payment link
CREATE OR REPLACE FUNCTION public.update_payment_link(
    p_link_id UUID,
    p_title VARCHAR(255) DEFAULT NULL,
    p_public_description TEXT DEFAULT NULL,
    p_private_description TEXT DEFAULT NULL,
    p_price NUMERIC(10,2) DEFAULT NULL,
    p_is_active BOOLEAN DEFAULT NULL,
    p_expires_at TIMESTAMPTZ DEFAULT NULL,
    p_success_url VARCHAR(2048) DEFAULT NULL,
    p_allowed_providers provider_code[] DEFAULT NULL
)
RETURNS payment_links AS $$
DECLARE
    v_link_type link_type;
    v_updated_link payment_links;
BEGIN
    -- Get the link type of the payment link
    SELECT link_type INTO v_link_type
    FROM payment_links
    WHERE link_id = p_link_id;

    -- Update the payment link based on the link type
    IF v_link_type = 'product' OR v_link_type = 'plan' THEN
        UPDATE payment_links
        SET
            title = COALESCE(p_title, title),
            public_description = COALESCE(p_public_description, public_description),
            private_description = COALESCE(p_private_description, private_description),
            is_active = COALESCE(p_is_active, is_active),
            expires_at = COALESCE(p_expires_at, expires_at),
            success_url = COALESCE(p_success_url, success_url),
            allowed_providers = COALESCE(p_allowed_providers, allowed_providers),
            updated_at = NOW()
        WHERE link_id = p_link_id
        RETURNING * INTO v_updated_link;
    ELSIF v_link_type = 'instant' THEN
        UPDATE payment_links
        SET
            title = COALESCE(p_title, title),
            public_description = COALESCE(p_public_description, public_description),
            private_description = COALESCE(p_private_description, private_description),
            price = COALESCE(p_price, price),
            is_active = COALESCE(p_is_active, is_active),
            expires_at = COALESCE(p_expires_at, expires_at),
            success_url = COALESCE(p_success_url, success_url),
            allowed_providers = COALESCE(p_allowed_providers, allowed_providers),
            updated_at = NOW()
        WHERE link_id = p_link_id
        RETURNING * INTO v_updated_link;
    END IF;

    RETURN v_updated_link;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to get available providers for a payment link based on the merchant's organization
CREATE OR REPLACE FUNCTION public.get_payment_link_available_providers(
    p_merchant_id UUID
)
RETURNS TABLE (
    code provider_code,
    name VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.code,
        p.name
    FROM providers p
    JOIN organization_providers_settings ops ON p.code = ops.provider_code
    WHERE ops.organization_id = (
        SELECT organization_id
        FROM merchants
        WHERE merchant_id = p_merchant_id
    ) AND ops.is_connected = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to delete a payment link
CREATE OR REPLACE FUNCTION public.delete_payment_link(
    p_link_id UUID
)
RETURNS VOID AS $$
BEGIN
    DELETE FROM payment_links
    WHERE link_id = p_link_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to get the base URL based on the environment
CREATE OR REPLACE FUNCTION public.get_base_url()
RETURNS VARCHAR(2048) AS $$
BEGIN
    IF inet_client_addr() << '127.0.0.0/8'::inet THEN
        RETURN 'https://pay.lomi.africa/';
    ELSE
        RETURN 'http://localhost:5173/';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to generate the URL after the payment link is created
CREATE OR REPLACE FUNCTION public.generate_payment_link_url()
RETURNS TRIGGER AS $$
BEGIN
    -- Generate the payment link URL based on the link_id and link_type
    NEW.url := CASE
        WHEN NEW.link_type = 'product' THEN get_base_url() || 'product/' || NEW.link_id::text
        WHEN NEW.link_type = 'plan' THEN get_base_url() || 'plan/' || NEW.link_id::text
        WHEN NEW.link_type = 'instant' THEN get_base_url() || 'instant/' || NEW.link_id::text
        ELSE NULL
    END;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to generate the URL after the payment link is created
CREATE TRIGGER generate_payment_link_url
BEFORE INSERT ON payment_links
FOR EACH ROW
EXECUTE FUNCTION public.generate_payment_link_url();
