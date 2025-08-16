-- Function to generate unique deal IDs
CREATE OR REPLACE FUNCTION generate_deal_id()
RETURNS VARCHAR(10) AS $$
DECLARE
    chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    result VARCHAR(10) := '';
    i INTEGER;
    char_index INTEGER;
BEGIN
    -- Generate 6-character random string
    FOR i IN 1..6 LOOP
        char_index := floor(random() * length(chars) + 1);
        result := result || substr(chars, char_index, 1);
    END LOOP;
    
    -- Check if ID already exists (very unlikely but be safe)
    WHILE EXISTS(SELECT 1 FROM deals WHERE deal_id = result) LOOP
        result := '';
        FOR i IN 1..6 LOOP
            char_index := floor(random() * length(chars) + 1);
            result := result || substr(chars, char_index, 1);
        END LOOP;
    END LOOP;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to create a new deal
CREATE OR REPLACE FUNCTION create_deal(
    p_item_description TEXT,
    p_price DECIMAL(15,2),
    p_currency currency_code,
    p_seller_phone VARCHAR(20),
    p_buyer_phone VARCHAR(20),
    p_metadata JSONB DEFAULT '{}'
)
RETURNS TABLE (
    deal_id VARCHAR(10),
    deal_url TEXT
) AS $$
DECLARE
    v_deal_id VARCHAR(10);
    v_seller_user_id UUID;
    v_buyer_user_id UUID;
BEGIN
    -- Validate inputs
    IF p_seller_phone = p_buyer_phone THEN
        RAISE EXCEPTION 'Seller and buyer phone numbers must be different';
    END IF;
    
    IF p_price <= 0 THEN
        RAISE EXCEPTION 'Price must be greater than 0';
    END IF;
    
    IF length(trim(p_item_description)) < 10 THEN
        RAISE EXCEPTION 'Item description must be at least 10 characters';
    END IF;
    
    -- Generate unique deal ID
    v_deal_id := generate_deal_id();
    
    -- Find or create users
    INSERT INTO users (phone_number)
    VALUES (p_seller_phone)
    ON CONFLICT (phone_number) DO NOTHING;
    
    INSERT INTO users (phone_number)
    VALUES (p_buyer_phone)
    ON CONFLICT (phone_number) DO NOTHING;
    
    -- Get user IDs
    SELECT user_id INTO v_seller_user_id FROM users WHERE phone_number = p_seller_phone;
    SELECT user_id INTO v_buyer_user_id FROM users WHERE phone_number = p_buyer_phone;
    
    -- Create the deal
    INSERT INTO deals (
        deal_id,
        item_description,
        price,
        currency,
        seller_phone,
        buyer_phone,
        seller_user_id,
        buyer_user_id,
        metadata
    ) VALUES (
        v_deal_id,
        p_item_description,
        p_price,
        p_currency,
        p_seller_phone,
        p_buyer_phone,
        v_seller_user_id,
        v_buyer_user_id,
        p_metadata
    );
    
    -- Log the action
    INSERT INTO audit_log (deal_id, user_id, action, details)
    VALUES (v_deal_id, v_seller_user_id, 'deal_created', jsonb_build_object(
        'price', p_price,
        'currency', p_currency,
        'buyer_phone', p_buyer_phone
    ));
    
    -- Return deal info
    RETURN QUERY SELECT 
        v_deal_id,
        'https://dako.ci/deal/' || v_deal_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get deal details
