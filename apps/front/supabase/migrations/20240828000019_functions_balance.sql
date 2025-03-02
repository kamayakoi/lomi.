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
DECLARE
    v_organization_id UUID;
BEGIN
    -- Get the organization ID for the merchant
    SELECT mol.organization_id INTO v_organization_id
    FROM merchant_organization_links mol
    WHERE mol.merchant_id = p_merchant_id
    LIMIT 1;

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
        p.organization_id = v_organization_id AND
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
    v_organization_id UUID;
    v_merchant_id UUID;
BEGIN
    -- Get the merchant ID and organization ID for the account
    SELECT ma.merchant_id, ma.organization_id
    INTO v_merchant_id, v_organization_id
    FROM merchant_accounts ma
    WHERE ma.account_id = p_account_id
    LIMIT 1;

    SELECT 
        COUNT(*) INTO v_payout_count
    FROM 
        payouts p
    WHERE 
        p.account_id = p_account_id AND
        p.merchant_id = v_merchant_id AND
        p.organization_id = v_organization_id AND
        (p_start_date IS NULL OR p.created_at >= p_start_date) AND
        (p_end_date IS NULL OR p.created_at <= p_end_date);
        
    RETURN v_payout_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch bank accounts for a specific merchant
CREATE OR REPLACE FUNCTION public.fetch_merchant_bank_accounts(
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
DECLARE
    v_organization_id UUID;
BEGIN
    -- Get the organization ID for the merchant
    SELECT mol.organization_id INTO v_organization_id
    FROM merchant_organization_links mol
    WHERE mol.merchant_id = p_merchant_id
    LIMIT 1;

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
        mba.organization_id = v_organization_id AND
        mba.is_valid = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to initiate a withdrawal for a specific merchant
CREATE OR REPLACE FUNCTION public.initiate_withdrawal(
    p_merchant_id UUID,
    p_amount NUMERIC(10,2),
    p_bank_account_id UUID,
    p_currency_code currency_code DEFAULT 'XOF'
)
RETURNS TABLE (
    success BOOLEAN,
    message TEXT
) AS $$
DECLARE
    v_account_id UUID;
    v_organization_id UUID;
    v_balance NUMERIC(10,2);
    v_account_currency currency_code;
    v_converted_amount NUMERIC(10,2);
    v_conversion_rate NUMERIC(10,8);
    v_latest_rates RECORD;
BEGIN
    -- Get the account ID and organization ID for the merchant
    SELECT ma.account_id, ma.organization_id, ma.currency_code, ma.balance
    INTO v_account_id, v_organization_id, v_account_currency, v_balance
    FROM merchant_accounts ma
    WHERE ma.merchant_id = p_merchant_id
    AND ma.currency_code = p_currency_code
    LIMIT 1;

    -- Check if the merchant account exists for the specified currency
    IF v_account_id IS NULL THEN
        -- Try to find an account in any currency
        SELECT ma.account_id, ma.organization_id, ma.currency_code, ma.balance
        INTO v_account_id, v_organization_id, v_account_currency, v_balance
        FROM merchant_accounts ma
        WHERE ma.merchant_id = p_merchant_id
        LIMIT 1;

        IF v_account_id IS NULL THEN
            RETURN QUERY SELECT false, 'No account found for the merchant';
            RETURN;
        END IF;

        -- Get latest conversion rates
        SELECT * INTO v_latest_rates FROM fetch_latest_conversion_rates();

        -- Convert the withdrawal amount to account's currency
        IF p_currency_code = 'USD' AND v_account_currency = 'XOF' THEN
            v_converted_amount := p_amount * v_latest_rates.usd_to_xof;
            v_conversion_rate := v_latest_rates.usd_to_xof;
        ELSIF p_currency_code = 'XOF' AND v_account_currency = 'USD' THEN
            v_converted_amount := p_amount * v_latest_rates.xof_to_usd;
            v_conversion_rate := v_latest_rates.xof_to_usd;
        ELSE
            v_converted_amount := p_amount;
            v_conversion_rate := 1;
        END IF;
    ELSE
        v_converted_amount := p_amount;
        v_conversion_rate := 1;
    END IF;

    -- Check if the merchant account has sufficient balance
    IF v_balance < v_converted_amount THEN
        RETURN QUERY SELECT false, 'Insufficient balance';
        RETURN;
    END IF;

    -- Create a new payout record with 'pending' status
    INSERT INTO payouts (
        merchant_id, 
        account_id, 
        organization_id, 
        bank_account_id, 
        amount, 
        currency_code, 
        status,
        conversion_rate,
        converted_amount,
        original_currency
    )
    VALUES (
        p_merchant_id, 
        v_account_id, 
        v_organization_id, 
        p_bank_account_id, 
        p_amount, 
        p_currency_code, 
        'pending',
        v_conversion_rate,
        v_converted_amount,
        v_account_currency
    );

    -- Update the merchant account balance
    UPDATE merchant_accounts
    SET balance = balance - v_converted_amount
    WHERE account_id = v_account_id;

    -- Log the currency conversion
    IF v_conversion_rate != 1 THEN
        INSERT INTO currency_conversion_history (
            merchant_id,
            organization_id,
            from_currency,
            to_currency,
            original_amount,
            converted_amount,
            conversion_rate,
            conversion_type,
            payout_id
        )
        VALUES (
            p_merchant_id,
            v_organization_id,
            p_currency_code,
            v_account_currency,
            p_amount,
            v_converted_amount,
            v_conversion_rate,
            'withdrawal',
            (SELECT currval('payouts_payout_id_seq'))
        );
    END IF;

    RETURN QUERY SELECT true, 'Withdrawal initiated successfully';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to fetch the balance breakdown for a specific merchant with currency conversion
CREATE OR REPLACE FUNCTION public.fetch_balance_breakdown(
    p_merchant_id UUID,
    p_target_currency currency_code DEFAULT NULL
)
RETURNS TABLE (
    currency_code currency_code,
    available_balance NUMERIC,
    pending_balance NUMERIC,
    total_balance NUMERIC,
    converted_available_balance NUMERIC,
    converted_pending_balance NUMERIC,
    converted_total_balance NUMERIC,
    target_currency currency_code
) AS $$
DECLARE
    v_organization_id UUID;
    v_xof_to_usd NUMERIC(20,8);
    v_usd_to_xof NUMERIC(20,8);
BEGIN
    -- Get the organization ID for the merchant
    SELECT mol.organization_id INTO v_organization_id
    FROM merchant_organization_links mol
    WHERE mol.merchant_id = p_merchant_id
    LIMIT 1;

    -- Get XOF to USD conversion rate
    SELECT rate INTO v_xof_to_usd
    FROM currency_conversion_rates
    WHERE from_currency = 'XOF' AND to_currency = 'USD'
    ORDER BY created_at DESC
    LIMIT 1;

    -- Get USD to XOF conversion rate
    SELECT rate INTO v_usd_to_xof
    FROM currency_conversion_rates
    WHERE from_currency = 'USD' AND to_currency = 'XOF'
    ORDER BY created_at DESC
    LIMIT 1;

    RETURN QUERY
    WITH balances AS (
        SELECT
            ma.currency_code,
            COALESCE(ma.balance, 0) AS available_balance,
            COALESCE(SUM(p.amount) FILTER (WHERE p.status IN ('pending', 'processing')), 0) AS pending_balance,
            COALESCE(ma.balance, 0) + COALESCE(SUM(p.amount) FILTER (WHERE p.status IN ('pending', 'processing')), 0) AS total_balance
        FROM
            merchant_accounts ma
            LEFT JOIN payouts p ON ma.merchant_id = p.merchant_id 
                AND p.organization_id = v_organization_id 
                AND p.currency_code = ma.currency_code
        WHERE
            ma.merchant_id = p_merchant_id AND
            ma.organization_id = v_organization_id
        GROUP BY
            ma.currency_code, ma.balance
    )
    SELECT
        b.currency_code,
        b.available_balance,
        b.pending_balance,
        b.total_balance,
        CASE
            WHEN p_target_currency = 'USD' AND b.currency_code = 'XOF' THEN
                b.available_balance * v_xof_to_usd
            WHEN p_target_currency = 'XOF' AND b.currency_code = 'USD' THEN
                b.available_balance * v_usd_to_xof
            ELSE b.available_balance
        END AS converted_available_balance,
        CASE
            WHEN p_target_currency = 'USD' AND b.currency_code = 'XOF' THEN
                b.pending_balance * v_xof_to_usd
            WHEN p_target_currency = 'XOF' AND b.currency_code = 'USD' THEN
                b.pending_balance * v_usd_to_xof
            ELSE b.pending_balance
        END AS converted_pending_balance,
        CASE
            WHEN p_target_currency = 'USD' AND b.currency_code = 'XOF' THEN
                b.total_balance * v_xof_to_usd
            WHEN p_target_currency = 'XOF' AND b.currency_code = 'USD' THEN
                b.total_balance * v_usd_to_xof
            ELSE b.total_balance
        END AS converted_total_balance,
        COALESCE(p_target_currency, b.currency_code) AS target_currency
    FROM balances b;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Create function to fetch latest conversion rates
CREATE OR REPLACE FUNCTION public.fetch_latest_conversion_rates(
    p_from_currency currency_code DEFAULT NULL,
    p_to_currency currency_code DEFAULT NULL
)
RETURNS TABLE (
    from_currency currency_code,
    to_currency currency_code,
    rate NUMERIC(20,8),
    inverse_rate NUMERIC(20,8),
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ccr.from_currency,
        ccr.to_currency,
        ccr.rate,
        ccr.inverse_rate,
        ccr.created_at
    FROM 
        currency_conversion_rates ccr
    WHERE 
        (p_from_currency IS NULL OR ccr.from_currency = p_from_currency) AND
        (p_to_currency IS NULL OR ccr.to_currency = p_to_currency)
    ORDER BY
        ccr.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to save conversion rates
CREATE OR REPLACE FUNCTION public.save_conversion_rates(
    p_from_currency currency_code,
    p_to_currency currency_code,
    p_rate NUMERIC(20,8)
) RETURNS TABLE (success BOOLEAN, message TEXT) AS $$
BEGIN
    INSERT INTO currency_conversion_rates (
        from_currency, 
        to_currency, 
        rate, 
        inverse_rate
    )
    VALUES (
        p_from_currency, 
        p_to_currency, 
        p_rate, 
        1 / p_rate
    )
    ON CONFLICT (from_currency, to_currency) 
    DO UPDATE SET 
        rate = EXCLUDED.rate,
        inverse_rate = EXCLUDED.inverse_rate,
        updated_at = NOW();

    -- Also insert/update the inverse pair
    INSERT INTO currency_conversion_rates (
        from_currency, 
        to_currency, 
        rate, 
        inverse_rate
    )
    VALUES (
        p_to_currency, 
        p_from_currency, 
        1 / p_rate, 
        p_rate
    )
    ON CONFLICT (from_currency, to_currency) 
    DO UPDATE SET 
        rate = EXCLUDED.rate,
        inverse_rate = EXCLUDED.inverse_rate,
        updated_at = NOW();

    RETURN QUERY SELECT true, 'Conversion rates saved successfully';
EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT false, 'Failed to save conversion rates: ' || SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Function to convert currency
CREATE OR REPLACE FUNCTION public.convert_currency(
    p_amount NUMERIC,
    p_from_currency currency_code,
    p_to_currency currency_code,
    p_merchant_id UUID DEFAULT NULL,
    p_organization_id UUID DEFAULT NULL,
    p_conversion_type conversion_type DEFAULT 'manual',
    p_reference_id UUID DEFAULT NULL
) RETURNS NUMERIC AS $$
DECLARE
    v_rate NUMERIC;
    v_converted_amount NUMERIC;
    v_conversion_rate RECORD;
BEGIN
    -- If same currency, return original amount
    IF p_from_currency = p_to_currency THEN
        RETURN p_amount;
    END IF;

    -- Get conversion rate
    SELECT rate INTO v_rate
    FROM currency_conversion_rates
    WHERE from_currency = p_from_currency 
    AND to_currency = p_to_currency
    ORDER BY created_at DESC
    LIMIT 1;

    -- If direct rate not found, try to find inverse rate
    IF v_rate IS NULL THEN
        SELECT inverse_rate INTO v_rate
        FROM currency_conversion_rates
        WHERE from_currency = p_to_currency 
        AND to_currency = p_from_currency
        ORDER BY created_at DESC
        LIMIT 1;
    END IF;

    -- If still no rate found, raise an exception
    IF v_rate IS NULL THEN
        RAISE EXCEPTION 'No conversion rate found for pair: % to %', p_from_currency, p_to_currency;
    END IF;

    v_converted_amount := p_amount * v_rate;

    -- Log conversion if merchant_id and organization_id are provided
    IF p_merchant_id IS NOT NULL AND p_organization_id IS NOT NULL THEN
        INSERT INTO currency_conversion_history (
            merchant_id,
            organization_id,
            from_currency,
            to_currency,
            original_amount,
            converted_amount,
            conversion_rate,
            conversion_type,
            payout_id,
            transaction_id,
            refund_id
        )
        VALUES (
            p_merchant_id,
            p_organization_id,
            p_from_currency,
            p_to_currency,
            p_amount,
            v_converted_amount,
            v_rate,
            p_conversion_type,
            CASE WHEN p_conversion_type = 'withdrawal' THEN p_reference_id ELSE NULL END,
            CASE WHEN p_conversion_type = 'payment' THEN p_reference_id ELSE NULL END,
            CASE WHEN p_conversion_type = 'refund' THEN p_reference_id ELSE NULL END
        );
    END IF;

    RETURN v_converted_amount;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Add trigger for updated_at
CREATE TRIGGER update_currency_conversion_rates_updated_at
    BEFORE UPDATE ON currency_conversion_rates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_currency_conversion_history_updated_at
    BEFORE UPDATE ON currency_conversion_history
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT SELECT ON public.currency_conversion_rates TO authenticated;
GRANT SELECT ON public.currency_conversion_history TO authenticated;
GRANT EXECUTE ON FUNCTION public.fetch_balance_breakdown(UUID, currency_code) TO authenticated;
GRANT EXECUTE ON FUNCTION public.fetch_latest_conversion_rates(currency_code, currency_code) TO authenticated;
GRANT EXECUTE ON FUNCTION public.save_conversion_rates(currency_code, currency_code, NUMERIC) TO authenticated;
GRANT EXECUTE ON FUNCTION public.convert_currency(NUMERIC, currency_code, currency_code, UUID, UUID, conversion_type, UUID) TO authenticated;
