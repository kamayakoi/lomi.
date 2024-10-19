import { supabase } from '@/utils/supabase/client'
import { Product, Transaction } from './types'

export const fetchProducts = async (merchantId: string, isActive: boolean | null) => {
  console.log('Fetching products with merchant ID:', merchantId, 'and isActive:', isActive)

  const { data, error } = await supabase.rpc('fetch_products', {
    p_merchant_id: merchantId,
    p_is_active: isActive,
  })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  console.log('Fetched products:', data)

  return data as Product[]
}

interface CreateProductData {
  merchantId: string
  organizationId: string
  name: string
  description: string
  price: number
  currencyCode: string
  isActive: boolean
}

export const createProduct = async (data: CreateProductData) => {
  const { data: productId, error } = await supabase.rpc('create_product', {
    p_merchant_id: data.merchantId,
    p_organization_id: data.organizationId,
    p_name: data.name,
    p_description: data.description,
    p_price: data.price,
    p_currency_code: data.currencyCode,
    p_is_active: data.isActive,
  })

  if (error) {
    throw error
  }

  return productId as string
}

export const deleteProduct = async (productId: string) => {
  const { error } = await supabase.rpc('delete_product', {
    p_product_id: productId,
  })

  if (error) {
    throw error
  }
}

export const fetchProductTransactions = async (productId: string) => {
    const { data, error } = await supabase
        .rpc('fetch_product_transactions', { p_product_id: productId })

    if (error) {
        console.error('Error fetching product transactions:', error)
        return []
    }

    return data as Transaction[]
}
