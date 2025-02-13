
-- Update the transaction status function to work with new schema
CREATE OR REPLACE FUNCTION update_transaction_status(
    p_transaction_id UUID,
    p_status transaction_status,
    p_metadata JSONB DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
    v_transaction RECORD;
    v_provider_fee_percentage NUMERIC := 1.0; -- 1% Wave fee
    v_quarter_start DATE;
BEGIN
    -- Get transaction details
    SELECT * FROM transactions 
    WHERE transaction_id = p_transaction_id
    INTO v_transaction;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Transaction not found';
    END IF;

    -- Calculate current quarter start
    v_quarter_start := date_trunc('quarter', CURRENT_DATE);

    -- Update transaction status
    UPDATE transactions 
    SET 
        status = p_status,
        metadata = COALESCE(p_metadata, metadata),
        updated_at = NOW()
    WHERE transaction_id = p_transaction_id;

    -- If transaction is completed, update all balances
    IF p_status = 'completed' THEN
        -- Calculate provider fee
        DECLARE
            v_provider_fee NUMERIC := (v_transaction.gross_amount * v_provider_fee_percentage / 100);
            v_platform_fee NUMERIC := v_transaction.fee_amount - v_provider_fee;
        BEGIN
            -- 1. Update platform main account (our fee revenue)
            INSERT INTO platform_main_account (
                total_balance,
                available_balance,
                currency_code,
                updated_at
            ) VALUES (
                v_platform_fee,
                v_platform_fee,
                v_transaction.currency_code,
                NOW()
            )
            ON CONFLICT (currency_code) DO UPDATE
            SET 
                total_balance = platform_main_account.total_balance + v_platform_fee,
                available_balance = platform_main_account.available_balance + v_platform_fee,
                updated_at = NOW();

            -- 2. Update merchant account (what they receive)
            INSERT INTO merchant_accounts (
                merchant_id,
                balance,
                currency_code,
                updated_at
            ) VALUES (
                v_transaction.merchant_id,
                v_transaction.net_amount,
                v_transaction.currency_code,
                NOW()
            )
            ON CONFLICT (merchant_id, currency_code) DO UPDATE
            SET 
                balance = merchant_accounts.balance + v_transaction.net_amount,
                updated_at = NOW();

            -- 3. Update provider balance (what they hold)
            INSERT INTO platform_provider_balance (
                provider_code,
                total_transactions_amount,
                current_balance,
                currency_code,
                provider_fees,
                platform_revenue,
                quarter_start_date,
                updated_at
            ) VALUES (
                v_transaction.provider_code,
                v_transaction.gross_amount,
                v_transaction.gross_amount - v_provider_fee,
                v_transaction.currency_code,
                v_provider_fee,
                v_platform_fee,
                v_quarter_start,
                NOW()
            )
            ON CONFLICT (provider_code, currency_code, quarter_start_date) DO UPDATE
            SET 
                total_transactions_amount = platform_provider_balance.total_transactions_amount + v_transaction.gross_amount,
                current_balance = platform_provider_balance.current_balance + (v_transaction.gross_amount - v_provider_fee),
                provider_fees = platform_provider_balance.provider_fees + v_provider_fee,
                platform_revenue = platform_provider_balance.platform_revenue + v_platform_fee,
                updated_at = NOW();
        END;
    END IF;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;


-- Test transaction
DO $$ 
DECLARE
    v_merchant_id UUID;
    v_organization_id UUID;
    v_customer_id UUID;
    v_transaction_id UUID;
BEGIN
    -- Get test merchant (using Merchant 1 from seed data)
    SELECT merchant_id INTO v_merchant_id
    FROM merchants 
    WHERE email = 'merchant1@example.com';

    -- Get test organization (using Organization 1 from seed data)
    SELECT organization_id INTO v_organization_id
    FROM organizations 
    WHERE email = 'org1@example.com';

    IF v_merchant_id IS NULL OR v_organization_id IS NULL THEN
        RAISE EXCEPTION 'Test merchant or organization not found. Please ensure seed data is loaded.';
    END IF;

    -- Create test customer
    INSERT INTO customers (
        merchant_id,
        organization_id,
        name,
        email,
        phone_number
    ) VALUES (
        v_merchant_id,
        v_organization_id,
        'Test Customer',
        'test@example.com',
        '+1234567891'
    ) RETURNING customer_id INTO v_customer_id;

    -- Create Wave transaction of 2000 XOF
    SELECT create_transaction(
        v_merchant_id,
        v_organization_id,
        v_customer_id,
        2000.00,  -- amount
        'XOF',    -- currency
        'WAVE',   -- provider
        'E_WALLET', -- payment method
        'Test Wave transaction', -- description
        NULL,     -- product_id
        NULL,     -- subscription_id
        jsonb_build_object(
            'test', true,
            'customer_phone', '+1234567891'
        )
    ) INTO v_transaction_id;

    -- Simulate successful payment
    PERFORM update_transaction_status(
        v_transaction_id,
        'completed'::transaction_status,
        jsonb_build_object(
            'provider_reference', 'WAVE_TEST' || v_transaction_id,
            'completed_at', NOW()
        )
    );

    -- Print transaction details
    RAISE NOTICE 'Transaction created with ID: %', v_transaction_id;
    RAISE NOTICE 'Transaction details: %', (
        SELECT json_build_object(
            'gross_amount', gross_amount,
            'fee_amount', fee_amount,
            'net_amount', net_amount,
            'fee_reference', fee_reference,
            'status', status
        )
        FROM transactions 
        WHERE transaction_id = v_transaction_id
    );
    
    -- Check balances
    RAISE NOTICE 'Merchant balance: %', (
        SELECT json_build_object(
            'balance', balance,
            'updated_at', updated_at
        )
        FROM merchant_accounts 
        WHERE merchant_id = v_merchant_id AND currency_code = 'XOF'
    );
    
    RAISE NOTICE 'Platform balance: %', (
        SELECT json_build_object(
            'total_balance', total_balance,
            'available_balance', available_balance,
            'updated_at', updated_at
        )
        FROM platform_main_account 
        WHERE currency_code = 'XOF'
    );
    
    RAISE NOTICE 'Provider balance: %', (
        SELECT json_build_object(
            'total_transactions_amount', total_transactions_amount,
            'current_balance', current_balance,
            'provider_fees', provider_fees,
            'platform_revenue', platform_revenue,
            'quarter_start_date', quarter_start_date,
            'updated_at', updated_at
        )
        FROM platform_provider_balance 
        WHERE provider_code = 'WAVE' AND currency_code = 'XOF'
    );
END $$;