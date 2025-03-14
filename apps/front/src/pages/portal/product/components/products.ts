export interface Fee {
    fee_type_id: string;
    name: string;
    percentage: number;
    is_enabled: boolean;
}

export interface Product {
    product_id: string;
    merchant_id: string;
    organization_id: string;
    name: string;
    description: string | null;
    price: number;
    currency_code: string;
    image_url: string | null;
    is_active: boolean;
    display_on_storefront: boolean;
    fees?: Fee[];
    created_at: string;
    updated_at: string;
    total_count?: number;
}

export interface Transaction {
    transaction_id: string
    description: string
    gross_amount: number
    currency_code: string
    created_at: string
    status?: 'completed' | 'refunded' | 'pending' | 'failed' | string
}

export interface ProductsResponse {
    products: Product[]
    totalCount: number
}
