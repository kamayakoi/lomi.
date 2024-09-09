-- Function to create a merchant record
CREATE OR REPLACE FUNCTION public.create_merchant_record()
RETURNS TRIGGER AS $$
BEGIN
  -- Create a merchant record for all new users
  INSERT INTO public.merchants (merchant_id, name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_merchant_record();

-- Function to update merchant record
CREATE OR REPLACE FUNCTION public.update_merchant_record()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.merchants
  SET 
    name = NEW.raw_user_meta_data->>'full_name',
    email = NEW.email,
    updated_at = NOW()
  WHERE merchant_id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the update function on user update
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.update_merchant_record();

-- Function to create initial organization and link to merchant
CREATE OR REPLACE FUNCTION public.create_initial_organization(new_merchant_id UUID)
RETURNS void AS $$
DECLARE
  org_id UUID;
  merchant_email VARCHAR;
BEGIN
  -- Get the merchant's email
  SELECT email INTO merchant_email FROM merchants WHERE merchant_id = new_merchant_id;

  -- Create initial organization record
  INSERT INTO organizations (
    name, email, phone_number, country, city, address, postal_code, industry
  ) VALUES (
    'Default Organization', 
    merchant_email,
    NULL, NULL, NULL, NULL, NULL, NULL
  ) RETURNING organization_id INTO org_id;

  -- Link merchant to organization
  INSERT INTO merchant_organization_links (
    merchant_id, organization_id, role
  ) VALUES (
    new_merchant_id, org_id, 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update merchant and organization during onboarding
CREATE OR REPLACE FUNCTION public.complete_onboarding(
    p_merchant_id UUID,
    p_phone_number VARCHAR,
    p_country VARCHAR,
    p_org_name VARCHAR,
    p_org_country VARCHAR,
    p_org_city VARCHAR,
    p_org_address VARCHAR,
    p_org_postal_code VARCHAR,
    p_org_industry VARCHAR
) RETURNS void AS $$
DECLARE
    org_id UUID;
BEGIN
    -- Update merchant information
    UPDATE merchants
    SET 
        phone_number = p_phone_number,
        country = p_country,
        onboarded = true,
        updated_at = NOW()
    WHERE merchant_id = p_merchant_id;

    -- Get the organization ID linked to the merchant
    SELECT organization_id INTO org_id
    FROM merchant_organization_links
    WHERE merchant_id = p_merchant_id
    LIMIT 1;

    -- Update organization information
    UPDATE organizations
    SET 
        name = p_org_name,
        phone_number = p_phone_number,
        country = p_org_country,
        city = p_org_city,
        address = p_org_address,
        postal_code = p_org_postal_code,
        industry = p_org_industry,
        updated_at = NOW()
    WHERE organization_id = org_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;