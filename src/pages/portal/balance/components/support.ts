import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/utils/supabase/client'
import { Payout, payout_status, BankAccount, BalanceBreakdown } from './types'
import { DateRange } from 'react-day-picker'
import { subDays, subMonths, startOfYear, format, parse } from 'date-fns'
import { fr } from 'date-fns/locale'

export async function fetchPayouts(
    merchantId: string,
    statuses: string[],
    page: number,
    pageSize: number
): Promise<Payout[]> {
    try {
        const { data, error } = await supabase.rpc('fetch_payouts', {
            p_merchant_id: merchantId,
            p_statuses: statuses,
            p_page_number: page,
            p_page_size: pageSize,
        })

        if (error) {
            throw error
        }

        return data as Payout[]
    } catch (error) {
        console.error('Error fetching payouts:', error)
        return []
    }
}

export function usePayoutCount(accountId: string, startDate?: string, endDate?: string) {
    return useQuery(['payoutCount', accountId, startDate, endDate], async () => {
        const { data, error } = await supabase.rpc('fetch_payout_count', {
            p_account_id: accountId,
            p_start_date: startDate,
            p_end_date: endDate,
        })

        if (error) {
            console.error('Error fetching payout count:', error)
            throw error
        }

        return data as number
    })
}

export function applySearch(payouts: Payout[], searchTerm: string): Payout[] {
    if (!searchTerm) return payouts

    const lowerCaseSearchTerm = searchTerm.toLowerCase()
    const frenchMonths = [
        'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
        'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
    ]

    const keywordSearches: [string, (payout: Payout) => boolean][] = [
        ['2 derniers jours', (payout) => {
            const twoDaysAgo = subDays(new Date(), 2)
            return new Date(payout.created_at) >= twoDaysAgo
        }],
        ['3 derniers mois', (payout) => {
            const threeMonthsAgo = subMonths(new Date(), 3)
            return new Date(payout.created_at) >= threeMonthsAgo
        }],
        ['derniers mois', (payout) => {
            const sixMonthsAgo = subMonths(new Date(), 6)
            return new Date(payout.created_at) >= sixMonthsAgo
        }],
        ['dernière année', (payout) => {
            const oneYearAgo = subMonths(new Date(), 12)
            return new Date(payout.created_at) >= oneYearAgo
        }],
        ['ce mois-ci', (payout) => {
            const thisMonth = new Date()
            return new Date(payout.created_at).getMonth() === thisMonth.getMonth() &&
                new Date(payout.created_at).getFullYear() === thisMonth.getFullYear()
        }],
        ['aujourd\'hui', (payout) => {
            const today = new Date()
            return new Date(payout.created_at).toDateString() === today.toDateString()
        }],
        ['hier', (payout) => {
            const yesterday = subDays(new Date(), 1)
            return new Date(payout.created_at).toDateString() === yesterday.toDateString()
        }],
    ]

    const keywordSearch = keywordSearches.find(([keyword]) =>
        lowerCaseSearchTerm.includes(keyword)
    )

    if (keywordSearch) {
        return payouts.filter(keywordSearch[1])
    }

    const dateSearch = lowerCaseSearchTerm.match(/(\d{1,2})\s+(janv\.|févr\.|mars|avr\.|mai|juin|juil\.|août|sept\.|oct\.|nov\.|déc\.)\s+(\d{4})/i)
    if (dateSearch) {
        const [, day, month, year] = dateSearch
        const searchDate = parse(`${day} ${month} ${year}`, 'dd MMM yyyy', new Date(), { locale: fr })
        return payouts.filter((payout) => {
            const payoutDate = new Date(payout.created_at)
            return payoutDate.toDateString() === searchDate.toDateString()
        })
    }

    const monthYearSearch = lowerCaseSearchTerm.match(/(janv\.|févr\.|mars|avr\.|mai|juin|juil\.|août|sept\.|oct\.|nov\.|déc\.)\s+(\d{4})/i)
    if (monthYearSearch) {
        const [, month, year] = monthYearSearch
        const searchDate = parse(`01 ${month} ${year}`, 'dd MMM yyyy', new Date(), { locale: fr })
        return payouts.filter((payout) => {
            const payoutDate = new Date(payout.created_at)
            return payoutDate.getMonth() === searchDate.getMonth() &&
                payoutDate.getFullYear() === searchDate.getFullYear()
        })
    }

    return payouts.filter((payout) => {
        const { payout_id, amount, currency_code, status, created_at } = payout
        const lowerCaseStatus = formatPayoutStatus(status).toLowerCase()
        const formattedDate = format(new Date(created_at), 'MMM d, yyyy').toLowerCase()
        const frenchFormattedDate = format(new Date(created_at), 'd MMM yyyy', { locale: fr }).toLowerCase()

        return (
            payout_id.toLowerCase().includes(lowerCaseSearchTerm) ||
            amount.toString().includes(lowerCaseSearchTerm) ||
            currency_code.toLowerCase().includes(lowerCaseSearchTerm) ||
            lowerCaseStatus.includes(lowerCaseSearchTerm) ||
            formattedDate.includes(lowerCaseSearchTerm) ||
            frenchFormattedDate.includes(lowerCaseSearchTerm) ||
            frenchMonths.some(month => frenchFormattedDate.includes(month) && month.includes(lowerCaseSearchTerm))
        )
    })
}

