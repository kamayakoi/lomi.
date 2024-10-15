-- Function to fetch payouts for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_payouts(
    p_merchant_id UUID,
    p_statuses TEXT[] DEFAULT NULL,
    p_page_number INTEGER DEFAULT 1,
    p_page_size INTEGER DEFAULT 50
)
RETURNS TABLE (
    payout_id UUID,
    account_id UUID,
    merchant_id UUID,
    organization_id UUID,
    bank_account_id UUID,
    amount NUMERIC(10,2),
    currency_code currency_code,
    status payout_status,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.payout_id,
        p.account_id,
        p.merchant_id,
        p.organization_id,
        p.bank_account_id,
        p.amount,
        p.currency_code,
        p.status,
        p.created_at,
        p.updated_at
    FROM 
        payouts p
    WHERE 
        p.merchant_id = p_merchant_id AND
        (p_statuses IS NULL OR p.status = ANY(p_statuses::payout_status[]))
    ORDER BY
        p.created_at DESC
    LIMIT p_page_size
    OFFSET ((p_page_number - 1) * p_page_size);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch payout count for a specific merchant account
CREATE OR REPLACE FUNCTION public.fetch_payout_count(
    p_account_id UUID,
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
    v_payout_count INTEGER;
BEGIN
    SELECT 
        COUNT(*) INTO v_payout_count
    FROM 
        payouts p
    WHERE 
        p.account_id = p_account_id AND
        (p_start_date IS NULL OR p.created_at >= p_start_date) AND
        (p_end_date IS NULL OR p.created_at <= p_end_date);
        
    RETURN v_payout_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch bank accounts for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_bank_accounts(
    p_merchant_id UUID
)
RETURNS TABLE (
    bank_account_id UUID,
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
        mba.bank_account_id,
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
    FROM 
        merchant_bank_accounts mba
    WHERE 
        mba.merchant_id = p_merchant_id AND
        mba.is_valid = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to initiate a withdrawal for a specific merchant
CREATE OR REPLACE FUNCTION public.initiate_withdrawal(
    p_merchant_id UUID,
    p_amount NUMERIC(10,2),
    p_bank_account_id UUID
)
RETURNS TABLE (
    success BOOLEAN,
    message TEXT
) AS $$
DECLARE
    v_account_id UUID;
    v_organization_id UUID;
    v_balance NUMERIC(10,2);
BEGIN
    -- Get the account ID and organization ID for the merchant
    SELECT ma.account_id, mol.organization_id
    INTO v_account_id, v_organization_id
    FROM merchant_accounts ma
    JOIN merchants m ON ma.merchant_id = m.merchant_id
    JOIN merchant_organization_links mol ON m.merchant_id = mol.merchant_id
    WHERE m.merchant_id = p_merchant_id
    LIMIT 1;

    -- Check if the merchant account has sufficient balance
    SELECT ma.balance INTO v_balance
    FROM merchant_accounts ma
    WHERE ma.account_id = v_account_id;

    IF v_balance < p_amount THEN
        RETURN QUERY SELECT false, 'Insufficient balance';
        RETURN;
    END IF;

    -- Create a new payout record with 'pending' status
    INSERT INTO payouts (merchant_id, account_id, organization_id, bank_account_id, amount, currency_code, status)
    VALUES (p_merchant_id, v_account_id, v_organization_id, p_bank_account_id, p_amount, 'XOF', 'pending');

    -- Update the merchant account balance
    UPDATE merchant_accounts
    SET balance = balance - p_amount
    WHERE account_id = v_account_id;

    RETURN QUERY SELECT true, 'Withdrawal initiated successfully';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch the balance breakdown for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_balance_breakdown(
    p_merchant_id UUID
)
RETURNS TABLE (
    available_balance NUMERIC,
    pending_balance NUMERIC,
    total_balance NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COALESCE(ma.balance, 0) AS available_balance,
        COALESCE(SUM(p.amount) FILTER (WHERE p.status IN ('pending', 'processing')), 0) AS pending_balance,
        COALESCE(ma.balance, 0) + COALESCE(SUM(p.amount) FILTER (WHERE p.status IN ('pending', 'processing')), 0) AS total_balance
    FROM
        merchant_accounts ma
        JOIN merchants m ON ma.merchant_id = m.merchant_id
        LEFT JOIN payouts p ON ma.merchant_id = p.merchant_id
    WHERE
        m.merchant_id = p_merchant_id
    GROUP BY
        ma.balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;
