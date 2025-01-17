export interface Product {
    product_id: string
    merchant_id: string
    organization_id: string
    name: string
    description: string | null
    price: number
    currency_code: string
    image_url: string | null
    is_active: boolean
    display_on_storefront: boolean
    created_at: string
    updated_at: string
    total_count?: number
}

export interface Transaction {
    transaction_id: string
    description: string
    gross_amount: number
    currency_code: string
    created_at: string
}

export interface ProductsResponse {
    products: Product[]
    totalCount: number
}
