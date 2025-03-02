import { supabase } from "../../../src/utils/supabase/client"
import type { Database } from '../../../database.types'

export type Subscription = Database['public']['Tables']['merchant_subscriptions']['Row']
export type SubscriptionInsert = Database['public']['Tables']['merchant_subscriptions']['Insert']
export type SubscriptionUpdate = Database['public']['Tables']['merchant_subscriptions']['Update']

export type SubscriptionPlan = Database['public']['Tables']['subscription_plans']['Row']
export type SubscriptionPlanInsert = Database['public']['Tables']['subscription_plans']['Insert']
export type SubscriptionPlanUpdate = Database['public']['Tables']['subscription_plans']['Update']

export async function fetchSubscriptions({
  merchantId,
  customerId,
  planId,
  page = 1,
  pageSize = 50,
  status,
}: {
  merchantId: string
  customerId?: string
  planId?: string
  page?: number
  pageSize?: number
  status?: Database['public']['Enums']['subscription_status']
}) {
  const query = supabase
    .from('merchant_subscriptions')
    .select(`
      subscription_id,
      status,
      plan:subscription_plans(name),
      customer:customers(name),
      created_at,
      updated_at,
      next_billing_date,
      end_date
    `)
    .eq('merchant_id', merchantId)
    
  if (customerId) {
    query.eq('customer_id', customerId)
  }
  
  if (planId) {
    query.eq('plan_id', planId)
  }
  
  if (status) {
    query.eq('status', status)
  }
  
  return query
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize)
}

export async function fetchSubscription(subscriptionId: string) {
  return supabase
    .from('merchant_subscriptions')
    .select(`
      subscription_id,
      status,
      plan:subscription_plans(
        name,
        description,
        price,
        currency_code,
        billing_frequency,
        trial_period_days
      ),
      customer:customers(
        name,
        email,
        phone_number,
        country,
        city,
        address,
        postal_code
      ),
      created_at,
      updated_at,
      next_billing_date,
      end_date
    `)
    .eq('subscription_id', subscriptionId)
    .single()
}

export async function fetchSubscriptionTransactions(subscriptionId: string) {
  return supabase
    .from('transactions')
    .select(`
      transaction_id,
      amount,
      currency_code,
      status,
      created_at
    `)
    .eq('subscription_id', subscriptionId)
    .order('created_at', { ascending: false })
}

export async function fetchSubscriptionPlans({
  merchantId,
  page = 1,
  pageSize = 50
}: {
  merchantId: string
  page?: number
  pageSize?: number
}) {
  return supabase
    .from('subscription_plans')
    .select('*')
    .eq('merchant_id', merchantId)
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize)
}

export async function fetchSubscriptionPlan(planId: string) {
  return supabase
    .from('subscription_plans')
    .select('*')
    .eq('plan_id', planId)
    .single()
}

export async function createSubscriptionPlan(plan: SubscriptionPlanInsert) {
  return supabase
    .from('subscription_plans')
    .insert(plan)
    .select()
    .single()
}

export async function updateSubscriptionPlan(planId: string, updates: SubscriptionPlanUpdate) {
  return supabase
    .from('subscription_plans')
    .update(updates)
    .eq('plan_id', planId)
    .select()
    .single()
}

export async function deleteSubscriptionPlan(planId: string) {
  return supabase
    .from('subscription_plans')
    .delete()
    .eq('plan_id', planId)
}

export async function updateSubscriptionStatus(
  subscriptionId: string,
  status: Database['public']['Enums']['subscription_status']
) {
  return supabase
    .from('merchant_subscriptions')
    .update({ status })
    .eq('subscription_id', subscriptionId)
    .select()
    .single()
} 