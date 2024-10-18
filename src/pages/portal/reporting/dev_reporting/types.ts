export type currency_code = 'XOF' | 'USD' | 'EUR';
export type payment_method_code = 'CARDS' | 'MOBILE_MONEY' | 'E_WALLET' | 'BANK_TRANSFER' | 'APPLE_PAY' | 'GOOGLE_PAY' | 'USSD' | 'QR_CODE';
export type transaction_status = 'pending' | 'completed' | 'failed'| 'refunded';
export type transaction_type = 'payment' | 'instalment';
export type provider_code = 'ORANGE' | 'WAVE' | 'ECOBANK' | 'MTN' | 'STRIPE' | 'OTHER';
export type refund_status = 'pending' | 'completed' | 'failed';
export type subscription_status = 'pending' | 'active' | 'paused' | 'cancelled' | 'expired' | 'past_due' | 'trial';

export type Transaction = {
    transaction_id: string
    merchant_id: string
    organization_id: string
    customer_id: string
    product_id?: string
    subscription_id?: string
    transaction_type: transaction_type
    status: transaction_status
    description?: string
    reference_id: string
    gross_amount: number
    fee_amount: number
    net_amount: number
    fee_reference: string
    currency_code: currency_code
    provider_code: provider_code
    payment_method_code: payment_method_code
    created_at: string
    updated_at: string
}

export type Product = {
    product_id: string
    merchant_id: string
    name: string
    description?: string
    price: number
    currency_code: currency_code
    image_url?: string
    is_active: boolean
    created_at: string
    updated_at: string
}

export type Subscription = {
    subscription_id: string
    merchant_id: string
    organization_id: string
    customer_id: string
    name: string
    description?: string
    status: subscription_status
    image_url?: string
    start_date: string
    end_date?: string
    next_billing_date?: string
    billing_frequency: string
    amount: number
    currency_code: currency_code
    retry_payment_every?: number
    total_retries?: number
    failed_payment_action?: string
    created_at: string
    updated_at: string
}

export type RevenueData = {
    date: string
    revenue: number
}

export type TransactionVolumeData = {
    date: string
    transaction_count: number
}

export type TopPerformingProduct = {
    product_name: string
    sales_count: number
    total_revenue: number
}

export type CompletionRate = {
    completed: number
    refunded: number
    failed: number
}

export type MerchantId = string

export type FetchRevenueByDateParams = {
    merchantId: MerchantId
    startDate?: string
    endDate?: string
    granularity?: '24H' | '7D' | '1M' | 'hour' | 'day' | 'week' | 'month'
}

export type FetchTransactionVolumeByDateParams = {
    merchantId: MerchantId
    startDate?: string
    endDate?: string
    granularity?: '24H' | '7D' | '1M' | 'hour' | 'day' | 'week' | 'month'
}

export type FetchTopPerformingProductsParams = {
    merchantId: MerchantId
    startDate?: string
    endDate?: string
    limit?: number
}

export type FetchNewCustomerCountParams = never
export type CalculateConversionRateParams = never
export type FetchNewCustomerCountChangeParams = never
export type FetchConversionRateChangeParams = never

export type TopPerformingSubscription = {
    plan_name: string
    sales_count: number
    total_revenue: number
}

export type FetchTopPerformingSubscriptionsParams = {
    merchantId: MerchantId
    startDate?: string
    endDate?: string
    limit?: number
}

export type ProviderDistribution = {
    provider_code: provider_code
    transaction_count: number
}

export type FetchProviderDistributionParams = {
    merchantId: MerchantId
    startDate?: string
    endDate?: string
}

export const COLORS = ['#3498db', '#2ecc71', '#f1c40f', '#e74c3c']
