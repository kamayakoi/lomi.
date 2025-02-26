import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { supabase } from '@/utils/supabase/client'
import { Payout, payout_status, BankAccount, BalanceBreakdown, currency_code, conversion_type, CurrencyConversion, ConversionRate } from './types'
import { DateRange } from 'react-day-picker'
import { subDays, subMonths, startOfYear, format, parse } from 'date-fns'
import { fr } from 'date-fns/locale'
import { getConversionRates, findConversionRate } from './currency-utils'

export async function fetchPayouts(
    merchantId: string,
    statuses: payout_status[],
    page: number,
    pageSize: number
): Promise<Payout[]> {
    try {
        const { data, error } = await supabase.rpc('fetch_payouts', {
            p_merchant_id: merchantId,
            p_statuses: statuses,
            p_page_number: page,
            p_page_size: pageSize
        })

        if (error) {
            console.error('Error fetching payouts:', error)
            return []
        }

        return data as Payout[]
    } catch (error) {
        console.error('Error fetching payouts:', error)
        return []
    }
}

export function usePayouts(userId: string | null, selectedStatuses: payout_status[]): UseQueryResult<Payout[], Error> {
    return useQuery<Payout[], Error>({
        queryKey: ['payouts', userId, selectedStatuses] as const,
        queryFn: async () => {
            if (!userId) {
                return []
            }
            return fetchPayouts(userId, selectedStatuses, 1, 10)
        },
        enabled: !!userId,
    })
}