CREATE OR REPLACE FUNCTION get_deal(p_deal_id VARCHAR(10))
RETURNS TABLE (
    deal_id VARCHAR(10),
    status deal_status,
    item_description TEXT,
    price DECIMAL(15,2),
    currency currency_code,
    seller_phone VARCHAR(20),
    buyer_phone VARCHAR(20),
    seller_name VARCHAR(100),
    buyer_name VARCHAR(100),
    seller_rating DECIMAL(3,2),
    buyer_rating DECIMAL(3,2),
    seller_total_deals INTEGER,
    buyer_total_deals INTEGER,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    funded_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    metadata JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.deal_id,
        d.status,
        d.item_description,
        d.price,
        d.currency,
        d.seller_phone,
        d.buyer_phone,
        su.name as seller_name,
        bu.name as buyer_name,
        su.reputation_rating as seller_rating,
        bu.reputation_rating as buyer_rating,
        su.total_deals as seller_total_deals,
        bu.total_deals as buyer_total_deals,
        d.created_at,
        d.updated_at,
        d.funded_at,
        d.completed_at,
        d.metadata
    FROM deals d
    LEFT JOIN users su ON d.seller_user_id = su.user_id
    LEFT JOIN users bu ON d.buyer_user_id = bu.user_id
    WHERE d.deal_id = p_deal_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create payment session
CREATE OR REPLACE FUNCTION create_payment_session(
    p_deal_id VARCHAR(10),
    p_provider_code VARCHAR(20),
    p_expires_in_minutes INTEGER DEFAULT 30
)
RETURNS TABLE (
    session_id UUID,
    amount DECIMAL(15,2),
    currency currency_code,
    expires_at TIMESTAMPTZ
) AS $$
DECLARE
    v_session_id UUID;
    v_deal RECORD;
    v_expires_at TIMESTAMPTZ;
BEGIN
    -- Get deal details
    SELECT * INTO v_deal FROM deals WHERE deal_id = p_deal_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Deal not found';
    END IF;
    
    IF v_deal.status != 'pending' THEN
        RAISE EXCEPTION 'Deal is not in pending status';
    END IF;
    
    -- Set expiration time
    v_expires_at := now() + (p_expires_in_minutes || ' minutes')::INTERVAL;
    
    -- Create payment session
    INSERT INTO payment_sessions (
        deal_id,
        amount,
        currency,
        provider_code,
        expires_at
    ) VALUES (
        p_deal_id,
        v_deal.price,
        v_deal.currency,
        p_provider_code,
        v_expires_at
    ) RETURNING payment_sessions.session_id INTO v_session_id;
    
    -- Return session details
    RETURN QUERY SELECT 
        v_session_id,
        v_deal.price,
        v_deal.currency,
        v_expires_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark deal as funded (called by webhook)
CREATE OR REPLACE FUNCTION mark_deal_as_funded(
    p_deal_id VARCHAR(10),
    p_lomi_transaction_id UUID,
    p_provider_details JSONB DEFAULT '{}'
)
RETURNS BOOLEAN AS $$
DECLARE
    v_deal RECORD;
BEGIN
    -- Get deal details
    SELECT * INTO v_deal FROM deals WHERE deal_id = p_deal_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Deal not found';
    END IF;
    
    IF v_deal.status != 'pending' THEN
        RAISE EXCEPTION 'Deal is not in pending status';
    END IF;
    
    -- Update deal status
    UPDATE deals 
    SET 
        status = 'funded',
        funded_at = now(),
        lomi_transaction_id = p_lomi_transaction_id,
        metadata = metadata || p_provider_details
    WHERE deal_id = p_deal_id;
    
    -- Update user deal counts
    UPDATE users 
    SET total_deals = total_deals + 1
    WHERE user_id = v_deal.seller_user_id OR user_id = v_deal.buyer_user_id;
    
    -- Log the action
    INSERT INTO audit_log (deal_id, action, details)
    VALUES (p_deal_id, 'deal_funded', jsonb_build_object(
        'lomi_transaction_id', p_lomi_transaction_id,
        'funded_at', now()
    ));
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to release funds (complete deal)
CREATE OR REPLACE FUNCTION release_funds(
    p_deal_id VARCHAR(10),
    p_confirmed_by_phone VARCHAR(20)
)
RETURNS BOOLEAN AS $$
DECLARE
    v_deal RECORD;
BEGIN
    -- Get deal details
    SELECT * INTO v_deal FROM deals WHERE deal_id = p_deal_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Deal not found';
    END IF;
    
    IF v_deal.status != 'funded' THEN
        RAISE EXCEPTION 'Deal is not funded';
    END IF;
    
    -- Only buyer can release funds
    IF v_deal.buyer_phone != p_confirmed_by_phone THEN
        RAISE EXCEPTION 'Only the buyer can release funds';
    END IF;
    
    -- Update deal status
    UPDATE deals 
    SET 
        status = 'completed',
        completed_at = now()
    WHERE deal_id = p_deal_id;
    
    -- Update completed deals count
    UPDATE users 
    SET completed_deals = completed_deals + 1
    WHERE user_id = v_deal.seller_user_id OR user_id = v_deal.buyer_user_id;
    
    -- Log the action
    INSERT INTO audit_log (deal_id, user_id, action, details)
    VALUES (p_deal_id, v_deal.buyer_user_id, 'funds_released', jsonb_build_object(
        'completed_at', now(),
        'confirmed_by', p_confirmed_by_phone
    ));
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create dispute
CREATE OR REPLACE FUNCTION create_dispute(
    p_deal_id VARCHAR(10),
    p_opened_by_phone VARCHAR(20),
    p_reason VARCHAR(100),
    p_description TEXT,
    p_evidence_urls TEXT[] DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    v_dispute_id UUID;
    v_deal RECORD;
    v_user_id UUID;
BEGIN
    -- Get deal details
    SELECT * INTO v_deal FROM deals WHERE deal_id = p_deal_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Deal not found';
    END IF;
    
    -- Verify the person opening dispute is involved in the deal
    IF v_deal.seller_phone != p_opened_by_phone AND v_deal.buyer_phone != p_opened_by_phone THEN
        RAISE EXCEPTION 'Only deal participants can open disputes';
    END IF;
    
    -- Can't dispute completed deals (for now)
    IF v_deal.status = 'completed' THEN
        RAISE EXCEPTION 'Cannot dispute completed deals';
    END IF;
    
    -- Get user ID
    SELECT user_id INTO v_user_id FROM users WHERE phone_number = p_opened_by_phone;
    
    -- Create dispute
    INSERT INTO disputes (
        deal_id,
        opened_by_phone,
        opened_by_user_id,
        reason,
        description,
        evidence_urls
    ) VALUES (
        p_deal_id,
        p_opened_by_phone,
        v_user_id,
        p_reason,
        p_description,
        p_evidence_urls
    ) RETURNING dispute_id INTO v_dispute_id;
    
    -- Update deal status to disputed
    UPDATE deals SET status = 'disputed' WHERE deal_id = p_deal_id;
    
    -- Log the action
    INSERT INTO audit_log (deal_id, user_id, action, details)
    VALUES (p_deal_id, v_user_id, 'dispute_created', jsonb_build_object(
        'dispute_id', v_dispute_id,
        'reason', p_reason
    ));
    
    RETURN v_dispute_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log notifications
CREATE OR REPLACE FUNCTION log_notification(
    p_deal_id VARCHAR(10),
    p_recipient_phone VARCHAR(20),
    p_type notification_type,
    p_message TEXT,
    p_provider_message_id VARCHAR(255) DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_notification_id UUID;
    v_user_id UUID;
BEGIN
    -- Get user ID if exists
    SELECT user_id INTO v_user_id FROM users WHERE phone_number = p_recipient_phone;
    
    -- Create notification log
    INSERT INTO notifications (
        deal_id,
        recipient_phone,
        recipient_user_id,
        type,
        message,
        provider_message_id,
        sent_at
    ) VALUES (
        p_deal_id,
        p_recipient_phone,
        v_user_id,
        p_type,
        p_message,
        p_provider_message_id,
        now()
    ) RETURNING notification_id INTO v_notification_id;
    
    RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user deals
CREATE OR REPLACE FUNCTION get_user_deals(
    p_phone_number VARCHAR(20),
    p_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
    deal_id VARCHAR(10),
    status deal_status,
    item_description TEXT,
    price DECIMAL(15,2),
    currency currency_code,
    is_seller BOOLEAN,
    other_party_name VARCHAR(100),
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.deal_id,
        d.status,
        d.item_description,
        d.price,
        d.currency,
        (d.seller_phone = p_phone_number) as is_seller,
        CASE 
            WHEN d.seller_phone = p_phone_number THEN bu.name
            ELSE su.name
        END as other_party_name,
        d.created_at,
        d.updated_at
    FROM deals d
    LEFT JOIN users su ON d.seller_user_id = su.user_id
    LEFT JOIN users bu ON d.buyer_user_id = bu.user_id
    WHERE d.seller_phone = p_phone_number OR d.buyer_phone = p_phone_number
    ORDER BY d.created_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
