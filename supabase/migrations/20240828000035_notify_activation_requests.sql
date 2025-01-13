-- Function to send activation request notifications
CREATE OR REPLACE FUNCTION public.send_activation_request_notification(
    merchant_id UUID,
    legal_name TEXT,
    signatory_name TEXT,
    signatory_email TEXT,
    business_description TEXT,
    country TEXT,
    request_date TIMESTAMPTZ
) RETURNS void AS $$
DECLARE
  resend_api_key TEXT;
  notification_email TEXT := 'hello@lomi.africa';
  email_subject TEXT;
  email_content TEXT;
  response_status INTEGER;
  response_body TEXT;
BEGIN
  -- Get the Resend API key securely with error handling
  BEGIN
    resend_api_key := secrets.get_resend_api_key();
    RAISE NOTICE 'Successfully retrieved Resend API key';
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Failed to get Resend API key: %', SQLERRM;
    RETURN;
  END;
  
  -- Format the subject with date
  email_subject := format('New Activation Request on %s', to_char(request_date, 'DD-MM-YYYY HH24:MI:SS'));
  
  -- Compose the email content  
  email_content := format(
    'New activation request submitted on lomi.

Activation request details:
- Merchant ID: %s
- Legal Business Name: %s
- Authorized Signatory: %s
- Signatory Email: %s
- Business Description: %s
- Country: %s
- Submission Date: %s

You can review this request and related documents in the admin portal: https://admin.lomi.africa/activations/%s

It''s always day 1.
lomi. System',
    merchant_id,
    legal_name,
    signatory_name,
    signatory_email,
    business_description,
    country,
    to_char(request_date, 'DD-MM-YYYY HH24:MI:SS'),
    merchant_id
  );

  -- Send the email via Resend with error handling
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
        'from', 'lomi. System <system@updates.lomi.africa>',
        'to', notification_email,
        'subject', email_subject,
        'text', email_content,
        'click_tracking', true,
        'open_tracking', true
      )::text
    ));

    IF response_status >= 400 THEN
      RAISE WARNING 'Resend API returned error status %: %', response_status, response_body;
    ELSE
      RAISE NOTICE 'Activation request notification sent successfully. Status: %, Response: %', response_status, response_body;
    END IF;

  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Failed to send activation request notification: %', SQLERRM;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Create trigger function for new activation requests
