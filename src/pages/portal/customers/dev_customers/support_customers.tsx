import { supabase } from '@/utils/supabase/client'

export const fetchTransactions = async (customerId: string) => {
    const { data, error } = await supabase
        .from('transactions')
        .select('transaction_id, description, gross_amount, currency_code, created_at')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching transactions:', error)
        return []
    }

    return data
}
