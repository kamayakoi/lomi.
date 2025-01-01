-- Function to create a new bank account
CREATE OR REPLACE FUNCTION public.create_bank_account(
    p_account_number VARCHAR,
    p_account_name VARCHAR,
    p_bank_name VARCHAR,
    p_bank_code VARCHAR,
    p_branch_code VARCHAR,
    p_country VARCHAR,
    p_is_default BOOLEAN
)
RETURNS UUID AS $$
DECLARE
    v_merchant_id UUID;
    v_bank_account_id UUID;
BEGIN
    SELECT merchant_id INTO v_merchant_id
    FROM merchants
    WHERE merchant_id = auth.uid();

    INSERT INTO merchant_bank_accounts (
        merchant_id, account_number, account_name, bank_name, bank_code, branch_code, country, is_default, is_valid
    )
    VALUES (
        v_merchant_id, p_account_number, p_account_name, p_bank_name, p_bank_code, p_branch_code, p_country, p_is_default, false
    )
    RETURNING bank_account_id INTO v_bank_account_id;

    -- Log bank account creation (only for critical changes)
    PERFORM public.log_event(
        p_merchant_id := v_merchant_id,
        p_event := 'add_bank_account'::event_type,
        p_details := jsonb_build_object(
            'bank_account_id', v_bank_account_id,
            'bank_name', p_bank_name,
            'account_name', p_account_name,
            'is_default', p_is_default
        ),
        p_severity := 'CRITICAL'
    );

    RETURN v_bank_account_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch bank accounts for the authenticated merchant
CREATE OR REPLACE FUNCTION public.fetch_bank_accounts()
RETURNS TABLE (
    id UUID,
    account_number VARCHAR,
    account_name VARCHAR,
    bank_name VARCHAR,
    bank_code VARCHAR,
    branch_code VARCHAR,
    country VARCHAR,
    is_default BOOLEAN,
    is_valid BOOLEAN,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        mba.bank_account_id AS id,
        mba.account_number,
        mba.account_name,
        mba.bank_name,
        mba.bank_code,
        mba.branch_code,
        mba.country,
        mba.is_default,
        mba.is_valid,
        mba.created_at,
        mba.updated_at
    FROM merchant_bank_accounts mba
    WHERE mba.merchant_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to delete a bank account
CREATE OR REPLACE FUNCTION public.delete_bank_account(p_bank_account_id UUID)
RETURNS VOID AS $$
DECLARE
    v_merchant_id UUID;
    v_bank_name VARCHAR;
    v_account_name VARCHAR;
BEGIN
    -- Get bank account details before deletion for logging
    SELECT merchant_id, bank_name, account_name
    INTO v_merchant_id, v_bank_name, v_account_name
    FROM merchant_bank_accounts
    WHERE bank_account_id = p_bank_account_id
    AND merchant_id = auth.uid();

    -- Only proceed if the bank account belongs to the authenticated user
    IF v_merchant_id IS NOT NULL THEN
        DELETE FROM merchant_bank_accounts
        WHERE bank_account_id = p_bank_account_id
        AND merchant_id = auth.uid();

        -- Log bank account deletion (only for critical changes)
        PERFORM public.log_event(
            p_merchant_id := v_merchant_id,
            p_event := 'remove_bank_account'::event_type,
            p_details := jsonb_build_object(
                'bank_account_id', p_bank_account_id,
                'bank_name', v_bank_name,
                'account_name', v_account_name
            ),
            p_severity := 'CRITICAL'
        );
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.create_bank_account(VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION public.fetch_bank_accounts() TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_bank_account(UUID) TO authenticated;
