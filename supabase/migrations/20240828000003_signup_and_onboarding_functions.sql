-- Function to create a merchant record
CREATE OR REPLACE FUNCTION public.create_merchant_record()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the new user is a merchant
  IF NEW.raw_user_meta_data->>'is_merchant' = 'true' THEN
    INSERT INTO public.merchants (merchant_id, name, email)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'full_name',
      NEW.email
    );
  END IF;
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