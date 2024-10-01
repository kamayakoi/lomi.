import { supabase } from '@/utils/supabase/client'

interface Checkout {
    id: string
    // Add other checkout properties here
}

export async function initiateCheckout(checkoutData: Omit<Checkout, 'id'>) {
    const { data, error } = await supabase
        .from('checkouts')
        .insert(checkoutData)
        .single()

    if (error) {
        throw error
    }

    return data as Checkout
}

export async function getCheckoutById(id: string) {
    const { data, error } = await supabase
        .from('checkouts')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        throw error
    }

    return data as Checkout
}

export async function updateCheckout(id: string, updates: Partial<Checkout>) {
    const { data, error } = await supabase
        .from('checkouts')
        .update(updates)
        .eq('id', id)
        .single()

    if (error) {
        throw error
    }

    return data as Checkout
}
