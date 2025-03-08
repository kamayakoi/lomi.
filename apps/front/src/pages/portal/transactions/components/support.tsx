import { format } from 'date-fns'
import { supabase } from '@/utils/supabase/client'
import { Transaction, FetchedTransaction } from './types'
import { DateRange } from 'react-day-picker'
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query'
import { Database } from 'database.types'

export const fetchTransactions = async (
    merchantId: string,
    selectedProvider: string | null,
    selectedStatuses: string[],
    selectedTypes: string[],
    selectedCurrencies: string[],
    selectedPaymentMethods: string[],
    page: number,
    pageSize: number,
    selectedDateRange: string | null = null,
    customDateRange?: DateRange
) => {
    if (!merchantId) {
        console.warn('Merchant ID is empty. Skipping transactions fetch.')
        return []
    }

    console.log('fetchTransactions called with filters:', {
        merchantId,
        selectedProvider,
        selectedStatuses,
        selectedTypes,
        selectedCurrencies,
        selectedPaymentMethods,
        page,
        pageSize,
        selectedDateRange,
        customDateRange
    })

    // Get date range for filtering
    const { startDate, endDate } = getDateRange(selectedDateRange, customDateRange)

    const formattedStartDate = startDate ? formatDateParam(startDate) : undefined
    const formattedEndDate = endDate ? formatDateParam(endDate) : undefined

    console.log('Formatted dates for database:', { formattedStartDate, formattedEndDate })

    const params = {
        p_merchant_id: merchantId,
        p_provider_code: selectedProvider === 'all' ? undefined : selectedProvider as Database['public']['Enums']['provider_code'],
        p_status: selectedStatuses.length > 0 ? selectedStatuses as Database['public']['Enums']['transaction_status'][] : undefined,
        p_type: selectedTypes.length > 0 ? selectedTypes as Database['public']['Enums']['transaction_type'][] : undefined,
        p_currency: selectedCurrencies.length > 0 ? selectedCurrencies as Database['public']['Enums']['currency_code'][] : undefined,
        p_payment_method: selectedPaymentMethods.length > 0 ? selectedPaymentMethods as Database['public']['Enums']['payment_method_code'][] : undefined,
        p_page: page,
        p_page_size: pageSize,
        p_start_date: formattedStartDate,
        p_end_date: formattedEndDate
    }

    console.log('Database params:', params)

    const { data, error } = await supabase.rpc('fetch_transactions', params)

    if (error) {
        console.error('Error fetching transactions:', error)
        return []
    }

    console.log('Fetched transactions count:', data?.length || 0)

    const transactions = data.map((transaction: FetchedTransaction) => ({
        transaction_id: transaction.transaction_id,
        customer_name: transaction.customer_name,
        customer_email: transaction.customer_email,
        customer_phone: transaction.customer_phone,
        customer_country: transaction.customer_country,
        customer_city: transaction.customer_city,
        customer_address: transaction.customer_address,
        customer_postal_code: transaction.customer_postal_code,
        gross_amount: transaction.gross_amount,
        net_amount: transaction.net_amount,
        currency: transaction.currency_code,
        payment_method: transaction.payment_method_code,
        status: transaction.status,
        type: transaction.transaction_type,
        date: format(new Date(transaction.created_at), 'yyyy-MM-dd HH:mm:ss'),
        provider_code: transaction.provider_code,
        product_id: transaction.product_id,
        product_name: transaction.product_name,
        product_description: transaction.product_description,
        product_price: transaction.product_price,
    }))

    const transactionsWithSubscriptions = await Promise.all(
        transactions.map(async (transaction: Transaction) => {
            if (transaction.type === 'instalment') {
                const { data: subscriptionData, error: subscriptionError } = await supabase
                    .rpc('fetch_subscription_data', { p_transaction_id: transaction.transaction_id });

                if (subscriptionError) {
                    console.error('Error fetching subscription data:', subscriptionError);
                } else if (subscriptionData && subscriptionData.length > 0) {
                    const subscription = subscriptionData[0];
                    return {
                        ...transaction,
                        subscription_id: subscription?.subscription_id,
                        plan_name: subscription?.plan_name,
                        plan_description: subscription?.plan_description,
                        plan_billing_frequency: subscription?.plan_billing_frequency,
                        subscription_end_date: subscription?.subscription_end_date,
                        subscription_next_billing_date: subscription?.subscription_next_billing_date,
                        subscription_status: subscription?.subscription_status,
                    };
                }
            }
            return transaction;
        })
    );

    return transactionsWithSubscriptions;
}

