import { supabase } from '@/utils/supabase/client'
import { SubscriptionPlan, Subscription, Transaction } from './types'

export const fetchSubscriptionPlans = async (
  merchantId: string,
  page: number,
  pageSize: number
) => {
  const { data, error } = await supabase.rpc('fetch_subscription_plans', {
    p_merchant_id: merchantId,
    p_page: page,
    p_page_size: pageSize,
  })

  if (error) {
    console.error('Error fetching subscription plans:', error)
    return []
  }

  return data as SubscriptionPlan[]
}

export const fetchSubscriptions = async (
  merchantId: string,
  status: string | null,
  page: number,
  pageSize: number
) => {
  const { data, error } = await supabase.rpc('fetch_subscriptions', {
    p_merchant_id: merchantId,
    p_status: status === 'all' ? null : status,
    p_page: page,
    p_page_size: pageSize,
  })

  if (error) {
    console.error('Error fetching subscriptions:', error)
    return []
  }

  return data as Subscription[]
}

export const fetchSubscriptionPlan = async (planId: string) => {
  const { data, error } = await supabase
    .from('subscription_plans')
    .select('name')
    .eq('plan_id', planId)
    .single()

  if (error) {
    console.error('Error fetching subscription plan:', error)
    return null
  }

  return data as SubscriptionPlan
}

interface CreateSubscriptionPlanData {
  merchantId: string
  name: string
  description: string
  billingFrequency: string
  amount: number
  currencyCode: string
  retryPaymentEvery: number
  totalRetries: number
  failedPaymentAction: string
  emailNotifications: Record<string, unknown>
  metadata: Record<string, unknown>
}

export const createSubscriptionPlan = async (data: CreateSubscriptionPlanData) => {
  const { error } = await supabase.rpc('create_subscription_plan', {
    p_merchant_id: data.merchantId,
    p_name: data.name,
    // ...
  })

  if (error) {
    throw error
  }
}

export const fetchSubscriptionTransactions = async (subscriptionId: string) => {
    const { data, error } = await supabase
        .rpc('fetch_subscription_transactions', { p_subscription_id: subscriptionId })

    if (error) {
        console.error('Error fetching subscription transactions:', error)
        return []
    }

    return data as Transaction[]
}
