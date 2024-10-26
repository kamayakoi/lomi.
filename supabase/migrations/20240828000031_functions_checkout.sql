-- Function to fetch data for checkout
CREATE OR REPLACE FUNCTION public.fetch_data_for_checkout(
    p_link_id UUID,
    p_organization_id UUID
)
RETURNS TABLE (
    link_id UUID,
    url VARCHAR,
    title VARCHAR,
    public_description TEXT,
    private_description TEXT,
    price NUMERIC,
    currency_code currency_code,
    allowed_providers provider_code[],
    allow_coupon_code BOOLEAN,
    success_url VARCHAR,
    metadata JSONB,
    product_id UUID,
    product_name VARCHAR,
    product_description TEXT,
    product_price NUMERIC,
    plan_id UUID,
    plan_name VARCHAR,
    plan_description TEXT,
    plan_amount NUMERIC,
    plan_billing_frequency frequency,
    organization_logo_url VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        pl.link_id,
        pl.url,
        pl.title,
        pl.public_description,
        pl.private_description,
        pl.price,
        pl.currency_code,
        pl.allowed_providers,
        pl.allow_coupon_code,
        pl.success_url,
        pl.metadata,
        pl.product_id,
        mp.name AS product_name,
        mp.description AS product_description,
        mp.price AS product_price,
        pl.plan_id,
        sp.name AS plan_name,
        sp.description AS plan_description,
        sp.amount AS plan_amount,
        sp.billing_frequency AS plan_billing_frequency,
        CAST(REGEXP_REPLACE(o.logo_url, '^.*\/logos\/', '') AS VARCHAR) AS organization_logo_url
    FROM
        payment_links pl
        LEFT JOIN merchant_products mp ON pl.product_id = mp.product_id
        LEFT JOIN subscription_plans sp ON pl.plan_id = sp.plan_id
        JOIN organizations o ON pl.organization_id = o.organization_id
    WHERE
        pl.link_id = p_link_id AND
        pl.organization_id = p_organization_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch organization ID for checkout
CREATE OR REPLACE FUNCTION public.fetch_organization_id(p_merchant_id UUID)
RETURNS TABLE (
    organization_id UUID
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mol.organization_id
    FROM 
        merchant_organization_links mol
    WHERE 
        mol.merchant_id = p_merchant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;