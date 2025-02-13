-- First, add the quarterly rollover functions
CREATE OR REPLACE FUNCTION rollover_provider_balance_quarterly() RETURNS void AS $$
DECLARE
    v_quarter_start DATE;
BEGIN
    -- Calculate start of current quarter
    v_quarter_start := date_trunc('quarter', CURRENT_DATE);
    
    -- Move current balances to history if they're from previous quarter
    INSERT INTO platform_provider_balance_history (
        provider_code,
        total_transactions_amount,
        final_balance,
        currency_code,
        provider_fees,
        platform_revenue,
        quarter_start_date,
        quarter_end_date
    )
    SELECT 
        provider_code,
        total_transactions_amount,
        current_balance,
        currency_code,
        provider_fees,
        platform_revenue,
        quarter_start_date,
        v_quarter_start - INTERVAL '1 day'
    FROM platform_provider_balance
    WHERE quarter_start_date < v_quarter_start;

    -- Create new records for current quarter
    INSERT INTO platform_provider_balance (
        provider_code,
        total_transactions_amount,
        current_balance,
        currency_code,
        provider_fees,
        platform_revenue,
        quarter_start_date
    )
    SELECT 
        provider_code,
        0, -- Reset transaction amount
        current_balance, -- Carry forward current balance
        currency_code,
        0, -- Reset provider fees
        0, -- Reset platform revenue
        v_quarter_start
    FROM platform_provider_balance
    WHERE quarter_start_date < v_quarter_start
    ON CONFLICT (provider_code, currency_code, quarter_start_date) DO NOTHING;

    -- Delete old records
    DELETE FROM platform_provider_balance 
    WHERE quarter_start_date < v_quarter_start;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically check for rollover on each transaction
CREATE OR REPLACE FUNCTION check_quarterly_rollover() RETURNS trigger AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM platform_provider_balance 
        WHERE quarter_start_date = date_trunc('quarter', CURRENT_DATE)
        AND provider_code = NEW.provider_code
        AND currency_code = NEW.currency_code
    ) THEN
        PERFORM rollover_provider_balance_quarterly();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_quarterly_rollover_trigger
    BEFORE INSERT OR UPDATE ON platform_provider_balance
    FOR EACH ROW
    EXECUTE FUNCTION check_quarterly_rollover();