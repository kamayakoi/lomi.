import { supabase } from '@/utils/supabase/client'
import { Subscription } from './types'

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

interface CreateSubscriptionData {
  merchantId: string
  organizationId: string
  customerId: string
  name: string
  description: string
  imageUrl: string
  startDate: Date
  billingFrequency: string
  amount: number
  currencyCode: string
  retryPaymentEvery: number
  totalRetries: number
  failedPaymentAction: string
  emailNotifications: Record<string, unknown>
  metadata: Record<string, unknown>
}

export const createSubscription = async (data: CreateSubscriptionData) => {
  const { error } = await supabase.rpc('create_subscription', {
    p_merchant_id: data.merchantId,
    p_organization_id: data.organizationId,
    p_customer_id: data.customerId,
    p_name: data.name,
    p_description: data.description,
    p_image_url: data.imageUrl,
    p_start_date: data.startDate,
    p_billing_frequency: data.billingFrequency,
    p_amount: data.amount,
    p_currency_code: data.currencyCode,
    p_retry_payment_every: data.retryPaymentEvery,
    p_total_retries: data.totalRetries,
    p_failed_payment_action: data.failedPaymentAction,
    p_email_notifications: data.emailNotifications,
    p_metadata: data.metadata,
  })

  if (error) {
    throw error
  }
}
