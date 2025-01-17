import { supabase } from '@/utils/supabase/client'
import { Webhook, webhook_event } from './types'

export interface CreateWebhookData {
    url: string;
    authorized_events: webhook_event[];
}

export async function createWebhook(data: CreateWebhookData): Promise<Webhook> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: webhook, error } = await supabase.rpc('create_organization_webhook', {
        p_merchant_id: user.id,
        p_url: data.url,
        p_authorized_events: data.authorized_events,
        p_is_active: true,
        p_metadata: {}
    });

    if (error) throw error;
    return webhook;
}

export async function fetchWebhooks(
    merchant_id: string,
    event?: webhook_event | 'all',
    status?: 'active' | 'inactive' | 'all'
): Promise<Webhook[]> {
    const { data: webhooks, error } = await supabase.rpc('fetch_organization_webhooks', {
        p_merchant_id: merchant_id,
        p_event: event === 'all' ? null : event,
        p_is_active: status === 'all' ? null : status === 'active'
    });

    if (error) throw error;
    return webhooks || [];
}

export async function updateWebhookDeliveryStatus(
    webhook_id: string,
    status: number,
    responseBody: string,
    payload: Record<string, unknown>
): Promise<boolean> {
    const { error } = await supabase.rpc('update_webhook_delivery_status', {
        p_webhook_id: webhook_id,
        p_last_response_status: status,
        p_last_response_body: responseBody,
        p_last_payload: payload
    });

    if (error) throw error;
    return true;
}

export async function updateWebhook(
    webhook_id: string,
    data: {
        url: string;
        authorized_events: webhook_event[];
        is_active: boolean;
        metadata?: Record<string, unknown>;
    }
): Promise<Webhook> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: webhook, error } = await supabase.rpc('update_organization_webhook', {
        p_merchant_id: user.id,
        p_webhook_id: webhook_id,
        p_url: data.url,
        p_authorized_events: data.authorized_events,
        p_is_active: data.is_active,
        p_metadata: data.metadata || {}
    });

    if (error) throw error;
    return webhook;
}

export async function deleteWebhook(webhook_id: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase.rpc('delete_organization_webhook', {
        p_webhook_id: webhook_id,
        p_merchant_id: user.id
    });

    if (error) throw error;
    return true;
}

export async function testWebhook(webhook_id: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase.rpc('test_organization_webhook', {
        p_webhook_id: webhook_id,
        p_merchant_id: user.id
    });

    if (error) throw error;
    return true;
}
