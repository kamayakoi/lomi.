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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

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
  INSERT INTO organizations (name, email, phone_number, industry) 
  VALUES ('Acme Inc.', merchant_email, NULL, NULL)
  RETURNING organization_id INTO org_id;

  -- Link merchant to organization
  INSERT INTO merchant_organization_links (merchant_id, organization_id, role)
  VALUES (new_merchant_id, org_id, 'Admin');  
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;
