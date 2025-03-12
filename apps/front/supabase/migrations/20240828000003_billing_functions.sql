-- Function to get fees and outstanding balance
CREATE OR REPLACE FUNCTION get_merchant_platform_fees(
    p_merchant_id UUID
)
RETURNS TABLE (
    last_30_days_fees NUMERIC,
    last_month_fees NUMERIC,
    outstanding_balance NUMERIC,
    organization_id UUID
) AS $$
DECLARE
    v_organization_id UUID;
BEGIN
    -- Get the organization_id for the merchant
    SELECT mol.organization_id INTO v_organization_id
    FROM merchant_organization_links mol
    WHERE mol.merchant_id = p_merchant_id
    LIMIT 1;

    RETURN QUERY
    WITH monthly_fees AS (
        SELECT 
            DATE_TRUNC('month', t.created_at) as month,
            SUM(t.fee_amount) as fees
        FROM transactions t
        WHERE t.merchant_id = p_merchant_id
        AND t.organization_id = v_organization_id
        AND t.status = 'completed'
        AND t.currency_code = 'XOF'
        AND t.created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
        GROUP BY DATE_TRUNC('month', t.created_at)
    )
    SELECT 
        -- Last 30 days fees
        COALESCE((
            SELECT SUM(t.fee_amount)
            FROM transactions t
            WHERE t.merchant_id = p_merchant_id
            AND t.organization_id = v_organization_id
            AND t.status = 'completed'
            AND t.currency_code = 'XOF'
            AND t.created_at >= CURRENT_DATE - INTERVAL '30 days'
        ), 0) as last_30_days_fees,
        -- Last month fees
        COALESCE((
            SELECT fees
            FROM monthly_fees
            WHERE month = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
        ), 0) as last_month_fees,
        -- Outstanding balance
        COALESCE((
            SELECT mob.amount
            FROM merchant_outstanding_balance mob
            WHERE mob.merchant_id = p_merchant_id
            AND mob.organization_id = v_organization_id
            AND mob.currency_code = 'XOF'
        ), 0) as outstanding_balance,
        v_organization_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to fetch billing statements with monthly fees and outstanding balance
CREATE OR REPLACE FUNCTION fetch_billing_statements(
    p_merchant_id UUID
)
RETURNS TABLE (
    platform_invoice_id UUID,
    merchant_id UUID,
    organization_id UUID,
    monthly_fees NUMERIC,
    outstanding_balance NUMERIC,
    total_amount NUMERIC,
    description TEXT,
    currency_code currency_code,
    invoice_date DATE,
    status invoice_status,
    created_at TIMESTAMPTZ,
    metadata JSONB
) AS $$
DECLARE
    v_organization_id UUID;
BEGIN
    -- Get the organization_id for the merchant
    SELECT mol.organization_id INTO v_organization_id
    FROM merchant_organization_links mol
    WHERE mol.merchant_id = p_merchant_id
    LIMIT 1;

    -- Return the combined result
    RETURN QUERY
    WITH monthly_fees AS (
        SELECT 
            DATE_TRUNC('month', t.created_at) as month,
            SUM(t.fee_amount) as total_fees
        FROM transactions t
        WHERE t.merchant_id = p_merchant_id
        AND t.organization_id = v_organization_id
        AND t.status = 'completed'
        AND t.currency_code = 'XOF'
        GROUP BY DATE_TRUNC('month', t.created_at)
    ), outstanding AS (
        SELECT mob.amount as outstanding_amount
        FROM merchant_outstanding_balance mob
        WHERE mob.merchant_id = p_merchant_id
        AND mob.organization_id = v_organization_id
        AND mob.currency_code = 'XOF'
    )
    SELECT 
        pi.platform_invoice_id,
        pi.merchant_id,
        pi.organization_id,
        COALESCE(mf.total_fees, 0) as monthly_fees,
        COALESCE(o.outstanding_amount, 0) as outstanding_balance,
        COALESCE(mf.total_fees, 0) + COALESCE(o.outstanding_amount, 0) as total_amount,
        COALESCE(pi.description, 'Platform Fees for ' || TO_CHAR(pi.created_at, 'Month YYYY')) as description,
        pi.currency_code,
        pi.due_date as invoice_date,
        pi.status,
        pi.created_at,
        pi.metadata
    FROM platform_invoices pi
    LEFT JOIN monthly_fees mf ON DATE_TRUNC('month', pi.created_at) = mf.month
    LEFT JOIN outstanding o ON true
    WHERE pi.merchant_id = p_merchant_id
    AND pi.organization_id = v_organization_id
    ORDER BY pi.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to generate monthly platform invoice (to be run on the 25th of each month)
