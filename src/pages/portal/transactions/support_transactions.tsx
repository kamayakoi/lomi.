import { format } from 'date-fns'
import { supabase } from '@/utils/supabase/client'
import { Transaction, FetchedTransaction } from './types'
import { DateRange } from 'react-day-picker'
import { useQuery } from 'react-query'

export const fetchTransactions = async (
    merchantId: string,
    selectedProvider: string | null,
    selectedStatuses: string[],
    selectedTypes: string[],
    selectedCurrencies: string[],
    selectedPaymentMethods: string[]
) => {
    const { data, error } = await supabase.rpc('fetch_transactions', {
        p_merchant_id: merchantId,
        p_provider_code: selectedProvider === 'all' ? null : selectedProvider,
        p_status: selectedStatuses.length > 0 ? selectedStatuses : null,
        p_type: selectedTypes.length > 0 ? selectedTypes : null,
        p_currency: selectedCurrencies.length > 0 ? selectedCurrencies : null,
        p_payment_method: selectedPaymentMethods.length > 0 ? selectedPaymentMethods : null,
    })

    if (error) {
        console.error('Error fetching transactions:', error)
        return []
    }

    return data.map((transaction: FetchedTransaction) => ({
        transaction_id: transaction.transaction_id,
        customer: transaction.customer_name,
        gross_amount: transaction.gross_amount,
        net_amount: transaction.net_amount,
        currency: transaction.currency_code,
        payment_method: transaction.payment_method_code,
        status: transaction.status,
        type: transaction.transaction_type,
        date: format(new Date(transaction.created_at), 'yyyy-MM-dd'),
        provider_code: transaction.provider_code,
    }))
}

export const fetchTotalIncomingAmount = async (merchantId: string, selectedDateRange: string | null, customDateRange?: DateRange) => {
    let startDate: Date | undefined
    let endDate: Date | undefined

    if (selectedDateRange === 'custom' && customDateRange) {
        startDate = customDateRange.from
        endDate = customDateRange.to
    } else {
        const now = new Date()
        switch (selectedDateRange) {
            case '24H':
                startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
                endDate = now
                break
            case '7D':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                endDate = now
                break
            case '1M':
                startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
                endDate = now
                break
            case '3M':
                startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
                endDate = now
                break
            case 'YTD':
                startDate = new Date(now.getFullYear(), 0, 1)
                endDate = now
                break
        }
    }

    const { data, error } = await supabase.rpc('fetch_total_incoming_amount', {
        p_merchant_id: merchantId,
        p_start_date: startDate ? format(startDate, 'yyyy-MM-dd HH:mm:ss') : null,
        p_end_date: endDate ? format(endDate, 'yyyy-MM-dd HH:mm:ss') : null,
    })

    if (error) {
        console.error('Error fetching total incoming amount:', error)
        return 0
    }

    return data
}

export const fetchTransactionCount = async (merchantId: string, selectedDateRange: string | null, customDateRange?: DateRange) => {
    let startDate: Date | undefined
    let endDate: Date | undefined

    if (selectedDateRange === 'custom' && customDateRange) {
        startDate = customDateRange.from
        endDate = customDateRange.to
    } else {
        const now = new Date()
        switch (selectedDateRange) {
            case '24H':
                startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
                endDate = now
                break
            case '7D':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                endDate = now
                break
            case '1M':
                startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
                endDate = now
                break
            case '3M':
                startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
                endDate = now
                break
            case 'YTD':
                startDate = new Date(now.getFullYear(), 0, 1)
                endDate = now
                break
        }
    }

    const { data, error } = await supabase.rpc('fetch_transaction_count', {
        p_merchant_id: merchantId,
        p_start_date: startDate ? format(startDate, 'yyyy-MM-dd') : null,
        p_end_date: endDate ? format(endDate, 'yyyy-MM-dd') : null,
    })

    if (error) {
        console.error('Error fetching transaction count:', error)
        return 0
    }

    return data
}

export const applySearch = (transactions: Transaction[], searchTerm: string) => {
    if (!searchTerm) return transactions

    return transactions.filter(transaction =>
        Object.values(transaction).some(value =>
            value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    )
}

export const applyDateFilter = (transactions: Transaction[], selectedDateRange: string | null, customDateRange?: DateRange) => {
    if (selectedDateRange === 'custom' && customDateRange) {
        return transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date)
            return customDateRange.from && customDateRange.to &&
                transactionDate >= customDateRange.from &&
                transactionDate <= customDateRange.to
        })
    }

    if (!selectedDateRange) return transactions

    const now = new Date()
    let startDate: Date

    switch (selectedDateRange) {
        case '24H':
            startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
            break
        case '7D':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            break
        case '1M':
            startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
            break
        case '3M':
            startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
            break
        case 'YTD':
            startDate = new Date(now.getFullYear(), 0, 1)
            break
        default:
            return transactions
    }

    return transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date)
        return transactionDate >= startDate && transactionDate <= now
    })
}

export const useTransactions = (merchantId: string, selectedProvider: string | null, selectedStatuses: string[], selectedTypes: string[], selectedCurrencies: string[], selectedPaymentMethods: string[]) => {
    return useQuery(['transactions', merchantId, selectedProvider, selectedStatuses, selectedTypes, selectedCurrencies, selectedPaymentMethods], () =>
        fetchTransactions(merchantId, selectedProvider, selectedStatuses, selectedTypes, selectedCurrencies, selectedPaymentMethods)
    )
}

export const useTotalIncomingAmount = (merchantId: string, selectedDateRange: string | null, customDateRange?: DateRange) => {
    return useQuery(['totalIncomingAmount', merchantId, selectedDateRange, customDateRange], () =>
        fetchTotalIncomingAmount(merchantId, selectedDateRange, customDateRange)
    )
}

export const useTransactionCount = (merchantId: string, selectedDateRange: string | null, customDateRange?: DateRange) => {
    return useQuery(['transactionCount', merchantId, selectedDateRange, customDateRange], () =>
        fetchTransactionCount(merchantId, selectedDateRange, customDateRange)
    )
}
