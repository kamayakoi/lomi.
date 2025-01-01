-- Function to extract client information from the request
CREATE OR REPLACE FUNCTION public.get_client_info()
RETURNS TABLE (
    ip_address VARCHAR,
    operating_system VARCHAR,
    browser VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(current_setting('request.headers', true)::json->>'x-forwarded-for', 
                current_setting('request.headers', true)::json->>'x-real-ip')::VARCHAR,
        (current_setting('request.headers', true)::json->>'user-agent')::VARCHAR,
        (current_setting('request.headers', true)::json->>'sec-ch-ua')::VARCHAR
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Main logging function
CREATE OR REPLACE FUNCTION public.log_event(
    p_merchant_id UUID,
    p_event event_type,
    p_details JSONB DEFAULT NULL,
    p_severity VARCHAR DEFAULT 'NOTICE',
    p_request_url VARCHAR DEFAULT NULL,
    p_request_method VARCHAR DEFAULT NULL,
    p_response_status INTEGER DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_log_id UUID;
    v_client_info RECORD;
    v_notification_type notification_type;
    v_notification_message TEXT;
    v_calculated_severity VARCHAR;
BEGIN
    -- Get client information
    SELECT * INTO v_client_info FROM public.get_client_info();

    -- Calculate severity based on event type if not explicitly set
    v_calculated_severity := CASE
        -- Security events are always CRITICAL
        WHEN p_event::TEXT LIKE ANY(ARRAY['%api_key%', '%2fa%', '%password%', '%bank_account%', '%pin%'])
            THEN 'CRITICAL'
        -- Payment failures and errors are ERROR
        WHEN p_event::TEXT LIKE ANY(ARRAY['%_failed%', '%_error%'])
            THEN 'ERROR'
        -- Status changes are WARNING
        WHEN p_event::TEXT LIKE '%status_change'
            THEN 'WARNING'
        -- Everything else stays as provided or defaults to NOTICE
        ELSE p_severity
    END;

    -- Insert log entry
    INSERT INTO logs (
        merchant_id,
        event,
        ip_address,
        operating_system,
        browser,
        details,
        severity,
        request_url,
        request_method,
        response_status,
        created_at
    ) VALUES (
        p_merchant_id,
        p_event,
        v_client_info.ip_address,
        v_client_info.operating_system,
        v_client_info.browser,
        p_details,
        v_calculated_severity,
        p_request_url,
        p_request_method,
        p_response_status,
        NOW()
    ) RETURNING log_id INTO v_log_id;

    -- Map event to notification type and message
    SELECT
        CASE
            -- Security Events
            WHEN p_event::TEXT LIKE ANY(ARRAY['%api_key%', '%2fa%', '%password%', '%bank_account%', '%pin%'])
                THEN 'security_alert'
            -- Payment & Transaction Events
            WHEN p_event::TEXT LIKE ANY(ARRAY['%payment%', '%invoice%'])
                THEN 'transaction'
            -- Payout Events
            WHEN p_event::TEXT LIKE '%payout%'
                THEN 'payout'
            -- Provider Events
            WHEN p_event::TEXT LIKE '%provider%'
                THEN 'provider_status'
            -- Billing Events
            WHEN p_event::TEXT LIKE ANY(ARRAY['%subscription%', '%billing%'])
                THEN 'billing'
            -- Refund Events
            WHEN p_event::TEXT LIKE '%refund%'
                THEN 'refund'
            -- Dispute Events
            WHEN p_event::TEXT LIKE '%dispute%'
                THEN 'dispute'
            -- System & Maintenance Events
            WHEN p_event::TEXT LIKE ANY(ARRAY['%system%', '%maintenance%'])
                THEN 'maintenance'
            -- Compliance Events
            WHEN p_event::TEXT LIKE '%compliance%'
                THEN 'compliance'
            -- Update Events (products, settings, etc)
            WHEN p_event::TEXT LIKE ANY(ARRAY['%update%', '%edit%', '%product%', '%webhook%'])
                THEN 'update'
            -- Onboarding Events
            WHEN p_event::TEXT LIKE '%onboarding%'
                THEN 'onboarding'
            -- Tips & Guides
            WHEN p_event::TEXT LIKE '%tip%'
                THEN 'tip'
            -- Default to alert
            ELSE 'alert'
        END,
        CASE p_event
            -- Security Messages
            WHEN 'create_api_key' THEN 'New API key created'
            WHEN 'remove_api_key' THEN 'API key deleted'
            WHEN 'create_user_2fa' THEN '2FA enabled for your account'
            WHEN 'remove_user_2fa' THEN '2FA disabled for your account'
            WHEN 'create_pin' THEN 'New PIN created'
            WHEN 'edit_pin' THEN 'PIN updated'
            -- Payment Messages
            WHEN 'process_payment' THEN format('New payment of %s %s processed', p_details->>'amount', p_details->>'currency')
            WHEN 'payment_status_change' THEN format('Payment status changed to %s', p_details->>'status')
            WHEN 'create_payout' THEN format('New payout of %s %s initiated', p_details->>'amount', p_details->>'currency')
            WHEN 'payout_status_change' THEN format('Payout status changed to %s', p_details->>'status')
            -- Product Messages
            WHEN 'create_product' THEN format('New product "%s" created at %s %s', p_details->>'name', p_details->>'price', p_details->>'currency')
            WHEN 'update_product' THEN format('Product "%s" updated - Price changed from %s to %s %s', p_details->>'name', p_details->>'old_price', p_details->>'new_price', p_details->>'currency')
            WHEN 'delete_product' THEN format('Product "%s" deleted', p_details->>'name')
            -- Bank Account Messages
            WHEN 'add_bank_account' THEN format('New bank account added: %s - %s', p_details->>'bank_name', p_details->>'account_name')
            WHEN 'remove_bank_account' THEN format('Bank account removed: %s - %s', p_details->>'bank_name', p_details->>'account_name')
            -- Webhook Messages
            WHEN 'update_webhook' THEN 
                CASE p_details->>'action'
                    WHEN 'create' THEN format('New webhook endpoint added for %s events', p_details->>'event')
                    WHEN 'update' THEN format('Webhook endpoint updated for %s events', p_details->>'event')
                    WHEN 'delete' THEN format('Webhook endpoint removed for %s events', p_details->>'event')
                    WHEN 'delivery_failed' THEN format('Webhook delivery failed for %s events (Status: %s)', p_details->>'event', p_details->>'status')
                    ELSE format('Webhook %s for %s events', p_details->>'action', p_details->>'event')
                END
            -- Refund Messages
            WHEN 'create_refund' THEN format('Refund of %s %s initiated', p_details->>'amount', p_details->>'currency')
            WHEN 'refund_status_change' THEN format('Refund status changed to %s', p_details->>'status')
            -- Subscription Messages
            WHEN 'subscription_status_change' THEN format('Subscription status changed to %s', p_details->>'status')
            WHEN 'subscription_payment_failed' THEN 'Subscription payment failed'
            -- Provider Messages
            WHEN 'provider_status_change' THEN format('Provider %s status changed to %s', p_details->>'provider', p_details->>'status')
            WHEN 'provider_connection_error' THEN format('Connection error with provider %s', p_details->>'provider')
            WHEN 'provider_integration_success' THEN format('Successfully integrated with provider %s', p_details->>'provider')
            -- System Messages
            WHEN 'system_maintenance' THEN 'System maintenance scheduled'
            WHEN 'system_update' THEN 'System update available'
            WHEN 'compliance_update' THEN 'Important compliance update'
            WHEN 'api_status_change' THEN format('API status changed to %s', p_details->>'status')
            -- Customer Messages
            WHEN 'customer_verification_required' THEN 'Customer verification required'
            WHEN 'customer_verification_success' THEN 'Customer verification successful'
            WHEN 'customer_verification_failed' THEN 'Customer verification failed'
            -- Default Message
            ELSE p_event::TEXT || ' event occurred'
        END
    INTO v_notification_type, v_notification_message;

    -- Create notification for events based on severity and importance
    IF (
        -- Critical security events
        v_calculated_severity = 'CRITICAL' OR
        -- Error events
        (v_calculated_severity = 'ERROR' AND p_event::TEXT LIKE ANY(ARRAY[
            '%_failed',
            '%_error',
            'provider_connection_error'
        ])) OR
        -- Important status changes
        (p_event::TEXT LIKE ANY(ARRAY[
            'payment_status_change',
            'subscription_status_change',
            'provider_status_change',
            'payout_status_change'
        ]) AND p_details->>'status' IN ('failed', 'rejected', 'expired', 'cancelled')) OR
        -- System-wide alerts
        p_event::TEXT LIKE ANY(ARRAY[
            'system_maintenance',
            'system_update',
            'compliance_update',
            'api_status_change'
        ])
    ) THEN
        INSERT INTO notifications (
            merchant_id,
            type,
            message,
            is_read
        ) VALUES (
            p_merchant_id,
            v_notification_type,
            v_notification_message,
            false
        );
    END IF;

    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.log_event TO authenticated; 