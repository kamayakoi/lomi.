import { supabase } from '@/utils/supabase/client';
import { CurrencyCode, ProviderCode, PaymentMethodCode, TransactionType, CalculatedFee } from './types';

export class FeeService {
    /**
     * Calculate transaction fee using database values
     */
    static async calculateFee(params: {
        amount: number;
        transactionType: TransactionType;
        provider: ProviderCode;
        paymentMethod: PaymentMethodCode;
        currency: CurrencyCode;
    }): Promise<CalculatedFee> {
        const { amount, transactionType, provider, paymentMethod, currency } = params;

        // Get fee from database
        const { data: fee, error } = await supabase.rpc('get_transaction_fee', {
            p_transaction_type: transactionType,
            p_provider_code: provider,
            p_payment_method_code: paymentMethod,
            p_currency_code: currency
        });

        if (error) throw error;
        if (!fee?.length) throw new Error('No fee configuration found');

        const { name, percentage, fixed_amount } = fee[0] as { name: string; percentage: number; fixed_amount: number };
        
        // Calculate fee amount
        const feeAmount = (amount * (percentage / 100)) + fixed_amount;
        
        // Calculate net amount (what merchant receives)
        const netAmount = amount - feeAmount;

        return {
            feeAmount,
            netAmount,
            feeName: name
        };
    }
} 