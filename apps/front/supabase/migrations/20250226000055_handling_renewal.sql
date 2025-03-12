CREATE OR REPLACE FUNCTION public.find_subscriptions_due_for_renewal(days_before_renewal INTEGER DEFAULT 3)
RETURNS TABLE (
  subscription_id UUID,
  customer_id UUID,
  merchant_id UUID,
  organization_id UUID,
  customer_email TEXT,
  customer_name TEXT,
  merchant_email TEXT,
  merchant_name TEXT,
  business_name TEXT,
  organization_logo_url TEXT,
  plan_id UUID,
  plan_name TEXT,
  plan_amount NUMERIC,
  currency_code currency_code,
  next_billing_date DATE,
  billing_frequency TEXT,
  days_until_renewal INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.subscription_id,
    s.customer_id,
    s.merchant_id,
    s.organization_id,
    c.email as customer_email,
    COALESCE(c.first_name || ' ' || c.last_name, c.email) as customer_name,
    m.email as merchant_email,
    m.name as merchant_name,
    o.business_name,
    o.logo_url as organization_logo_url,
    p.plan_id,
    p.name as plan_name,
    p.amount as plan_amount,
    p.currency_code,
    s.next_billing_date,
    p.billing_frequency,
    (s.next_billing_date - CURRENT_DATE) as days_until_renewal
  FROM 
    merchant_subscriptions s
    JOIN customers c ON s.customer_id = c.customer_id
    JOIN merchants m ON s.merchant_id = m.merchant_id
    JOIN organizations o ON s.organization_id = o.organization_id
    JOIN subscription_plans p ON s.plan_id = p.plan_id
  WHERE 
    s.status = 'active' AND
    s.next_billing_date IS NOT NULL AND
    -- Find subscriptions due in the next 'days_before_renewal' days OR due today OR 1 day before
    -- This allows for multiple notification points (3 days before, 1 day before, day of)
    (
      s.next_billing_date = CURRENT_DATE OR  -- Due today (day of billing)
      s.next_billing_date = CURRENT_DATE + 1 OR  -- Due tomorrow (1 day before)
      s.next_billing_date = CURRENT_DATE + days_before_renewal  -- Due in X days (default 3 days before)
    )
  ORDER BY 
    s.next_billing_date;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = '';

-- Create a function to directly generate checkout sessions for subscription renewals
CREATE OR REPLACE FUNCTION public.generate_subscription_renewal_session(
  p_subscription_id UUID
) RETURNS TEXT AS $$
DECLARE
  v_checkout_session_id UUID;
  v_checkout_url TEXT;
  v_merchant_id UUID;
  v_organization_id UUID;
  v_customer_id UUID;
  v_customer_email TEXT;
  v_customer_name TEXT;
  v_plan_id UUID;
  v_plan_name TEXT;
  v_currency_code TEXT;
  v_amount NUMERIC;
  v_base_url TEXT := 'https://lomi.africa';
  v_expiration_minutes INTEGER := 60 * 24 * 7; -- 7 days (in minutes)
  v_success_url TEXT;
  v_cancel_url TEXT;
BEGIN
  -- Get subscription details
  SELECT 
    s.merchant_id, 
    s.organization_id, 
    s.customer_id,
    s.plan_id,
    p.name AS plan_name, 
    p.amount,
    p.currency_code
  INTO 
    v_merchant_id, 
    v_organization_id, 
    v_customer_id,
    v_plan_id,
    v_plan_name,
    v_amount,
    v_currency_code
  FROM 
    merchant_subscriptions s
    JOIN subscription_plans p ON s.plan_id = p.plan_id
  WHERE 
    s.subscription_id = p_subscription_id;
  
  -- Get customer details
  SELECT 
    email,
    COALESCE(first_name || ' ' || last_name, email) AS name
  INTO 
    v_customer_email,
    v_customer_name
  FROM 
    customers
  WHERE 
    customer_id = v_customer_id;
  
  -- Get success and cancel URLs from organization settings
  SELECT * 
  FROM public.get_organization_checkout_urls(v_organization_id)
  INTO v_success_url, v_cancel_url;
  
  -- Insert checkout session
  INSERT INTO checkout_sessions (
    organization_id,
    merchant_id,
    customer_id,
    amount,
    currency_code,
    subscription_id,
    plan_id,
    success_url,
    cancel_url,
    customer_email,
    customer_name,
    metadata,
    allowed_providers,
    expires_at
  )
  SELECT
    v_organization_id,
    v_merchant_id,
    v_customer_id,
    v_amount,
    v_currency_code,
    p_subscription_id,
    v_plan_id,
    v_success_url,
    v_cancel_url,
    v_customer_email,
    v_customer_name,
    jsonb_build_object(
      'renewal', true,
      'system_generated', true,
      'original_subscription_id', p_subscription_id
    ),
    (SELECT array_agg(provider_code) FROM organization_providers_settings 
     WHERE organization_id = v_organization_id AND is_connected = true),
    NOW() + (v_expiration_minutes * interval '1 minute')
  RETURNING checkout_session_id INTO v_checkout_session_id;
  
  -- Generate checkout URL
  v_checkout_url := v_base_url || '/checkout/' || v_checkout_session_id;
  
  RETURN v_checkout_url;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Error generating renewal checkout: %', SQLERRM;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to update the next billing date based on the billing frequency
CREATE OR REPLACE FUNCTION public.update_subscription_next_billing_date(
  p_subscription_id UUID
) RETURNS DATE AS $$
DECLARE
  v_current_billing_date DATE;
  v_next_billing_date DATE;
  v_billing_frequency TEXT;
  v_specific_day INTEGER;
  v_metadata JSONB;
  v_subscription_length TEXT;
  v_fixed_charges INTEGER;
  v_current_charges INTEGER;
  v_failed_payment_action TEXT;
BEGIN
  -- Get current subscription details
  SELECT 
    s.next_billing_date,
    p.billing_frequency,
    s.metadata,
    COALESCE(p.charge_day, 0) AS specific_day,
    COALESCE(p.metadata->>'subscription_length', 'automatic') AS subscription_length,
    COALESCE(p.metadata->>'fixed_charges', '0')::INTEGER AS fixed_charges,
    COALESCE(p.failed_payment_action, 'cancel') AS failed_payment_action,
    COALESCE(s.metadata->>'current_charges', '0')::INTEGER AS current_charges
  INTO 
    v_current_billing_date,
    v_billing_frequency,
    v_metadata,
    v_specific_day,
    v_subscription_length,
    v_fixed_charges,
    v_failed_payment_action,
    v_current_charges
  FROM 
    merchant_subscriptions s
    JOIN subscription_plans p ON s.plan_id = p.plan_id
  WHERE 
    s.subscription_id = p_subscription_id;
  
  -- If current billing date is null, use today
  IF v_current_billing_date IS NULL THEN
    v_current_billing_date := CURRENT_DATE;
  END IF;
  
  -- Check if we've reached the maximum number of charges for fixed-length subscriptions
  IF v_subscription_length = 'fixed' AND v_current_charges >= v_fixed_charges THEN
    -- Update subscription status to completed
    UPDATE merchant_subscriptions
    SET 
      status = 'completed',
      updated_at = NOW(),
      metadata = jsonb_set(
        COALESCE(v_metadata, '{}'::jsonb),
        '{completion_info}',
        jsonb_build_object(
          'completed_at', NOW(),
          'reason', 'Reached maximum number of charges (' || v_fixed_charges || ')'
        )
      )
    WHERE 
      subscription_id = p_subscription_id;
    
    -- Log the completion with RAISE NOTICE instead of INSERT
    RAISE NOTICE 'Subscription % completed after reaching maximum charges (% of %)', 
      p_subscription_id, v_current_charges, v_fixed_charges;
    
    RETURN NULL; -- No next billing date as subscription is completed
  END IF;
  
  -- Calculate next billing date based on frequency
  v_next_billing_date := CASE 
    WHEN v_billing_frequency = 'weekly' THEN 
      v_current_billing_date + interval '1 week'
    WHEN v_billing_frequency = 'bi-weekly' THEN 
      v_current_billing_date + interval '2 weeks'
    WHEN v_billing_frequency = 'monthly' THEN 
      v_current_billing_date + interval '1 month'
    WHEN v_billing_frequency = 'bi-monthly' THEN 
      v_current_billing_date + interval '2 months'
    WHEN v_billing_frequency = 'quarterly' THEN 
      v_current_billing_date + interval '3 months'
    WHEN v_billing_frequency = 'semi-annual' THEN 
      v_current_billing_date + interval '6 months'
    WHEN v_billing_frequency = 'yearly' THEN 
      v_current_billing_date + interval '1 year'
    ELSE NULL
  END;
  
  -- Handle specific charge day if set
  IF v_specific_day > 0 AND v_next_billing_date IS NOT NULL THEN
    -- If the next billing date is in a month with fewer days than the specific day,
    -- use the last day of that month
    v_next_billing_date := 
      CASE 
        WHEN extract(day from (date_trunc('month', v_next_billing_date) + interval '1 month - 1 day')) < v_specific_day THEN
          date_trunc('month', v_next_billing_date) + interval '1 month - 1 day'
        ELSE
          date_trunc('month', v_next_billing_date) + (v_specific_day - 1) * interval '1 day'
      END;
  END IF;
  
  -- Update subscription with next billing date and increment charge count
  UPDATE merchant_subscriptions
  SET 
    next_billing_date = v_next_billing_date,
    updated_at = NOW(),
    metadata = jsonb_set(
      jsonb_set(
        COALESCE(v_metadata, '{}'::jsonb),
        '{current_charges}',
        to_jsonb(v_current_charges + 1)
      ),
      '{last_billing_date}',
      to_jsonb(v_current_billing_date)
    )
  WHERE 
    subscription_id = p_subscription_id;
  
  RETURN v_next_billing_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to handle failed payments according to subscription settings
CREATE OR REPLACE FUNCTION public.handle_subscription_failed_payment(
  p_subscription_id UUID
) RETURNS TEXT AS $$
DECLARE
  v_status subscription_status;
  v_failed_payment_action TEXT;
  v_merchant_id UUID;
  v_customer_id UUID;
BEGIN
  -- Get subscription details and action to take
  SELECT 
    s.status,
    COALESCE(p.failed_payment_action, 'cancel') AS failed_payment_action,
    s.merchant_id,
    s.customer_id
  INTO 
    v_status,
    v_failed_payment_action,
    v_merchant_id,
    v_customer_id
  FROM 
    merchant_subscriptions s
    JOIN subscription_plans p ON s.plan_id = p.plan_id
  WHERE 
    s.subscription_id = p_subscription_id;
  
  IF v_status IS NULL THEN
    RETURN 'Error: Subscription not found';
  END IF;
  
  -- Take action based on failed_payment_action setting
  CASE v_failed_payment_action
    WHEN 'cancel' THEN
      -- Cancel the subscription
      UPDATE merchant_subscriptions
      SET 
        status = 'cancelled',
        updated_at = NOW(),
        metadata = jsonb_set(
          COALESCE(merchant_subscriptions.metadata, '{}'::jsonb),
          '{cancellation_info}',
          jsonb_build_object(
            'cancelled_at', NOW(),
            'reason', 'Payment failed',
            'automatic', true
          )
        )
      WHERE 
        subscription_id = p_subscription_id;
      
      -- Log the cancellation with RAISE NOTICE instead of INSERT
      RAISE NOTICE 'Subscription % cancelled due to payment failure (merchant_id: %, customer_id: %)', 
        p_subscription_id, v_merchant_id, v_customer_id;
      
      RETURN 'Subscription cancelled';
      
    WHEN 'pause' THEN
      -- Pause the subscription
      UPDATE merchant_subscriptions
      SET 
        status = 'paused',
        updated_at = NOW(),
        metadata = jsonb_set(
          COALESCE(merchant_subscriptions.metadata, '{}'::jsonb),
          '{pause_info}',
          jsonb_build_object(
            'paused_at', NOW(),
            'reason', 'Payment failed',
            'automatic', true
          )
        )
      WHERE 
        subscription_id = p_subscription_id;
      
      -- Log the pause with RAISE NOTICE instead of INSERT
      RAISE NOTICE 'Subscription % paused due to payment failure (merchant_id: %, customer_id: %)',
        p_subscription_id, v_merchant_id, v_customer_id;
      
      RETURN 'Subscription paused';
      
    WHEN 'continue' THEN
      -- Keep subscription active but log the failure with RAISE NOTICE instead of INSERT
      RAISE NOTICE 'Subscription % payment failed but subscription remains active (merchant_id: %, customer_id: %)',
        p_subscription_id, v_merchant_id, v_customer_id;
      
      RETURN 'Subscription continues despite payment failure';
      
    ELSE
      RETURN format('Unknown failed payment action: %s', v_failed_payment_action);
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Create or replace the send_subscription_renewal_email function
CREATE OR REPLACE FUNCTION public.send_subscription_renewal_email(
  p_subscription_id UUID,
  p_checkout_url TEXT DEFAULT NULL,
  p_template_type TEXT DEFAULT 'standard_template'
) RETURNS BOOLEAN AS $$
DECLARE
  resend_api_key TEXT;
  v_merchant_id UUID;
  v_organization_id UUID;
  v_customer_id UUID;
  v_customer_email TEXT;
  v_customer_name TEXT;
  v_business_name TEXT;
  v_organization_logo_url TEXT;
  v_plan_id UUID;
  v_plan_name TEXT;
  v_amount NUMERIC;
  v_currency_code TEXT;
  v_next_billing_date DATE;
  v_checkout_url TEXT := p_checkout_url;
  v_email_html TEXT;
  v_email_subject TEXT;
  v_urgency_class TEXT := '';
  v_urgency_message TEXT := '';
  v_default_logo_url TEXT := 'https://res.cloudinary.com/dzrdlevfn/image/upload/v1740527656/uzveu1wetrylpdcfpfoa.png';
  v_days_until_renewal INTEGER;
  response_json JSONB;
  http_response_code INTEGER;
BEGIN
  -- Get subscription details
  SELECT 
    s.merchant_id,
    s.organization_id,
    s.customer_id,
    s.plan_id,
    p.name AS plan_name,
    p.amount,
    p.currency_code,
    s.next_billing_date,
    (s.next_billing_date - CURRENT_DATE) AS days_until_renewal
  INTO
    v_merchant_id,
    v_organization_id,
    v_customer_id,
    v_plan_id,
    v_plan_name,
    v_amount,
    v_currency_code,
    v_next_billing_date,
    v_days_until_renewal
  FROM 
    merchant_subscriptions s
    JOIN subscription_plans p ON s.plan_id = p.plan_id
  WHERE 
    s.subscription_id = p_subscription_id;
  
  -- Get customer and merchant details
  SELECT 
    c.email,
    COALESCE(c.first_name || ' ' || c.last_name, c.email) AS customer_name,
    o.business_name,
    COALESCE(o.logo_url, v_default_logo_url) AS organization_logo_url
  INTO 
    v_customer_email,
    v_customer_name,
    v_business_name,
    v_organization_logo_url
  FROM 
    customers c
    JOIN merchants m ON m.merchant_id = v_merchant_id
    JOIN organizations o ON o.organization_id = v_organization_id
  WHERE 
    c.customer_id = v_customer_id;

  -- If checkout URL not provided, generate one
  IF v_checkout_url IS NULL THEN
    v_checkout_url := generate_subscription_renewal_session(p_subscription_id);
    IF v_checkout_url IS NULL THEN
      RAISE WARNING 'Failed to generate renewal checkout URL for subscription %', p_subscription_id;
      RETURN FALSE;
    END IF;
  END IF;
  
  -- Set urgency styling and messages based on template type
  CASE p_template_type
    WHEN 'final_day_template' THEN
      v_urgency_class := 'urgent-renewal';
      v_urgency_message := 'Your subscription ends today! Please renew now to avoid service interruption.';
      v_email_subject := format('URGENT: Your %s subscription expires today', v_plan_name);
    WHEN 'one_day_template' THEN
      v_urgency_class := 'important-renewal';
      v_urgency_message := 'Your subscription will expire tomorrow. Please renew to maintain uninterrupted access.';
      v_email_subject := format('Important: Your %s subscription expires tomorrow', v_plan_name);
    ELSE
      v_urgency_class := '';
      v_urgency_message := format('Your subscription will expire in %s days. Renew now to maintain uninterrupted access.', v_days_until_renewal);
      v_email_subject := format('Renewal reminder: Your %s subscription', v_plan_name);
  END CASE;

  -- Create HTML email content with urgency styling if needed
  v_email_html := format('
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Subscription Renewal</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 20px 0; }
    .logo { max-width: 100px; height: auto; }
    .content { background-color: #f9f9f9; padding: 30px; border-radius: 5px; }
    .footer { text-align: center; padding: 20px 0; font-size: 12px; color: #888; }
    .button { display: inline-block; background-color: #0056b3; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; }
    .details { margin: 20px 0; background: #fff; padding: 15px; border-radius: 4px; border-left: 4px solid #0056b3; }
    .urgent-renewal { background-color: #ffecec; border-left: 4px solid #ff5252; }
    .important-renewal { background-color: #fff8e1; border-left: 4px solid #ffb300; }
    h1 { color: #333; margin-top: 0; }
    p { margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="%s" alt="%s" class="logo">
    </div>
    <div class="content">
      <h1>Subscription Renewal</h1>
      <p>Hello %s,</p>
      <p>Your subscription to <strong>%s</strong> from <strong>%s</strong> is scheduled to expire on <strong>%s</strong>.</p>
      
      <div class="details %s">
        <p><strong>%s</strong></p>
        <p>To continue enjoying your subscription benefits, please renew your subscription by clicking the button below.</p>
      </div>
      
      <p><strong>Subscription Details:</strong></p>
      <ul>
        <li>Plan: %s</li>
        <li>Amount: %s %s</li>
        <li>Next Billing Date: %s</li>
      </ul>
      
      <div style="text-align: center; margin: 30px 0;">
      <a href="%s" class="button">Renew Subscription</a>
      </div>
      
      <p>If you have any questions or need assistance, please contact us.</p>
      <p>Thank you for your continued support!</p>
    </div>
    <div class="footer">
      <p>This is an automated email from %s through lomi. Please do not reply directly to this email.</p>
    </div>
  </div>
</body>
</html>
  ',
    -- Variables for the template
    v_organization_logo_url,
    v_business_name,
    v_customer_name,
    v_plan_name,
    v_business_name,
    to_char(v_next_billing_date, 'YYYY-MM-DD'),
    v_urgency_class,
    v_urgency_message,
    v_plan_name,
    v_amount,
    v_currency_code,
    to_char(v_next_billing_date, 'YYYY-MM-DD'),
    v_checkout_url,
    v_business_name
  );
  
  -- Get the Resend API key
  BEGIN
    resend_api_key := secrets.get_resend_api_key();
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Failed to get Resend API key: %', SQLERRM;
    RETURN FALSE;
  END;

  -- Send the email
  BEGIN
    SELECT 
      status,
      response::jsonb
    INTO 
      http_response_code,
      response_json
    FROM 
      extensions.http((
      'POST',
      'https://api.resend.com/emails',
      ARRAY[('Authorization', 'Bearer ' || resend_api_key)::extensions.http_header],
      'application/json',
      jsonb_build_object(
          'from', format('%s <no-reply@updates.lomi.africa>', v_business_name),
        'to', ARRAY[v_customer_email],
          'subject', v_email_subject,
          'html', v_email_html,
          'reply_to', format('%s <no-reply@updates.lomi.africa>', v_business_name)
      )::text
    ));

    -- Check response
    IF http_response_code >= 400 THEN
      RAISE WARNING 'Failed to send email, HTTP status %: %', http_response_code, response_json;
      RETURN FALSE;
    END IF;

    -- Update subscription with notification timestamp
    UPDATE merchant_subscriptions
    SET 
      metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object(
        'last_renewal_notification', NOW(),
        'renewal_notification_template', p_template_type
      ),
      updated_at = NOW()
    WHERE 
      subscription_id = p_subscription_id;

    RETURN TRUE;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Error sending renewal email: %', SQLERRM;
    RETURN FALSE;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to process all due subscription renewals and send notifications
CREATE OR REPLACE FUNCTION public.process_subscription_renewal_notifications()
RETURNS INTEGER AS $$
DECLARE
  v_processed_count INTEGER := 0;
  v_subscription RECORD;
  v_checkout_url TEXT;
  v_email_status BOOLEAN;
  v_organization_settings JSONB;
  v_notification_template TEXT;
  v_attempt_count INTEGER;
  v_max_attempts INTEGER := 3; -- Default max attempts
BEGIN
  -- Process subscriptions due for renewal
  FOR v_subscription IN
    SELECT * FROM find_subscriptions_due_for_renewal(3)
  LOOP
    BEGIN
      -- Check if we should process this notification based on organization settings
      SELECT 
        settings 
      INTO 
        v_organization_settings
      FROM 
        organization_checkout_settings
      WHERE 
        organization_id = v_subscription.organization_id;
      
      -- If organization has settings, use them, otherwise use defaults
      IF v_organization_settings IS NOT NULL THEN
        -- Check if renewal notifications are enabled
        IF v_organization_settings->'enable_renewal_notifications' = 'false'::jsonb THEN
          CONTINUE; -- Skip this subscription if notifications are disabled
        END IF;
        
        -- Check organization's max retry attempts
        IF v_organization_settings->'renewal_max_attempts' IS NOT NULL THEN
          v_max_attempts := (v_organization_settings->>'renewal_max_attempts')::INTEGER;
        END IF;
      END IF;

      -- Get the number of notification attempts already made
      SELECT 
        COALESCE((metadata->>'renewal_notification_attempts')::INTEGER, 0)
      INTO 
        v_attempt_count
      FROM 
        merchant_subscriptions
      WHERE 
        subscription_id = v_subscription.subscription_id;
      
      -- Only process if we haven't exceeded max attempts
      IF v_attempt_count < v_max_attempts THEN
        -- Choose notification template based on how many days remain
        CASE v_subscription.days_until_renewal
          WHEN 0 THEN
            v_notification_template := 'final_day_template';
          WHEN 1 THEN
            v_notification_template := 'one_day_template';
          ELSE
            v_notification_template := 'standard_template';
        END CASE;
        
        -- Generate the checkout URL for renewal
        v_checkout_url := generate_subscription_renewal_session(v_subscription.subscription_id);
        
        IF v_checkout_url IS NOT NULL THEN
          -- Send the email with the appropriate template
          v_email_status := send_subscription_renewal_email(
            v_subscription.subscription_id, 
            v_checkout_url,
            v_notification_template
          );
          
          IF v_email_status THEN
            -- Update notification attempt count
    UPDATE merchant_subscriptions
            SET 
              metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object(
                'renewal_notification_attempts', v_attempt_count + 1,
                'last_renewal_notification', NOW(),
                'renewal_notification_template', v_notification_template
              ),
              updated_at = NOW()
            WHERE 
              subscription_id = v_subscription.subscription_id;
              
            v_processed_count := v_processed_count + 1;
          END IF;
        END IF;
      END IF;

      -- Log activity with RAISE NOTICE instead of INSERT
      RAISE NOTICE 'Processed renewal notification for subscription % (customer: %, next billing: %, days until: %, attempt: %, email sent: %)',
        v_subscription.subscription_id, v_subscription.customer_id, v_subscription.next_billing_date, 
        v_subscription.days_until_renewal, v_attempt_count + 1, v_email_status;
    EXCEPTION WHEN OTHERS THEN
      -- Log error with RAISE NOTICE instead of INSERT
      RAISE WARNING 'Error processing renewal for subscription %: %', 
        v_subscription.subscription_id, SQLERRM;
      CONTINUE;
    END;
  END LOOP;
  
  RETURN v_processed_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Add a scheduled job to run daily
DO $$
BEGIN
  -- Only create the cron job if pg_cron extension is available
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    -- Drop the job if it already exists
    PERFORM cron.unschedule('process_subscription_renewals');
    
    -- Schedule the job to run daily at 8:00 AM UTC
    PERFORM cron.schedule(
      'process_subscription_renewals',
      '0 8 * * *',
      'SELECT process_subscription_renewal_notifications()'
    );
    
    -- Log the cron job creation using RAISE NOTICE instead of INSERT
    RAISE NOTICE 'Scheduled daily subscription renewal notification job at 8:00 AM UTC';
  ELSE
    RAISE NOTICE 'pg_cron extension not available. Scheduled job not created.';
  END IF;
END;
$$;

-- Function to manually test the renewal system for a specific subscription
CREATE OR REPLACE FUNCTION public.manually_send_subscription_renewal(
  p_subscription_id UUID
)
RETURNS TEXT AS $$
DECLARE
  v_status subscription_status;
  v_next_billing_date DATE;
  v_checkout_url TEXT;
BEGIN
  -- Check if subscription exists
  SELECT status, next_billing_date INTO v_status, v_next_billing_date
  FROM merchant_subscriptions
  WHERE subscription_id = p_subscription_id;
  
  IF v_status IS NULL THEN
    RETURN 'Error: Subscription not found';
  END IF;
  
  IF v_status <> 'active' THEN
    RETURN format('Error: Subscription is not active (current status: %s)', v_status::TEXT);
  END IF;
  
  -- Send the renewal email
  PERFORM public.send_subscription_renewal_email(p_subscription_id);
  
  -- Get the generated checkout URL
  SELECT metadata->>'renewal_checkout_url' INTO v_checkout_url
  FROM merchant_subscriptions
  WHERE subscription_id = p_subscription_id;
  
  RETURN format('Subscription renewal notification sent successfully. Checkout URL: %s', v_checkout_url);
EXCEPTION WHEN OTHERS THEN
  RETURN format('Error sending renewal notification: %s', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = public, pg_temp;