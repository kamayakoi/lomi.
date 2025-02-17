-- Function to create a new product
CREATE OR REPLACE FUNCTION public.create_product(
    p_merchant_id UUID,
    p_organization_id UUID,
    p_name VARCHAR(255),
    p_description TEXT,
    p_price NUMERIC(10,2),
    p_currency_code currency_code,
    p_image_url TEXT DEFAULT NULL,
    p_is_active BOOLEAN DEFAULT true,
    p_display_on_storefront BOOLEAN DEFAULT true,
    p_fee_type_ids UUID[] DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_product_id UUID;
BEGIN
    -- Create the product
    INSERT INTO merchant_products (
        merchant_id, 
        organization_id, 
        name, 
        description, 
        price, 
        currency_code,
        image_url,
        is_active,
        display_on_storefront
    )
    VALUES (
        p_merchant_id, 
        p_organization_id, 
        p_name, 
        p_description, 
        p_price, 
        p_currency_code,
        p_image_url,
        p_is_active,
        p_display_on_storefront
    )
    RETURNING product_id INTO v_product_id;

    -- Create fee links if fees are provided
    IF p_fee_type_ids IS NOT NULL AND array_length(p_fee_type_ids, 1) > 0 THEN
        INSERT INTO organization_fee_links (
            organization_id,
            fee_type_id,
            product_id
        )
        SELECT 
            p_organization_id,
            fee_id,
            v_product_id
        FROM unnest(p_fee_type_ids) AS fee_id;
    END IF;

    -- Log product creation
    PERFORM public.log_event(
        p_merchant_id := p_merchant_id,
        p_event := 'create_product'::event_type,
        p_details := jsonb_build_object(
            'product_id', v_product_id,
            'name', p_name,
            'price', p_price,
            'currency', p_currency_code,
            'has_image', p_image_url IS NOT NULL,
            'display_on_storefront', p_display_on_storefront,
            'fee_count', array_length(p_fee_type_ids, 1)
        ),
        p_severity := 'NOTICE'
    );

    RETURN v_product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch products for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_products(
    p_merchant_id UUID,
    p_is_active BOOLEAN DEFAULT NULL,
    p_limit INTEGER DEFAULT 15,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    product_id UUID,
    merchant_id UUID,
    organization_id UUID,
    name VARCHAR(255),
    description TEXT,
    price NUMERIC(10,2),
    currency_code currency_code,
    image_url TEXT,
    is_active BOOLEAN,
    display_on_storefront BOOLEAN,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    total_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    WITH product_data AS (
        SELECT 
            p.product_id,
            p.merchant_id,
            p.organization_id,
            p.name,
            p.description,
            p.price,
            p.currency_code,
            p.image_url,
            p.is_active,
            p.display_on_storefront,
            p.created_at,
            p.updated_at,
            COUNT(*) OVER() as total_count
        FROM 
            merchant_products p
        WHERE 
            p.merchant_id = p_merchant_id
            AND (p_is_active IS NULL OR p.is_active = p_is_active)
        ORDER BY
            p.created_at DESC
        LIMIT p_limit
        OFFSET p_offset
    )
    SELECT * FROM product_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to delete a product
CREATE OR REPLACE FUNCTION public.delete_product(
    p_product_id UUID
)
RETURNS VOID AS $$
DECLARE
    v_merchant_id UUID;
    v_product_name VARCHAR;
    v_price NUMERIC;
    v_currency currency_code;
BEGIN
    -- Get product details before deletion
    SELECT merchant_id, name, price, currency_code
    INTO v_merchant_id, v_product_name, v_price, v_currency
    FROM merchant_products
    WHERE product_id = p_product_id;

    DELETE FROM merchant_products
    WHERE product_id = p_product_id;

    -- Log product deletion
    PERFORM public.log_event(
        p_merchant_id := v_merchant_id,
        p_event := 'delete_product'::event_type,
        p_details := jsonb_build_object(
            'product_id', p_product_id,
            'name', v_product_name,
            'price', v_price,
            'currency', v_currency
        ),
        p_severity := 'NOTICE'
    );
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

-- Function to fetch product fees
CREATE OR REPLACE FUNCTION public.fetch_product_fees(
    p_product_id UUID
)
RETURNS TABLE (
    fee_type_id UUID,
    name VARCHAR(255),
    percentage NUMERIC(5,2),
    is_enabled BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        f.fee_type_id,
        f.name,
        f.percentage,
        f.is_enabled
    FROM 
        organization_fees f
        INNER JOIN organization_fee_links fl ON f.fee_type_id = fl.fee_type_id
    WHERE 
        fl.product_id = p_product_id
        AND f.is_enabled = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to update a product
CREATE OR REPLACE FUNCTION public.update_product(
    p_product_id UUID,
    p_name VARCHAR(255),
    p_description TEXT,
    p_price NUMERIC(10,2),
    p_image_url TEXT,
    p_is_active BOOLEAN,
    p_display_on_storefront BOOLEAN,
    p_fee_type_ids UUID[] DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
    v_merchant_id UUID;
    v_organization_id UUID;
    v_old_price NUMERIC;
    v_currency currency_code;
    v_old_image_url TEXT;
BEGIN
    -- Get current product details
    SELECT 
        merchant_id, 
        organization_id,
        price, 
        currency_code, 
        image_url
    INTO 
        v_merchant_id, 
        v_organization_id,
        v_old_price, 
        v_currency, 
        v_old_image_url
    FROM merchant_products
    WHERE product_id = p_product_id;

    -- Update product details
    UPDATE merchant_products
    SET
        name = COALESCE(p_name, name),
        description = p_description,
        price = COALESCE(p_price, price),
        image_url = p_image_url,
        is_active = COALESCE(p_is_active, is_active),
        display_on_storefront = COALESCE(p_display_on_storefront, display_on_storefront),
        updated_at = NOW()
    WHERE product_id = p_product_id;

    -- Update fees if provided
    IF p_fee_type_ids IS NOT NULL THEN
        -- Delete existing fee links
        DELETE FROM organization_fee_links
        WHERE product_id = p_product_id;

        -- Insert new fee links
        IF array_length(p_fee_type_ids, 1) > 0 THEN
            INSERT INTO organization_fee_links (
                organization_id,
                fee_type_id,
                product_id
            )
            SELECT 
                v_organization_id,
                fee_id,
                p_product_id
            FROM unnest(p_fee_type_ids) AS fee_id;
        END IF;
    END IF;

    -- Log product update
    PERFORM public.log_event(
        p_merchant_id := v_merchant_id,
        p_event := 'update_product'::event_type,
        p_details := jsonb_build_object(
            'product_id', p_product_id,
            'name', p_name,
            'old_price', v_old_price,
            'new_price', p_price,
            'currency', v_currency,
            'is_active', p_is_active,
            'old_image_url', v_old_image_url,
            'new_image_url', p_image_url,
            'image_changed', (v_old_image_url IS DISTINCT FROM p_image_url),
            'display_on_storefront', p_display_on_storefront,
            'fee_count', array_length(p_fee_type_ids, 1)
        ),
        p_severity := 'NOTICE'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch organization fees
CREATE OR REPLACE FUNCTION public.fetch_organization_fees(
    p_merchant_id UUID
)
RETURNS TABLE (
    fee_type_id UUID,
    name VARCHAR(255),
    percentage NUMERIC(5,2),
    is_enabled BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        f.fee_type_id,
        f.name,
        f.percentage,
        f.is_enabled
    FROM 
        organization_fees f
        INNER JOIN merchant_organization_links mo ON f.organization_id = mo.organization_id
    WHERE 
        mo.merchant_id = p_merchant_id
        AND f.is_enabled = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.fetch_product_transactions(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.fetch_products(UUID, BOOLEAN, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_product(UUID, UUID, VARCHAR, TEXT, NUMERIC, currency_code, TEXT, BOOLEAN, BOOLEAN, UUID[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_product(UUID, VARCHAR, TEXT, NUMERIC, TEXT, BOOLEAN, BOOLEAN, UUID[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_product(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.fetch_product_fees(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.fetch_organization_fees(UUID) TO authenticated;
