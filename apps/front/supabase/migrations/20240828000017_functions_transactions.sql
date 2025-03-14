-- Function to fetch transactions for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_transactions(
    p_merchant_id UUID,
    p_provider_code provider_code DEFAULT NULL,
    p_status transaction_status[] DEFAULT NULL,
    p_type transaction_type[] DEFAULT NULL,
    p_currency currency_code[] DEFAULT NULL,
    p_payment_method payment_method_code[] DEFAULT NULL,
    p_page INTEGER DEFAULT 1,
    p_page_size INTEGER DEFAULT 50,
    p_start_date TIMESTAMP DEFAULT NULL,
    p_end_date TIMESTAMP DEFAULT NULL
)
RETURNS TABLE (
    transaction_id UUID,
    customer_name VARCHAR,
    customer_email VARCHAR,
    customer_phone VARCHAR,
    customer_country VARCHAR,
    customer_city VARCHAR,
    customer_address VARCHAR,
    customer_postal_code VARCHAR,
    gross_amount NUMERIC(10,2),
    net_amount NUMERIC(10,2),
    currency_code currency_code,
    payment_method_code payment_method_code,
    status transaction_status,
    transaction_type transaction_type,
    created_at TIMESTAMPTZ,
    provider_code provider_code,
    product_id UUID,
    product_name VARCHAR,
    product_description TEXT,
    product_price NUMERIC(10,2),
    provider_transaction_id VARCHAR,
    provider_checkout_id VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.transaction_id,
        c.name AS customer_name,
        c.email AS customer_email,
        c.phone_number AS customer_phone,
        c.country AS customer_country,
        c.city AS customer_city,
        c.address AS customer_address,
        c.postal_code AS customer_postal_code,
        t.gross_amount,
        t.net_amount,
        t.currency_code,
        t.payment_method_code,
        t.status,
        t.transaction_type,
        t.created_at,
        t.provider_code,
        t.product_id,
        mp.name AS product_name,
        mp.description AS product_description,
        mp.price AS product_price,
        pt.provider_transaction_id,
        pt.provider_checkout_id
    FROM 
        transactions t
    JOIN
        customers c ON t.customer_id = c.customer_id
    LEFT JOIN
        merchant_products mp ON t.product_id = mp.product_id
    LEFT JOIN
        providers_transactions pt ON t.transaction_id = pt.transaction_id
    WHERE 
        t.merchant_id = p_merchant_id AND
        (p_provider_code IS NULL OR t.provider_code = p_provider_code) AND
        (p_status IS NULL OR t.status = ANY(p_status)) AND
        (p_type IS NULL OR t.transaction_type = ANY(p_type)) AND
        (p_currency IS NULL OR t.currency_code = ANY(p_currency)) AND
        (p_payment_method IS NULL OR t.payment_method_code = ANY(p_payment_method)) AND
        (p_start_date IS NULL OR t.created_at >= p_start_date::TIMESTAMP) AND
        (p_end_date IS NULL OR t.created_at <= p_end_date::TIMESTAMP)
    ORDER BY
        t.created_at DESC
    LIMIT p_page_size
    OFFSET ((p_page - 1) * p_page_size);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch total incoming amount for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_total_incoming_amount(
    p_merchant_id UUID,
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS NUMERIC(15,2) AS $$
DECLARE
    v_total_incoming NUMERIC(15,2);
BEGIN
    SELECT 
        COALESCE(SUM(t.net_amount), 0) - COALESCE(SUM(r.amount), 0) INTO v_total_incoming
    FROM 
        transactions t
    LEFT JOIN
        refunds r ON t.transaction_id = r.transaction_id
    WHERE 
        t.merchant_id = p_merchant_id AND
        t.status = 'completed' AND
        t.transaction_type IN ('payment', 'instalment') AND
        (p_start_date IS NULL OR t.created_at >= p_start_date) AND
        (p_end_date IS NULL OR t.created_at <= p_end_date);
        
    RETURN ROUND(v_total_incoming, 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch the number of transactions for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_transaction_count(
    p_merchant_id UUID,
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
    v_transaction_count INTEGER;
BEGIN
    SELECT 
        COUNT(*) INTO v_transaction_count
    FROM 
        transactions
    WHERE 
        merchant_id = p_merchant_id AND
        transaction_type IN ('payment', 'instalment') AND
        status IN ('completed', 'pending', 'refunded') AND
        (p_start_date IS NULL OR created_at >= p_start_date) AND
        (p_end_date IS NULL OR created_at <= p_end_date);
        
    RETURN v_transaction_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch completion rate data for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_completion_rate(
    p_merchant_id UUID,
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS TABLE (
    completed BIGINT,
    refunded BIGINT,
    failed BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*) FILTER (WHERE status = 'completed')::BIGINT AS completed,
        COUNT(*) FILTER (WHERE status = 'refunded')::BIGINT AS refunded,
        COUNT(*) FILTER (WHERE status = 'failed')::BIGINT AS failed
    FROM
        transactions
    WHERE
        merchant_id = p_merchant_id AND
        transaction_type IN ('payment', 'instalment') AND
        (p_start_date IS NULL OR created_at >= p_start_date) AND
        (p_end_date IS NULL OR created_at <= p_end_date);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch gross amount for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_gross_amount(
    p_merchant_id UUID,
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS NUMERIC(15,2) AS $$
DECLARE
    v_gross_amount NUMERIC(15,2);
BEGIN
    SELECT 
        COALESCE(SUM(gross_amount), 0) INTO v_gross_amount
    FROM 
        transactions
    WHERE 
        merchant_id = p_merchant_id AND
        status = 'completed' AND
        transaction_type IN ('payment', 'instalment') AND
        (p_start_date IS NULL OR created_at >= p_start_date) AND
        (p_end_date IS NULL OR created_at <= p_end_date);
        
    RETURN ROUND(v_gross_amount, 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch fee amount for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_fee_amount(
    p_merchant_id UUID,
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS NUMERIC(15,2) AS $$
DECLARE
    v_fee_amount NUMERIC(15,2);
BEGIN
    SELECT 
        COALESCE(SUM(fee_amount), 0) INTO v_fee_amount
    FROM 
        transactions
    WHERE 
        merchant_id = p_merchant_id AND
        status = 'completed' AND
        transaction_type IN ('payment', 'instalment') AND
        (p_start_date IS NULL OR created_at >= p_start_date) AND
        (p_end_date IS NULL OR created_at <= p_end_date);
        
    RETURN ROUND(v_fee_amount, 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch average transaction value for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_average_transaction_value(
    p_merchant_id UUID,
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS NUMERIC(15,2) AS $$
DECLARE
    v_average_transaction_value NUMERIC(15,2);
BEGIN
    SELECT 
        COALESCE(AVG(gross_amount), 0) INTO v_average_transaction_value
    FROM 
        transactions
    WHERE 
        merchant_id = p_merchant_id AND
        status = 'completed' AND
        transaction_type IN ('payment', 'instalment') AND
        (p_start_date IS NULL OR created_at >= p_start_date) AND
        (p_end_date IS NULL OR created_at <= p_end_date);
        
    RETURN ROUND(v_average_transaction_value, 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch average customer lifetime value for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_average_customer_lifetime_value(
    p_merchant_id UUID,
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS NUMERIC(15,2) AS $$
DECLARE
    v_average_customer_lifetime_value NUMERIC(15,2);
BEGIN
    WITH customer_transactions AS (
        SELECT
            c.customer_id,
            SUM(t.net_amount) AS total_net_amount,
            COUNT(t.transaction_id) AS total_transactions
        FROM
            customers c
        JOIN
            transactions t ON c.customer_id = t.customer_id
        WHERE
            c.merchant_id = p_merchant_id AND
            t.status = 'completed' AND
            (p_start_date IS NULL OR t.created_at >= p_start_date) AND
            (p_end_date IS NULL OR t.created_at <= p_end_date)
        GROUP BY
            c.customer_id
    )
    SELECT
        COALESCE(AVG(ct.total_net_amount * ct.total_transactions), 0) INTO v_average_customer_lifetime_value
    FROM
        customer_transactions ct;

    RETURN ROUND(v_average_customer_lifetime_value, 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch average retention rate for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_average_retention_rate(
    p_merchant_id UUID,
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS NUMERIC(5,2) AS $$
DECLARE
    v_total_customers INTEGER;
    v_returning_customers INTEGER;
    v_average_retention_rate NUMERIC(5,2);
BEGIN
    SELECT
        COUNT(DISTINCT customer_id) INTO v_total_customers
    FROM
        transactions
    WHERE
        merchant_id = p_merchant_id AND
        status = 'completed' AND
        (p_start_date IS NULL OR created_at >= p_start_date) AND
        (p_end_date IS NULL OR created_at <= p_end_date);

    SELECT
        COUNT(DISTINCT customer_id) INTO v_returning_customers
    FROM
        transactions
    WHERE
        merchant_id = p_merchant_id AND
        status = 'completed' AND
        (p_start_date IS NULL OR created_at >= p_start_date) AND
        (p_end_date IS NULL OR created_at <= p_end_date)
    GROUP BY
        customer_id
    HAVING
        COUNT(transaction_id) > 1;

    IF v_total_customers > 0 THEN
        v_average_retention_rate := (v_returning_customers * 100.0) / v_total_customers;
    ELSE
        v_average_retention_rate := 0;
    END IF;

    RETURN ROUND(v_average_retention_rate, 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to process a payment
CREATE OR REPLACE FUNCTION public.process_payment(
    p_merchant_id UUID,
    p_amount NUMERIC,
    p_currency_code currency_code,
    p_provider_code provider_code,
    p_metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_transaction_id UUID;
BEGIN
    -- Create transaction record
    INSERT INTO transactions (
        merchant_id,
        amount,
        currency_code,
        provider_code,
        status,
        metadata
    ) VALUES (
        p_merchant_id,
        p_amount,
        p_currency_code,
        p_provider_code,
        'pending',
        p_metadata
    ) RETURNING transaction_id INTO v_transaction_id;

    -- Log payment processing
    PERFORM public.log_event(
        p_merchant_id := p_merchant_id,
        p_event := 'process_payment'::event_type,
        p_details := jsonb_build_object(
            'transaction_id', v_transaction_id,
            'amount', p_amount,
            'currency', p_currency_code,
            'provider', p_provider_code,
            'status', 'pending'
        ),
        p_severity := 'NOTICE'
    );

    RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to create a refund
DROP FUNCTION IF EXISTS public.create_refund;
CREATE OR REPLACE FUNCTION public.create_refund(
    p_merchant_id UUID,
    p_transaction_id UUID,
    p_amount NUMERIC,
    p_reason TEXT DEFAULT NULL,
    p_provider_transaction_id VARCHAR DEFAULT NULL,
    p_provider_merchant_id VARCHAR DEFAULT NULL,
    p_provider_code provider_code DEFAULT NULL,
    p_metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_refund_id UUID;
    v_transaction_amount NUMERIC;
    v_fee_amount NUMERIC;
    v_new_status transaction_status;
BEGIN
    -- Get original transaction amount
    SELECT gross_amount, fee_amount 
    INTO v_transaction_amount, v_fee_amount
    FROM transactions 
    WHERE transaction_id = p_transaction_id;
    
    -- Determine new transaction status based on refund amount
    IF p_amount >= v_transaction_amount THEN
        v_new_status := 'refunded';
    ELSE
        v_new_status := 'partially_refunded';
    END IF;

    -- Create refund record
    INSERT INTO refunds (
        transaction_id,
        amount,
        refunded_amount,
        fee_amount,
        reason,
        provider_transaction_id,
        metadata,
        status
    ) VALUES (
        p_transaction_id,
        v_transaction_amount,
        p_amount,
        v_fee_amount,
        p_reason,
        p_provider_transaction_id,
        jsonb_build_object(
            'provider_transaction_id', p_provider_transaction_id,
            'provider_merchant_id', p_provider_merchant_id,
            'provider_code', p_provider_code,
            'refunded_by', 'merchant',
            'additional_data', p_metadata
        ),
        'completed'
    ) RETURNING refund_id INTO v_refund_id;

    -- Update transaction status
    UPDATE transactions
    SET status = v_new_status
    WHERE transaction_id = p_transaction_id;
    
    -- Update provider transaction status if applicable
    IF p_provider_transaction_id IS NOT NULL THEN
        UPDATE providers_transactions
        SET provider_payment_status = v_new_status
        WHERE transaction_id = p_transaction_id;
    END IF;

    -- Log refund creation
    PERFORM public.log_event(
        p_merchant_id := p_merchant_id,
        p_event := 'create_refund'::event_type,
        p_details := jsonb_build_object(
            'refund_id', v_refund_id,
            'transaction_id', p_transaction_id,
            'amount', p_amount,
            'provider_transaction_id', p_provider_transaction_id,
            'provider_merchant_id', p_provider_merchant_id,
            'reason', p_reason
        ),
        p_severity := 'CRITICAL'
    );

    RETURN v_refund_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to get the provider merchant ID for a specific organization and provider code
CREATE OR REPLACE FUNCTION public.get_provider_merchant_id(
    p_organization_id UUID,
    p_provider_code provider_code
)
RETURNS VARCHAR AS $$
DECLARE
    v_provider_merchant_id VARCHAR;
BEGIN
    SELECT provider_merchant_id INTO v_provider_merchant_id
    FROM organization_providers_settings
    WHERE organization_id = p_organization_id AND provider_code = p_provider_code;
    
    RETURN v_provider_merchant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;
