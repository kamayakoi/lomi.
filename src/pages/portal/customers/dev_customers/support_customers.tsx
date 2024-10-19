import { supabase } from '@/utils/supabase/client'

export const fetchTransactions = async (customerId: string) => {
    const { data, error } = await supabase
        .rpc('fetch_customer_transactions', { p_customer_id: customerId })

    if (error) {
        console.error('Error fetching transactions:', error)
        return []
    }

    return data
}