const getDateRange = (selectedDateRange: string | null, customDateRange?: DateRange) => {
    let startDate: Date | undefined
    let endDate: Date | undefined

    console.log('getDateRange called with:', { selectedDateRange, customDateRange })

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
            case '6M':
                startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())
                endDate = now
                break
            case 'YTD':
                startDate = new Date(now.getFullYear(), 0, 1)
                endDate = now
                break
        }
    }

    console.log('Date range calculated:', { startDate, endDate })
    return { startDate, endDate }
}

const formatDateParam = (date: Date | undefined): string | undefined => {
    if (!date) return undefined;

    // Format date as ISO string without timezone for PostgreSQL
    return format(date, 'yyyy-MM-dd HH:mm:ss');
}

export const fetchTotalIncomingAmount = async (merchantId: string, selectedDateRange: string | null, customDateRange?: DateRange) => {
    if (!merchantId) {
        console.warn('Merchant ID is empty. Skipping total incoming amount fetch.')
        return 0
    }

    const { startDate, endDate } = getDateRange(selectedDateRange, customDateRange)

    const { data, error } = await supabase.rpc('fetch_total_incoming_amount', {
        p_merchant_id: merchantId,
        p_start_date: formatDateParam(startDate),
        p_end_date: formatDateParam(endDate),
    })

    if (error) {
        console.error('Error fetching total incoming amount:', error)
        return 0
    }

    return data
}

export const fetchTransactionCount = async (merchantId: string, selectedDateRange: string | null, customDateRange?: DateRange) => {
    if (!merchantId) {
        console.warn('Merchant ID is empty. Skipping transaction count fetch.')
        return 0
    }

    const { startDate, endDate } = getDateRange(selectedDateRange, customDateRange)

    const { data, error } = await supabase.rpc('fetch_transaction_count', {
        p_merchant_id: merchantId,
        p_start_date: formatDateParam(startDate),
        p_end_date: formatDateParam(endDate),
    })

    if (error) {
        console.error('Error fetching transaction count:', error)
        return 0
    }

    return data
}

export const fetchCompletionRate = async (merchantId: string, selectedDateRange: string | null, customDateRange?: DateRange) => {
    if (!merchantId) {
        console.warn('Merchant ID is empty. Skipping completion rate fetch.')
        return { completed: 0, refunded: 0, failed: 0 }
    }

    const { startDate, endDate } = getDateRange(selectedDateRange, customDateRange)

    const { data, error } = await supabase.rpc('fetch_completion_rate', {
        p_merchant_id: merchantId,
        p_start_date: formatDateParam(startDate),
        p_end_date: formatDateParam(endDate),
    })

    if (error) {
        console.error('Error fetching completion rate:', error)
        return { completed: 0, refunded: 0, failed: 0 }
    }

    if (data?.[0]) {
        const stats = data[0]
        return {
            completed: Number(stats?.completed ?? 0),
            refunded: Number(stats?.refunded ?? 0),
            failed: Number(stats?.failed ?? 0),
        }
    }

    return { completed: 0, refunded: 0, failed: 0 }
}

export const fetchGrossAmount = async (merchantId: string, selectedDateRange: string | null, customDateRange?: DateRange) => {
    if (!merchantId) {
        console.warn('Merchant ID is empty. Skipping gross amount fetch.')
        return 0
    }

    const { startDate, endDate } = getDateRange(selectedDateRange, customDateRange)

    const { data, error } = await supabase.rpc('fetch_gross_amount', {
        p_merchant_id: merchantId,
        p_start_date: formatDateParam(startDate),
        p_end_date: formatDateParam(endDate),
    })

    if (error) {
        console.error('Error fetching gross amount:', error)
        return 0
    }

    return data
}

