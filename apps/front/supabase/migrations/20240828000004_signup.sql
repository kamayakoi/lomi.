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
    -- Only update email and name if the merchant doesn't exist or if name is NULL
    UPDATE merchants 
    SET 
        email = COALESCE(NEW.email, merchants.email),
        name = CASE 
            WHEN merchants.name IS NULL THEN 
                COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', merchants.name)
            ELSE 
                merchants.name -- Keep existing name if it's set
            END,
        updated_at = NOW()
    WHERE merchant_id = NEW.id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Create the update trigger
CREATE TRIGGER on_auth_user_updated
    AFTER UPDATE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_merchant_record();

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

-- Function to create a new organization
CREATE OR REPLACE FUNCTION public.create_organization(
    p_merchant_id UUID,
    p_name VARCHAR DEFAULT NULL,
    p_role member_role DEFAULT 'Admin'
) RETURNS TABLE (
    organization_id UUID,
    store_handle VARCHAR
) AS $$
DECLARE
    v_organization_id UUID;
    v_merchant_email VARCHAR;
    v_merchant_name VARCHAR;
    v_merchant_phone VARCHAR;
    v_store_handle VARCHAR;
    v_current_org RECORD;
    v_org_name VARCHAR;
BEGIN
    -- Get the merchant's details
    SELECT 
        email,
        name,
        phone_number
    INTO 
        v_merchant_email,
        v_merchant_name,
        v_merchant_phone
    FROM merchants 
    WHERE merchant_id = p_merchant_id;

    IF v_merchant_email IS NULL THEN
        RAISE EXCEPTION 'Merchant not found';
    END IF;

    -- Try to get current organization details if any exist
    BEGIN
        SELECT 
            o.industry,
            o.default_currency,
            oa.country,
            oa.region,
            oa.city
        INTO STRICT v_current_org
        FROM organizations o
        JOIN merchant_organization_links mol ON mol.organization_id = o.organization_id
        LEFT JOIN organization_addresses oa ON oa.organization_id = o.organization_id
        WHERE mol.merchant_id = p_merchant_id
        AND mol.team_status = 'active'
        LIMIT 1;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            -- If no organization exists, set v_current_org to NULL
            v_current_org := NULL;
    END;

    -- Generate organization name
    v_org_name := CASE 
        WHEN p_name IS NOT NULL THEN p_name
        WHEN v_merchant_name IS NOT NULL THEN v_merchant_name || '''s Organization'
        ELSE 'New Organization'
    END;

    -- Create organization record with inherited data where available
    INSERT INTO organizations (
        name,
        email,
        phone_number,
        industry,
        default_currency
    ) VALUES (
        v_org_name,
        v_merchant_email,
        COALESCE(v_merchant_phone, ''), -- Use merchant's phone if available
        CASE WHEN v_current_org IS NOT NULL THEN v_current_org.industry ELSE NULL END,
        CASE WHEN v_current_org IS NOT NULL THEN v_current_org.default_currency ELSE 'XOF' END
    )
    RETURNING organizations.organization_id INTO v_organization_id;

    -- If we have address info from current org, create address record
    IF v_current_org IS NOT NULL AND v_current_org.country IS NOT NULL THEN
        INSERT INTO organization_addresses (
            organization_id,
            country,
            region,
            city
        ) VALUES (
            v_organization_id,
            v_current_org.country,
            v_current_org.region,
            v_current_org.city
        );
    END IF;

    -- Generate store handle from organization name (following frontend pattern)
    v_store_handle := lower(regexp_replace(v_org_name, '[^a-zA-Z0-9]', '-', 'g')); -- Replace non-alphanumeric with dash
    v_store_handle := regexp_replace(v_store_handle, '-+', '-', 'g'); -- Replace multiple dashes with single dash
    v_store_handle := regexp_replace(v_store_handle, '^-|-$', '', 'g'); -- Remove leading/trailing dashes

    -- Ensure store handle is unique by appending a number if needed
    WHILE EXISTS (
        SELECT 1 FROM merchant_organization_links mol2
        WHERE mol2.store_handle = v_store_handle
    ) LOOP
        v_store_handle := v_store_handle || '-' || floor(random() * 1000)::text;
    END LOOP;

    -- Link merchant to organization
    INSERT INTO merchant_organization_links (
        merchant_id,
        organization_id,
        role,
        store_handle,
        team_status
    ) VALUES (
        p_merchant_id,
        v_organization_id,
        p_role,
        v_store_handle,
        'active'
    );

    -- Update organization's total_merchants count
    UPDATE organizations
    SET total_merchants = 1
    WHERE organizations.organization_id = v_organization_id;

    -- Return the result
    RETURN QUERY 
    SELECT 
        v_organization_id AS organization_id,
        v_store_handle AS store_handle;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;
