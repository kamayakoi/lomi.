-- Funtion to get Merchant-Org ID
CREATE OR REPLACE FUNCTION public.get_merchant_organization_id(p_merchant_id UUID)
RETURNS UUID AS $$
DECLARE
    v_organization_id UUID;
BEGIN
    SELECT organization_id INTO v_organization_id
    FROM merchant_organization_links
    WHERE merchant_id = p_merchant_id;

    IF v_organization_id IS NULL THEN
        RAISE EXCEPTION 'No organization found for merchant_id %', p_merchant_id;
    END IF;

    RETURN v_organization_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to complete activation (renamed from upsert_organization_kyc)
CREATE OR REPLACE FUNCTION public.complete_activation(
    p_merchant_id UUID,
    p_legal_organization_name VARCHAR,
    p_tax_number VARCHAR,
    p_business_description VARCHAR,
    p_legal_country VARCHAR,
    p_legal_region VARCHAR,
    p_legal_city VARCHAR,
    p_legal_postal_code VARCHAR,
    p_legal_street VARCHAR,
    p_proof_of_business VARCHAR,
    p_business_platform_url VARCHAR,
    p_authorized_signatory_name VARCHAR,
    p_authorized_signatory_email VARCHAR,
    p_authorized_signatory_phone_number VARCHAR,
    p_legal_representative_id_url VARCHAR,
    p_address_proof_url VARCHAR,
    p_business_registration_url VARCHAR
) RETURNS VOID AS $$
DECLARE
    v_organization_id UUID;
    v_signatory_name TEXT;
    v_signatory_email TEXT;
BEGIN
    -- Get the organization_id for the merchant
    v_organization_id := get_merchant_organization_id(p_merchant_id);

    -- Store signatory details for email
    v_signatory_name := p_authorized_signatory_name;
    v_signatory_email := p_authorized_signatory_email;

    -- Insert or update the organization_kyc record
    INSERT INTO organization_kyc (
        organization_id,
        merchant_id,
        legal_organization_name,
        tax_number,
        business_description,
        legal_country,
        legal_region,
        legal_city,
        legal_postal_code,
        legal_street,
        proof_of_business,
        business_platform_url,
        authorized_signatory_name,
        authorized_signatory_email,
        authorized_signatory_phone_number,
        legal_representative_id_url,
        address_proof_url,
        business_registration_url,
        kyc_submitted_at
    ) VALUES (
        v_organization_id,
        p_merchant_id,
        p_legal_organization_name,
        p_tax_number,
        p_business_description,
        p_legal_country,
        p_legal_region,
        p_legal_city,
        p_legal_postal_code,
        p_legal_street,
        p_proof_of_business,
        p_business_platform_url,
        p_authorized_signatory_name,
        p_authorized_signatory_email,
        p_authorized_signatory_phone_number,
        p_legal_representative_id_url,
        p_address_proof_url,
        p_business_registration_url,
        CURRENT_TIMESTAMP
    ) ON CONFLICT (organization_id, merchant_id) DO UPDATE SET
        legal_organization_name = EXCLUDED.legal_organization_name,
        tax_number = EXCLUDED.tax_number,
        business_description = EXCLUDED.business_description,
        legal_country = EXCLUDED.legal_country,
        legal_region = EXCLUDED.legal_region,
        legal_city = EXCLUDED.legal_city,
        legal_postal_code = EXCLUDED.legal_postal_code,
        legal_street = EXCLUDED.legal_street,
        proof_of_business = EXCLUDED.proof_of_business,
        business_platform_url = EXCLUDED.business_platform_url,
        authorized_signatory_name = EXCLUDED.authorized_signatory_name,
        authorized_signatory_email = EXCLUDED.authorized_signatory_email,
        authorized_signatory_phone_number = EXCLUDED.authorized_signatory_phone_number,
        legal_representative_id_url = EXCLUDED.legal_representative_id_url,
        address_proof_url = EXCLUDED.address_proof_url,
        business_registration_url = EXCLUDED.business_registration_url,
        kyc_submitted_at = CURRENT_TIMESTAMP,
        status = 'pending'::kyc_status;

    -- Send activation submitted email with error handling
    BEGIN
        PERFORM public.send_activation_submitted_email(v_signatory_email, v_signatory_name);
        RAISE NOTICE 'Activation submitted email sent to %', v_signatory_email;
    EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'Failed to send activation submitted email: %', SQLERRM;
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to check activation status
CREATE OR REPLACE FUNCTION public.check_activation_state(p_merchant_id UUID)
RETURNS kyc_status AS $$
DECLARE
    v_status kyc_status;
