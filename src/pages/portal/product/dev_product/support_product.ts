import { supabase } from '@/utils/supabase/client'
import { Product, Transaction } from './types'

export async function uploadProductImage(file: File, merchantId: string): Promise<string | null> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${merchantId}/${Date.now()}.${fileExt}`
    const { error } = await supabase.storage
        .from('product_images')
        .upload(fileName, file)

    if (error) {
        console.error('Error uploading image:', error)
        return null
    }

    const { data: { publicUrl } } = supabase.storage
        .from('product_images')
        .getPublicUrl(fileName)

    return publicUrl
}

export async function deleteProductImage(imageUrl: string): Promise<void> {
    const path = imageUrl.split('/').slice(-2).join('/')
    const { error } = await supabase.storage
        .from('product_images')
        .remove([path])

    if (error) {
        console.error('Error deleting image:', error)
    }
}

export async function fetchProducts(merchantId: string, isActive: boolean | null = null): Promise<Product[]> {
    const { data, error } = await supabase.rpc('fetch_products', {
        p_merchant_id: merchantId,
        p_is_active: isActive
    })

    if (error) {
        console.error('Error fetching products:', error)
        return []
    }

    return data as Product[]
}

export async function createProduct(data: {
    name: string
    description: string | null
    price: number
    image_url?: string | null
    display_on_storefront?: boolean
}): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No user found')

    const { data: organizationData, error: organizationError } = await supabase
        .rpc('fetch_organization_details', { p_merchant_id: user.id })

    if (organizationError) throw organizationError
    if (!organizationData?.length) throw new Error('No organization found')

    const { error } = await supabase.rpc('create_product', {
        p_merchant_id: user.id,
        p_organization_id: organizationData[0].organization_id,
        p_name: data.name,
        p_description: data.description,
        p_price: data.price,
        p_currency_code: 'XOF',
        p_image_url: data.image_url,
        p_is_active: true,
        p_display_on_storefront: data.display_on_storefront ?? true
    })

    if (error) throw error
}

export async function updateProduct(productId: string, data: {
    name: string
    description: string | null
    price: number
    image_url?: string | null
    is_active: boolean
    display_on_storefront?: boolean
}): Promise<void> {
    const { error } = await supabase.rpc('update_product', {
        p_product_id: productId,
        p_name: data.name,
        p_description: data.description,
        p_price: data.price,
        p_image_url: data.image_url,
        p_is_active: data.is_active,
        p_display_on_storefront: data.display_on_storefront ?? true
    })

    if (error) throw error
}

export async function deleteProduct(productId: string): Promise<void> {
    const { error } = await supabase.rpc('delete_product', {
        p_product_id: productId
    })

    if (error) throw error
}

export async function fetchProductTransactions(productId: string): Promise<Transaction[]> {
    const { data, error } = await supabase.rpc('fetch_product_transactions', {
        p_product_id: productId
    })

    if (error) {
        console.error('Error fetching product transactions:', error)
        return []
    }

    return data as Transaction[]
}