export function usePayoutCount(accountId: string, startDate?: string, endDate?: string): UseQueryResult<number, Error> {
    return useQuery<number, Error>({
        queryKey: ['payoutCount', accountId, startDate, endDate] as const,
        queryFn: async () => {
            const { data, error } = await supabase.rpc('fetch_payout_count', {
                p_account_id: accountId,
                p_start_date: startDate || '1970-01-01',
                p_end_date: endDate || new Date().toISOString()
            })

            if (error) {
                console.error('Error fetching payout count:', error)
                return 0
            }

            return data || 0
        },
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
    return useQuery({
        queryKey: ['balance', userId] as const,
        queryFn: async () => {
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
        }
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
    bankAccountId: string,
    currencyCode: currency_code = 'XOF'
): Promise<{ success: boolean; message?: string }> {
    try {
        const { data, error } = await supabase.rpc('initiate_withdrawal', {
            p_merchant_id: merchantId,
            p_amount: amount,
            p_bank_account_id: bankAccountId,
            p_currency_code: currencyCode,
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
    return useQuery<BalanceBreakdown[], Error>({
        queryKey: ['balanceBreakdown', userId] as const,
        queryFn: async () => {
            if (!userId) {
                return []
            }

            const { data, error } = await supabase.rpc('fetch_balance_breakdown', {
                p_merchant_id: userId,
            })

            if (error) {
                console.error('Error fetching balance breakdown:', error)
                throw error
            }

            // Return the array of balance breakdowns
            return data as BalanceBreakdown[] || []
        },
        enabled: !!userId,
    })
}

// Update the useConversionRates hook
export function useConversionRates() {
    return useQuery<ConversionRate[], Error>({
        queryKey: ['conversionRates'],
        queryFn: async () => {
            const { data, error } = await supabase.rpc('fetch_latest_conversion_rates');
            
            if (error) {
                console.error('Error fetching conversion rates:', error);
                throw error;
            }
            
            return data || [];
        },
        gcTime: 30 * 60 * 1000, // Cache for 30 minutes
        staleTime: 5 * 60 * 1000 // Consider stale after 5 minutes
    });
}

// Update the fetchConversionRates function
export async function fetchConversionRates(fromCurrency?: currency_code, toCurrency?: currency_code): Promise<ConversionRate[]> {
    try {
        const { data, error } = await supabase.rpc('fetch_latest_conversion_rates', {
            p_from_currency: fromCurrency,
            p_to_currency: toCurrency
        });

        if (error) {
            console.error('Error fetching conversion rates:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error in fetchConversionRates:', error);
        return [];
    }
}

// Update the saveConversionRates function
export async function saveConversionRatesToDB(fromCurrency: currency_code, toCurrency: currency_code, rate: number): Promise<boolean> {
    try {
        const { data, error } = await supabase.rpc('save_conversion_rates', {
            p_from_currency: fromCurrency,
            p_to_currency: toCurrency,
            p_rate: rate
        });

        if (error) {
            console.error('Error saving conversion rates:', error);
            return false;
        }

        return data && data[0] && data[0].success;
    } catch (error) {
        console.error('Error in saveConversionRatesToDB:', error);
        return false;
    }
}

// Convert currency using the database function
export async function convertCurrencyDB(
    amount: number,
    fromCurrency: currency_code,
    toCurrency: currency_code,
    merchantId?: string,
    organizationId?: string,
    conversionType: conversion_type = 'manual',
    referenceId?: string
): Promise<number> {
    try {
        if (fromCurrency === toCurrency) return amount;

        const { data, error } = await supabase.rpc('convert_currency', {
            p_amount: amount,
            p_from_currency: fromCurrency,
            p_to_currency: toCurrency,
            p_merchant_id: merchantId,
            p_organization_id: organizationId,
            p_conversion_type: conversionType,
            p_reference_id: referenceId
        });

        if (error) {
            console.error('Error converting currency using DB:', error);
            // Fallback to client-side conversion
            const rates = getConversionRates();
            const rate = findConversionRate(rates, fromCurrency, toCurrency);
            
            if (rate !== null) {
                return amount * rate;
            }
            
            // Hardcoded fallback if all else fails
            if (fromCurrency === 'XOF' && toCurrency === 'USD') {
                return amount * 0.00165;
            } else if (fromCurrency === 'USD' && toCurrency === 'XOF') {
                return amount * 605;
            }
            
            return amount;
        }

        return data;
    } catch (error) {
        console.error('Error in convertCurrencyDB:', error);
        // Fallback to client-side conversion
        const rates = getConversionRates();
        const rate = findConversionRate(rates, fromCurrency, toCurrency);
        
        if (rate !== null) {
            return amount * rate;
        }
        
        // Hardcoded fallback if all else fails
        if (fromCurrency === 'XOF' && toCurrency === 'USD') {
            return amount * 0.00165;
        } else if (fromCurrency === 'USD' && toCurrency === 'XOF') {
            return amount * 605;
        }
        
        return amount;
    }
}

// Fetch conversion history
export async function fetchConversionHistory(
    merchantId: string,
    fromDate?: string,
    toDate?: string,
    conversionType?: conversion_type
): Promise<CurrencyConversion[]> {
    try {
        let query = supabase
            .from('currency_conversion_history')
            .select('*')
            .eq('merchant_id', merchantId)
            .order('created_at', { ascending: false });

        if (fromDate) {
            query = query.gte('created_at', fromDate);
        }
        if (toDate) {
            query = query.lte('created_at', toDate);
        }
        if (conversionType) {
            query = query.eq('conversion_type', conversionType);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching conversion history:', error);
            return [];
        }

        return data as CurrencyConversion[];
    } catch (error) {
        console.error('Error in fetchConversionHistory:', error);
        return [];
    }
}

// React Query hook for conversion history
export function useConversionHistory(
    merchantId: string | null,
    fromDate?: string,
    toDate?: string,
    conversionType?: conversion_type
) {
    return useQuery<CurrencyConversion[], Error>({
        queryKey: ['conversionHistory', merchantId, fromDate, toDate, conversionType],
        queryFn: () => 
            merchantId 
                ? fetchConversionHistory(merchantId, fromDate, toDate, conversionType)
                : Promise.resolve([]),
        enabled: !!merchantId
    });
}
