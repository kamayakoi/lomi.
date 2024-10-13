import { supabase } from '@/utils/supabase/client'
import { FetchNewCustomerCountParams, FetchPaymentChannelDistributionParams, FetchRevenueByMonthParams, FetchTopPerformingProductsParams, FetchTransactionVolumeByDayParams, CalculateConversionRateParams, RevenueData, TransactionVolumeData, TopPerformingProduct, PaymentChannelDistribution } from '../reporting-types'

export const fetchRevenueByMonth = async ({ merchantId, startDate, endDate }: FetchRevenueByMonthParams) => {
    const { data, error } = await supabase.rpc('fetch_revenue_by_month', {
        p_merchant_id: merchantId,
        p_start_date: startDate,
        p_end_date: endDate,
    })

    if (error) {
        console.error('Error fetching revenue by month:', error)
        return []
    }

    return data as RevenueData[]
}

export const fetchTransactionVolumeByDay = async ({ merchantId, startDate, endDate }: FetchTransactionVolumeByDayParams) => {
    const { data, error } = await supabase.rpc('fetch_transaction_volume_by_day', {
        p_merchant_id: merchantId,
        p_start_date: startDate,
        p_end_date: endDate,
    })

    if (error) {
        console.error('Error fetching transaction volume by day:', error)
        return []
    }

    return data as TransactionVolumeData[]
}

export const fetchTopPerformingProducts = async ({ merchantId, startDate, endDate, limit = 4 }: FetchTopPerformingProductsParams) => {
    const { data, error } = await supabase.rpc('fetch_top_performing_products', {
        p_merchant_id: merchantId,
        p_start_date: startDate,
        p_end_date: endDate,
        p_limit: limit,
    })

    if (error) {
        console.error('Error fetching top performing products:', error)
        return []
    }

    return data as TopPerformingProduct[]
}

export const fetchPaymentChannelDistribution = async ({ merchantId, startDate, endDate }: FetchPaymentChannelDistributionParams) => {
    const { data, error } = await supabase.rpc('fetch_payment_channel_distribution', {
        p_merchant_id: merchantId,
        p_start_date: startDate,
        p_end_date: endDate,
    })

    if (error) {
        console.error('Error fetching payment channel distribution:', error)
        return []
    }

    return data as PaymentChannelDistribution[]
}

export const fetchNewCustomerCount = async ({ merchantId, startDate, endDate }: FetchNewCustomerCountParams) => {
    const { data, error } = await supabase.rpc('fetch_new_customer_count', {
        p_merchant_id: merchantId,
        p_start_date: startDate,
        p_end_date: endDate,
    })

    if (error) {
        console.error('Error fetching new customer count:', error)
        return 0
    }

    return data as number
}

export const calculateConversionRate = async ({ merchantId, startDate, endDate }: CalculateConversionRateParams) => {
    const { data, error } = await supabase.rpc('calculate_conversion_rate', {
        p_merchant_id: merchantId,
        p_start_date: startDate,
        p_end_date: endDate,
    })

    if (error) {
        console.error('Error calculating conversion rate:', error)
        return 0
    }

    return data as number
}

// ... similar functions for other reporting data ...