CREATE OR REPLACE FUNCTION public.notify_new_activation_request()
RETURNS TRIGGER AS $$
BEGIN
  -- Only send notification for new submissions or resubmissions
  IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.status = 'rejected'::kyc_status) THEN
    PERFORM public.send_activation_request_notification(
      NEW.merchant_id,
      NEW.legal_organization_name,
      NEW.authorized_signatory_name,
      NEW.authorized_signatory_email,
      NEW.business_description,
      NEW.legal_country,
      NEW.kyc_submitted_at
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Create trigger for activation request notifications
DROP TRIGGER IF EXISTS notify_new_activation_request_trigger ON organization_kyc;
CREATE TRIGGER notify_new_activation_request_trigger
AFTER INSERT OR UPDATE ON organization_kyc
FOR EACH ROW
EXECUTE FUNCTION public.notify_new_activation_request();

-- Function to send notification when a provider is connected
CREATE OR REPLACE FUNCTION public.send_provider_connected_notification(
    p_organization_id UUID,
    p_provider_code provider_code
) RETURNS void AS $$
DECLARE
  resend_api_key TEXT;
  notification_emails TEXT[];
  email_subject TEXT;
  email_content TEXT;
  response_status INTEGER;
  response_body TEXT;
  merchant_id UUID;
  organization_name TEXT;
  signatory_name TEXT;
  signatory_email TEXT;
  business_description TEXT;
  country TEXT;
  email_already_sent BOOLEAN;
  provider_name TEXT;
  from_email TEXT;
  recipient TEXT;
  business_platform_url TEXT;
  legal_organization_name TEXT;
  tax_number TEXT;
BEGIN
  -- Set provider-specific details
  provider_name := CASE p_provider_code
    WHEN 'WAVE'::provider_code THEN 'Wave'
    WHEN 'ORANGE'::provider_code THEN 'Orange Money'
    WHEN 'MTN'::provider_code THEN 'MTN Mobile Money'
    ELSE 'Unknown Provider'
  END;

  from_email := CASE p_provider_code
    WHEN 'WAVE'::provider_code THEN 'wave@updates.lomi.africa'
    WHEN 'ORANGE'::provider_code THEN 'orange@updates.lomi.africa'
    WHEN 'MTN'::provider_code THEN 'mtn@updates.lomi.africa'
    ELSE 'system@updates.lomi.africa'
  END;

  -- Set notification emails based on provider
  notification_emails := CASE p_provider_code
    WHEN 'WAVE'::provider_code THEN ARRAY[
      'ci-payment-admins@wave.com',
      'hello@lomi.africa'
    ]
    WHEN 'ORANGE'::provider_code THEN ARRAY['hello@lomi.africa']
    WHEN 'MTN'::provider_code THEN ARRAY['hello@lomi.africa']
    ELSE ARRAY['hello@lomi.africa']
  END;

  -- Check if email has already been sent
  SELECT email_sent 
  INTO email_already_sent
  FROM organization_providers_settings
  WHERE organization_id = p_organization_id AND provider_code = p_provider_code;

  IF email_already_sent THEN
    RETURN;
  END IF;

  -- Get the merchant details
  SELECT 
    mol.merchant_id,
    o.name,
    ok.authorized_signatory_name,
    ok.authorized_signatory_email,
    ok.business_description,
    ok.legal_country,
    ok.business_platform_url,
    ok.legal_organization_name,
    ok.tax_number
  INTO
    merchant_id,
    organization_name,
    signatory_name,
    signatory_email,
    business_description,
    country,
    business_platform_url,
    legal_organization_name,
    tax_number
  FROM organizations o
  JOIN merchant_organization_links mol ON o.organization_id = mol.organization_id
  LEFT JOIN organization_kyc ok ON o.organization_id = ok.organization_id AND ok.status = 'approved'
  WHERE o.organization_id = p_organization_id;

  -- Get the Resend API key
  BEGIN
    resend_api_key := secrets.get_resend_api_key();
  EXCEPTION WHEN OTHERS THEN
    RETURN;
  END;
  
  -- Format the subject 
  email_subject := format('An organization has connected %s - %s', provider_name, COALESCE(legal_organization_name, organization_name));
  
  -- Compose the email content  
  email_content := format(
    'An organization has succesfully connected the %s payment channel on the lomi. platform.

Organization details:
- Organization ID (internal): %s
- Organization Name: %s
- Authorized Signatory: %s
- Signatory Email: %s
- Tax Number: %s
- Business Description: %s
- Website: %s
- Country: %s

The organization can now enable %s payments for their customers. Thank you so much for your trust.

Please reply to this email to get more details about the concerned organization including their legal representative ID (passport / ID card), their address proof and business registration documents.

lomi.',
    provider_name,
    merchant_id,
    COALESCE(legal_organization_name, 'Not provided'),
    COALESCE(signatory_name, 'Not provided'),
    COALESCE(signatory_email, 'Not provided'),
    COALESCE(tax_number, 'Not provided'),
    COALESCE(business_description, 'Not provided'),
    COALESCE(business_platform_url, 'Not provided'),
    COALESCE(country, 'Not provided'),

    provider_name
  );

  -- Send the email to each recipient for the provider
  FOREACH recipient IN ARRAY notification_emails
  LOOP
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
          'from', format('lomi. — %s <%s>', provider_name, from_email),
          'to', recipient,
          'reply_to', 'hello@lomi.africa',
          'subject', email_subject,
          'text', email_content,
          'click_tracking', true,
          'open_tracking', true
        )::text
      ));

    EXCEPTION WHEN OTHERS THEN
      NULL;
    END;
  END LOOP;

  -- Update email_sent flag after attempting to send to all recipients
  UPDATE organization_providers_settings
  SET email_sent = true
  WHERE organization_id = p_organization_id AND provider_code = p_provider_code;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Create trigger function for provider connections
CREATE OR REPLACE FUNCTION public.notify_provider_connected()
RETURNS TRIGGER AS $$  
BEGIN
  -- Only send notification when is_connected changes to true for supported providers
  IF TG_OP = 'UPDATE' AND NEW.is_connected = true AND 
     NEW.provider_code IN ('WAVE'::provider_code, 'ORANGE'::provider_code, 'MTN'::provider_code) THEN
    PERFORM public.send_provider_connected_notification(NEW.organization_id, NEW.provider_code);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Create trigger for provider connected notifications  
DROP TRIGGER IF EXISTS notify_provider_connected_trigger ON organization_providers_settings;
CREATE TRIGGER notify_provider_connected_trigger
AFTER UPDATE ON organization_providers_settings
FOR EACH ROW  
EXECUTE FUNCTION public.notify_provider_connected(); 