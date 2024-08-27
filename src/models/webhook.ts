import { supabase } from '@/utils/supabase/client';
import { Database } from '@/../database.types';

type Webhook = Database['public']['Tables']['webhooks']['Row'];
type WebhookInsert = Database['public']['Tables']['webhooks']['Insert'];
type WebhookUpdate = Database['public']['Tables']['webhooks']['Update'];

export async function createWebhook(webhookData: WebhookInsert): Promise<Webhook | null> {
  const { data, error } = await supabase
    .rpc('create_webhook', webhookData);

  if (error) {
    console.error('Error creating webhook:', error);
    return null;
  }

  return data;
}

export async function getWebhookById(webhookId: string): Promise<Webhook | null> {
  const { data, error } = await supabase
    .rpc('get_webhook_by_id', { p_webhook_id: webhookId });

  if (error) {
    console.error('Error retrieving webhook:', error);
    return null;
  }

  return data;
}

export async function updateWebhook(webhookId: string, updates: WebhookUpdate): Promise<Webhook | null> {
  const { data, error } = await supabase
    .rpc('update_webhook', { p_webhook_id: webhookId, ...updates });

  if (error) {
    console.error('Error updating webhook:', error);
    return null;
  }

  return data;
}

export async function deleteWebhook(webhookId: string): Promise<boolean> {
  const { data, error } = await supabase
    .rpc('delete_webhook', { p_webhook_id: webhookId });

  if (error) {
    console.error('Error deleting webhook:', error);
    return false;
  }

  return data;
}