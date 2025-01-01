-- Function to create a new webhook
CREATE OR REPLACE FUNCTION public.create_webhook(
    p_merchant_id UUID,
    p_url VARCHAR,
    p_event webhook_event,
    p_is_active BOOLEAN DEFAULT true,
    p_metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_webhook_id UUID;
BEGIN
    -- Validate URL format
    IF NOT p_url ~ '^https?://' THEN
        RAISE EXCEPTION 'Invalid URL format. URL must start with http:// or https://';
    END IF;

    INSERT INTO webhooks (
        merchant_id,
        url,
        event,
        is_active,
        metadata
    )
    VALUES (
        p_merchant_id,
        p_url,
        p_event,
        p_is_active,
        p_metadata
    )
    RETURNING webhook_id INTO v_webhook_id;

    -- Log webhook creation
    PERFORM public.log_event(
        p_merchant_id := p_merchant_id,
        p_event := 'update_webhook'::event_type,
        p_details := jsonb_build_object(
            'webhook_id', v_webhook_id,
            'url', p_url,
            'event', p_event,
            'is_active', p_is_active,
            'action', 'create'
        ),
        p_severity := 'NOTICE'
    );

    RETURN v_webhook_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to update webhook status and response
CREATE OR REPLACE FUNCTION public.update_webhook_status(
    p_webhook_id UUID,
    p_last_response_status INT,
    p_last_response_body TEXT,
    p_last_payload JSONB
)
RETURNS VOID AS $$
DECLARE
    v_merchant_id UUID;
    v_event webhook_event;
    v_retry_count INT;
BEGIN
    -- Get current webhook details
    SELECT 
        merchant_id,
        event,
        COALESCE(retry_count, 0)
    INTO 
        v_merchant_id,
        v_event,
        v_retry_count
    FROM webhooks
    WHERE webhook_id = p_webhook_id;

    -- Update webhook status
    UPDATE webhooks
    SET
        last_triggered_at = NOW(),
        last_response_status = p_last_response_status,
        last_response_body = p_last_response_body,
        last_payload = p_last_payload,
        retry_count = CASE 
            WHEN p_last_response_status >= 200 AND p_last_response_status < 300 THEN 0
            ELSE v_retry_count + 1
        END
    WHERE webhook_id = p_webhook_id;

    -- Log webhook failure if status is not successful
    IF p_last_response_status < 200 OR p_last_response_status >= 300 THEN
        PERFORM public.log_event(
            p_merchant_id := v_merchant_id,
            p_event := 'update_webhook'::event_type,
            p_details := jsonb_build_object(
                'webhook_id', p_webhook_id,
                'event', v_event,
                'status', p_last_response_status,
                'retry_count', v_retry_count + 1,
                'action', 'delivery_failed'
            ),
            p_severity := 'ERROR',
            p_response_status := p_last_response_status
        );
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to update a webhook
CREATE OR REPLACE FUNCTION public.update_webhook(
    p_webhook_id UUID,
    p_url VARCHAR,
    p_is_active BOOLEAN,
    p_metadata JSONB DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
    v_merchant_id UUID;
    v_event webhook_event;
BEGIN
    -- Validate URL format
    IF NOT p_url ~ '^https?://' THEN
        RAISE EXCEPTION 'Invalid URL format. URL must start with http:// or https://';
    END IF;

    -- Get webhook details before update
    SELECT merchant_id, event
    INTO v_merchant_id, v_event
    FROM webhooks
    WHERE webhook_id = p_webhook_id;

    UPDATE webhooks
    SET
        url = p_url,
        is_active = p_is_active,
        metadata = p_metadata,
        updated_at = NOW()
    WHERE webhook_id = p_webhook_id;

    -- Log webhook update
    PERFORM public.log_event(
        p_merchant_id := v_merchant_id,
        p_event := 'update_webhook'::event_type,
        p_details := jsonb_build_object(
            'webhook_id', p_webhook_id,
            'url', p_url,
            'event', v_event,
            'is_active', p_is_active,
            'action', 'update'
        ),
        p_severity := 'NOTICE'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to delete a webhook
CREATE OR REPLACE FUNCTION public.delete_webhook(
    p_webhook_id UUID
)
RETURNS VOID AS $$
DECLARE
    v_merchant_id UUID;
    v_url VARCHAR;
    v_event webhook_event;
BEGIN
    -- Get webhook details before deletion
    SELECT merchant_id, url, event
    INTO v_merchant_id, v_url, v_event
    FROM webhooks
    WHERE webhook_id = p_webhook_id;

    DELETE FROM webhooks
    WHERE webhook_id = p_webhook_id;

    -- Log webhook deletion
    PERFORM public.log_event(
        p_merchant_id := v_merchant_id,
        p_event := 'update_webhook'::event_type,
        p_details := jsonb_build_object(
            'webhook_id', p_webhook_id,
            'url', v_url,
            'event', v_event,
            'action', 'delete'
        ),
        p_severity := 'NOTICE'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.create_webhook(UUID, VARCHAR, webhook_event, BOOLEAN, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_webhook(UUID, VARCHAR, BOOLEAN, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_webhook(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_webhook_status(UUID, INT, TEXT, JSONB) TO authenticated;
