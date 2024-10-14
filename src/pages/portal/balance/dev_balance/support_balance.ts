import { useQuery } from 'react-query'
import { supabase } from '@/utils/supabase/client'
import { FetchedPayout, Payout, payout_status } from './types'
import { DateRange } from 'react-day-picker'
import { subDays, subMonths, startOfYear, format, parse } from 'date-fns'
import { fr } from 'date-fns/locale'

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
    const frenchMonths = [
        'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
        'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
    ]

    const keywordSearches: [string, (payout: Payout) => boolean][] = [
        ['2 derniers jours', (payout) => {
            const twoDaysAgo = subDays(new Date(), 2)
            return new Date(payout.date) >= twoDaysAgo
        }],
        ['3 derniers mois', (payout) => {
            const threeMonthsAgo = subMonths(new Date(), 3)
            return new Date(payout.date) >= threeMonthsAgo
        }],
        ['derniers mois', (payout) => {
            const sixMonthsAgo = subMonths(new Date(), 6)
            return new Date(payout.date) >= sixMonthsAgo
        }],
        ['dernière année', (payout) => {
            const oneYearAgo = subMonths(new Date(), 12)
            return new Date(payout.date) >= oneYearAgo
        }],
        ['ce mois-ci', (payout) => {
            const thisMonth = new Date()
            return new Date(payout.date).getMonth() === thisMonth.getMonth() &&
                new Date(payout.date).getFullYear() === thisMonth.getFullYear()
        }],
        ['aujourd\'hui', (payout) => {
            const today = new Date()
            return new Date(payout.date).toDateString() === today.toDateString()
        }],
        ['hier', (payout) => {
            const yesterday = subDays(new Date(), 1)
            return new Date(payout.date).toDateString() === yesterday.toDateString()
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
            const payoutDate = new Date(payout.date)
            return payoutDate.toDateString() === searchDate.toDateString()
        })
    }

    const monthYearSearch = lowerCaseSearchTerm.match(/(janv\.|févr\.|mars|avr\.|mai|juin|juil\.|août|sept\.|oct\.|nov\.|déc\.)\s+(\d{4})/i)
    if (monthYearSearch) {
        const [, month, year] = monthYearSearch
        const searchDate = parse(`01 ${month} ${year}`, 'dd MMM yyyy', new Date(), { locale: fr })
        return payouts.filter((payout) => {
            const payoutDate = new Date(payout.date)
            return payoutDate.getMonth() === searchDate.getMonth() &&
                payoutDate.getFullYear() === searchDate.getFullYear()
        })
    }

    return payouts.filter((payout) => {
        const { payout_id, amount, currency, payout_method, status, date } = payout
        const lowerCasePayoutMethod = payout_method.toLowerCase()
        const lowerCaseStatus = formatPayoutStatus(status).toLowerCase()
        const formattedDate = format(new Date(date), 'MMM d, yyyy').toLowerCase()
        const frenchFormattedDate = format(new Date(date), 'd MMM yyyy', { locale: fr }).toLowerCase()

        return (
            payout_id.toLowerCase().includes(lowerCaseSearchTerm) ||
            amount.toString().includes(lowerCaseSearchTerm) ||
            currency.toLowerCase().includes(lowerCaseSearchTerm) ||
            lowerCasePayoutMethod.includes(lowerCaseSearchTerm) ||
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