BEGIN
    SELECT status INTO v_status
    FROM organization_kyc
    WHERE merchant_id = p_merchant_id
    ORDER BY kyc_submitted_at DESC
    LIMIT 1;

    IF v_status IS NULL THEN
        RETURN 'not_submitted'::kyc_status;
    ELSE
        RETURN v_status;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to send activation submitted email via Resend
CREATE OR REPLACE FUNCTION public.send_activation_submitted_email(signatory_email TEXT, signatory_name TEXT)
RETURNS void AS $$
DECLARE
  resend_api_key TEXT;
  email_subject TEXT := 'lomi. — Activation submitted';
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
  
  -- Compose the email content  
  email_content := format(
    'Hello %s,

Thank you for submitting your account activation information. Our team is currently reviewing your application.

We will notify you as soon as the review is complete, usually within 24 hours. In the meantime, please feel free to explore the lomi.''s portal and documentation to familiarize yourself with our platform.

If we need any additional information to process your application, we will reach out to you directly. 

Best regards,
Babacar

---

If you have any questions, please reply to this email or contact our support team at [hello@lomi.africa](mailto:hello@lomi.africa).',
    split_part(signatory_name, ' ', 1)  
  );

  RAISE NOTICE 'Sending activation submitted email to % with subject: %', signatory_email, email_subject;

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
        'from', 'Babacar Diop <welcome@updates.lomi.africa>',
        'reply_to', 'Support from lomi. <hello@lomi.africa>',
        'to', signatory_email,
        'subject', email_subject, 
        'text', email_content,
        'click_tracking', true,
        'open_tracking', true
      )::text
    ));

    IF response_status >= 400 THEN
      RAISE WARNING 'Resend API returned error status %: %', response_status, response_body;
    ELSE
      RAISE NOTICE 'Activation submitted email sent successfully. Status: %, Response: %', response_status, response_body;
    END IF;

  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Failed to send activation submitted email: %', SQLERRM;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

CREATE OR REPLACE FUNCTION public.send_kyc_approved_email()
RETURNS TRIGGER AS $$
DECLARE
  resend_api_key TEXT;
  signatory_name TEXT;
  signatory_email TEXT; 
  email_subject TEXT := 'lomi. Account Approved';
  email_content TEXT;
  response_status INTEGER;
  response_body TEXT;
BEGIN
  -- Only send email if status changed to approved
  IF NEW.status = 'approved'::kyc_status THEN
    -- Get the authorized signatory name and email
    SELECT 
      authorized_signatory_name,
      authorized_signatory_email
    INTO
      signatory_name,
      signatory_email  
    FROM organization_kyc
    WHERE organization_id = NEW.organization_id
    ORDER BY kyc_submitted_at DESC
    LIMIT 1;

    RAISE NOTICE 'Preparing to send approval email to % (%)', signatory_name, signatory_email;

    -- Get the Resend API key securely with error handling
    BEGIN
      resend_api_key := secrets.get_resend_api_key();
      RAISE NOTICE 'Successfully retrieved Resend API key';
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'Failed to get Resend API key: %', SQLERRM;
      RETURN NEW;
    END;
    
    -- Compose the email content
    email_content := format(
      'Hello %s,

Congratulations! Your lomi. account has been approved. 

You now have full access to all the features of our platform. Feel free to explore the portal, connect your payment providers, and start accepting payments.

If you have any questions or need assistance to set up lomi. API, our support team is here to help. You can reach us anytime at [hello@lomi.africa](mailto:hello@lomi.africa).

Best regards, 
Babacar',
      split_part(signatory_name, ' ', 1)
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
          'from', 'Babacar Diop <welcome@updates.lomi.africa>',
          'reply_to', 'Support from lomi. <hello@lomi.africa>',
          'to', signatory_email,
          'subject', email_subject,
          'text', email_content,
          'click_tracking', true,
          'open_tracking', true
        )::text
      ));

      IF response_status >= 400 THEN
        RAISE WARNING 'Resend API returned error status %: %', response_status, response_body;
      ELSE
        RAISE NOTICE 'Approval email sent successfully. Status: %, Response: %', response_status, response_body;
      END IF;

    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'Failed to send approval email: %', SQLERRM;
    END;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Create trigger for KYC approved email
DROP TRIGGER IF EXISTS send_kyc_approved_email_trigger ON organization_kyc;
CREATE TRIGGER send_kyc_approved_email_trigger
AFTER UPDATE OF status ON organization_kyc
FOR EACH ROW
EXECUTE FUNCTION public.send_kyc_approved_email();