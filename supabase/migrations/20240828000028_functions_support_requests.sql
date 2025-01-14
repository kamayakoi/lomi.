-- Create a new bucket for storing support request images
INSERT INTO storage.buckets (id, name, public)
VALUES ('support_request_images', 'support_request_images', false)
ON CONFLICT (id) DO NOTHING;

-- Grant access to authenticated users to use the bucket
CREATE POLICY "Allow authenticated users to upload images to their own folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'support_request_images' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Allow authenticated users to read their own images"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'support_request_images' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Function to send support request notifications
CREATE OR REPLACE FUNCTION public.send_support_request_notification(
    p_merchant_name TEXT,
    p_merchant_email TEXT,
    p_category support_category,
    p_message TEXT,
    p_image_url TEXT,
    p_created_at TIMESTAMPTZ
) RETURNS void AS $$
DECLARE
  resend_api_key TEXT;
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
  
  -- Format the subject
  email_subject := format('New Support Request from %s', p_merchant_name);
  
  -- Compose the email content  
  email_content := format(
    'A new support request has been submitted.

Request Details:
- Merchant Name: %s
- Merchant Email: %s
- Category: %s
- Message: %s
- Image Attachment: %s
- Submitted at: %s

Please handle this request according to our support guidelines.

Best regards,
lomi. System',
    p_merchant_name,
    p_merchant_email,
    p_category,
    p_message,
    COALESCE(p_image_url, 'No image attached'),
    to_char(p_created_at, 'DD-MM-YYYY HH24:MI:SS')
  );

  -- Send the email to all recipients at once
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
        'from', 'Support from lomi. <support@updates.lomi.africa>',
        'to', ARRAY['babacar@lomi.africa', 'hello@lomi.africa'],
        'subject', email_subject,
        'text', email_content,
        'click_tracking', true,
        'open_tracking', true
      )::text
    ));

    IF response_status >= 400 THEN
      RAISE WARNING 'Resend API returned error status %: %', response_status, response_body;
    ELSE
      RAISE NOTICE 'Support request notification sent successfully. Status: %, Response: %', response_status, response_body;
    END IF;

  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Failed to send support request notification: %', SQLERRM;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to send confirmation email to merchant
CREATE OR REPLACE FUNCTION public.send_merchant_support_confirmation(
    p_merchant_email TEXT,
    p_support_request_id UUID
) RETURNS void AS $$
DECLARE
  resend_api_key TEXT;
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
  
  -- Format the subject and content
  email_subject := 'Thank you for contacting support';
  email_content := format(
    '##- Please type your reply above this line -##

Thank you for reaching out to the lomi. support team! Our team will reply via email to help you or request more information on your issue.

We typically reach out with our first response within 24 hours, though we work to respond faster than that. For additional information about lomi. please see our developers center: https://developers.lomi.africa/

To add more comments, please reply to this email. For reference, your ticket number is %s.

This email is a service from lomi. Support Team.',
    p_support_request_id
  );

  -- Send the confirmation email to merchant
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
        'from', 'Support from lomi. <support@updates.lomi.africa>',
        'to', ARRAY[p_merchant_email],
        'subject', email_subject,
        'text', email_content,
        'click_tracking', true,
        'open_tracking', true
      )::text
    ));

    IF response_status >= 400 THEN
      RAISE WARNING 'Failed to send merchant confirmation: %', response_body;
    END IF;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to create a new support request
CREATE OR REPLACE FUNCTION public.create_support_request(
    p_merchant_id UUID,
    p_category support_category,
    p_message TEXT,
    p_image_url TEXT DEFAULT NULL,
    p_priority support_priority DEFAULT 'normal'
)
RETURNS UUID AS $$
DECLARE
    v_support_request_id UUID;
    v_merchant_name TEXT;
    v_merchant_email TEXT;
BEGIN
    -- Get merchant details
    SELECT name, email 
    INTO v_merchant_name, v_merchant_email
    FROM merchants 
    WHERE merchant_id = p_merchant_id;

    -- Create the support request
    INSERT INTO support_requests (
        merchant_id,
        category,
        message,
        image_url,
        priority
    )
    VALUES (
        p_merchant_id,
        p_category,
        p_message,
        p_image_url,
        p_priority
    )
    RETURNING support_requests_id INTO v_support_request_id;

    -- Send notification to support team
    PERFORM public.send_support_request_notification(
        v_merchant_name,
        v_merchant_email,
        p_category,
        p_message,
        p_image_url,
        NOW()
    );

    -- Send confirmation to merchant
    PERFORM public.send_merchant_support_confirmation(
        v_merchant_email,
        v_support_request_id
    );

    RETURN v_support_request_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch support requests for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_support_requests(
    p_merchant_id UUID,
    p_status support_status DEFAULT NULL,
    p_page INTEGER DEFAULT 1,
    p_page_size INTEGER DEFAULT 50
)
RETURNS TABLE (
    support_requests_id UUID,
    category support_category,
    message TEXT,
    image_url TEXT,
    status support_status,
    priority support_priority,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sr.support_requests_id,
        sr.category,
        sr.message,
        sr.image_url,
        sr.status,
        sr.priority,
        sr.created_at,
        sr.updated_at
    FROM 
        support_requests sr
    WHERE 
        sr.merchant_id = p_merchant_id
        AND (p_status IS NULL OR sr.status = p_status)
    ORDER BY
        sr.created_at DESC
    LIMIT p_page_size
    OFFSET ((p_page - 1) * p_page_size);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Trigger function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_support_request_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public, pg_temp;

-- Trigger to call the update_support_request_timestamp function
CREATE TRIGGER update_support_request_timestamp
BEFORE UPDATE ON support_requests
FOR EACH ROW
EXECUTE FUNCTION update_support_request_timestamp();
