-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "http" WITH SCHEMA extensions;

-- Create secrets schema if it doesn't exist  
CREATE SCHEMA IF NOT EXISTS secrets;

-- Create a secure secret for the Resend API key
CREATE TABLE IF NOT EXISTS secrets.resend_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Function to get the Resend API key securely
CREATE OR REPLACE FUNCTION secrets.get_resend_api_key()
RETURNS TEXT AS $$
DECLARE
  v_api_key TEXT;
BEGIN
  SELECT value INTO v_api_key FROM secrets.resend_config WHERE key = 'resend_api_key';
  IF v_api_key IS NULL THEN
    RAISE EXCEPTION 'Resend API key not found in secrets.resend_config';
  END IF;
  RETURN v_api_key;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to send welcome email via Resend
CREATE OR REPLACE FUNCTION public.send_onboarding_welcome_email(user_email TEXT, user_name TEXT)
RETURNS void AS $$
DECLARE
  resend_api_key TEXT;
  email_subject TEXT := 'Welcome to lomi!';
  email_content TEXT;
  response_status INTEGER;
  response_body TEXT;
BEGIN
  RAISE NOTICE 'Starting send_onboarding_welcome_email for user: % (%)', user_name, user_email;

  -- Get the Resend API key securely with error handling
  BEGIN
    resend_api_key := secrets.get_resend_api_key();
    RAISE NOTICE 'Successfully retrieved Resend API key: %', substring(resend_api_key, 1, 8) || '...';
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Failed to get Resend API key: % - %', SQLERRM, SQLSTATE;
    RETURN;
  END;
  
  -- Compose the email content  
  email_content := format(E'Hello %s,

I''m Babacar, the founder of lomi.. We''re thrilled to have you on board! Our mission is to build francophone West Africa''s most reliable payment orchestration platform.

To achieve this, we’ve built top-tier programmatic tools from the ground up, designed to empower businesses like yours to start accepting payments effortlessly.

Here''s how you can get started:

1. Activate your account by going through our activation process
2. Connect your preferred payment providers
3. Create your first product or subscription plan
4. Create your first payment link or generate a payment page
5. Set up our API in your application

We’ve designed Lomi. to be exceptionally developer-friendly, offering comprehensive documentation and powerful APIs that give you the freedom to build exactly what you need.

Access your portal: https://lomi.africa/portal
Access the docs: https://developers.lomi.africa

If you need any help or there''s anything we could do to improve lomi. for you, our team is at your entire disposal — anytime. Making lomi. phenomenal for our users is our number one priority.

Best regards,
Babacar

---

Follow us:
X: https://x.com/lomiafrica  
LinkedIn: https://linkedin.com/company/lomiafrica
GitHub: https://github.com/lomiafrica
Product Hunt: https://www.producthunt.com/posts/lomi',
    CASE 
      WHEN user_name LIKE '% %' THEN split_part(user_name, ' ', 1)
      ELSE user_name
    END
  );

  RAISE NOTICE 'Email content prepared for user: %', user_name;

  -- Send the email via Resend with error handling
  BEGIN
    RAISE NOTICE 'Attempting to send email via Resend API';
    
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
        'from', 'Babacar Diop <welcome@updates.lomi.africa>',
        'reply_to', 'Support from lomi. <hello@lomi.africa>',
        'to', user_email,
        'subject', email_subject,
        'text', email_content,
        'click_tracking', false,
        'open_tracking', false
      )::text
    ));

    RAISE NOTICE 'Resend API response - Status: %, Body: %', response_status, response_body;

    IF response_status >= 400 THEN
      RAISE WARNING 'Resend API returned error status %: %', response_status, response_body;
    ELSE
      RAISE NOTICE 'Welcome email sent successfully. Status: %, Response: %', response_status, response_body;
    END IF;

  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Failed to send welcome email: % - %', SQLERRM, SQLSTATE;
    RAISE WARNING 'Error details - State: %, Message: %', SQLSTATE, SQLERRM;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp; 