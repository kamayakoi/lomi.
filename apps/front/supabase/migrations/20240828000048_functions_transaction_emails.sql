-- Function to send transaction confirmation emails to both customer and merchant
CREATE OR REPLACE FUNCTION public.send_transaction_confirmation_email(
  p_transaction_id UUID
)
RETURNS void AS $$
DECLARE
  resend_api_key TEXT;
  v_merchant_id UUID;
  v_organization_id UUID;
  v_customer_id UUID;
  v_amount NUMERIC;
  v_currency_code TEXT;
  v_merchant_email TEXT;
  v_merchant_name TEXT;
  v_customer_email TEXT;
  v_customer_name TEXT;
  v_business_name TEXT;
  v_organization_logo_url TEXT;
  v_transaction_reference TEXT;
  v_transaction_date TIMESTAMP;
  v_product_name TEXT;
  v_payment_method TEXT;
  v_subscription_id UUID;
  v_transaction_type TEXT;
  v_merchant_subject TEXT;
  v_customer_subject TEXT;
  v_merchant_html TEXT;
  v_customer_html TEXT;
  v_portal_url TEXT := 'https://lomi.africa/portal';
  v_default_logo_url TEXT := 'https://res.cloudinary.com/dzrdlevfn/image/upload/v1740527656/uzveu1wetrylpdcfpfoa.png';
  response_status INTEGER;
  response_body TEXT;
