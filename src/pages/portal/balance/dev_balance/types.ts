export type currency_code = 'XOF' | 'USD' | 'EUR';
export type payout_status = 'pending' | 'processing' | 'completed' | 'failed';

export type Payout = {
    payout_id: string
    account_id: string
    merchant_id: string
    organization_id: string | null
    bank_account_id: string | null
    amount: number
    currency_code: currency_code
    status: payout_status
    created_at: string
    updated_at: string
}

export type BankAccount = {
    bank_account_id: string
    merchant_id: string
    account_number: string
    account_name: string
    bank_name: string
    bank_code?: string
    branch_code?: string
    country?: string
    is_default: boolean
    is_valid: boolean
    created_at: string
    updated_at: string
}
