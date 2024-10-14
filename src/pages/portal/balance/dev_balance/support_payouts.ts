import { useQuery } from 'react-query'
import { supabase } from '@/utils/supabase/client'
import { FetchedPayout, Payout } from './types'
import { DateRange } from 'react-day-picker'
import { subDays, subMonths, startOfYear } from 'date-fns'

export async function fetchPayouts(
    merchantId: string,
    statuses: string[],
    page: number,
    pageSize: number
): Promise<Payout[]> {
    const { data, error } = await supabase.rpc('fetch_payouts', {
        p_merchant_id: merchantId,
        p_status: statuses.length > 0 ? statuses : null,
        p_page: page,
        p_page_size: pageSize,
    })

    if (error) {
        console.error('Error fetching payouts:', error)
        throw error
    }

    return data.map(mapFetchedPayoutToPayout)
}

export function usePayoutCount(merchantId: string, startDate?: string, endDate?: string) {
    return useQuery(['payoutCount', merchantId, startDate, endDate], async () => {
        const { data, error } = await supabase.rpc('fetch_payout_count', {
            p_merchant_id: merchantId,
            p_start_date: startDate,
            p_end_date: endDate,
        })

        if (error) {
            console.error('Error fetching payout count:', error)
            throw error
        }

        return data
    })
}

export function applySearch(payouts: Payout[], searchTerm: string): Payout[] {
    if (!searchTerm) return payouts

    const lowerCaseSearchTerm = searchTerm.toLowerCase()

    return payouts.filter((payout) =>
        Object.values(payout).some((value) =>
            String(value).toLowerCase().includes(lowerCaseSearchTerm)
        )
    )
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
        const payoutDate = new Date(payout.date)
        return (
            (!startDate || payoutDate >= startDate) &&
            (!endDate || payoutDate <= endDate)
        )
    })
}

function mapFetchedPayoutToPayout(fetchedPayout: FetchedPayout): Payout {
    return {
        payout_id: fetchedPayout.payout_id,
        amount: fetchedPayout.amount,
        currency: fetchedPayout.currency_code,
        payout_method: fetchedPayout.payout_method,
        bank_account_number: fetchedPayout.bank_account_number,
        bank_name: fetchedPayout.bank_name,
        bank_code: fetchedPayout.bank_code,
        phone_number: fetchedPayout.phone_number,
        status: fetchedPayout.status,
        date: fetchedPayout.created_at,
        provider_code: fetchedPayout.provider_code,
    }
}

export function useBalance(merchantId: string) {
    return useQuery(['balance', merchantId], async () => {
        const { data, error } = await supabase.rpc('fetch_balance', {
            p_merchant_id: merchantId,
        })

        if (error) {
            console.error('Error fetching balance:', error)
            throw error
        }

        return data
    })
}