BEGIN
  -- Get transaction details
  SELECT 
    t.merchant_id,
    t.organization_id,
    t.customer_id,
    t.gross_amount,
    t.currency_code,
    t.created_at,
    COALESCE(t.metadata->>'clientReference', t.transaction_id::TEXT) as transaction_reference,
    COALESCE(p.name, 'Product') as product_name,
    CASE 
      WHEN t.payment_method_code = 'E_WALLET' THEN 'Mobile Money'
      WHEN t.payment_method_code = 'CARD' THEN 'Card Payment'
      ELSE INITCAP(REPLACE(t.payment_method_code::TEXT, '_', ' '))
    END as payment_method,
    t.subscription_id
  INTO
    v_merchant_id,
    v_organization_id,
    v_customer_id,
    v_amount,
    v_currency_code,
    v_transaction_date,
    v_transaction_reference,
    v_product_name,
    v_payment_method,
    v_subscription_id
  FROM 
    transactions t
    LEFT JOIN products p ON t.product_id = p.product_id
  WHERE 
    t.transaction_id = p_transaction_id;
    
  -- Determine transaction type (subscription or one-time product)
  v_transaction_type := CASE WHEN v_subscription_id IS NOT NULL THEN 'subscription' ELSE 'product' END;

  -- Get merchant details
  SELECT 
    m.email,
    m.name,
    o.business_name,
    COALESCE(o.logo_url, v_default_logo_url)
  INTO
    v_merchant_email,
    v_merchant_name,
    v_business_name,
    v_organization_logo_url
  FROM 
    merchants m
    JOIN organizations o ON o.organization_id = v_organization_id
  WHERE 
    m.merchant_id = v_merchant_id;

  -- Get customer details
  SELECT 
    email,
    COALESCE(first_name || ' ' || last_name, 'Customer') as name
  INTO
    v_customer_email,
    v_customer_name
  FROM 
    customers
  WHERE 
    customer_id = v_customer_id;

  -- Get the Resend API key securely with error handling
  BEGIN
    resend_api_key := secrets.get_resend_api_key();
    RAISE NOTICE 'Successfully retrieved Resend API key';
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Failed to get Resend API key: %', SQLERRM;
    RETURN;
  END;
  
  -- Skip if missing essential information
  IF v_merchant_email IS NULL OR v_customer_email IS NULL THEN
    RAISE WARNING 'Missing email information for transaction_id: %. Merchant email: %, Customer email: %', 
      p_transaction_id, v_merchant_email, v_customer_email;
    RETURN;
  END IF;

  -- Prepare email subjects
  IF v_transaction_type = 'subscription' THEN
    v_merchant_subject := format('New subscriber - %s %s', v_amount, v_currency_code);
  ELSE
    v_merchant_subject := format('New payment received - %s %s', v_amount, v_currency_code);
  END IF;
  
  v_customer_subject := format('Payment confirmation - %s %s', v_amount, v_currency_code);

  -- HTML template for merchant email
  v_merchant_html := format('
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Payment Received</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%%; -ms-text-size-adjust: 100%%; }
    body { font-family: "Inter", Helvetica, Arial, sans-serif; margin: 0; padding: 0; line-height: 1.5; color: #333333; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; }
    .logo-img { width: 100px; height: auto; border-radius: 6px; }
    .email-container { max-width: 600px; margin: auto; }
    .email-header { padding: 20px; text-align: center; background-color: #ffffff; }
    .email-body { padding: 30px; background-color: #ffffff; border-radius: 5px; }
    .email-footer { padding: 20px; text-align: center; font-size: 12px; color: #999999; }
    .transaction-details { margin: 20px 0; width: 100%%; }
    .transaction-details td { padding: 8px 0; }
    .transaction-details tr td:first-child { color: #666666; padding-right: 20px; }
    .button { display: inline-block; padding: 12px 20px; margin: 20px 0; background-color: #0056b3; color: #ffffff; text-decoration: none; border-radius: 4px; text-align: center; }
    @media screen and (max-width: 600px) {
      .email-container { width: 100%% !important; }
      .email-body { padding: 20px !important; }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <img src="%s" alt="%s" class="logo-img" />
    </div>
    <div class="email-body">
      <h2>%s</h2>
      <p>Hello %s,</p>
      <p>%s</p>
      
      <table class="transaction-details">
        <tr>
          <td><strong>Amount</strong></td>
          <td><strong>%s %s</strong></td>
        </tr>
        <tr>
          <td>Customer</td>
          <td>%s</td>
        </tr>
        <tr>
          <td>Reference</td>
          <td>%s</td>
        </tr>
        <tr>
          <td>Date</td>
          <td>%s</td>
        </tr>
        <tr>
          <td>%s</td>
          <td>%s</td>
        </tr>
        <tr>
          <td>Payment Method</td>
          <td>%s</td>
        </tr>
      </table>
      
      <a href="%s/transactions/%s" class="button">View Transaction Details</a>
      
      <p>Thank you for using lomi. for your payments.</p>
    </div>
    <div class="email-footer">
      <p>This email is a service from lomi. system.<br>If you have any questions, please reply to this email.</p>
    </div>
  </div>
</body>
</html>
  ',
    -- Variables for the template
    v_organization_logo_url,
    v_business_name,
    CASE WHEN v_transaction_type = 'subscription' THEN 'New Subscriber' ELSE 'New Payment Received' END,
    split_part(v_merchant_name, ' ', 1),
    CASE 
      WHEN v_transaction_type = 'subscription' THEN 'You have a new subscriber'
      ELSE 'You''ve received a new payment on lomi.'
    END,
    v_amount,
    v_currency_code,
    v_customer_name,
    v_transaction_reference,
    to_char(v_transaction_date, 'YYYY-MM-DD HH24:MI:SS'),
    CASE WHEN v_transaction_type = 'subscription' THEN 'Plan' ELSE 'Product' END,
    v_product_name,
    v_payment_method,
    v_portal_url,
    p_transaction_id
  );

  -- HTML template for customer email
  v_customer_html := format('
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Payment Confirmation</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%%; -ms-text-size-adjust: 100%%; }
    body { font-family: "Inter", Helvetica, Arial, sans-serif; margin: 0; padding: 0; line-height: 1.5; color: #333333; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; }
    .logo-img { width: 100px; height: auto; border-radius: 6px; }
    .email-container { max-width: 600px; margin: auto; }
    .email-header { padding: 20px; text-align: center; background-color: #ffffff; }
    .email-body { padding: 30px; background-color: #ffffff; border-radius: 5px; }
    .email-footer { padding: 20px; text-align: center; font-size: 12px; color: #999999; }
    .transaction-details { margin: 20px 0; width: 100%%; }
    .transaction-details td { padding: 8px 0; }
    .transaction-details tr td:first-child { color: #666666; padding-right: 20px; }
    .button { display: inline-block; padding: 12px 20px; margin: 20px 0; background-color: #0056b3; color: #ffffff; text-decoration: none; border-radius: 4px; text-align: center; }
    @media screen and (max-width: 600px) {
      .email-container { width: 100%% !important; }
      .email-body { padding: 20px !important; }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <img src="%s" alt="%s" class="logo-img" />
    </div>
    <div class="email-body">
      <h2>Payment Confirmation</h2>
      <p>Hello %s,</p>
      <p>Thank you for your payment to %s.</p>
      
      <table class="transaction-details">
        <tr>
          <td><strong>Amount</strong></td>
          <td><strong>%s %s</strong></td>
        </tr>
        <tr>
          <td>Reference</td>
          <td>%s</td>
        </tr>
        <tr>
          <td>Date</td>
          <td>%s</td>
        </tr>
        <tr>
          <td>%s</td>
          <td>%s</td>
        </tr>
        <tr>
          <td>Payment Method</td>
          <td>%s</td>
        </tr>
      </table>
      
      <p>Your payment has been successfully processed. If you have any questions about this transaction, please contact %s directly.</p>
    </div>
    <div class="email-footer">
      <p>This is an automated message from lomi.<br>Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
  ',
    -- Variables for the template
    v_organization_logo_url,
    v_business_name,
    split_part(v_customer_name, ' ', 1),
    v_business_name,
    v_amount,
    v_currency_code,
    v_transaction_reference,
    to_char(v_transaction_date, 'YYYY-MM-DD HH24:MI:SS'),
    CASE WHEN v_transaction_type = 'subscription' THEN 'Plan' ELSE 'Item' END,
    v_product_name,
    v_payment_method,
    v_business_name
  );

  -- Log email preparation
  RAISE NOTICE 'Preparing to send transaction confirmation emails for transaction_id: %', p_transaction_id;

  -- Send email to merchant with error handling
  BEGIN
    SELECT 
      status,
      content::text
    INTO 
      response_status,
      response_body
    FROM extensions.http((
      'POST',
      'https://api.resend.com/emails',
      ARRAY[('Authorization', 'Bearer ' || resend_api_key)::extensions.http_header],
      'application/json',
      jsonb_build_object(
        'from', 'lomi. Payments <payments@updates.lomi.africa>',
        'reply_to', 'Support from lomi. <hello@lomi.africa>',
        'to', ARRAY[v_merchant_email],
        'subject', v_merchant_subject, 
        'html', v_merchant_html,
        'click_tracking', true,
        'open_tracking', true
      )::text
    ));

    IF response_status >= 400 THEN
      RAISE WARNING 'Resend API returned error status % when sending to merchant: %', response_status, response_body;
    ELSE
      RAISE NOTICE 'Merchant transaction email sent successfully to %', v_merchant_email;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Failed to send merchant transaction email: %', SQLERRM;
  END;

  -- Send email to customer with error handling
  BEGIN
    SELECT 
      status,
      content::text
    INTO 
      response_status,
      response_body
    FROM extensions.http((
      'POST',
      'https://api.resend.com/emails',
      ARRAY[('Authorization', 'Bearer ' || resend_api_key)::extensions.http_header],
      'application/json',
      jsonb_build_object(
        'from', format('%s <payments@updates.lomi.africa>', v_business_name),
        'reply_to', format('%s <no-reply@updates.lomi.africa>', v_business_name),
        'to', ARRAY[v_customer_email],
        'subject', v_customer_subject, 
        'html', v_customer_html,
        'click_tracking', true,
        'open_tracking', true
      )::text
    ));

    IF response_status >= 400 THEN
      RAISE WARNING 'Resend API returned error status % when sending to customer: %', response_status, response_body;
    ELSE
      RAISE NOTICE 'Customer transaction email sent successfully to %', v_customer_email;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Failed to send customer transaction email: %', SQLERRM;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Create a trigger function to send emails after transaction status changes to completed
CREATE OR REPLACE FUNCTION public.send_transaction_confirmation_email_trigger()
RETURNS TRIGGER AS $$
BEGIN
  -- Only send email if status changed to completed
  IF NEW.status = 'completed' AND 
     (OLD.status IS NULL OR OLD.status <> 'completed') THEN
    
    -- Call the email sending function
    PERFORM public.send_transaction_confirmation_email(NEW.transaction_id);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Create the trigger on the transactions table
DROP TRIGGER IF EXISTS transaction_email_notification_trigger ON transactions;
CREATE TRIGGER transaction_email_notification_trigger
AFTER UPDATE OF status ON transactions
FOR EACH ROW
EXECUTE FUNCTION public.send_transaction_confirmation_email_trigger();

-- Function to manually send transaction confirmation for a specific transaction
CREATE OR REPLACE FUNCTION public.manually_send_transaction_confirmation(
  p_transaction_id UUID
)
RETURNS TEXT AS $$
DECLARE
  v_status transaction_status;
BEGIN
  -- Check if transaction exists and is completed
  SELECT status INTO v_status
  FROM transactions
  WHERE transaction_id = p_transaction_id;
  
  IF v_status IS NULL THEN
    RETURN 'Error: Transaction not found';
  END IF;
  
  IF v_status <> 'completed' THEN
    RETURN 'Error: Transaction is not completed (current status: ' || v_status::TEXT || ')';
  END IF;
  
  -- Send the confirmation email
  PERFORM public.send_transaction_confirmation_email(p_transaction_id);
  
  RETURN 'Transaction confirmation email sent successfully';
EXCEPTION WHEN OTHERS THEN
  RETURN 'Error sending confirmation email: ' || SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to update organization checkout settings
CREATE OR REPLACE FUNCTION public.update_organization_checkout_settings(
  p_organization_id UUID,
  p_settings JSONB
) RETURNS JSONB AS $$
DECLARE
  v_existing_settings JSONB;
  v_updated_settings JSONB;
BEGIN
  -- Check if there's an existing record
  SELECT
    CASE
      WHEN customer_notifications IS NOT NULL THEN 
        jsonb_build_object(
          'default_language', default_language,
          'display_currency', display_currency,
          'payment_link_duration', payment_link_duration,
          'customer_notifications', customer_notifications,
          'merchant_recipients', merchant_recipients,
          'enable_renewal_notifications', COALESCE(p_settings->>'enable_renewal_notifications', 'true'),
          'renewal_days_before', COALESCE((p_settings->>'renewal_days_before')::INTEGER, 3),
          'renewal_max_attempts', COALESCE((p_settings->>'renewal_max_attempts')::INTEGER, 3),
          'default_success_url', default_success_url,
          'default_cancel_url', default_cancel_url
        )
      ELSE '{}'::jsonb
    END
  INTO v_existing_settings
  FROM organization_checkout_settings
  WHERE organization_id = p_organization_id;
  
  -- If no existing record, prepare default values
  IF v_existing_settings IS NULL THEN
    v_existing_settings := jsonb_build_object(
      'default_language', 'en',
      'display_currency', 'XOF',
      'payment_link_duration', 1,
      'customer_notifications', '{
        "new_payment_links": {"email": true, "whatsapp": false},
        "payment_reminders": {"email": true, "whatsapp": false},
        "successful_payment_attempts": {"email": true, "whatsapp": false}
      }'::jsonb,
      'merchant_recipients', '[]'::jsonb,
      'enable_renewal_notifications', true,
      'renewal_days_before', 3,
      'renewal_max_attempts', 3,
      'default_success_url', '',
      'default_cancel_url', ''
    );
  END IF;
  
  -- Merge with new settings
  v_updated_settings := v_existing_settings || p_settings;
  
  -- Update or insert record
  INSERT INTO organization_checkout_settings (
    organization_id,
    default_language,
    display_currency,
    payment_link_duration,
    customer_notifications,
    merchant_recipients,
    default_success_url,
    default_cancel_url,
    updated_at
  ) VALUES (
    p_organization_id,
    COALESCE(v_updated_settings->>'default_language', 'en'),
    (v_updated_settings->>'display_currency')::currency_code,
    COALESCE((v_updated_settings->>'payment_link_duration')::INTEGER, 1),
    COALESCE(v_updated_settings->'customer_notifications', '{
      "new_payment_links": {"email": true, "whatsapp": false},
      "payment_reminders": {"email": true, "whatsapp": false},
      "successful_payment_attempts": {"email": true, "whatsapp": false}
    }'::jsonb),
    COALESCE(v_updated_settings->'merchant_recipients', '[]'::jsonb),
    COALESCE(v_updated_settings->>'default_success_url', ''),
    COALESCE(v_updated_settings->>'default_cancel_url', ''),
    NOW()
  )
  ON CONFLICT (organization_id) DO UPDATE SET
    default_language = COALESCE(v_updated_settings->>'default_language', organization_checkout_settings.default_language),
    display_currency = COALESCE((v_updated_settings->>'display_currency')::currency_code, organization_checkout_settings.display_currency),
    payment_link_duration = COALESCE((v_updated_settings->>'payment_link_duration')::INTEGER, organization_checkout_settings.payment_link_duration),
    customer_notifications = COALESCE(v_updated_settings->'customer_notifications', organization_checkout_settings.customer_notifications),
    merchant_recipients = COALESCE(v_updated_settings->'merchant_recipients', organization_checkout_settings.merchant_recipients),
    default_success_url = COALESCE(v_updated_settings->>'default_success_url', organization_checkout_settings.default_success_url),
    default_cancel_url = COALESCE(v_updated_settings->>'default_cancel_url', organization_checkout_settings.default_cancel_url),
    updated_at = NOW();
  
  -- Add subscription renewal settings to customer_notifications
  UPDATE organization_checkout_settings
  SET 
    customer_notifications = jsonb_set(
      customer_notifications,
      '{subscription_renewals}',
      jsonb_build_object(
        'email', COALESCE((v_updated_settings->>'enable_renewal_notifications')::BOOLEAN, TRUE),
        'days_before', COALESCE((v_updated_settings->>'renewal_days_before')::INTEGER, 3),
        'max_attempts', COALESCE((v_updated_settings->>'renewal_max_attempts')::INTEGER, 3)
      ),
      true
    )
  WHERE organization_id = p_organization_id;
  
  RETURN v_updated_settings;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to get organization checkout URLs
CREATE OR REPLACE FUNCTION public.get_organization_checkout_urls(
  p_organization_id UUID
) 
RETURNS TABLE (success_url TEXT, cancel_url TEXT) AS $$
DECLARE
  v_base_url TEXT := 'https://lomi.africa';
BEGIN
  -- Get organization settings
  RETURN QUERY SELECT 
    CASE 
      WHEN default_success_url IS NULL OR default_success_url = '' 
      THEN v_base_url || '/checkout/success'
      ELSE 
        CASE 
          WHEN default_success_url LIKE 'http%' 
          THEN default_success_url
          ELSE 'https://' || default_success_url
        END
    END as success_url,
    CASE 
      WHEN default_cancel_url IS NULL OR default_cancel_url = '' 
      THEN v_base_url || '/checkout/cancel'
      ELSE 
        CASE 
          WHEN default_cancel_url LIKE 'http%' 
          THEN default_cancel_url
          ELSE 'https://' || default_cancel_url
        END
    END as cancel_url
  FROM organization_checkout_settings
  WHERE organization_id = p_organization_id;
  
  -- If no record was found, return default URLs
  IF NOT FOUND THEN
    RETURN QUERY SELECT 
      v_base_url || '/checkout/success' as success_url,
      v_base_url || '/checkout/cancel' as cancel_url;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = public, pg_temp;

-- Function to fetch organization checkout settings for subscription renewals
CREATE OR REPLACE FUNCTION public.fetch_organization_checkout_settings(
  p_organization_id UUID
) RETURNS JSONB AS $$
DECLARE
  v_settings JSONB;
  v_renewal_settings JSONB;
BEGIN
  -- Get organization settings
  SELECT 
    jsonb_build_object(
      'default_language', default_language,
      'display_currency', display_currency,
      'payment_link_duration', payment_link_duration,
      'customer_notifications', customer_notifications,
      'merchant_recipients', merchant_recipients,
      'default_success_url', default_success_url,
      'default_cancel_url', default_cancel_url
    )
  INTO v_settings
  FROM organization_checkout_settings
  WHERE organization_id = p_organization_id;
  
  -- If no settings, return defaults
  IF v_settings IS NULL THEN
    RETURN jsonb_build_object(
      'default_language', 'en',
      'display_currency', 'XOF',
      'payment_link_duration', 1,
      'enable_renewal_notifications', true,
      'renewal_days_before', 3,
      'renewal_max_attempts', 3,
      'default_success_url', '',
      'default_cancel_url', ''
    );
  END IF;
  
  -- Extract subscription renewal settings from customer_notifications
  IF v_settings->'customer_notifications' ? 'subscription_renewals' THEN
    v_renewal_settings := v_settings->'customer_notifications'->'subscription_renewals';
  ELSE
    v_renewal_settings := jsonb_build_object(
      'email', true,
      'days_before', 3,
      'max_attempts', 3
    );
  END IF;
  
  -- Combine all settings
  RETURN v_settings || jsonb_build_object(
    'enable_renewal_notifications', COALESCE((v_renewal_settings->>'email')::BOOLEAN, true),
    'renewal_days_before', COALESCE((v_renewal_settings->>'days_before')::INTEGER, 3),
    'renewal_max_attempts', COALESCE((v_renewal_settings->>'max_attempts')::INTEGER, 3)
  );
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = public, pg_temp;

-- Add a trigger to ensure checkout sessions always have success and cancel URLs
CREATE OR REPLACE FUNCTION public.ensure_checkout_session_urls()
RETURNS TRIGGER AS $$
DECLARE
  v_urls RECORD;
BEGIN
  -- Skip if both URLs are already set
  IF NEW.success_url IS NOT NULL AND NEW.success_url <> '' AND 
     NEW.cancel_url IS NOT NULL AND NEW.cancel_url <> '' THEN
    RETURN NEW;
  END IF;
  
  -- Get organization default URLs
  SELECT * FROM get_organization_checkout_urls(NEW.organization_id) INTO v_urls;
  
  -- Set missing success_url
  IF NEW.success_url IS NULL OR NEW.success_url = '' THEN
    NEW.success_url := v_urls.success_url;
  END IF;
  
  -- Set missing cancel_url
  IF NEW.cancel_url IS NULL OR NEW.cancel_url = '' THEN
    NEW.cancel_url := v_urls.cancel_url;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = public, pg_temp;

-- Create the trigger
DROP TRIGGER IF EXISTS ensure_checkout_session_urls_trigger ON checkout_sessions;
CREATE TRIGGER ensure_checkout_session_urls_trigger
BEFORE INSERT OR UPDATE ON checkout_sessions
FOR EACH ROW
EXECUTE FUNCTION public.ensure_checkout_session_urls();