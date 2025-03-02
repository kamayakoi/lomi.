import { Database } from 'database.types'

type currency_code = Database['public']['Enums']['currency_code']
type payout_status = Database['public']['Enums']['payout_status']

export type Payout = Database['public']['Tables']['payouts']['Row']
export type BankAccount = Database['public']['Tables']['merchant_bank_accounts']['Row']

export interface BalanceBreakdown {
    currency_code: currency_code;
    available_balance: number;
    pending_balance: number;
    total_balance: number;
    converted_available_balance: number;
    converted_pending_balance: number;
    converted_total_balance: number;
    target_currency: currency_code;
}

export type conversion_type = 'payment' | 'withdrawal' | 'refund' | 'manual';

export interface CurrencyConversion {
    id: string;
    merchant_id: string;
    organization_id: string;
    from_currency: currency_code;
    to_currency: currency_code;
    original_amount: number;
    converted_amount: number;
    conversion_rate: number;
    conversion_type: conversion_type;
    payout_id?: string;
    transaction_id?: string;
    refund_id?: string;
    created_at: string;
    updated_at: string;
}

// Database conversion rate structure
export interface ConversionRate {
    from_currency: currency_code;
    to_currency: currency_code;
    rate: number;
    inverse_rate: number;
    created_at: string;
}

export type { currency_code, payout_status }