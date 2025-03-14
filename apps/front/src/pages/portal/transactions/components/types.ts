import { Database } from 'database.types'

export type currency_code = Database['public']['Enums']['currency_code']
export type payment_method_code = Database['public']['Enums']['payment_method_code']
export type provider_code = Database['public']['Enums']['provider_code']
export type transaction_status = Database['public']['Enums']['transaction_status']
export type transaction_type = Database['public']['Enums']['transaction_type']
export type frequency = Database['public']['Enums']['frequency']
export type subscription_status = Database['public']['Enums']['subscription_status']

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
    provider_transaction_id?: string
    provider_checkout_id?: string
}

export type Transaction = {
    transaction_id: string
    merchant_id: string
    customer_name: string
    customer_email: string
    customer_phone: string
    customer_country: string
    customer_city: string
    customer_address: string
    customer_postal_code: string
    gross_amount: number
    net_amount: number
    currency: currency_code
    currency_code: currency_code
    payment_method: payment_method_code
    status: transaction_status
    type: transaction_type
    date: string
    provider_code: provider_code
    product_id: string
    product_name: string
    product_description: string
    product_price: number
    subscription_id?: string
    plan_name?: string
    plan_description?: string
    plan_billing_frequency?: frequency
    subscription_end_date?: string
    subscription_next_billing_date?: string
    subscription_status?: subscription_status
    provider_transaction_id?: string
    provider_checkout_id?: string
}
