-- Function to create a new product
CREATE OR REPLACE FUNCTION public.create_product(
    p_merchant_id UUID,
    p_organization_id UUID,
    p_name VARCHAR(255),
    p_description TEXT,
    p_price NUMERIC(10,2),
    p_currency_code currency_code,
    p_is_active BOOLEAN DEFAULT true
)
RETURNS UUID AS $$
DECLARE
    v_product_id UUID;
BEGIN
    INSERT INTO merchant_products (merchant_id, organization_id, name, description, price, currency_code, is_active)
    VALUES (p_merchant_id, p_organization_id, p_name, p_description, p_price, p_currency_code, p_is_active)
    RETURNING product_id INTO v_product_id;

    RETURN v_product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch products for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_products(
    p_merchant_id UUID,
    p_is_active BOOLEAN DEFAULT NULL
)
RETURNS TABLE (
    product_id UUID,
    merchant_id UUID,
    organization_id UUID,
    name VARCHAR(255),
    description TEXT,
    price NUMERIC(10,2),
    currency_code currency_code,
    is_active BOOLEAN,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.product_id,
        p.merchant_id,
        p.organization_id,
        p.name,
        p.description,
        p.price,
        p.currency_code,
        p.is_active,
        p.created_at,
        p.updated_at
    FROM 
        merchant_products p
    WHERE 
        p.merchant_id = p_merchant_id
        AND (p_is_active IS NULL OR p.is_active = p_is_active)
    ORDER BY
        p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to delete a product
CREATE OR REPLACE FUNCTION public.delete_product(
    p_product_id UUID
)
RETURNS VOID AS $$
BEGIN
    DELETE FROM merchant_products
    WHERE product_id = p_product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch transactions for a specific product
CREATE OR REPLACE FUNCTION public.fetch_product_transactions(
    p_product_id UUID
)
RETURNS TABLE (
    transaction_id UUID,
    description TEXT,
    gross_amount NUMERIC,
    currency_code currency_code,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        t.transaction_id,
        t.description,
        t.gross_amount,
        t.currency_code,
        t.created_at
    FROM
        transactions t
    WHERE
        t.product_id = p_product_id
    ORDER BY
        t.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.fetch_product_transactions(UUID) TO authenticated;
