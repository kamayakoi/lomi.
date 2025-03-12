-- Function to generate statements for a specific month
CREATE OR REPLACE FUNCTION public.generate_invoice_for_past_month(
    p_merchant_id UUID,
    p_year INT,
    p_month INT
) 
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_organization_id UUID;
    v_invoice_id UUID;
    v_monthly_fees NUMERIC;
    v_outstanding_balance NUMERIC;
    v_start_date TIMESTAMPTZ;
    v_end_date TIMESTAMPTZ;
BEGIN
    -- Get the organization_id
    SELECT mol.organization_id INTO v_organization_id
    FROM merchant_organization_links mol
    WHERE mol.merchant_id = p_merchant_id
    LIMIT 1;

    -- If no organization link exists, throw an error
    IF v_organization_id IS NULL THEN
        RAISE EXCEPTION 'No organization found for merchant %', p_merchant_id;
    END IF;

    -- Calculate date range for the specified month
    v_start_date := make_date(p_year, p_month, 1)::TIMESTAMPTZ;
    v_end_date := (make_date(p_year, p_month, 1) + INTERVAL '1 month')::TIMESTAMPTZ;

    -- Calculate total fees for the specified month
    SELECT COALESCE(SUM(t.fee_amount), 0)
    INTO v_monthly_fees
    FROM transactions t
    WHERE t.merchant_id = p_merchant_id
    AND t.organization_id = v_organization_id
    AND t.status = 'completed'
    AND t.currency_code = 'XOF'
    AND t.created_at >= v_start_date
    AND t.created_at < v_end_date;

    -- Get current outstanding balance (using the current value, as historical records might not exist)
    SELECT COALESCE(mob.amount, 0)
    INTO v_outstanding_balance
    FROM merchant_outstanding_balance mob
    WHERE mob.merchant_id = p_merchant_id
    AND mob.organization_id = v_organization_id
    AND mob.currency_code = 'XOF';

    -- Check if a statement already exists for this month/year
    PERFORM 1 
    FROM platform_invoices pi
    WHERE pi.merchant_id = p_merchant_id
    AND pi.organization_id = v_organization_id
    AND pi.metadata->>'fee_period_start' = v_start_date::DATE::TEXT;

    -- If a statement already exists, throw an error
    IF FOUND THEN
        RAISE EXCEPTION 'Statement already exists for merchant % for % %', 
            p_merchant_id, to_char(v_start_date, 'Month'), p_year;
    END IF;

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
        GREATEST(v_monthly_fees + v_outstanding_balance, 0.01), -- Ensure amount is positive
        'Platform Fees for ' || TO_CHAR(v_start_date, 'Month YYYY'),
        'XOF',
        v_end_date::DATE,
        CASE 
            WHEN v_outstanding_balance > 0 THEN 'sent'::invoice_status
            ELSE 'paid'::invoice_status
        END,
        jsonb_build_object(
            'invoice_date', v_start_date::DATE,
            'fee_period_start', v_start_date::DATE,
            'fee_period_end', (v_end_date - INTERVAL '1 day')::DATE,
            'monthly_fees', v_monthly_fees,
            'outstanding_balance', v_outstanding_balance,
            'retroactively_generated', true
        )
    )
    RETURNING platform_invoice_id INTO v_invoice_id;

    RETURN v_invoice_id;
END;
$$;

