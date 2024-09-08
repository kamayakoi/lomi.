CREATE OR REPLACE FUNCTION public.create_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (user_id, name, email, phone_number)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    ''
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.create_user();

-- Create a new organization function
CREATE OR REPLACE FUNCTION create_organization(
  p_name VARCHAR,
  p_email VARCHAR,
  p_phone_number VARCHAR,
  p_country VARCHAR,
  p_city VARCHAR,
  p_address VARCHAR,
  p_postal_code VARCHAR,
  p_industry VARCHAR,
  p_website_url VARCHAR,
  p_created_by UUID
) RETURNS organizations AS $$
DECLARE
  new_organization organizations;
BEGIN
  -- Insert the new organization
  INSERT INTO organizations (name, email, phone_number, country, city, address, postal_code, industry, website_url, created_by)
  VALUES (p_name, p_email, p_phone_number, p_country, p_city, p_address, p_postal_code, p_industry, p_website_url, p_created_by)
  RETURNING * INTO new_organization;
  
  RETURN new_organization;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update user profile function
CREATE OR REPLACE FUNCTION update_user_profile(
  p_user_id UUID,
  p_name VARCHAR,
  p_phone_number VARCHAR,
  p_country VARCHAR,
  p_onboarded BOOLEAN
) RETURNS VOID AS $$
BEGIN
  -- Update the user profile
  UPDATE users
  SET name = p_name,
      phone_number = p_phone_number,
      country = p_country,
      onboarded = p_onboarded
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create user-organization link function
CREATE OR REPLACE FUNCTION create_user_organization_link(
  p_user_id UUID,
  p_organization_id UUID,
  p_role VARCHAR
) RETURNS user_organization_links AS $$
DECLARE
  new_link user_organization_links;
BEGIN
  -- Insert the new user-organization link
  INSERT INTO user_organization_links (user_id, organization_id, role)
  VALUES (p_user_id, p_organization_id, p_role)
  RETURNING * INTO new_link;
  
  RETURN new_link;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;