-- Function to create a new webhook
CREATE OR REPLACE FUNCTION public.create_organization_webhook(
    p_merchant_id UUID,
    p_url VARCHAR,
    p_authorized_events webhook_event[],
    p_is_active BOOLEAN DEFAULT true,
    p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS webhooks AS $$
DECLARE
    v_webhook webhooks;
BEGIN
    -- Validate URL format
    IF NOT p_url ~ '^https?://' THEN
        RAISE EXCEPTION 'Invalid URL format. URL must start with http:// or https://';
    END IF;

    -- Validate authorized_events is not empty
    IF array_length(p_authorized_events, 1) IS NULL THEN
        RAISE EXCEPTION 'At least one event must be specified';
    END IF;

    INSERT INTO webhooks (
        merchant_id,
        url,
        authorized_events,
        is_active,
        metadata
    )
    VALUES (
        p_merchant_id,
        p_url,
        p_authorized_events,
        p_is_active,
        p_metadata
    )
    RETURNING * INTO v_webhook;

    -- Log webhook creation
    PERFORM public.log_event(
        p_merchant_id := p_merchant_id,
        p_event := 'update_webhook'::event_type,
        p_details := jsonb_build_object(
            'webhook_id', v_webhook.webhook_id,
            'url', p_url,
            'authorized_events', p_authorized_events,
            'is_active', p_is_active,
            'action', 'create'
        ),
        p_severity := 'NOTICE'
    );

    RETURN v_webhook;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to update webhook status and response
CREATE OR REPLACE FUNCTION public.update_webhook_delivery_status(
    p_webhook_id UUID,
    p_last_response_status INT,
    p_last_response_body TEXT,
    p_last_payload JSONB
)
RETURNS VOID AS $$
DECLARE
    v_merchant_id UUID;
    v_retry_count INT;
BEGIN
    -- Get current webhook details
    SELECT 
        merchant_id,
        COALESCE(retry_count, 0)
    INTO 
        v_merchant_id,
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
CREATE OR REPLACE FUNCTION public.update_organization_webhook(
    p_merchant_id UUID,
    p_webhook_id UUID,
    p_url VARCHAR,
    p_authorized_events webhook_event[],
    p_is_active BOOLEAN DEFAULT true,
    p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS webhooks AS $$
DECLARE
    v_webhook webhooks;
    v_current_merchant_id UUID;
BEGIN
    -- Validate URL format
    IF NOT p_url ~ '^https?://' THEN
        RAISE EXCEPTION 'Invalid URL format. URL must start with http:// or https://';
    END IF;

    -- Validate authorized_events is not empty
    IF array_length(p_authorized_events, 1) IS NULL THEN
        RAISE EXCEPTION 'At least one event must be specified';
    END IF;

    -- Get webhook details before update
    SELECT merchant_id
    INTO v_current_merchant_id
    FROM webhooks
    WHERE webhook_id = p_webhook_id;

    -- Verify merchant owns this webhook
    IF v_current_merchant_id IS NULL OR v_current_merchant_id != p_merchant_id THEN
        RAISE EXCEPTION 'Webhook not found or unauthorized';
    END IF;

    UPDATE webhooks
    SET
        url = p_url,
        authorized_events = p_authorized_events,
        is_active = p_is_active,
        metadata = p_metadata,
        updated_at = NOW()
    WHERE webhook_id = p_webhook_id
    AND merchant_id = p_merchant_id
    RETURNING * INTO v_webhook;

    -- Log webhook update
    PERFORM public.log_event(
        p_merchant_id := p_merchant_id,
        p_event := 'update_webhook'::event_type,
        p_details := jsonb_build_object(
            'webhook_id', p_webhook_id,
            'url', p_url,
            'authorized_events', p_authorized_events,
            'is_active', p_is_active,
            'action', 'update'
        ),
        p_severity := 'NOTICE'
    );

    RETURN v_webhook;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to delete a webhook
CREATE OR REPLACE FUNCTION public.delete_organization_webhook(
    p_webhook_id UUID,
    p_merchant_id UUID
)
RETURNS VOID AS $$
DECLARE
    v_url VARCHAR;
    v_authorized_events webhook_event[];
    v_current_merchant_id UUID;
BEGIN
    -- Get webhook details before deletion
    SELECT merchant_id, url, authorized_events
    INTO v_current_merchant_id, v_url, v_authorized_events
    FROM webhooks
    WHERE webhook_id = p_webhook_id;

    -- Verify merchant owns this webhook
    IF v_current_merchant_id IS NULL OR v_current_merchant_id != p_merchant_id THEN
        RAISE EXCEPTION 'Webhook not found or unauthorized';
    END IF;

    DELETE FROM webhooks
    WHERE webhook_id = p_webhook_id
    AND merchant_id = p_merchant_id;

    -- Log webhook deletion
    PERFORM public.log_event(
        p_merchant_id := p_merchant_id,
        p_event := 'update_webhook'::event_type,
        p_details := jsonb_build_object(
            'webhook_id', p_webhook_id,
            'url', v_url,
            'authorized_events', v_authorized_events,
            'action', 'delete'
        ),
        p_severity := 'NOTICE'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch organization webhooks with optional filters
CREATE OR REPLACE FUNCTION public.fetch_organization_webhooks(
    p_merchant_id UUID,
    p_event webhook_event DEFAULT NULL,
    p_is_active BOOLEAN DEFAULT NULL
)
RETURNS SETOF webhooks AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM webhooks
    WHERE merchant_id = p_merchant_id
    AND (p_event IS NULL OR p_event = ANY(authorized_events))
    AND (p_is_active IS NULL OR is_active = p_is_active)
    ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to test a webhook by sending a test event
CREATE OR REPLACE FUNCTION public.test_organization_webhook(
    p_webhook_id UUID,
    p_merchant_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    v_webhook webhooks;
BEGIN
    -- Get webhook details
    SELECT *
    INTO v_webhook
    FROM webhooks
    WHERE webhook_id = p_webhook_id;

    -- Verify merchant owns this webhook
    IF v_webhook.merchant_id != p_merchant_id THEN
        RAISE EXCEPTION 'Webhook not found or unauthorized';
    END IF;

    -- Log test event
    PERFORM public.log_event(
        p_merchant_id := p_merchant_id,
        p_event := 'update_webhook'::event_type,
        p_details := jsonb_build_object(
            'webhook_id', p_webhook_id,
            'url', v_webhook.url,
            'action', 'test'
        ),
        p_severity := 'NOTICE'
    );

    -- In a real implementation, you would trigger an actual test webhook here
    -- For now, we'll just return true
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.create_organization_webhook(UUID, VARCHAR, webhook_event[], BOOLEAN, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_organization_webhook(UUID, UUID, VARCHAR, webhook_event[], BOOLEAN, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_organization_webhook(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_webhook_delivery_status(UUID, INT, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.fetch_organization_webhooks(UUID, webhook_event, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION public.test_organization_webhook(UUID, UUID) TO authenticated;