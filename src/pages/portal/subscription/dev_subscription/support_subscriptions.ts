import { supabase } from '@/utils/supabase/client'
import { SubscriptionPlan, Subscription, Transaction, frequency, currency_code, failed_payment_action, FirstPaymentType } from './types'

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
  description?: string
  billingFrequency: frequency
  amount: number
  currencyCode: currency_code
  failedPaymentAction: failed_payment_action
  chargeDay?: number
  metadata: Record<string, unknown>
  firstPaymentType: FirstPaymentType
}

export const createSubscriptionPlan = async (data: CreateSubscriptionPlanData) => {
  const { data: organizationData, error: organizationError } = await supabase
    .rpc('fetch_organization_details', { p_merchant_id: data.merchantId })

  if (organizationError) {
    console.error('Error fetching organization details:', organizationError)
    throw organizationError
  }

  const { error } = await supabase.rpc('create_subscription_plan', {
    p_merchant_id: data.merchantId,
    p_organization_id: organizationData[0].organization_id,
    p_name: data.name,
    p_description: data.description,
    p_billing_frequency: data.billingFrequency,
    p_amount: data.amount,
    p_currency_code: data.currencyCode,
    p_failed_payment_action: data.failedPaymentAction,
    p_charge_day: data.chargeDay,
    p_metadata: data.metadata,
    p_first_payment_type: data.firstPaymentType,
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

interface UpdateSubscriptionPlanData {
  planId: string
  name: string
  description?: string
  billingFrequency: frequency
  amount: number
  failedPaymentAction: failed_payment_action
  chargeDay?: number
  metadata: Record<string, unknown>
}

export const updateSubscriptionPlan = async (data: UpdateSubscriptionPlanData) => {
  const { error } = await supabase.rpc('update_subscription_plan', {
    p_plan_id: data.planId,
    p_name: data.name,
    p_description: data.description,
    p_billing_frequency: data.billingFrequency,
    p_amount: data.amount.toString(),
    p_charge_day: data.chargeDay ?? null,
    p_failed_payment_action: data.failedPaymentAction,
    p_metadata: JSON.stringify(data.metadata),
  })

  if (error) {
    throw error
  }
}

export const deleteSubscriptionPlan = async (planId: string) => {
  const { error } = await supabase.rpc('delete_subscription_plan', {
    p_plan_id: planId,
  })

  if (error) {
    throw error
  }
}
