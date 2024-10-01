import { supabase } from '@/utils/supabase/client'

interface Transaction {
    id: string
    // Add other transaction properties here
}

export async function createTransaction(transaction: Omit<Transaction, 'id'>) {
    const { data, error } = await supabase
        .from('transactions')
        .insert(transaction)
        .single()

    if (error) {
        throw error
    }

    return data as Transaction
}

export async function updateTransaction(id: string, updates: Partial<Transaction>) {
    const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .single()

    if (error) {
        throw error
    }

    return data as Transaction
}

export async function getTransactionById(id: string) {
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        throw error
    }

    return data as Transaction
}
