-- Function to send new signup notifications
CREATE OR REPLACE FUNCTION public.send_signup_notification(
    merchant_name TEXT,
    merchant_email TEXT,
    signup_date TIMESTAMPTZ
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
  email_subject := format('New Sign Up on %s', to_char(signup_date, 'DD-MM-YYYY HH24:MI:SS'));
  
  -- Compose the email content  
  email_content := format(
    'New user signed up on lomi.

Sign up details:
- Name: %s
- Email: %s
- Date: %s

It''s always day 1.
lomi. System',
    merchant_name,
    merchant_email,
    to_char(signup_date, 'DD-MM-YYYY HH24:MI:SS')
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
      RAISE NOTICE 'Signup notification sent successfully. Status: %, Response: %', response_status, response_body;
    END IF;

  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Failed to send signup notification: %', SQLERRM;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Modify the complete_onboarding function to send notification
CREATE OR REPLACE FUNCTION public.notify_new_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Send notification for new signup
  PERFORM public.send_signup_notification(
    NEW.name,
    NEW.email,
    NEW.created_at
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Create trigger for new signup notifications
DROP TRIGGER IF EXISTS notify_new_signup_trigger ON merchants;
CREATE TRIGGER notify_new_signup_trigger
AFTER INSERT ON merchants
FOR EACH ROW
EXECUTE FUNCTION public.notify_new_signup(); 