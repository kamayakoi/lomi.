import { supabase } from "../../../src/utils/supabase/client"
import type { Database } from '../../../database.types'

export type Product = Database['public']['Tables']['merchant_products']['Row']
export type ProductInsert = Database['public']['Tables']['merchant_products']['Insert']
export type ProductUpdate = Database['public']['Tables']['merchant_products']['Update']

export async function fetchProducts({
  merchantId,
  isActive,
  page = 1,
  pageSize = 50
}: {
  merchantId: string
  isActive?: boolean
  page?: number
  pageSize?: number
}) {
  const { data } = await supabase.rpc('fetch_products', {
    p_merchant_id: merchantId,
    p_is_active: isActive,
    p_limit: pageSize,
    p_offset: (page - 1) * pageSize
  })
  return data
}

export async function fetchProduct(productId: string) {
  return supabase
    .from('merchant_products')
    .select('*')
    .eq('product_id', productId)
    .single()
}

export async function fetchProductTransactions(productId: string) {
  const { data } = await supabase.rpc('fetch_product_transactions', {
    p_product_id: productId
  })
  return data
}

export async function fetchProductFees(productId: string) {
  const { data } = await supabase.rpc('fetch_product_fees', {
    p_product_id: productId
  })
  return data
}

export async function createProduct(product: ProductInsert) {
  return supabase
    .from('merchant_products')
    .insert(product)
    .select()
    .single()
}

export async function updateProduct(productId: string, updates: ProductUpdate) {
  return supabase
    .from('merchant_products')
    .update(updates)
    .eq('product_id', productId)
    .select()
    .single()
}

export async function deleteProduct(productId: string) {
  return supabase
    .from('merchant_products')
    .update({ is_active: false })
    .eq('product_id', productId)
} 