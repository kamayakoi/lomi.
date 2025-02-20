import { supabase } from "../../../src/utils/supabase/client"
import type { Database } from '../../../database.types'

export type Customer = Database['public']['Tables']['customers']['Row']
export type CustomerInsert = Database['public']['Tables']['customers']['Insert']
export type CustomerUpdate = Database['public']['Tables']['customers']['Update']

export async function fetchCustomers({
  merchantId,
  searchTerm,
  customerType,
  page = 1,
  pageSize = 50
}: {
  merchantId: string
  searchTerm?: string
  customerType?: 'business' | 'individual'
  page?: number
  pageSize?: number
}) {
  const query = supabase
    .from('customers')
    .select('*')
    .eq('merchant_id', merchantId)
    .eq('is_deleted', false)
    
  if (searchTerm) {
    query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone_number.ilike.%${searchTerm}%`)
  }
  
  if (customerType) {
    query.eq('is_business', customerType === 'business')
  }
  
  return query
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize)
}

export async function fetchCustomer(customerId: string) {
  return supabase
    .from('customers')
    .select('*')
    .eq('customer_id', customerId)
    .eq('is_deleted', false)
    .single()
}

export async function fetchCustomerTransactions(customerId: string) {
  return supabase
    .from('transactions')
    .select(`
      transaction_id,
      description,
      gross_amount,
      currency_code,
      created_at
    `)
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })
}

export async function createCustomer(customer: CustomerInsert) {
  return supabase
    .from('customers')
    .insert(customer)
    .select()
    .single()
}

export async function updateCustomer(customerId: string, updates: CustomerUpdate) {
  return supabase
    .from('customers')
    .update(updates)
    .eq('customer_id', customerId)
    .select()
    .single()
}

export async function deleteCustomer(customerId: string) {
  return supabase
    .from('customers')
    .update({ is_deleted: true })
    .eq('customer_id', customerId)
} 