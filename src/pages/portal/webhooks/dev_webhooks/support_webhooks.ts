import { supabase } from '@/utils/supabase/client'
import { Webhook, webhook_event } from './types'

export const fetchWebhooks = async (
  merchantId: string,
  event: webhook_event | 'all',
  isActive: 'active' | 'inactive' | 'all'
) => {
  const { data, error } = await supabase.rpc('fetch_webhooks', {
    p_merchant_id: merchantId,
    p_event: event === 'all' ? null : event,
    p_is_active: isActive === 'all' ? null : isActive === 'active'
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

export const fetchWebhookDetails = async (webhookId: string) => {
  const { data, error } = await supabase.rpc('fetch_webhook_details', {
    p_webhook_id: webhookId,
  })

  if (error) {
    console.error('Error fetching webhook details:', error)
    return null
  }

  return data[0] as Webhook
}

export const deleteWebhook = async (webhookId: string) => {
  const { error } = await supabase.rpc('delete_webhook', {
    p_webhook_id: webhookId,
  })

  if (error) {
    console.error('Error deleting webhook:', error)
    throw error
  }
}
