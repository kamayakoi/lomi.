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
        'click_tracking', false,
        'open_tracking', false
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