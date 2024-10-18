import { supabase } from '@/utils/supabase/client'
import { Webhook, webhook_event } from './types'

export const fetchWebhooks = async (
  merchantId: string,
  event: webhook_event | null,
  isActive: string | null,
  page: number,
  pageSize: number
) => {
  const { data, error } = await supabase.rpc('fetch_webhooks', {
    p_merchant_id: merchantId,
    p_event: event === null ? null : event,
    p_is_active: isActive === 'all' ? null : (isActive === 'active'),
    p_page: page,
    p_page_size: pageSize,
  })

  if (error) {
    console.error('Error fetching webhooks:', error)
    return []
  }

  return data as Webhook[]
}

interface CreateWebhookData {
  merchantId: string
  url: string
  event: webhook_event
  isActive?: boolean
  metadata?: Record<string, unknown>
}

export const createWebhook = async (data: CreateWebhookData) => {
  const { data: webhookId, error } = await supabase.rpc('create_webhook', {
    p_merchant_id: data.merchantId,
    p_url: data.url,
    p_event: data.event,
    p_is_active: data.isActive ?? true,
    p_metadata: data.metadata ?? {},
  })

  if (error) {
    throw error
  }

  return webhookId as string
}