-- Function to generate statements for all merchants for the current month
-- This bypasses RLS and can be used by the Edge Function
CREATE OR REPLACE FUNCTION public.admin_generate_statements_for_all_merchants()
RETURNS TABLE (
    merchant_id UUID,
    invoice_id UUID,
    status TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_merchant RECORD;
    v_result UUID;
    v_status TEXT;
    v_org_id UUID;
    v_monthly_fees NUMERIC;
    v_outstanding_balance NUMERIC;
    v_merchant_id UUID;
BEGIN
    FOR v_merchant IN 
        SELECT m.merchant_id
        FROM merchants m
        WHERE m.is_deleted = false
    LOOP
        v_merchant_id := v_merchant.merchant_id;
        BEGIN
            -- Instead of calling generate_monthly_platform_invoice directly,
            -- we'll do the calculations here to handle zero amounts better
            
            -- Get the organization_id
            SELECT mol.organization_id INTO v_org_id
            FROM merchant_organization_links mol
            WHERE mol.merchant_id = v_merchant_id
            LIMIT 1;
            
            IF v_org_id IS NULL THEN
                v_status := 'error: no organization found for merchant';
                v_result := NULL;
            ELSE
                -- Calculate total fees for the current month
                SELECT COALESCE(SUM(t.fee_amount), 0)
                INTO v_monthly_fees
                FROM transactions t
                WHERE t.merchant_id = v_merchant_id
                AND t.organization_id = v_org_id
                AND t.status = 'completed'
                AND t.currency_code = 'XOF'
                AND t.created_at >= DATE_TRUNC('month', CURRENT_DATE)
                AND t.created_at < DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month');

                -- Get current outstanding balance
                SELECT COALESCE(mob.amount, 0)
                INTO v_outstanding_balance
                FROM merchant_outstanding_balance mob
                WHERE mob.merchant_id = v_merchant_id
                AND mob.organization_id = v_org_id
                AND mob.currency_code = 'XOF';
                
                -- Only create invoice if there are fees or outstanding balance
                IF v_monthly_fees > 0 OR v_outstanding_balance > 0 THEN
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
                        v_merchant_id,
                        v_org_id,
                        GREATEST(v_monthly_fees + v_outstanding_balance, 0.01), -- Ensure amount is at least 0.01
                        'Platform Fees for ' || TO_CHAR(CURRENT_DATE, 'Month YYYY'),
                        'XOF',
                        DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month'),
                        CASE 
                            WHEN v_outstanding_balance > 0 THEN 'sent'::invoice_status
                            ELSE 'paid'::invoice_status
                        END,
                        jsonb_build_object(
                            'invoice_date', CURRENT_DATE,
                            'fee_period_start', DATE_TRUNC('month', CURRENT_DATE),
                            'fee_period_end', DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month') - INTERVAL '1 day',
                            'monthly_fees', v_monthly_fees,
                            'outstanding_balance', v_outstanding_balance
                        )
                    )
                    RETURNING platform_invoice_id INTO v_result;
                    
                    v_status := 'success';
                ELSE
                    -- No fees to invoice
                    v_result := NULL;
                    v_status := 'skipped: no fees to invoice';
                END IF;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            v_result := NULL;
            v_status := 'error: ' || SQLERRM;
        END;
        
        merchant_id := v_merchant_id;
        invoice_id := v_result;
        status := v_status;
        RETURN NEXT;
    END LOOP;
END;
$$;

-- Function to generate statements for a specific past period for all merchants
CREATE OR REPLACE FUNCTION public.admin_generate_statements_for_past_period(
    p_year INT,
    p_month INT
)
RETURNS TABLE (
    merchant_id UUID,
    invoice_id UUID,
    status TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_merchant RECORD;
    v_result UUID;
    v_status TEXT;
    v_merchant_id UUID;
BEGIN
    FOR v_merchant IN 
        SELECT m.merchant_id
        FROM merchants m
        WHERE m.is_deleted = false
    LOOP
        v_merchant_id := v_merchant.merchant_id;
        BEGIN
            SELECT generate_invoice_for_past_month(v_merchant_id, p_year, p_month) INTO v_result;
            v_status := 'success';
        EXCEPTION WHEN OTHERS THEN
            v_result := NULL;
            v_status := 'error: ' || SQLERRM;
        END;
        
        merchant_id := v_merchant_id;
        invoice_id := v_result;
        status := v_status;
        RETURN NEXT;
    END LOOP;
END;
$$;

COMMENT ON FUNCTION public.generate_invoice_for_past_month IS 'Generates a platform invoice for a specific merchant for a past month. Use with caution as this creates retroactive statements.';
COMMENT ON FUNCTION public.admin_generate_statements_for_all_merchants IS 'Admin function to generate statements for all merchants for the current month. This bypasses RLS and should be used by the monthly-statements Edge Function.';
COMMENT ON FUNCTION public.admin_generate_statements_for_past_period IS 'Admin function to generate statements for all merchants for a specific past month and year.'; 