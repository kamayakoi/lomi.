import { supabase } from '@/utils/supabase/client'
import { Customer } from './types'

export const fetchTransactions = async (customerId: string) => {
    const { data, error } = await supabase
        .rpc('fetch_customer_transactions', { p_customer_id: customerId })

    if (error) {
        console.error('Error fetching transactions:', error)
        return []
    }

    return data
}

export const fetchCustomer = async (customerId: string) => {
    const { data, error } = await supabase
        .rpc('fetch_customer', { p_customer_id: customerId })
        .single()

    if (error) {
        console.error('Error fetching customer:', error)
        throw error
    }

    return data as Customer
}

export const updateCustomer = async (customerId: string, data: Partial<Customer>) => {
    const { error } = await supabase.rpc('update_customer', {
        p_customer_id: customerId,
        p_name: data.name,
        p_email: data.email,
        p_phone_number: data.phone_number,
        p_country: data.country,
        p_city: data.city,
        p_address: data.address,
        p_postal_code: data.postal_code,
        p_is_business: data.is_business,
    })

    if (error) {
        throw error
    }
}

export const deleteCustomer = async (customerId: string) => {
    const { error } = await supabase
        .rpc('delete_customer', { p_customer_id: customerId })

    if (error) {
        throw error
    }
}