CREATE OR REPLACE FUNCTION generate_monthly_platform_invoice(
    p_merchant_id UUID
)
RETURNS UUID AS $$
DECLARE
    v_organization_id UUID;
    v_invoice_id UUID;
    v_monthly_fees NUMERIC;
    v_outstanding_balance NUMERIC;
    v_previous_month_start DATE;
    v_previous_month_end DATE;
BEGIN
    -- Get the organization_id
    SELECT organization_id INTO v_organization_id
    FROM merchant_organization_links
    WHERE merchant_id = p_merchant_id
    LIMIT 1;

    -- Calculate the previous month's date range
    v_previous_month_start := DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month');
    v_previous_month_end := DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 day';

    -- Calculate total fees for the previous month
    SELECT COALESCE(SUM(fee_amount), 0)
    INTO v_monthly_fees
    FROM transactions
    WHERE merchant_id = p_merchant_id
    AND organization_id = v_organization_id
    AND status = 'completed'
    AND currency_code = 'XOF'
    AND created_at >= v_previous_month_start
    AND created_at <= v_previous_month_end;

    -- Get current outstanding balance
    SELECT COALESCE(amount, 0)
    INTO v_outstanding_balance
    FROM merchant_outstanding_balance
    WHERE merchant_id = p_merchant_id
    AND organization_id = v_organization_id
    AND currency_code = 'XOF';

    -- Create the invoice with both fees and outstanding balance
    INSERT INTO platform_invoices (
        merchant_id,
        organization_id,
        amount,
        description,
        currency_code,
        due_date,
        status,
        metadata
    ) VALUES (
        p_merchant_id,
        v_organization_id,
        v_monthly_fees + v_outstanding_balance,
        'Platform Fees for ' || TO_CHAR(v_previous_month_start, 'Month YYYY'),
        'XOF',
        CURRENT_DATE + INTERVAL '15 days',
        CASE 
            WHEN v_outstanding_balance > 0 THEN 'sent'::invoice_status
            ELSE 'paid'::invoice_status
        END,
        jsonb_build_object(
            'invoice_date', CURRENT_DATE,
            'fee_period_start', v_previous_month_start,
            'fee_period_end', v_previous_month_end,
            'monthly_fees', v_monthly_fees,
            'outstanding_balance', v_outstanding_balance
        )
    )
    RETURNING platform_invoice_id INTO v_invoice_id;

    RETURN v_invoice_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to generate PDF for a statement and store it in the platform-invoices bucket
