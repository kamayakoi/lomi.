import { supabase } from '@/utils/supabase/client'

export async function getPaymentMethods() {
    const { data, error } = await supabase
        .from('payment_methods')
        .select('*')

    if (error) {
        throw error
    }

    return data
}

export async function getPaymentMethodById(id: string) {
    const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        throw error
    }

    return data
}