export const fetchFeeAmount = async (merchantId: string, selectedDateRange: string | null, customDateRange?: DateRange) => {
    if (!merchantId) {
        console.warn('Merchant ID is empty. Skipping fee amount fetch.')
        return 0
    }

    const { startDate, endDate } = getDateRange(selectedDateRange, customDateRange)

    const { data, error } = await supabase.rpc('fetch_fee_amount', {
        p_merchant_id: merchantId,
        p_start_date: formatDateParam(startDate),
        p_end_date: formatDateParam(endDate),
    })

    if (error) {
        console.error('Error fetching fee amount:', error)
        return 0
    }

    return data
}

export const fetchAverageTransactionValue = async (merchantId: string, selectedDateRange: string | null, customDateRange?: DateRange) => {
    if (!merchantId) {
        console.warn('Merchant ID is empty. Skipping average transaction value fetch.')
        return 0
    }

    const { startDate, endDate } = getDateRange(selectedDateRange, customDateRange)

    const { data, error } = await supabase.rpc('fetch_average_transaction_value', {
        p_merchant_id: merchantId,
        p_start_date: formatDateParam(startDate),
        p_end_date: formatDateParam(endDate),
    })

    if (error) {
        console.error('Error fetching average transaction value:', error)
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
        case '6M':
            startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())
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

export function useTransactions(
    merchantId: string,
    selectedProvider: string | null,
    selectedStatuses: string[],
    selectedTypes: string[],
    selectedCurrencies: string[],
    selectedPaymentMethods: string[],
    page: number,
    pageSize: number,
    selectedDateRange: string | null = null,
    customDateRange?: DateRange
): UseQueryResult<Transaction[], Error> {
    return useQuery<Transaction[], Error>({
        queryKey: ['transactions', merchantId, selectedProvider, selectedStatuses, selectedTypes, selectedCurrencies, selectedPaymentMethods, page, pageSize, selectedDateRange, customDateRange] as const,
        queryFn: () => fetchTransactions(merchantId, selectedProvider, selectedStatuses, selectedTypes, selectedCurrencies, selectedPaymentMethods, page, pageSize, selectedDateRange, customDateRange),
        placeholderData: (previousData) => previousData,
        gcTime: 5 * 60 * 1000,
        staleTime: 2 * 60 * 1000,
        enabled: !!merchantId
    })
}

export function useTotalIncomingAmount(
    merchantId: string,
    selectedDateRange: string | null,
    customDateRange?: DateRange,
    options?: UseQueryOptions<number, Error>
): UseQueryResult<number, Error> {
    return useQuery<number, Error>({
        queryKey: ['totalIncomingAmount', merchantId, selectedDateRange, customDateRange] as const,
        queryFn: () => fetchTotalIncomingAmount(merchantId, selectedDateRange, customDateRange),
        ...options
    })
}

export function useTransactionCount(
    merchantId: string,
    selectedDateRange: string | null,
    customDateRange?: DateRange,
    options?: UseQueryOptions<number, Error>
): UseQueryResult<number, Error> {
    return useQuery<number, Error>({
        queryKey: ['transactionCount', merchantId, selectedDateRange, customDateRange] as const,
        queryFn: () => fetchTransactionCount(merchantId, selectedDateRange, customDateRange),
        ...options
    })
}

interface CompletionRateData {
    completed: number;
    refunded: number;
    failed: number;
}

export function useCompletionRate(
    merchantId: string,
    selectedDateRange: string | null,
    customDateRange?: DateRange,
    options?: UseQueryOptions<CompletionRateData, Error>
): UseQueryResult<CompletionRateData, Error> {
    return useQuery<CompletionRateData, Error>({
        queryKey: ['completionRate', merchantId, selectedDateRange, customDateRange] as const,
        queryFn: () => fetchCompletionRate(merchantId, selectedDateRange, customDateRange),
        ...options
    })
}

export function useGrossAmount(
    merchantId: string,
    selectedDateRange: string | null,
    customDateRange?: DateRange,
    options?: UseQueryOptions<number, Error>
): UseQueryResult<number, Error> {
    return useQuery<number, Error>({
        queryKey: ['grossAmount', merchantId, selectedDateRange, customDateRange] as const,
        queryFn: () => fetchGrossAmount(merchantId, selectedDateRange, customDateRange),
        ...options
    })
}

export function useFeeAmount(
    merchantId: string,
    selectedDateRange: string | null,
    customDateRange?: DateRange,
    options?: UseQueryOptions<number, Error>
): UseQueryResult<number, Error> {
    return useQuery<number, Error>({
        queryKey: ['feeAmount', merchantId, selectedDateRange, customDateRange] as const,
        queryFn: () => fetchFeeAmount(merchantId, selectedDateRange, customDateRange),
        ...options
    })
}

export function useAverageTransactionValue(
    merchantId: string,
    selectedDateRange: string | null,
    customDateRange?: DateRange,
    options?: UseQueryOptions<number, Error>
): UseQueryResult<number, Error> {
    return useQuery<number, Error>({
        queryKey: ['averageTransactionValue', merchantId, selectedDateRange, customDateRange] as const,
        queryFn: () => fetchAverageTransactionValue(merchantId, selectedDateRange, customDateRange),
        ...options
    })
}

export const fetchAverageCustomerLifetimeValue = async (merchantId: string, selectedDateRange: string | null, customDateRange?: DateRange) => {
    if (!merchantId) {
        console.warn('Merchant ID is empty. Skipping average customer lifetime value fetch.')
        return 0
    }

    const { startDate, endDate } = getDateRange(selectedDateRange, customDateRange)

    const { data, error } = await supabase.rpc('fetch_average_customer_lifetime_value', {
        p_merchant_id: merchantId,
        p_start_date: formatDateParam(startDate),
        p_end_date: formatDateParam(endDate),
    })

    if (error) {
        console.error('Error fetching average customer lifetime value:', error)
        return 0
    }

    return data
}

export const fetchAverageRetentionRate = async (merchantId: string, selectedDateRange: string | null, customDateRange?: DateRange) => {
    if (!merchantId) {
        console.warn('Merchant ID is empty. Skipping average retention rate fetch.')
        return 0
    }

    const { startDate, endDate } = getDateRange(selectedDateRange, customDateRange)

    const { data, error } = await supabase.rpc('fetch_average_retention_rate', {
        p_merchant_id: merchantId,
        p_start_date: formatDateParam(startDate),
        p_end_date: formatDateParam(endDate),
    })

    if (error) {
        console.error('Error fetching average retention rate:', error)
        return 0
    }

    return data
}

export function useAverageCustomerLifetimeValue(
    merchantId: string,
    selectedDateRange: string | null,
    customDateRange?: DateRange,
    options?: UseQueryOptions<number, Error>
): UseQueryResult<number, Error> {
    return useQuery<number, Error>({
        queryKey: ['averageCustomerLifetimeValue', merchantId, selectedDateRange, customDateRange] as const,
        queryFn: () => fetchAverageCustomerLifetimeValue(merchantId, selectedDateRange, customDateRange),
        ...options
    })
}

export function useAverageRetentionRate(
    merchantId: string,
    selectedDateRange: string | null,
    customDateRange?: DateRange,
    options?: UseQueryOptions<number, Error>
): UseQueryResult<number, Error> {
    return useQuery<number, Error>({
        queryKey: ['averageRetentionRate', merchantId, selectedDateRange, customDateRange] as const,
        queryFn: () => fetchAverageRetentionRate(merchantId, selectedDateRange, customDateRange),
        ...options
    })
}
