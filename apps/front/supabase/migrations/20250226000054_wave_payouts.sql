-- Create update merchant account balance function for payouts
CREATE OR REPLACE FUNCTION public.update_merchant_account_balance(
    p_merchant_id UUID,
    p_amount NUMERIC,
    p_currency_code public.currency_code
) RETURNS VOID AS $$
DECLARE
    v_account_id UUID;
BEGIN
    -- Get the account ID for the merchant and currency
    SELECT account_id INTO v_account_id 
    FROM merchant_accounts 
    WHERE merchant_id = p_merchant_id 
    AND currency_code = p_currency_code
    LIMIT 1;
    
    IF v_account_id IS NULL THEN
        RAISE EXCEPTION 'No account found for merchant % with currency %', p_merchant_id, p_currency_code;
    END IF;
    
    -- Update the account balance
    UPDATE merchant_accounts
    SET 
        available_balance = available_balance + p_amount,
        updated_at = NOW()
    WHERE account_id = v_account_id;
    
    -- Log the balance adjustment
    INSERT INTO account_balance_history (
        account_id,
        merchant_id,
        adjustment_amount,
        previous_balance,
        new_balance,
        adjustment_type,
        reference_type,
        reference_id,
        notes
    )
    SELECT
        v_account_id,
        p_merchant_id,
        p_amount,
        available_balance - p_amount,
        available_balance,
        CASE 
            WHEN p_amount < 0 THEN 'debit'::balance_adjustment_type
            ELSE 'credit'::balance_adjustment_type
        END,
        'payout'::reference_type,
        NULL,
        'Account balance adjustment for payout'
    FROM merchant_accounts
    WHERE account_id = v_account_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check available balance for a merchant
CREATE OR REPLACE FUNCTION public.check_merchant_available_balance(
    p_merchant_id UUID,
    p_currency_code public.currency_code
) RETURNS NUMERIC AS $$
DECLARE
    v_available_balance NUMERIC;
BEGIN
    SELECT available_balance INTO v_available_balance
    FROM merchant_accounts
    WHERE merchant_id = p_merchant_id
    AND currency_code = p_currency_code
    LIMIT 1;
    
    RETURN COALESCE(v_available_balance, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 