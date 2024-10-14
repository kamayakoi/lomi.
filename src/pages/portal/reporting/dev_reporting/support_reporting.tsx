import { supabase } from '@/utils/supabase/client'
import { FetchNewCustomerCountParams, FetchRevenueByDateParams, FetchTopPerformingProductsParams, RevenueData, TransactionVolumeData, TopPerformingProduct, FetchTransactionVolumeByDateParams, FetchNewCustomerCountChangeParams, FetchTopPerformingSubscriptionsParams, TopPerformingSubscription, FetchProviderDistributionParams, ProviderDistribution } from './reporting-types'

export const fetchRevenueByDate = async ({ merchantId, startDate, endDate, granularity = 'day' }: FetchRevenueByDateParams) => {
    const { data, error } = await supabase.rpc('fetch_revenue_by_date', {
        p_merchant_id: merchantId,
        p_start_date: startDate,
        p_end_date: endDate,
        p_granularity: granularity,
    })

    if (error) {
        console.error('Error fetching revenue by date:', error)
        return []
    }

    return data as RevenueData[]
}

export const fetchTransactionVolumeByDate = async ({ merchantId, startDate, endDate }: FetchTransactionVolumeByDateParams) => {
    const { data, error } = await supabase.rpc('fetch_transaction_volume_by_date', {
        p_merchant_id: merchantId,
        p_start_date: startDate,
        p_end_date: endDate,
    })

    if (error) {
        console.error('Error fetching transaction volume by date:', error)
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

export const fetchNewCustomerCountChange = async ({ merchantId, startDate, endDate }: FetchNewCustomerCountChangeParams) => {
    const { data, error } = await supabase.rpc('fetch_new_customer_count_change', {
        p_merchant_id: merchantId,
        p_start_date: startDate,
        p_end_date: endDate,
    })

    if (error) {
        console.error('Error fetching new customer count change:', error)
        return 0
    }

    return data ?? 0
}

export const fetchTopPerformingSubscriptions = async ({ merchantId, startDate, endDate, limit = 4 }: FetchTopPerformingSubscriptionsParams) => {
    const { data, error } = await supabase.rpc('fetch_top_performing_subscriptions', {
        p_merchant_id: merchantId,
        p_start_date: startDate,
        p_end_date: endDate,
        p_limit: limit,
    })

    if (error) {
        console.error('Error fetching top performing subscriptions:', error)
        return []
    }

    return data as TopPerformingSubscription[]
}

export const fetchProviderDistribution = async ({ merchantId, startDate, endDate }: FetchProviderDistributionParams) => {
    const { data, error } = await supabase.rpc('fetch_provider_distribution', {
        p_merchant_id: merchantId,
        p_start_date: startDate,
        p_end_date: endDate,
    })

    if (error) {
        console.error('Error fetching provider distribution:', error)
        return []
    }

    return data as ProviderDistribution[]
}