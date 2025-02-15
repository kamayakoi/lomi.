export type Customer = {
    customer_id: string
    name: string
    email: string
    phone_number: string
    whatsapp_number: string
    country: string
    city: string
    address: string
    postal_code: string
    is_business: boolean
}

export type Transaction = {
    transaction_id: string
    description: string
    gross_amount: number
    currency_code: string
    created_at: string
}

