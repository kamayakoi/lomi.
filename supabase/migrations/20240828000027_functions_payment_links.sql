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
    plan_id UUID,
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
        pl.plan_id,
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
    p_url VARCHAR(2048),
    p_currency_code currency_code,
    p_title VARCHAR(255),
    p_product_id UUID DEFAULT NULL,
    p_plan_id UUID DEFAULT NULL,
    p_public_description TEXT DEFAULT NULL,
    p_private_description TEXT DEFAULT NULL,
    p_price NUMERIC(10,2) DEFAULT NULL,
    p_allowed_providers provider_code[] DEFAULT ARRAY[]::provider_code[],
    p_allow_coupon_code BOOLEAN DEFAULT false,
    p_expires_at TIMESTAMPTZ DEFAULT NULL,
    p_success_url VARCHAR(2048) DEFAULT NULL,
    p_metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_link_id UUID;
BEGIN
    INSERT INTO payment_links (
        merchant_id,
        organization_id,
        link_type,
        url,
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
        p_url,
        p_currency_code,
        p_title,
        p_product_id,
        p_plan_id,
        p_public_description,
        p_private_description,
        p_price,
        p_allowed_providers,
        p_allow_coupon_code,
        p_expires_at,
        p_success_url,
        p_metadata
    )
    RETURNING link_id INTO v_link_id;

    RETURN v_link_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;
