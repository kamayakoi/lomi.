-- Function to fetch payment links for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_payment_links(
    p_merchant_id UUID,
    p_link_type link_type DEFAULT NULL,
    p_currency_code currency_code DEFAULT NULL,
    p_is_active BOOLEAN DEFAULT NULL,
    p_page INTEGER DEFAULT 1,
    p_page_size INTEGER DEFAULT 50,
    p_include_expired BOOLEAN DEFAULT false
)
RETURNS TABLE (
    link_id UUID,
    merchant_id UUID,
    organization_id UUID,
    link_type link_type,
    url VARCHAR(2048),
    product_id UUID,
    product_name VARCHAR(255),
    product_price NUMERIC(10,2),
    plan_id UUID,
    plan_name VARCHAR(255),
    plan_amount NUMERIC(10,2),
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
        mp.name AS product_name,
        mp.price AS product_price,
        pl.plan_id,
        sp.name AS plan_name,
        sp.amount AS plan_amount,
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
        LEFT JOIN merchant_products mp ON pl.product_id = mp.product_id
        LEFT JOIN subscription_plans sp ON pl.plan_id = sp.plan_id
    WHERE 
        pl.merchant_id = p_merchant_id AND
        (p_link_type IS NULL OR pl.link_type = p_link_type) AND
        (p_currency_code IS NULL OR pl.currency_code = p_currency_code) AND
        (p_is_active IS NULL OR pl.is_active = p_is_active) AND
        (p_include_expired = true OR pl.expires_at IS NULL OR pl.expires_at > NOW())
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
    p_title VARCHAR(255),
    p_currency_code currency_code,
    p_public_description TEXT DEFAULT NULL,
    p_private_description TEXT DEFAULT NULL,
    p_price NUMERIC(10,2) DEFAULT NULL,
    p_allowed_providers provider_code[] DEFAULT ARRAY[]::provider_code[],
    p_allow_coupon_code BOOLEAN DEFAULT false,
    p_expires_at TIMESTAMPTZ DEFAULT NULL,
    p_success_url VARCHAR(2048) DEFAULT NULL,
    p_cancel_url VARCHAR(2048) DEFAULT NULL,
    p_plan_id UUID DEFAULT NULL,
    p_product_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_link_id UUID;
    v_plan_amount NUMERIC(10,2);
    v_product_price NUMERIC(10,2);
    v_plan_currency_code currency_code;
    v_product_currency_code currency_code;
    v_website_url VARCHAR(2048);
BEGIN
    -- Get the organization's website_url
    SELECT website_url INTO v_website_url
    FROM organizations
    WHERE organization_id = p_organization_id;

    -- Get the plan amount and currency code if a plan ID is provided
    IF p_plan_id IS NOT NULL THEN
        SELECT amount, currency_code INTO v_plan_amount, v_plan_currency_code
        FROM subscription_plans
        WHERE plan_id = p_plan_id;
    END IF;

    -- Get the product price and currency code if a product ID is provided
    IF p_product_id IS NOT NULL THEN
        SELECT price, currency_code INTO v_product_price, v_product_currency_code
        FROM merchant_products
        WHERE product_id = p_product_id;
    END IF;

    INSERT INTO payment_links (
        merchant_id,
        organization_id,
        link_type,
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
        cancel_url,
        metadata
    )
    VALUES (
        p_merchant_id,
        p_organization_id,
        p_link_type,
        CASE
            WHEN p_link_type = 'instant' THEN p_currency_code
            WHEN p_link_type = 'plan' THEN v_plan_currency_code
            WHEN p_link_type = 'product' THEN v_product_currency_code
            ELSE p_currency_code
        END,
        p_title,
        p_product_id,
        p_plan_id,
        p_public_description,
        p_private_description,
        CASE
            WHEN p_link_type = 'instant' THEN p_price
            ELSE NULL
        END,
        p_allowed_providers,
        p_allow_coupon_code,
        p_expires_at,
        p_success_url,
        COALESCE(p_cancel_url, v_website_url, 'https://lomi.africa'),
        NULL
    )
    RETURNING link_id INTO v_link_id;

    RETURN v_link_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to update a payment link
CREATE OR REPLACE FUNCTION public.update_payment_link(
    p_link_id UUID,
    p_title VARCHAR(255) DEFAULT NULL,
    p_public_description TEXT DEFAULT NULL,
    p_private_description TEXT DEFAULT NULL,
    p_price NUMERIC(10,2) DEFAULT NULL,
    p_is_active BOOLEAN DEFAULT NULL,
    p_expires_at TIMESTAMPTZ DEFAULT NULL,
    p_success_url VARCHAR(2048) DEFAULT NULL,
    p_cancel_url VARCHAR(2048) DEFAULT NULL,
    p_allowed_providers provider_code[] DEFAULT NULL
)
RETURNS payment_links AS $$
DECLARE
    v_link_type link_type;
    v_updated_link payment_links;
BEGIN
    -- Get the link type of the payment link
    SELECT link_type INTO v_link_type
    FROM payment_links
    WHERE link_id = p_link_id;

    -- Update the payment link based on the link type
    IF v_link_type = 'product' OR v_link_type = 'plan' THEN
        UPDATE payment_links
        SET
            title = COALESCE(p_title, title),
            public_description = COALESCE(p_public_description, public_description),
            private_description = COALESCE(p_private_description, private_description),
            is_active = COALESCE(p_is_active, is_active),
            expires_at = COALESCE(p_expires_at, expires_at),
            success_url = COALESCE(p_success_url, success_url),
            cancel_url = COALESCE(p_cancel_url, cancel_url),
            allowed_providers = COALESCE(p_allowed_providers, allowed_providers),
            updated_at = NOW()
        WHERE link_id = p_link_id
        RETURNING * INTO v_updated_link;
    ELSIF v_link_type = 'instant' THEN
        UPDATE payment_links
        SET
            title = COALESCE(p_title, title),
            public_description = COALESCE(p_public_description, public_description),
            private_description = COALESCE(p_private_description, private_description),
            price = COALESCE(p_price, price),
            is_active = COALESCE(p_is_active, is_active),
            expires_at = COALESCE(p_expires_at, expires_at),
            success_url = COALESCE(p_success_url, success_url),
            cancel_url = COALESCE(p_cancel_url, cancel_url),
            allowed_providers = COALESCE(p_allowed_providers, allowed_providers),
            updated_at = NOW()
        WHERE link_id = p_link_id
        RETURNING * INTO v_updated_link;
    END IF;

    RETURN v_updated_link;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to get available providers for a payment link based on the merchant's organization
CREATE OR REPLACE FUNCTION public.get_payment_link_available_providers(
    p_merchant_id UUID
)
RETURNS TABLE (
    code provider_code,
    name VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.code,
        p.name
    FROM providers p
    JOIN organization_providers_settings ops ON p.code = ops.provider_code
    WHERE ops.organization_id = (
        SELECT organization_id
        FROM merchants
        WHERE merchant_id = p_merchant_id
    ) AND ops.is_connected = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to get the base URL based on the environment
CREATE OR REPLACE FUNCTION public.get_base_url()
RETURNS VARCHAR(2048)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    IF inet_client_addr() << '127.0.0.0/8'::inet THEN
        RETURN 'http://localhost:5173/';    
    ELSE
        RETURN 'https://pay.lomi.africa/';
    END IF;
END;
$$;

-- Trigger function to generate the URL after the payment link is created
CREATE OR REPLACE FUNCTION public.generate_payment_link_url()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    -- Generate the payment link URL based on the link_id and link_type
    NEW.url := CASE
        WHEN NEW.link_type = 'product' THEN get_base_url() || 'product/' || NEW.link_id::text
        WHEN NEW.link_type = 'plan' THEN get_base_url() || 'plan/' || NEW.link_id::text
        WHEN NEW.link_type = 'instant' THEN get_base_url() || 'instant/' || NEW.link_id::text
        ELSE NULL
    END;

    RETURN NEW;
END;
$$;

-- Trigger to generate the URL after the payment link is created
CREATE TRIGGER generate_payment_link_url
BEFORE INSERT ON payment_links
FOR EACH ROW
EXECUTE FUNCTION public.generate_payment_link_url();

-- Function to create a checkout session
CREATE OR REPLACE FUNCTION public.create_checkout_session(
    p_merchant_id UUID,
    p_organization_id UUID,
    p_amount NUMERIC(10,2),
    p_currency_code currency_code,
    p_payment_link_id UUID DEFAULT NULL,
    p_customer_id UUID DEFAULT NULL,
    p_product_id UUID DEFAULT NULL,
    p_plan_id UUID DEFAULT NULL,
    p_success_url VARCHAR(2048) DEFAULT NULL,
    p_cancel_url VARCHAR(2048) DEFAULT NULL,
    p_customer_email VARCHAR(255) DEFAULT NULL,
    p_customer_name VARCHAR(255) DEFAULT NULL,
    p_customer_phone VARCHAR(50) DEFAULT NULL,
    p_allowed_providers provider_code[] DEFAULT NULL,
    p_metadata JSONB DEFAULT NULL,
    p_expiration_minutes INTEGER DEFAULT 60
)
RETURNS JSON AS $$
DECLARE
    v_checkout_session_id UUID;
    v_expires_at TIMESTAMPTZ;
BEGIN
    -- Set expiration timestamp
    v_expires_at := NOW() + (p_expiration_minutes * INTERVAL '1 minute');
    
    -- Create checkout session
    INSERT INTO checkout_sessions (
        organization_id,
        merchant_id,
        payment_link_id,
        customer_id,
        amount,
        currency_code,
        product_id,
        plan_id,
        success_url,
        cancel_url,
        customer_email,
        customer_name,
        customer_phone,
        allowed_providers,
        metadata,
        expires_at
    ) VALUES (
        p_organization_id,
        p_merchant_id,
        p_payment_link_id,
        p_customer_id,
        p_amount,
        p_currency_code,
        p_product_id,
        p_plan_id,
        p_success_url,
        p_cancel_url,
        p_customer_email,
        p_customer_name,
        p_customer_phone,
        p_allowed_providers,
        p_metadata,
        v_expires_at
    ) RETURNING checkout_session_id INTO v_checkout_session_id;
    
    RETURN jsonb_build_object(
        'checkout_session_id', v_checkout_session_id,
        'expires_at', v_expires_at
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to retrieve a checkout session
CREATE OR REPLACE FUNCTION public.get_checkout_session(
    p_checkout_session_id UUID
)
RETURNS JSON AS $$
DECLARE
    v_result JSON;
    v_now TIMESTAMPTZ := NOW();
BEGIN
    -- First check if session needs to be expired
    UPDATE checkout_sessions
    SET status = 'expired'
    WHERE checkout_session_id = p_checkout_session_id
    AND status = 'open'
    AND expires_at < v_now;
    
    -- Get session details
    SELECT json_build_object(
        'checkout_session_id', cs.checkout_session_id,
        'organization_id', cs.organization_id,
        'merchant_id', cs.merchant_id,
        'payment_link_id', cs.payment_link_id,
        'customer_id', cs.customer_id,
        'amount', cs.amount,
        'currency_code', cs.currency_code,
        'status', cs.status,
        'product_id', cs.product_id,
        'plan_id', cs.plan_id,
        'success_url', cs.success_url,
        'cancel_url', cs.cancel_url,
        'customer_email', cs.customer_email,
        'customer_name', cs.customer_name,
        'customer_phone', cs.customer_phone,
        'allowed_providers', cs.allowed_providers,
        'expires_at', cs.expires_at,
        'created_at', cs.created_at,
        'updated_at', cs.updated_at,
        'is_expired', CASE WHEN cs.status = 'expired' OR cs.expires_at < v_now THEN true ELSE false END
    ) INTO v_result
    FROM checkout_sessions cs
    WHERE cs.checkout_session_id = p_checkout_session_id;
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to update checkout session status
CREATE OR REPLACE FUNCTION public.update_checkout_session_status(
    p_checkout_session_id UUID,
    p_status checkout_session_status
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE checkout_sessions
    SET 
        status = p_status,
        updated_at = NOW()
    WHERE checkout_session_id = p_checkout_session_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to update checkout session with customer information
CREATE OR REPLACE FUNCTION public.update_checkout_session_customer(
    p_checkout_session_id UUID,
    p_customer_id UUID,
    p_customer_email VARCHAR(255) DEFAULT NULL,
    p_customer_name VARCHAR(255) DEFAULT NULL,
    p_customer_phone VARCHAR(50) DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE checkout_sessions
    SET 
        customer_id = p_customer_id,
        customer_email = COALESCE(p_customer_email, customer_email),
        customer_name = COALESCE(p_customer_name, customer_name),
        customer_phone = COALESCE(p_customer_phone, customer_phone),
        updated_at = NOW()
    WHERE checkout_session_id = p_checkout_session_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to create a checkout session from payment link ID (without redirecting)
CREATE OR REPLACE FUNCTION public.create_checkout_session_from_payment_link(
    p_payment_link_id UUID,
    p_customer_id UUID DEFAULT NULL,
    p_customer_email VARCHAR(255) DEFAULT NULL,
    p_customer_name VARCHAR(255) DEFAULT NULL,
    p_customer_phone VARCHAR(50) DEFAULT NULL,
    p_expiration_minutes INTEGER DEFAULT 60
)
RETURNS JSON AS $$
DECLARE
    v_link payment_links;
    v_amount NUMERIC(10,2);
    v_result JSON;
BEGIN
    -- Get the payment link details
    SELECT * INTO v_link 
    FROM payment_links 
    WHERE link_id = p_payment_link_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Payment link not found';
    END IF;
    
    -- Check if payment link is active and not expired
    IF NOT v_link.is_active THEN
        RAISE EXCEPTION 'Payment link is not active';
    END IF;
    
    IF v_link.expires_at IS NOT NULL AND v_link.expires_at < NOW() THEN
        RAISE EXCEPTION 'Payment link has expired';
    END IF;
    
    -- Determine the amount based on link type
    IF v_link.link_type = 'instant' THEN
        v_amount := v_link.price;
    ELSIF v_link.link_type = 'product' THEN
        SELECT price INTO v_amount 
        FROM merchant_products 
        WHERE product_id = v_link.product_id;
    ELSIF v_link.link_type = 'plan' THEN
        -- For plans, we use the initial amount
        SELECT amount INTO v_amount 
        FROM subscription_plans 
        WHERE plan_id = v_link.plan_id;
    END IF;
    
    -- Create the checkout session
    SELECT public.create_checkout_session(
        v_link.merchant_id,
        v_link.organization_id,
        v_amount,
        v_link.currency_code,
        v_link.link_id,
        p_customer_id,
        v_link.product_id,
        v_link.plan_id,
        v_link.success_url,
        v_link.cancel_url,
        p_customer_email,
        p_customer_name,
        p_customer_phone,
        v_link.allowed_providers,
        jsonb_build_object('payment_link_id', v_link.link_id),
        p_expiration_minutes
    ) INTO v_result;
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to process a payment for a checkout session
CREATE OR REPLACE FUNCTION public.process_checkout_transaction(
    p_checkout_session_id UUID,
    p_payment_method_code payment_method_code,
    p_provider_code provider_code,
    p_provider_transaction_id VARCHAR(255) DEFAULT NULL,
    p_provider_payment_details JSONB DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    v_session checkout_sessions;
    v_transaction_id UUID;
    v_result JSON;
BEGIN
    -- Get the checkout session
    SELECT * INTO v_session
    FROM checkout_sessions
    WHERE checkout_session_id = p_checkout_session_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Checkout session not found';
    END IF;
    
    -- Check if session is valid
    IF v_session.status != 'open' THEN
        RAISE EXCEPTION 'Checkout session is not open';
    END IF;
    
    IF v_session.expires_at < NOW() THEN
        -- Update status to expired
        UPDATE checkout_sessions
        SET status = 'expired'
        WHERE checkout_session_id = p_checkout_session_id;
        
        RAISE EXCEPTION 'Checkout session has expired';
    END IF;
    
    -- Create the transaction
    INSERT INTO transactions (
        merchant_id,
        organization_id,
        customer_id,
        amount,
        currency_code,
        payment_method_code,
        provider_code,
        provider_transaction_id,
        transaction_type,
        product_id,
        subscription_id,
        plan_id,
        metadata
    ) VALUES (
        v_session.merchant_id,
        v_session.organization_id,
        v_session.customer_id,
        v_session.amount,
        v_session.currency_code,
        p_payment_method_code,
        p_provider_code,
        p_provider_transaction_id,
        'payment',
        v_session.product_id,
        v_session.subscription_id,
        v_session.plan_id,
        jsonb_build_object('checkout_session_id', p_checkout_session_id, 'provider_details', p_provider_payment_details)
    ) RETURNING transaction_id INTO v_transaction_id;
    
    -- Update the checkout session status
    UPDATE checkout_sessions
    SET 
        status = 'completed',
        updated_at = NOW()
    WHERE checkout_session_id = p_checkout_session_id;
    
    -- Build the result
    SELECT json_build_object(
        'transaction_id', t.transaction_id,
        'checkout_session_id', p_checkout_session_id,
        'amount', t.amount,
        'currency_code', t.currency_code,
        'status', 'completed',
        'provider_code', t.provider_code,
        'payment_method_code', t.payment_method_code,
        'created_at', t.created_at
    ) INTO v_result
    FROM transactions t
    WHERE t.transaction_id = v_transaction_id;
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to create or update a customer
CREATE OR REPLACE FUNCTION public.create_or_update_customer(
    p_organization_id UUID,
    p_merchant_id UUID,
    p_first_name VARCHAR(100),
    p_last_name VARCHAR(100),
    p_email VARCHAR(255),
    p_phone VARCHAR(50),
    p_address VARCHAR(255) DEFAULT NULL,
    p_city VARCHAR(100) DEFAULT NULL,
    p_state VARCHAR(100) DEFAULT NULL,
    p_postal_code VARCHAR(20) DEFAULT NULL,
    p_country VARCHAR(100) DEFAULT NULL,
    p_whatsapp_number VARCHAR(50) DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    v_customer_id UUID;
    v_existing_customer UUID;
BEGIN
    -- Check if customer exists by email or phone
    SELECT customer_id INTO v_existing_customer
    FROM customers
    WHERE (email = p_email OR phone = p_phone)
    AND merchant_id = p_merchant_id
    LIMIT 1;
    
    IF v_existing_customer IS NOT NULL THEN
        -- Update existing customer
        UPDATE customers
        SET
            first_name = p_first_name,
            last_name = p_last_name,
            email = p_email,
            phone = p_phone,
            address = COALESCE(p_address, address),
            city = COALESCE(p_city, city),
            state = COALESCE(p_state, state),
            postal_code = COALESCE(p_postal_code, postal_code),
            country = COALESCE(p_country, country),
            whatsapp_number = COALESCE(p_whatsapp_number, whatsapp_number),
            updated_at = NOW()
        WHERE customer_id = v_existing_customer;
        
        v_customer_id := v_existing_customer;
    ELSE
        -- Create new customer
        INSERT INTO customers (
            organization_id,
            merchant_id,
            first_name,
            last_name,
            email,
            phone,
            address,
            city,
            state,
            postal_code,
            country,
            whatsapp_number
        ) VALUES (
            p_organization_id,
            p_merchant_id,
            p_first_name,
            p_last_name,
            p_email,
            p_phone,
            p_address,
            p_city,
            p_state,
            p_postal_code,
            p_country,
            p_whatsapp_number
        ) RETURNING customer_id INTO v_customer_id;
    END IF;
    
    RETURN jsonb_build_object(
        'customer_id', v_customer_id,
        'is_new', v_existing_customer IS NULL
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to soft-delete expired payment links
CREATE OR REPLACE FUNCTION public.cleanup_expired_payment_links()
RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER;
BEGIN
    -- Soft delete by marking as inactive
    UPDATE payment_links
    SET is_active = false
    WHERE is_active = true
      AND expires_at IS NOT NULL
      AND expires_at < NOW();
      
    GET DIAGNOSTICS v_count = ROW_COUNT;
    RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Create a trigger function to handle expiration date changes
CREATE OR REPLACE FUNCTION public.handle_payment_link_expiration_changes()
RETURNS TRIGGER AS $$
BEGIN
    -- Only process if expires_at actually changed
    IF OLD.expires_at IS DISTINCT FROM NEW.expires_at THEN
        -- If expires_at changed to a future date, set is_active to true
        IF NEW.expires_at IS NOT NULL AND NEW.expires_at > NOW() THEN
            NEW.is_active := TRUE;
            -- Log for debugging
            RAISE NOTICE 'Payment link id % activated: expiration changed to future date %', 
                NEW.link_id, NEW.expires_at;
        
        -- If expires_at changed to a past date or null, set is_active to false
        ELSIF NEW.expires_at IS NULL OR NEW.expires_at <= NOW() THEN
            NEW.is_active := FALSE;
            -- Log for debugging
            RAISE NOTICE 'Payment link id % deactivated: expiration changed to past date %', 
                NEW.link_id, NEW.expires_at;
        END IF;
    END IF;
    
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- In case of any error, still allow the update to proceed
    RAISE WARNING 'Error in handle_payment_link_expiration_changes: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to apply the function before any update
DROP TRIGGER IF EXISTS payment_link_expiration_trigger ON payment_links;
CREATE TRIGGER payment_link_expiration_trigger
BEFORE UPDATE ON payment_links
FOR EACH ROW
EXECUTE FUNCTION public.handle_payment_link_expiration_changes();

-- Function to manually reactivate payment links with future expiration dates
CREATE OR REPLACE FUNCTION public.reactivate_valid_payment_links()
RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER;
BEGIN
    -- Reactivate links that have future expiration dates but are marked as inactive
    UPDATE payment_links
    SET is_active = true
    WHERE is_active = false
      AND expires_at IS NOT NULL
      AND expires_at > NOW();
      
    GET DIAGNOSTICS v_count = ROW_COUNT;
    RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to safely delete a payment link by first handling related records
CREATE OR REPLACE FUNCTION public.safe_delete_payment_link(
    p_link_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    v_success BOOLEAN := FALSE;
BEGIN
    -- First, update any associated checkout sessions to set payment_link_id to NULL
    UPDATE checkout_sessions
    SET payment_link_id = NULL
    WHERE payment_link_id = p_link_id;
    
    -- Then delete the payment link
    DELETE FROM payment_links
    WHERE link_id = p_link_id;
    
    v_success := TRUE;
    RETURN v_success;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error deleting payment link: %', SQLERRM;
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;