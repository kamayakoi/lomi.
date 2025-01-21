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
    p_name VARCHAR,
    p_email VARCHAR,
    p_phone_number VARCHAR,
    p_whatsapp_number VARCHAR,
    p_country VARCHAR,
    p_city VARCHAR,
    p_address VARCHAR,
    p_postal_code VARCHAR
)
RETURNS UUID AS $$
DECLARE
    v_customer_id UUID;
BEGIN
    -- Check if the customer already exists
    SELECT customer_id INTO v_customer_id
    FROM customers
    WHERE email = p_email AND merchant_id = p_merchant_id AND organization_id = p_organization_id;

    IF v_customer_id IS NULL THEN
        -- Customer doesn't exist, create a new one
        INSERT INTO customers (merchant_id, organization_id, name, email, phone_number, whatsapp_number, country, city, address, postal_code)
        VALUES (p_merchant_id, p_organization_id, p_name, p_email, p_phone_number, p_whatsapp_number, p_country, p_city, p_address, p_postal_code)
        RETURNING customer_id INTO v_customer_id;
    ELSE
        -- Customer exists, update their details
        UPDATE customers
        SET name = p_name,
            phone_number = p_phone_number,
            whatsapp_number = p_whatsapp_number,
            country = p_country,
            city = p_city,
            address = p_address,
            postal_code = p_postal_code,
            updated_at = NOW()
        WHERE customer_id = v_customer_id;
    END IF;

    RETURN v_customer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

/*
-- Function to initiate Wave checkout
CREATE OR REPLACE FUNCTION public.initiate_wave_checkout(
    p_amount NUMERIC,
    p_currency currency_code,
    p_aggregated_merchant_id VARCHAR,
    p_error_url VARCHAR,
    p_success_url VARCHAR,
    p_merchant_id UUID,
    p_organization_id UUID,
    p_customer_id UUID,
    p_product_id UUID,
    p_subscription_id UUID,
    p_transaction_type VARCHAR,
    p_description TEXT,
    p_reference_id VARCHAR,
    p_metadata JSONB,
    p_fee_amount NUMERIC,
    p_fee_reference VARCHAR,
    p_provider_code provider_code,
    p_payment_method_code payment_method_code,
    p_provider_transaction_id VARCHAR,
    p_provider_payment_status VARCHAR
)
RETURNS TABLE (
    wave_launch_url VARCHAR
) AS $$
BEGIN
    -- Implement the logic to initiate Wave checkout
    -- This may involve making API calls to Wave's payment gateway
    -- and returning the launch URL for the Wave checkout page

    RETURN QUERY
    SELECT 'https://example.com/wave-checkout' AS wave_launch_url;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;
*/