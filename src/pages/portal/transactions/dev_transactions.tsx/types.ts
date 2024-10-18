export type currency_code = 'XOF' | 'USD' | 'EUR';
export type payment_method_code = 'CARDS' | 'MOBILE_MONEY' | 'E_WALLET' | 'BANK_TRANSFER' | 'APPLE_PAY' | 'GOOGLE_PAY' | 'USSD' | 'QR_CODE';
export type transaction_status = 'pending' | 'completed' | 'failed'| 'refunded';
export type transaction_type = 'payment' | 'instalment';
export type provider_code = 'ORANGE' | 'WAVE' | 'ECOBANK' | 'MTN' | 'STRIPE' | 'OTHER';
export type frequency = 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'quaterly' | 'yearly' | 'one-time';
export type subscription_status = 'pending' | 'active' | 'paused' | 'cancelled' | 'expired' | 'past_due' | 'trial';

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
    subscription_id?: string
    subscription_name?: string
    subscription_description?: string
    subscription_status?: subscription_status
    subscription_start_date?: string
    subscription_end_date?: string
    subscription_next_billing_date?: string
    subscription_billing_frequency?: frequency
    subscription_amount?: number
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
    subscription_id: string
    subscription_status: subscription_status
    subscription_start_date: string
    subscription_end_date: string
    subscription_next_billing_date: string
    subscription_billing_frequency: frequency
    subscription_amount: number
    plan_id: string
    plan_name: string
    plan_description: string
}
