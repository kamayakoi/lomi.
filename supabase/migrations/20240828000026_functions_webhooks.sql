-- Function to create a new webhook
CREATE OR REPLACE FUNCTION public.create_webhook(
    p_merchant_id UUID,
    p_url VARCHAR,
    p_event webhook_event,
    p_is_active BOOLEAN,
    p_metadata JSONB
)
RETURNS UUID AS $$
DECLARE
    v_webhook_id UUID;
BEGIN
    INSERT INTO webhooks (merchant_id, url, event, is_active, metadata)
    VALUES (p_merchant_id, p_url, p_event, p_is_active, p_metadata)
    RETURNING webhook_id INTO v_webhook_id;

    RETURN v_webhook_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch webhooks for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_webhooks(
    p_merchant_id UUID,
    p_event webhook_event DEFAULT NULL,
    p_is_active BOOLEAN DEFAULT NULL,
    p_page INTEGER DEFAULT 1,
    p_page_size INTEGER DEFAULT 50
)
RETURNS TABLE (
    webhook_id UUID,
    url VARCHAR,
    event webhook_event,
    is_active BOOLEAN,
    last_triggered_at TIMESTAMPTZ,
    last_payload JSONB,
    last_response_status INT,
    last_response_body TEXT,
    retry_count INT,
    metadata JSONB,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        w.webhook_id,
        w.url,
        w.event,
        w.is_active,
        w.last_triggered_at,
        w.last_payload,
        w.last_response_status,
        w.last_response_body,
        w.retry_count,
        w.metadata,
        w.created_at,
        w.updated_at
    FROM 
        webhooks w
    WHERE 
        w.merchant_id = p_merchant_id AND
        (p_event IS NULL OR w.event = p_event) AND
        (p_is_active IS NULL OR w.is_active = p_is_active)
    ORDER BY
        w.created_at DESC
    LIMIT p_page_size
    OFFSET ((p_page - 1) * p_page_size);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to delete a webhook
CREATE OR REPLACE FUNCTION public.delete_webhook(
    p_webhook_id UUID
)
RETURNS VOID AS $$
BEGIN
    DELETE FROM webhooks
    WHERE webhook_id = p_webhook_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;
