import { supabase } from '@/utils/supabase/client'
import { Webhook, webhook_event } from './types'
import { Json } from 'database.types';

export interface CreateWebhookData {
    url: string;
    authorized_events: webhook_event[];
}

export async function createWebhook(data: CreateWebhookData): Promise<Webhook> {
    // Get the current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
        throw new Error(userError.message);
    }
    
    if (!userData.user) {
        throw new Error('User not authenticated');
    }

    // Call the fixed SQL function to create the webhook
    try {
        const { data: webhook, error } = await supabase.rpc('create_organization_webhook', {
            p_merchant_id: userData.user.id,
            p_url: data.url,
            p_authorized_events: data.authorized_events,
        });

        if (error) {
            console.error('Error creating webhook:', error);
            throw new Error(error.message || 'Failed to create webhook');
        }

        return webhook;
    } catch (error) {
        // Better error handling
        console.error('Error creating webhook:', error);
        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error('Unknown error occurred while creating webhook');
        }
    }
}

export async function fetchWebhooks(
    merchant_id: string,
    event?: webhook_event | 'all',
    status?: 'active' | 'inactive' | 'all',
    searchTerm = ''
): Promise<Webhook[]> {
    try {
        const { data: webhooks, error } = await supabase.rpc('fetch_organization_webhooks', {
            p_merchant_id: merchant_id,
            p_event: event === 'all' ? undefined : event as webhook_event,
            p_is_active: status === 'all' ? undefined : status === 'active',
            p_search_term: searchTerm || undefined
        });

        if (error) {
            console.error('Error fetching webhooks:', error);
            
            // Check if it's a 404 error (function not found)
            if (error.code === '404' || error.message?.includes('404')) {
                console.warn('The RPC function fetch_organization_webhooks might not exist in your Supabase instance.');
                throw new Error('The RPC function fetch_organization_webhooks does not exist in your Supabase instance.');
            }
            
            throw error;
        }
        
        return webhooks || [];
    } catch (error) {
        console.error('Exception when fetching webhooks:', error);
        throw error;
    }
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
        p_last_payload: payload as Json
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
