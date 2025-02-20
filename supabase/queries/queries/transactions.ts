import { supabase } from "../../../src/utils/supabase/client"
import type { Database } from '../../../database.types'

export type Transaction = Database['public']['Tables']['transactions']['Row']
export type TransactionInsert = Database['public']['Tables']['transactions']['Insert']
export type TransactionUpdate = Database['public']['Tables']['transactions']['Update']

export type FetchTransactionsParams = {
  merchantId: string
  providerCode?: Database['public']['Enums']['provider_code']
  status?: Database['public']['Enums']['transaction_status'][]
  type?: Database['public']['Enums']['transaction_type'][]
  currency?: Database['public']['Enums']['currency_code'][]
  paymentMethod?: Database['public']['Enums']['payment_method_code'][]
  page?: number
  pageSize?: number
}

export async function fetchTransactions({
  merchantId,
  providerCode,
  status,
  type,
  currency,
  paymentMethod,
  page = 1,
  pageSize = 50
}: FetchTransactionsParams) {
  const query = supabase
    .from('transactions')
    .select(`
      *,
      customer:customers(
        name,
        email,
        phone_number,
        country,
        city,
        address,
        postal_code
      ),
      product:merchant_products(
        name,
        description,
        price
      )
    `)
    .eq('merchant_id', merchantId)
    
  if (providerCode) {
    query.eq('provider_code', providerCode)
  }
  
  if (status?.length) {
    query.in('status', status)
  }
  
  if (type?.length) {
    query.in('transaction_type', type)
  }
  
  if (currency?.length) {
    query.in('currency_code', currency)
  }
  
  if (paymentMethod?.length) {
    query.in('payment_method_code', paymentMethod)
  }
  
  return query
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize)
}

export async function fetchTransaction(transactionId: string) {
  return supabase
    .from('transactions')
    .select(`
      *,
      customer:customers(
        name,
        email,
        phone_number,
        country,
        city,
        address,
        postal_code
      ),
      product:merchant_products(
        name,
        description,
        price
      )
    `)
    .eq('transaction_id', transactionId)
    .single()
}

export async function fetchTransactionStats(merchantId: string, startDate?: string, endDate?: string) {
  const query = supabase
    .from('transactions')
    .select('*')
    .eq('merchant_id', merchantId)
    
  if (startDate) {
    query.gte('created_at', startDate)
  }
  
  if (endDate) {
    query.lte('created_at', endDate)
  }
  
  const { data } = await query
  
  if (!data) return null
  
  return {
    total_count: data.length,
    total_amount: data.reduce((sum, t) => sum + (t.gross_amount || 0), 0),
    average_amount: data.length ? data.reduce((sum, t) => sum + (t.gross_amount || 0), 0) / data.length : 0,
    completion_rate: data.length ? 
      (data.filter(t => t.status === 'completed').length / data.length) * 100 : 0
  }
}

export async function createTransaction(transaction: TransactionInsert) {
  return supabase
    .from('transactions')
    .insert(transaction)
    .select()
    .single()
}

export async function updateTransactionStatus(
  transactionId: string, 
  status: Database['public']['Enums']['transaction_status']
) {
  return supabase
    .from('transactions')
    .update({ status })
    .eq('transaction_id', transactionId)
    .select()
    .single()
} 