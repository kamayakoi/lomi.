-- Function to fetch product data for checkout
CREATE OR REPLACE FUNCTION public.fetch_product_data_for_checkout(
    p_product_id UUID
)
RETURNS TABLE (
    product_id UUID,
    name VARCHAR,
    description TEXT,
    price NUMERIC,
    currency_code currency_code,
    merchant_id UUID,
    organization_id UUID
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.product_id,
        p.name,
        p.description,
        p.price,
        p.currency_code,
        p.merchant_id,
        p.organization_id
    FROM
        merchant_products p
    WHERE
        p.product_id = p_product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch plan data for checkout
CREATE OR REPLACE FUNCTION public.fetch_plan_data_for_checkout(
    p_plan_id UUID
)
RETURNS TABLE (
    plan_id UUID,
    name VARCHAR,
    description TEXT,
    amount NUMERIC,
    currency_code currency_code,
    merchant_id UUID,
    organization_id UUID
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.plan_id,
        p.name,
        p.description,
        p.amount,
        p.currency_code,
        p.merchant_id,
        p.organization_id
    FROM
        subscription_plans p
    WHERE
        p.plan_id = p_plan_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch payment link data for checkout
CREATE OR REPLACE FUNCTION public.fetch_payment_link_data_for_checkout(
    p_link_id UUID
)
RETURNS TABLE (
    link_id UUID,
    url VARCHAR,
    title VARCHAR,
    public_description TEXT,
    price NUMERIC,
    currency_code currency_code,
    allowed_providers provider_code[],
    success_url VARCHAR,
    metadata JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        pl.link_id,
        pl.url,
        pl.title,
        pl.public_description,
        pl.price,
        pl.currency_code,
        pl.allowed_providers,
        pl.success_url,
        pl.metadata
    FROM
        payment_links pl
    WHERE
        pl.link_id = p_link_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;