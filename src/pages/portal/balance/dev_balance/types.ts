export type currency_code = 'XOF' | 'USD' | 'EUR';
export type payout_status = 'pending' | 'processing' | 'completed' | 'failed';
export type provider_code = 'ORANGE' | 'WAVE' | 'ECOBANK' | 'MTN' | 'STRIPE' | 'OTHER';

export type Payout = {
    payout_id: string
    amount: number
    currency: currency_code
    payout_method: string
    bank_account_number?: string
    bank_name?: string
    bank_code?: string
    phone_number?: string
    status: payout_status
    date: string
    provider_code: provider_code
}

export type FetchedPayout = {
    payout_id: string
    amount: number
    currency_code: currency_code
    payout_method: string
    bank_account_number: string
    bank_name: string
    bank_code: string
    phone_number: string
    status: payout_status
    created_at: string
    provider_code: provider_code
}