function formatPayoutStatus(status: payout_status): string {
    switch (status) {
        case 'pending':
            return 'Pending'
        case 'processing':
            return 'Processing'
        case 'completed':
            return 'Completed'
        case 'failed':
            return 'Failed'
        default:
            return status
    }
}

export function applyDateFilter(payouts: Payout[], dateRange: string | null, customDateRange?: DateRange): Payout[] {
    if (!dateRange) return payouts

    const now = new Date()
    let startDate: Date | undefined
    let endDate: Date | undefined

    switch (dateRange) {
        case '24H':
            startDate = subDays(now, 1)
            break
        case '7D':
            startDate = subDays(now, 7)
            break
        case '1M':
            startDate = subMonths(now, 1)
            break
        case '3M':
            startDate = subMonths(now, 3)
            break
        case '6M':
            startDate = subMonths(now, 6)
            break
        case 'YTD':
            startDate = startOfYear(now)
            break
        case 'custom':
            if (customDateRange) {
                startDate = customDateRange.from
                endDate = customDateRange.to
            }
            break
    }

    return payouts.filter((payout) => {
        const payoutDate = new Date(payout.created_at)
        return (
            (!startDate || payoutDate >= startDate) &&
            (!endDate || payoutDate <= endDate)
        )
    })
}

export function useBalance(userId: string | null) {
    return useQuery(['balance', userId], async () => {
        if (!userId) {
            return 0
        }

        const { data, error } = await supabase.rpc('fetch_balance_breakdown', {
            p_merchant_id: userId,
        })

        if (error) {
            console.error('Error fetching balance:', error)
            throw error
        }

        return data ?? 0
    })
}

export async function fetchBankAccounts(merchantId: string): Promise<BankAccount[]> {
    try {
        const { data, error } = await supabase.rpc('fetch_merchant_bank_accounts', {
            p_merchant_id: merchantId,
        })

        if (error) {
            throw error
        }

        return data as BankAccount[]
    } catch (error) {
        console.error('Error fetching bank accounts:', error)
        return []
    }
}

export async function initiateWithdrawal(
    merchantId: string,
    amount: number,
    bankAccountId: string
): Promise<{ success: boolean; message?: string }> {
    try {
        const { data, error } = await supabase.rpc('initiate_withdrawal', {
            p_merchant_id: merchantId,
            p_amount: amount,
            p_bank_account_id: bankAccountId,
        })

        if (error) {
            throw error
        }

        return data[0] as { success: boolean; message: string }
    } catch (error) {
        console.error('Error initiating withdrawal:', error)
        return { success: false, message: 'Failed to initiate withdrawal' }
    }
}

export async function fetchBankAccountDetails(bankAccountId: string): Promise<BankAccount | null> {
    try {
        const { data, error } = await supabase
            .from('merchant_bank_accounts')
            .select('*')
            .eq('bank_account_id', bankAccountId)
            .single()

        if (error) {
            throw error
        }

        return data as BankAccount
    } catch (error) {
        console.error('Error fetching bank account details:', error)
        return null
    }
}

export function useBalanceBreakdown(userId: string | null) {
    return useQuery(['balanceBreakdown', userId], async () => {
        if (!userId) {
            return {
                available_balance: 0,
                pending_balance: 0,
                total_balance: 0,
            }
        }

        const { data, error } = await supabase.rpc('fetch_balance_breakdown', {
            p_merchant_id: userId,
        })

        if (error) {
            console.error('Error fetching balance breakdown:', error)
            throw error
        }

        return data[0] as BalanceBreakdown
    })
}