CREATE OR REPLACE FUNCTION generate_statement_pdf(
    p_invoice_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    v_statement RECORD;
    v_transactions RECORD;
    v_merchant_name TEXT;
    v_organization_name TEXT;
    v_pdf_content BYTEA;
    v_transaction_details JSONB = '[]'::JSONB;
    v_start_date DATE;
    v_end_date DATE;
BEGIN
    -- Get statement details
    SELECT 
        pi.*,
        pi.metadata->>'fee_period_start' AS fee_period_start,
        pi.metadata->>'fee_period_end' AS fee_period_end,
        pi.metadata->>'monthly_fees' AS monthly_fees,
        pi.metadata->>'outstanding_balance' AS outstanding_balance
    INTO v_statement
    FROM platform_invoices pi
    WHERE pi.platform_invoice_id = p_invoice_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Statement with ID % not found', p_invoice_id;
    END IF;
    
    -- Get merchant and organization names
    SELECT m.name INTO v_merchant_name
    FROM merchants m
    WHERE m.merchant_id = v_statement.merchant_id;
    
    SELECT o.name INTO v_organization_name
    FROM organizations o
    WHERE o.organization_id = v_statement.organization_id;
    
    -- Parse dates
    v_start_date := (v_statement.fee_period_start)::DATE;
    v_end_date := (v_statement.fee_period_end)::DATE;
    
    -- Get transaction details for the period
    FOR v_transactions IN 
        SELECT 
            t.transaction_id,
            t.created_at,
            t.description,
            t.gross_amount,
            t.fee_amount,
            t.net_amount,
            t.provider_code,
            t.payment_method_code,
            t.status
        FROM transactions t
        WHERE t.merchant_id = v_statement.merchant_id
        AND t.organization_id = v_statement.organization_id
        AND t.status = 'completed'
        AND t.created_at >= v_start_date
        AND t.created_at <= v_end_date
        ORDER BY t.created_at
    LOOP
        -- Add transaction to the JSON array
        v_transaction_details := v_transaction_details || jsonb_build_object(
            'transaction_id', v_transactions.transaction_id,
            'date', TO_CHAR(v_transactions.created_at, 'YYYY-MM-DD'),
            'description', v_transactions.description,
            'gross_amount', v_transactions.gross_amount,
            'fee_amount', v_transactions.fee_amount,
            'net_amount', v_transactions.net_amount,
            'provider', v_transactions.provider_code,
            'payment_method', v_transactions.payment_method_code,
            'status', v_transactions.status
        );
    END LOOP;
    
    -- Create a JSON object with all the data needed for the PDF
    v_pdf_content := jsonb_build_object(
        'invoice_id', v_statement.platform_invoice_id,
        'merchant_id', v_statement.merchant_id,
        'merchant_name', v_merchant_name,
        'organization_id', v_statement.organization_id,
        'organization_name', v_organization_name,
        'invoice_date', TO_CHAR(v_statement.due_date, 'YYYY-MM-DD'),
        'period_start', TO_CHAR(v_start_date, 'YYYY-MM-DD'),
        'period_end', TO_CHAR(v_end_date, 'YYYY-MM-DD'),
        'monthly_fees', v_statement.monthly_fees,
        'outstanding_balance', v_statement.outstanding_balance,
        'total_amount', v_statement.amount,
        'currency_code', v_statement.currency_code,
        'status', v_statement.status,
        'transactions', v_transaction_details
    )::TEXT::BYTEA;
    
    -- Store the JSON data in the platform-invoices bucket
    -- This will be processed by an Edge Function to generate the actual PDF
    PERFORM storage.upload(
        'platform-invoices',
        v_statement.platform_invoice_id || '.json',
        v_pdf_content
    );
    
    -- Return success
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RAISE;
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to generate monthly statements for all merchants
CREATE OR REPLACE FUNCTION generate_monthly_statements_for_all_merchants()
RETURNS TABLE (
    merchant_id UUID,
    invoice_id UUID,
    success BOOLEAN
) AS $$
DECLARE
    v_merchant RECORD;
    v_invoice_id UUID;
    v_success BOOLEAN;
BEGIN
    -- Loop through all active merchants
    FOR v_merchant IN 
        SELECT DISTINCT m.merchant_id
        FROM merchants m
        JOIN merchant_organization_links mol ON m.merchant_id = mol.merchant_id
        WHERE m.is_deleted = FALSE
        AND mol.team_status = 'active'
    LOOP
        BEGIN
            -- Generate monthly invoice for this merchant
            SELECT generate_monthly_platform_invoice(v_merchant.merchant_id) INTO v_invoice_id;
            
            -- Generate PDF for the invoice
            SELECT generate_statement_pdf(v_invoice_id) INTO v_success;
            
            -- Return the result
            merchant_id := v_merchant.merchant_id;
            invoice_id := v_invoice_id;
            success := v_success;
            RETURN NEXT;
        EXCEPTION
            WHEN OTHERS THEN
                -- Log error but continue with next merchant
                merchant_id := v_merchant.merchant_id;
                invoice_id := NULL;
                success := FALSE;
                RETURN NEXT;
        END;
    END LOOP;
    
    RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public; 