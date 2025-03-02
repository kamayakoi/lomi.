-- Function to fetch data for checkout
CREATE OR REPLACE FUNCTION public.fetch_data_for_checkout(
    p_link_id UUID
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
    cancel_url VARCHAR,
    metadata JSONB,
    product_id UUID,
    product_name VARCHAR,
    product_description TEXT,
    product_price NUMERIC,
    product_image_url TEXT,
    plan_id UUID,
    plan_name VARCHAR,
    plan_description TEXT,
    plan_amount NUMERIC,
    plan_billing_frequency frequency,
    plan_image_url TEXT,
    organization_logo_url VARCHAR,
    organization_name VARCHAR
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
        pl.cancel_url,
        pl.metadata,
        pl.product_id,
        mp.name AS product_name,
        mp.description AS product_description,
        mp.price AS product_price,
        mp.image_url AS product_image_url,
        pl.plan_id,
        sp.name AS plan_name,
        sp.description AS plan_description,
        sp.amount AS plan_amount,
        sp.billing_frequency AS plan_billing_frequency,
        sp.image_url AS plan_image_url,
        CAST(REGEXP_REPLACE(o.logo_url, '^.*\/logos\/', '') AS VARCHAR) AS organization_logo_url,
        o.name AS organization_name
    FROM
        payment_links pl
        LEFT JOIN merchant_products mp ON pl.product_id = mp.product_id
        LEFT JOIN subscription_plans sp ON pl.plan_id = sp.plan_id
        JOIN organizations o ON pl.organization_id = o.organization_id
    WHERE
        pl.link_id = p_link_id;
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

-- Function to create or update customer
CREATE OR REPLACE FUNCTION public.create_or_update_customer(
    p_merchant_id UUID,
    p_organization_id UUID,
    p_name TEXT,
    p_email TEXT DEFAULT NULL,
    p_phone_number TEXT DEFAULT NULL,
    p_whatsapp_number TEXT DEFAULT NULL,
    p_country TEXT DEFAULT NULL,
    p_city TEXT DEFAULT NULL,
    p_address TEXT DEFAULT NULL,
    p_postal_code TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_customer_id UUID;
BEGIN
    -- Try to find existing customer by phone or email
    SELECT customer_id INTO v_customer_id
    FROM customers
    WHERE merchant_id = p_merchant_id
    AND organization_id = p_organization_id
    AND (
        (p_phone_number IS NOT NULL AND phone_number = p_phone_number)
        OR (p_email IS NOT NULL AND email = p_email)
    )
    LIMIT 1;

    IF FOUND THEN
        -- Update existing customer
        UPDATE customers
        SET name = p_name,
            email = COALESCE(p_email, email),
            phone_number = COALESCE(p_phone_number, phone_number),
            whatsapp_number = COALESCE(p_whatsapp_number, whatsapp_number),
            country = COALESCE(p_country, country),
            city = COALESCE(p_city, city),
            address = COALESCE(p_address, address),
            postal_code = COALESCE(p_postal_code, postal_code),
            updated_at = NOW()
        WHERE customer_id = v_customer_id;
    ELSE
        -- Create new customer
        INSERT INTO customers (
            merchant_id,
            organization_id,
            name,
            email,
            phone_number,
            whatsapp_number,
            country,
            city,
            address,
            postal_code
        )
        VALUES (
            p_merchant_id,
            p_organization_id,
            p_name,
            p_email,
            p_phone_number,
            p_whatsapp_number,
            p_country,
            p_city,
            p_address,
            p_postal_code
        )
        RETURNING customer_id INTO v_customer_id;
    END IF;

    RETURN v_customer_id;
END;
$$;