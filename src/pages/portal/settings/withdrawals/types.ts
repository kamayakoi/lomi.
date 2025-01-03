export interface BankAccount {
    id: string
    account_number: string
    account_name: string
    bank_name: string
    bank_code: string
    branch_code: string
    country: string
    is_default: boolean
    is_valid: boolean
    auto_withdrawal_enabled: boolean
    auto_withdrawal_day: number | null
    auto_withdrawal_last_run: string | null
    created_at: string
    updated_at: string
}
