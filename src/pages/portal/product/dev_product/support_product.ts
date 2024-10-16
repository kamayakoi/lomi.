import { supabase } from '@/utils/supabase/client'
import { Product } from './types'

export const fetchProducts = async (
  merchantId: string,
  isActive: string | null,
  page: number,
  pageSize: number
) => {
  const { data, error } = await supabase.rpc('fetch_products', {
    p_merchant_id: merchantId,
    p_is_active: isActive === 'all' ? null : (isActive === 'active'),
    p_page: page,
    p_page_size: pageSize,
  })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data as Product[]
}

interface CreateProductData {
  merchantId: string
  name: string
  description: string
  price: number
  currencyCode: string
  imageUrl: string
  isActive: boolean
}

export const createProduct = async (data: CreateProductData) => {
  const { data: productId, error } = await supabase.rpc('create_product', {
    p_merchant_id: data.merchantId,
    p_name: data.name,
    p_description: data.description,
    p_price: data.price,
    p_currency_code: data.currencyCode,
    p_image_url: data.imageUrl,
    p_is_active: data.isActive,
  })

  if (error) {
    throw error
  }

  return productId as string
}
