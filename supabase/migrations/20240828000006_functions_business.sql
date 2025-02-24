-- Function to fetch organization details
CREATE OR REPLACE FUNCTION public.fetch_organization_details(
    p_merchant_id UUID,
    p_organization_id UUID DEFAULT NULL
) RETURNS TABLE (
    organization_id UUID,
    name VARCHAR,
    email VARCHAR,
    logo_url VARCHAR,
    website_url VARCHAR,
    verified BOOLEAN,
    default_currency currency_code,
    country VARCHAR,
    region VARCHAR,
    city VARCHAR,
    district VARCHAR,
    street VARCHAR,
    postal_code VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        o.organization_id,
        o.name,
        o.email,
        o.logo_url,
        o.website_url,
        o.verified,
        o.default_currency,
        oa.country,
        oa.region,
        oa.city,
        oa.district,
        oa.street,
        oa.postal_code
    FROM 
        organizations o
    JOIN 
        merchant_organization_links mol ON o.organization_id = mol.organization_id
    LEFT JOIN 
        organization_addresses oa ON o.organization_id = oa.organization_id
    WHERE 
        mol.merchant_id = p_merchant_id
        AND (p_organization_id IS NULL OR o.organization_id = p_organization_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to update organization details
CREATE OR REPLACE FUNCTION public.update_organization_details(
    p_organization_id UUID,
    p_name VARCHAR,
    p_email VARCHAR,
    p_website_url VARCHAR,
    p_verified BOOLEAN,
    p_default_currency VARCHAR
)
RETURNS VOID AS $$
BEGIN
    UPDATE organizations
    SET 
        name = p_name,
        email = p_email,
        website_url = p_website_url,
        verified = p_verified,
        default_currency = p_default_currency::currency_code,
        updated_at = NOW()
    WHERE 
        organization_id = p_organization_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to calculate organization metrics
CREATE OR REPLACE FUNCTION public.calculate_organization_metrics(
  p_organization_id UUID
) RETURNS TABLE (
  mrr NUMERIC,
  arr NUMERIC,
  total_transactions INT,
  total_revenue NUMERIC
) LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp AS $$
BEGIN
  RETURN QUERY
  WITH org_metrics AS (
    SELECT
      COALESCE(SUM(CASE 
        WHEN s.billing_frequency = 'monthly' THEN s.amount
        WHEN s.billing_frequency = 'yearly' THEN s.amount / 12
        ELSE 0
      END), 0) as mrr,
      COALESCE(SUM(CASE 
        WHEN s.billing_frequency = 'yearly' THEN s.amount
        WHEN s.billing_frequency = 'monthly' THEN s.amount * 12
        ELSE 0
      END), 0) as arr,
      COUNT(DISTINCT t.transaction_id) as total_transactions,
      COALESCE(SUM(t.gross_amount), 0) as total_revenue
    FROM organizations o
    LEFT JOIN transactions t ON t.organization_id = o.organization_id
    LEFT JOIN merchant_subscriptions ms ON ms.merchant_id IN (
      SELECT merchant_id 
      FROM merchant_organization_links 
      WHERE organization_id = p_organization_id
    )
    LEFT JOIN subscription_plans s ON s.plan_id = ms.plan_id
    WHERE o.organization_id = p_organization_id
    AND ms.status = 'active'
  )
  SELECT * FROM org_metrics;
END;
$$;

-- Add this to supabase/migrations/20240828000006_functions_business.sql

-- Function to invite team member
CREATE OR REPLACE FUNCTION public.invite_team_member(
    p_organization_id UUID,
    p_email VARCHAR,
    p_role member_role,
    p_position VARCHAR
) RETURNS VOID AS $$
DECLARE
    v_store_handle VARCHAR;
    v_organization_name VARCHAR;
    v_invitation_token UUID;
    v_existing_user_id UUID;
BEGIN
    -- Check if the email already exists as a merchant
    SELECT merchant_id INTO v_existing_user_id
    FROM merchants
    WHERE email = p_email;
    
    -- Get organization name
    SELECT name INTO v_organization_name
    FROM organizations
    WHERE organization_id = p_organization_id;
    
    -- Generate invitation token
    v_invitation_token := gen_random_uuid();
    
    -- Generate a unique store handle
    v_store_handle := lower(regexp_replace(p_email, '@.*$', ''));
    
    -- Insert the invitation
    INSERT INTO merchant_organization_links (
        organization_id,
        merchant_id,
        invitation_email,
        role,
        team_status,
        store_handle,
        organization_position,
        invitation_token
    ) VALUES (
        p_organization_id,
        v_existing_user_id,
        CASE WHEN v_existing_user_id IS NULL THEN p_email ELSE NULL END,
        p_role,
        'invited'::team_status,
        v_store_handle,
        p_position,
        v_invitation_token
    );
    
    -- Update organization's total_merchants count
    UPDATE organizations
    SET total_merchants = total_merchants + 1
    WHERE organization_id = p_organization_id;

    -- Send invitation email using Resend
    PERFORM net.http_post(
        url:='https://api.resend.com/emails',
        headers:=jsonb_build_object(
            'Authorization', 'Bearer ' || current_setting('app.resend_api_key'),
            'Content-Type', 'application/json'
        ),
        body:=jsonb_build_object(
            'from', 'Lomi <hello@lomi.africa>',
            'to', p_email,
            'subject', 'Invitation to join ' || v_organization_name || ' on lomi.',
            'html', format(
                '<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #111827; font-size: 24px; margin-bottom: 16px;">Join %s on lomi.</h1>
                    <p style="color: #4B5563; font-size: 16px; margin-bottom: 24px;">
                        You have been invited to join %s as a %s. Click the button below to %s.
                    </p>
                    <a href="https://lomi.africa/%s/%s" 
                       style="display: inline-block; background-color: #2563EB; color: white; padding: 12px 24px; 
                              text-decoration: none; border-radius: 6px; font-weight: 500;">
                        %s
                    </a>
                    <p style="color: #6B7280; font-size: 14px; margin-top: 24px;">
                        If you did not expect this invitation, you can safely ignore this email.
                    </p>
                </div>',
                v_organization_name,
                v_organization_name,
                p_role,
                CASE 
                    WHEN v_existing_user_id IS NULL THEN 'create your account and join the organization'
                    ELSE 'accept the invitation and join the organization'
                END,
                CASE 
                    WHEN v_existing_user_id IS NULL THEN 'signup'
                    ELSE 'accept-invitation'
                END,
                v_invitation_token::text,
                CASE 
                    WHEN v_existing_user_id IS NULL THEN 'Create Account & Join'
                    ELSE 'Accept Invitation'
                END
            )
        )::text
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Add invitation_token column to merchant_organization_links if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'merchant_organization_links' 
        AND column_name = 'invitation_token'
    ) THEN
        ALTER TABLE merchant_organization_links 
        ADD COLUMN invitation_token UUID;
    END IF;
END $$;

-- Function to fetch team members
CREATE OR REPLACE FUNCTION public.fetch_team_members(
    p_organization_id UUID
) RETURNS TABLE (
    merchant_id UUID,
    merchant_name VARCHAR,
    merchant_email VARCHAR,
    role member_role,
    team_status team_status,
    organization_position VARCHAR,
    invitation_email VARCHAR,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mol.merchant_id,
        m.name as merchant_name,
        COALESCE(m.email, mol.invitation_email) as merchant_email,
        mol.role::member_role,
        mol.team_status::team_status,
        mol.organization_position,
        mol.invitation_email,
        mol.created_at
    FROM merchant_organization_links mol
    LEFT JOIN merchants m ON mol.merchant_id = m.merchant_id
    WHERE mol.organization_id = p_organization_id
    ORDER BY mol.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to update team member role
CREATE OR REPLACE FUNCTION public.update_team_member_role(
    p_organization_id UUID,
    p_merchant_id UUID,
    p_new_role member_role
) RETURNS BOOLEAN AS $$
DECLARE
    v_current_role member_role;
    v_admin_count INT;
BEGIN
    -- Get current role
    SELECT role INTO v_current_role
    FROM merchant_organization_links
    WHERE organization_id = p_organization_id 
    AND merchant_id = p_merchant_id;

    -- If changing from Admin to Member, check admin count
    IF v_current_role = 'Admin' AND p_new_role = 'Member' THEN
        SELECT COUNT(*) INTO v_admin_count
        FROM merchant_organization_links
        WHERE organization_id = p_organization_id
        AND role = 'Admin'
        AND team_status = 'active';

        -- If this is the last admin, return false
        IF v_admin_count <= 1 THEN
            RETURN false;
        END IF;
    END IF;

    -- Update the role
    UPDATE merchant_organization_links
    SET 
        role = p_new_role,
        updated_at = NOW()
    WHERE 
        organization_id = p_organization_id 
        AND merchant_id = p_merchant_id;

    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to remove team member
CREATE OR REPLACE FUNCTION public.remove_team_member(
    p_organization_id UUID,
    p_merchant_id UUID
) RETURNS VOID AS $$
BEGIN
    -- Set the status to inactive instead of deleting
    UPDATE merchant_organization_links
    SET 
        team_status = 'inactive'::team_status,
        updated_at = NOW()
    WHERE 
        organization_id = p_organization_id 
        AND merchant_id = p_merchant_id;
        
    -- Update organization's total_merchants count
    UPDATE organizations
    SET total_merchants = total_merchants - 1
    WHERE organization_id = p_organization_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_organization_admin(
    p_merchant_id UUID,
    p_organization_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
    v_is_admin BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM merchant_organization_links
        WHERE 
            merchant_id = p_merchant_id
            AND organization_id = p_organization_id
            AND role = 'Admin'
            AND team_status = 'active'
    ) INTO v_is_admin;
    
    RETURN v_is_admin;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to soft delete merchant and potentially their organization
CREATE OR REPLACE FUNCTION public.soft_delete_merchant(
    p_merchant_id UUID
) RETURNS VOID AS $$
DECLARE
    v_organization_id UUID;
    v_active_members_count INT;
    v_user_id UUID;
    v_app_metadata jsonb;
    v_user_metadata jsonb;
BEGIN
    -- Get the organization ID and count active members
    SELECT 
        mol.organization_id,
        COUNT(other_mol.merchant_id) as active_members
    INTO 
        v_organization_id,
        v_active_members_count
    FROM merchant_organization_links mol
    LEFT JOIN merchant_organization_links other_mol 
        ON mol.organization_id = other_mol.organization_id 
        AND other_mol.team_status = 'active'
        AND other_mol.merchant_id != p_merchant_id
    WHERE 
        mol.merchant_id = p_merchant_id
        AND mol.team_status = 'active'
    GROUP BY mol.organization_id;

    -- Get the auth user ID (which is the same as merchant_id in our case)
    v_user_id := p_merchant_id;

    -- Get current metadata
    SELECT raw_app_meta_data, raw_user_meta_data 
    INTO v_app_metadata, v_user_metadata
    FROM auth.users 
    WHERE id = v_user_id;

    -- Initialize metadata if NULL
    v_app_metadata := COALESCE(v_app_metadata, '{}'::jsonb);
    v_user_metadata := COALESCE(v_user_metadata, '{}'::jsonb);

    -- Update metadata with deletion flags
    v_app_metadata := v_app_metadata || jsonb_build_object(
        'is_deleted', true,
        'deleted_at', extract(epoch from now())
    );
    v_user_metadata := v_user_metadata || jsonb_build_object(
        'is_deleted', true,
        'deleted_at', extract(epoch from now())
    );

    -- Update the Supabase auth user metadata and ban status
    UPDATE auth.users 
    SET 
        raw_app_meta_data = v_app_metadata,
        raw_user_meta_data = v_user_metadata,
        banned_until = TIMESTAMP 'infinity'
    WHERE id = v_user_id;

    -- Soft delete the merchant
    UPDATE merchants
    SET 
        is_deleted = true,
        deleted_at = NOW()
    WHERE merchant_id = p_merchant_id;

    -- Set team status to inactive
    UPDATE merchant_organization_links
    SET team_status = 'inactive'
    WHERE merchant_id = p_merchant_id;

    -- If this was the last active member, soft delete the organization
    IF v_active_members_count = 0 AND v_organization_id IS NOT NULL THEN
        UPDATE organizations
        SET 
            is_deleted = true,
            deleted_at = NOW()
        WHERE organization_id = v_organization_id;
    END IF;

    -- Update organization's total_merchants count
    UPDATE organizations
    SET total_merchants = total_merchants - 1
    WHERE organization_id = v_organization_id;

    -- Revoke all active sessions for the user
    DELETE FROM auth.sessions
    WHERE user_id = v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to reactivate a soft-deleted merchant
CREATE OR REPLACE FUNCTION public.reactivate_merchant(
    p_merchant_id UUID
) RETURNS VOID AS $$
DECLARE
    v_user_id UUID;
    v_app_metadata jsonb;
    v_user_metadata jsonb;
BEGIN
    -- Get the auth user ID (which is the same as merchant_id in our case)
    v_user_id := p_merchant_id;

    -- Get current metadata
    SELECT raw_app_meta_data, raw_user_meta_data 
    INTO v_app_metadata, v_user_metadata
    FROM auth.users 
    WHERE id = v_user_id;

    -- Initialize metadata if NULL
    v_app_metadata := COALESCE(v_app_metadata, '{}'::jsonb);
    v_user_metadata := COALESCE(v_user_metadata, '{}'::jsonb);

    -- Remove deletion flags from metadata
    v_app_metadata := v_app_metadata - 'is_deleted' - 'deleted_at';
    v_user_metadata := v_user_metadata - 'is_deleted' - 'deleted_at';

    -- Re-enable the Supabase auth user with clean metadata
    UPDATE auth.users 
    SET 
        raw_app_meta_data = v_app_metadata,
        raw_user_meta_data = v_user_metadata,
        banned_until = NULL
    WHERE id = v_user_id;

    -- Reactivate the merchant
    UPDATE merchants
    SET 
        is_deleted = false,
        deleted_at = NULL
    WHERE merchant_id = p_merchant_id;

    -- Reactivate team memberships
    UPDATE merchant_organization_links
    SET team_status = 'active'
    WHERE merchant_id = p_merchant_id
    AND team_status = 'inactive';

    -- Update organization's total_merchants count
    UPDATE organizations
    SET total_merchants = total_merchants + 1
    WHERE organization_id IN (
        SELECT organization_id 
        FROM merchant_organization_links 
        WHERE merchant_id = p_merchant_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to unban a user (can be called from Supabase Auth UI)
CREATE OR REPLACE FUNCTION auth.unban_user(user_id UUID)
RETURNS void AS $$
DECLARE
    v_app_metadata jsonb;
    v_user_metadata jsonb;
BEGIN
    -- Get current metadata
    SELECT raw_app_meta_data, raw_user_meta_data 
    INTO v_app_metadata, v_user_metadata
    FROM auth.users 
    WHERE id = user_id;

    -- Initialize metadata if NULL
    v_app_metadata := COALESCE(v_app_metadata, '{}'::jsonb);
    v_user_metadata := COALESCE(v_user_metadata, '{}'::jsonb);

    -- Remove deletion flags from metadata
    v_app_metadata := v_app_metadata - 'is_deleted' - 'deleted_at';
    v_user_metadata := v_user_metadata - 'is_deleted' - 'deleted_at';

    -- Update user
    UPDATE auth.users 
    SET 
        raw_app_meta_data = v_app_metadata,
        raw_user_meta_data = v_user_metadata,
        banned_until = NULL
    WHERE id = user_id;

    -- Reactivate the merchant
    UPDATE merchants
    SET 
        is_deleted = false,
        deleted_at = NULL
    WHERE merchant_id = user_id;

    -- Reactivate team memberships
    UPDATE merchant_organization_links
    SET team_status = 'active'
    WHERE merchant_id = user_id
    AND team_status = 'inactive';

    -- Update organization's total_merchants count for all affected organizations
    UPDATE organizations o
    SET total_merchants = total_merchants + 1
    WHERE organization_id IN (
        SELECT organization_id 
        FROM merchant_organization_links 
        WHERE merchant_id = user_id
    )
    AND EXISTS (
        SELECT 1 
        FROM merchant_organization_links mol 
        WHERE mol.organization_id = o.organization_id 
        AND mol.merchant_id = user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Grant execute permission to service_role (needed for Supabase UI)
GRANT EXECUTE ON FUNCTION auth.unban_user(UUID) TO service_role;