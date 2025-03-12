-- Deploy the monthly statement generation system
-- This ensures that all merchants will have monthly statements generated automatically

-- First, verify that the generate_monthly_platform_invoice function exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
        AND p.proname = 'generate_monthly_platform_invoice'
    ) THEN
        RAISE EXCEPTION 'The generate_monthly_platform_invoice function does not exist. Please run the 20240828000003_billing_functions.sql migration first.';
    END IF;
END
$$;

-- Comment to document the automatic monthly statement system
COMMENT ON FUNCTION generate_monthly_platform_invoice IS 'Generates a monthly platform invoice for a merchant with fees calculated from the current month. Used by the monthly-statements Edge Function scheduled to run on the 25th of each month.';

-- Check if platform_configuration table exists, create it if not
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'platform_configuration'
    ) THEN
        CREATE TABLE platform_configuration (
            config_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            config_key TEXT UNIQUE NOT NULL,
            config_value JSONB NOT NULL,
            description TEXT,
            is_public BOOLEAN NOT NULL DEFAULT false,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        
        COMMENT ON TABLE platform_configuration IS 'Stores platform-wide configuration settings';
    END IF;
END
$$;

-- Insert a configuration record to document and track the automated process
INSERT INTO platform_configuration (
    config_key,
    config_value,
    description,
    is_public
) VALUES (
    'monthly_statement_generation',
    jsonb_build_object(
        'enabled', true,
        'schedule', '0 0 25 * *',
        'last_updated', CURRENT_TIMESTAMP
    ),
    'Configuration for the automated monthly statement generation process that runs on the 25th of each month',
    true
) ON CONFLICT (config_key) DO UPDATE
SET 
    config_value = jsonb_build_object(
        'enabled', true,
        'schedule', '0 0 25 * *',
        'last_updated', CURRENT_TIMESTAMP
    ),
    description = 'Configuration for the automated monthly statement generation process that runs on the 25th of each month',
    updated_at = CURRENT_TIMESTAMP;

-- Create a test function to manually trigger a statement generation for all merchants
-- This can be used by administrators for testing or to manually generate statements if needed
CREATE OR REPLACE FUNCTION admin_generate_all_monthly_statements()
RETURNS TABLE (
    merchant_id UUID,
    platform_invoice_id UUID,
    status TEXT
) AS $$
DECLARE
    v_merchant RECORD;
    v_result UUID;
    v_status TEXT;
BEGIN
    FOR v_merchant IN 
        SELECT m.merchant_id
        FROM merchants m
        WHERE m.is_deleted = false
    LOOP
        BEGIN
            SELECT generate_monthly_platform_invoice(v_merchant.merchant_id) INTO v_result;
            v_status := 'success';
        EXCEPTION WHEN OTHERS THEN
            v_result := NULL;
            v_status := 'error: ' || SQLERRM;
        END;
        
        merchant_id := v_merchant.merchant_id;
        platform_invoice_id := v_result;
        status := v_status;
        RETURN NEXT;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public; 