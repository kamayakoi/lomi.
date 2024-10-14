import { supabase } from '@/utils/supabase/client'
import { FetchRevenueByDateParams, FetchTopPerformingProductsParams, FetchTransactionVolumeByDateParams, FetchTopPerformingSubscriptionsParams, RevenueData, TopPerformingProduct, TransactionVolumeData, TopPerformingSubscription, FetchProviderDistributionParams, ProviderDistribution } from './types'

export const fetchRevenueByDate = async ({ merchantId, startDate, endDate, granularity = 'day' }: FetchRevenueByDateParams) => {
    let query = supabase.rpc('fetch_revenue_by_date', {
        p_merchant_id: merchantId,
        p_start_date: startDate,
        p_end_date: endDate,
        p_granularity: granularity,
    })

    if (granularity === '24H') {
        query = supabase.rpc('fetch_revenue_last_24_hours', {
            p_merchant_id: merchantId,
        })
    } else if (granularity === '7D') {
        query = supabase.rpc('fetch_revenue_last_7_days', {
            p_merchant_id: merchantId,
        })
    } else if (granularity === '1M') {
        query = supabase.rpc('fetch_revenue_last_1_month', {
            p_merchant_id: merchantId,
        })
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching revenue by date:', error)
        return []
    }

    interface RevenueDataItem {
        date?: string
        hour?: string
        revenue: string
    }

    return data.map((item: RevenueDataItem) => ({
        date: item.date || item.hour,
        revenue: parseFloat(item.revenue),
    })) as RevenueData[]
}

export const fetchTransactionVolumeByDate = async ({ merchantId, startDate, endDate, granularity = 'day' }: FetchTransactionVolumeByDateParams) => {
    let query = supabase.rpc('fetch_transaction_volume_by_date', {
        p_merchant_id: merchantId,
        p_start_date: startDate,
        p_end_date: endDate,
        p_granularity: granularity,
    })

    if (granularity === '24H') {
        query = supabase.rpc('fetch_transaction_volume_last_24_hours', {
            p_merchant_id: merchantId,
        })
    } else if (granularity === '7D') {
        query = supabase.rpc('fetch_transaction_volume_last_7_days', {
            p_merchant_id: merchantId,
        })
    } else if (granularity === '1M') {
        query = supabase.rpc('fetch_transaction_volume_last_1_month', {
            p_merchant_id: merchantId,
        })
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching transaction volume by date:', error)
        return []
    }

    interface TransactionVolumeDataItem {
        date?: string
        hour?: string
        transaction_count: string
    }

    return data.map((item: TransactionVolumeDataItem) => ({
        date: item.date || item.hour,
        transaction_count: parseInt(item.transaction_count),
    })) as TransactionVolumeData[]
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