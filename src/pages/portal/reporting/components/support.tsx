import { supabase } from '@/utils/supabase/client'
import { FetchRevenueByDateParams, FetchTopPerformingProductsParams, FetchTransactionVolumeByDateParams, FetchTopPerformingSubscriptionPlansParams, RevenueData, TopPerformingProduct, TransactionVolumeData, TopPerformingSubscriptionPlan, FetchProviderDistributionParams, ProviderDistribution } from './types'

export const fetchRevenueByDate = async ({ merchantId, startDate, endDate }: FetchRevenueByDateParams) => {
    if (!merchantId || !startDate || !endDate) {
        console.error('Missing required parameters:', { merchantId, startDate, endDate })
        return []
    }

    try {
        const { data, error } = await supabase.rpc('fetch_revenue_custom_range', {
            p_merchant_id: merchantId,
            p_start_date: startDate,
            p_end_date: endDate
        })

        if (error) {
            console.error('Error fetching revenue by date:', error)
            return []
        }

        interface RevenueDataItem {
            date: string
            revenue: string
        }

        return data.map((item: RevenueDataItem) => ({
            date: item.date,
            revenue: parseFloat(item.revenue),
        })) as RevenueData[]
    } catch (error) {
        console.error('Error in fetchRevenueByDate:', error)
        return []
    }
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

export const fetchTopPerformingSubscriptionPlans = async ({ merchantId, startDate, endDate, limit = 4 }: FetchTopPerformingSubscriptionPlansParams) => {
    const { data, error } = await supabase.rpc('fetch_top_performing_subscription_plans', {
        p_merchant_id: merchantId,
        p_start_date: startDate,
        p_end_date: endDate,
        p_limit: limit,
    })

    if (error) {
        console.error('Error fetching top performing subscription plans:', error)
        return []
    }

    return data as TopPerformingSubscriptionPlan[]
}

interface ProviderDistributionDataItem {
    date: string;
    provider_code: string;
    transaction_count: string;
}

export const fetchProviderDistribution = async ({ merchantId, startDate, endDate }: FetchProviderDistributionParams) => {
    // Debug logging
    console.log('Fetching provider distribution with params:', {
        merchantId,
        startDate,
        endDate
    })

    if (!merchantId) {
        console.error('Missing merchantId parameter')
        return []
    }

    if (!startDate) {
        console.error('Missing startDate parameter')
        return []
    }

    if (!endDate) {
        console.error('Missing endDate parameter')
        return []
    }

    try {
        const { data, error } = await supabase
            .rpc('fetch_provider_distribution_custom_range', {
                p_merchant_id: merchantId,
                p_start_date: startDate,
                p_end_date: endDate
            })

        if (error) {
            console.error('Supabase error fetching provider distribution:', error)
            return []
        }

        if (!data) {
            console.error('No data returned from provider distribution query')
            return []
        }

        return data.map((item: ProviderDistributionDataItem) => ({
            date: item.date,
            provider_code: item.provider_code,
            transaction_count: parseInt(item.transaction_count)
        })) as ProviderDistribution[]
    } catch (error) {
        console.error('Error in fetchProviderDistribution:', error)
        return []
    }
}

export const fetchMRRMetrics = async ({ merchantId, startDate, endDate }: FetchRevenueByDateParams) => {
    if (!merchantId || !startDate || !endDate) {
        console.error('Missing required parameters:', { merchantId, startDate, endDate })
        return []
    }

    try {
        const { data, error } = await supabase.rpc('fetch_mrr_metrics_custom_range', {
            p_merchant_id: merchantId,
            p_start_date: startDate,
            p_end_date: endDate
        })

        if (error) {
            console.error('Error fetching MRR metrics:', error)
            return []
        }

        return data.map((item: any) => ({
            date: item.date,
            mrr: parseFloat(item.mrr)
        }))
    } catch (error) {
        console.error('Error in fetchMRRMetrics:', error)
        return []
    }
}
