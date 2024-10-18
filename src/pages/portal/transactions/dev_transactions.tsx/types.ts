export type currency_code = 'XOF' | 'USD' | 'EUR';
export type payment_method_code = 'CARDS' | 'MOBILE_MONEY' | 'E_WALLET' | 'BANK_TRANSFER' | 'APPLE_PAY' | 'GOOGLE_PAY' | 'USSD' | 'QR_CODE';
export type transaction_status = 'pending' | 'completed' | 'failed'| 'refunded';
export type transaction_type = 'payment' | 'instalment';
export type provider_code = 'ORANGE' | 'WAVE' | 'ECOBANK' | 'MTN' | 'STRIPE' | 'OTHER';

export type Transaction = {
    transaction_id: string
    customer_name: string
    customer_email?: string
    customer_phone?: string
    customer_country?: string
    customer_city?: string
    customer_address?: string
    customer_postal_code?: string
    gross_amount: number
    net_amount: number
    currency: currency_code
    payment_method: payment_method_code
    status: transaction_status
    type: transaction_type
    date: string
    provider_code: provider_code
    product_id?: string
    product_name?: string
    product_description?: string
    product_price?: number
}

export type FetchedTransaction = {
    transaction_id: string
    customer_name: string
    customer_email: string
    customer_phone: string
    customer_country: string
    customer_city: string
    customer_address: string
    customer_postal_code: string
    gross_amount: number
    net_amount: number
    currency_code: currency_code
    payment_method_code: payment_method_code
    status: transaction_status
    transaction_type: transaction_type
    created_at: string
    provider_code: provider_code
    product_id: string
    product_name: string
    product_description: string
    product_price: number
}
