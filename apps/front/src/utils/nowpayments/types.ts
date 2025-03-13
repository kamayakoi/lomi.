export interface NOWPaymentsCurrency {
    id: string;
    code: string;
    name: string;
    enabled: boolean;
    is_base_currency: boolean;
    is_quote_currency: boolean;
    minimum_amount: string;
}

export interface NOWPaymentsEstimateResponse {
    estimated_amount: number;
    min_amount: number;
    max_amount: number;
    currency_from: string;
    currency_to: string;
}

export interface CreatePaymentRequest {
    price_amount: number;
    price_currency: string;
    pay_currency: string;
    ipn_callback_url: string;
    order_id?: string;
    order_description?: string;
    success_url?: string;
    cancel_url?: string;
}

export interface NOWPaymentsCreatePaymentResponse {
    payment_id: string;
    payment_status: NOWPaymentsStatus;
    pay_address: string;
    price_amount: number;
    price_currency: string;
    pay_amount: number;
    pay_currency: string;
    created_at: string;
    updated_at: string;
    purchase_id: string;
    payment_extra_id?: string;
}

export interface NOWPaymentsPaymentStatusResponse {
    payment_id: string;
    payment_status: NOWPaymentsStatus;
    pay_address: string;
    price_amount: number;
    price_currency: string;
    pay_amount: number;
    pay_currency: string;
    created_at: string;
    updated_at: string;
    purchase_id: string;
    actually_paid: number;
    outcome_amount?: number;
    outcome_currency?: string;
}

export type NOWPaymentsStatus = 
    'waiting' | 
    'confirming' | 
    'confirmed' | 
    'sending' | 
    'partially_paid' | 
    'finished' | 
    'failed' | 
    'refunded' | 
    'expired';