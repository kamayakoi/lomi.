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
    p_is_business BOOLEAN
)
RETURNS UUID AS $$
DECLARE
    v_customer_id UUID;
BEGIN
    INSERT INTO customers (merchant_id, organization_id, name, email, phone_number, country, city, address, postal_code, is_business)
    VALUES (p_merchant_id, p_organization_id, p_name, p_email, p_phone_number, p_country, p_city, p_address, p_postal_code, p_is_business)
    RETURNING customer_id INTO v_customer_id;

    RETURN v_customer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch customers for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_customers(
    p_merchant_id UUID,
    p_search_term VARCHAR DEFAULT NULL,
    p_customer_type VARCHAR DEFAULT NULL,
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
        c.created_at,
        c.updated_at
    FROM 
        customers c
    WHERE 
        c.merchant_id = p_merchant_id
        AND c.is_deleted = false
        AND (p_search_term IS NULL OR c.name ILIKE '%' || p_search_term || '%' OR c.email ILIKE '%' || p_search_term || '%')
        AND (p_customer_type IS NULL OR (p_customer_type = 'business' AND c.is_business) OR (p_customer_type = 'individual' AND NOT c.is_business))
    ORDER BY
        c.created_at DESC
    LIMIT p_page_size
    OFFSET ((p_page - 1) * p_page_size);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to soft delete a customer
CREATE OR REPLACE FUNCTION public.delete_customer(
    p_customer_id UUID
)
RETURNS VOID AS $$
BEGIN
    UPDATE customers
    SET 
        is_deleted = true,
        deleted_at = NOW()
    WHERE
        customer_id = p_customer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch transactions for a specific customer
CREATE OR REPLACE FUNCTION public.fetch_customer_transactions(
    p_customer_id UUID
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
        t.customer_id = p_customer_id
    ORDER BY
        t.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.fetch_customer_transactions(UUID) TO authenticated;

-- Function to update a customer
CREATE OR REPLACE FUNCTION public.update_customer(
    p_customer_id UUID,
    p_name VARCHAR,
    p_email VARCHAR,
    p_phone_number VARCHAR,
    p_country VARCHAR,
    p_city VARCHAR,
    p_address VARCHAR,
    p_postal_code VARCHAR,
    p_is_business BOOLEAN
)
RETURNS VOID AS $$
BEGIN
    UPDATE customers
    SET
        name = p_name,
        email = p_email,
        phone_number = p_phone_number,
        country = p_country,
        city = p_city,
        address = p_address,
        postal_code = p_postal_code,
        is_business = p_is_business,
        updated_at = NOW()
    WHERE customer_id = p_customer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch a specific customer
CREATE OR REPLACE FUNCTION public.fetch_customer(
    p_customer_id UUID
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
    is_business BOOLEAN
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
        c.is_business
    FROM
        customers c
    WHERE
        c.customer_id = p_customer_id
        AND c.is_deleted = false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;
