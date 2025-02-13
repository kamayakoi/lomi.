export interface WaveCheckoutSession {
    id: string;
    amount: number;
    currency: string;
    merchant_reference_id: string;
    merchant_id: string;
    status: 'pending' | 'completed' | 'cancelled' | 'expired';
    success_url: string;
    cancel_url: string;
    checkout_url: string;
    created_at: string;
    expires_at: string;
    completed_at?: string;
    cancelled_at?: string;
    wave_launch_url: string;
    checkout_status: string;
    payment_status: string;
    last_payment_error?: WavePaymentError;
    when_created: string;
    when_expires: string;
    transaction_id?: string;
}

export interface WavePaymentError {
    code: string;
    message: string;
}

export interface CreateWaveCheckoutSessionParams {
    amount: number;
    currency: string;
    merchant_reference_id: string;
    merchant_id: string;
    success_url: string;
    cancel_url: string;
    error_url?: string;
    client_reference?: string;
    restrict_payer_mobile?: string;
    aggregated_merchant_id?: string;
}

export interface WaveConfig {
    apiUrl: string;
    apiKey: string;
    merchantId: string;
    accountId: string;
}

export type WaveCheckoutStatus = 'open' | 'complete' | 'expired';
export type WavePaymentStatus = 'processing' | 'cancelled' | 'succeeded';

// Wave API Types

export type WaveBusinessType = 'fintech' | 'other';

export interface CreateWaveAggregatedMerchantParams {
    name: string;
    business_type: WaveBusinessType;
    business_description: string;
    business_sector: string;
    website_url?: string;
    business_registration_identifier?: string;
    manager_name?: string;
}

export interface WaveAggregatedMerchant {
    id: string;
    name: string;
    business_type: WaveBusinessType;
    business_description: string;
    business_sector: string;
    website_url?: string;
    manager_name?: string;
    business_registration_identifier?: string;
    when_created: string;
    is_locked: boolean;
    checkout_fee_structure_name: string;
    payout_fee_structure_name: string;
}

export interface WaveAggregatedMerchantResponse {
    page_info: {
        has_next_page: boolean;
        end_cursor: string;
    };
    items: WaveAggregatedMerchant[];
}
