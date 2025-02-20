import { Database } from 'database.types'

type currency_code = Database['public']['Enums']['currency_code']
type payout_status = Database['public']['Enums']['payout_status']

export type Payout = Database['public']['Tables']['payouts']['Row']
export type BankAccount = Database['public']['Tables']['merchant_bank_accounts']['Row']
export type BalanceBreakdown = Database['public']['Tables']['merchant_accounts']['Row']

export type { currency_code, payout_status }