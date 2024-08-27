-- Create a new organization
CREATE OR REPLACE FUNCTION create_organization(
  p_name VARCHAR,
  p_email VARCHAR,
  p_phone_number VARCHAR,
  p_country VARCHAR,
  p_max_transactions_per_day INT,
  p_max_providers INT,
  p_max_transaction_amount NUMERIC(10,2),
  p_max_monthly_volume NUMERIC(10,2),
  p_max_api_calls_per_minute INT,
  p_max_webhooks INT,
  p_metadata JSONB DEFAULT NULL,
  p_logo_url TEXT DEFAULT NULL
) RETURNS organizations AS $$
DECLARE
  new_organization organizations;
BEGIN
  -- Validate input
  IF p_name IS NULL OR p_email IS NULL OR p_phone_number IS NULL OR p_country IS NULL THEN
    RAISE EXCEPTION 'Name, email, phone number, and country are required';
  END IF;

  -- Insert the new organization
  INSERT INTO organizations (name, email, phone_number, country, max_transactions_per_day, max_providers, max_transaction_amount, max_monthly_volume, max_api_calls_per_minute, max_webhooks, metadata, logo_url)
  VALUES (p_name, p_email, p_phone_number, p_country, p_max_transactions_per_day, p_max_providers, p_max_transaction_amount, p_max_monthly_volume, p_max_api_calls_per_minute, p_max_webhooks, p_metadata, p_logo_url)
  RETURNING * INTO new_organization;
  
  RETURN new_organization;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Read an organization by ID
CREATE OR REPLACE FUNCTION get_organization_by_id(p_organization_id UUID)
RETURNS organizations AS $$
  SELECT * FROM organizations WHERE organization_id = p_organization_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Update an organization
CREATE OR REPLACE FUNCTION update_organization(
  p_organization_id UUID,
  p_name VARCHAR,
  p_email VARCHAR,
  p_phone_number VARCHAR,
  p_country VARCHAR,
  p_status organization_status,
  p_max_transactions_per_day INT,
  p_max_providers INT,
  p_max_transaction_amount NUMERIC(10,2),
  p_max_monthly_volume NUMERIC(10,2),
  p_max_api_calls_per_minute INT,
  p_max_webhooks INT,
  p_metadata JSONB,
  p_logo_url TEXT
) RETURNS organizations AS $$
DECLARE
  updated_organization organizations;
BEGIN
  -- Validate input
  IF p_name IS NULL OR p_email IS NULL OR p_phone_number IS NULL OR p_country IS NULL THEN
    RAISE EXCEPTION 'Name, email, phone number, and country are required';
  END IF;

  -- Update the organization
  UPDATE organizations
  SET 
    name = p_name,
    email = p_email,
    phone_number = p_phone_number,
    country = p_country,
    status = p_status,
    max_transactions_per_day = p_max_transactions_per_day,
    max_providers = p_max_providers,
    max_transaction_amount = p_max_transaction_amount,
    max_monthly_volume = p_max_monthly_volume,
    max_api_calls_per_minute = p_max_api_calls_per_minute,
    max_webhooks = p_max_webhooks,
    metadata = p_metadata,
    logo_url = p_logo_url,
    updated_at = NOW()
  WHERE organization_id = p_organization_id
  RETURNING * INTO updated_organization;
  
  RETURN updated_organization;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Soft delete an organization
CREATE OR REPLACE FUNCTION delete_organization(p_organization_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  rows_affected INT;
BEGIN
  UPDATE organizations
  SET deleted_at = NOW()
  WHERE organization_id = p_organization_id
    AND deleted_at IS NULL;
  
  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  RETURN rows_affected > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;