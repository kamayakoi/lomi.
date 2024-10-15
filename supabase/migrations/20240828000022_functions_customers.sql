-- Function to create a new customer
CREATE OR REPLACE FUNCTION public.create_customer(
    p_merchant_id UUID,
    p_organization_id UUID,
    p_name VARCHAR,
    p_email VARCHAR,
    p_phone_number VARCHAR,
    p_country VARCHAR,
    p_city VARCHAR,
    p_address VARCHAR,
    p_postal_code VARCHAR,
    p_is_business BOOLEAN,
    p_metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_customer_id UUID;
BEGIN
    INSERT INTO customers (merchant_id, organization_id, name, email, phone_number, country, city, address, postal_code, is_business, metadata)
    VALUES (p_merchant_id, p_organization_id, p_name, p_email, p_phone_number, p_country, p_city, p_address, p_postal_code, p_is_business, p_metadata)
    RETURNING customer_id INTO v_customer_id;

    RETURN v_customer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch customers for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_customers(
    p_merchant_id UUID,
    p_page INTEGER DEFAULT 1,
    p_page_size INTEGER DEFAULT 50
)
RETURNS TABLE (
    customer_id UUID,
    name VARCHAR,
    email VARCHAR,
    phone_number VARCHAR,
    country VARCHAR,
    city VARCHAR,
    address VARCHAR,
    postal_code VARCHAR,
    is_business BOOLEAN,
    metadata JSONB,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.customer_id,
        c.name,
        c.email,
        c.phone_number,
        c.country,
        c.city,
        c.address,
        c.postal_code,
        c.is_business,
        c.metadata,
        c.created_at,
        c.updated_at
    FROM 
        customers c
    WHERE 
        c.merchant_id = p_merchant_id
    ORDER BY
        c.created_at DESC
    LIMIT p_page_size
    OFFSET ((p_page - 1) * p_page_size);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;
