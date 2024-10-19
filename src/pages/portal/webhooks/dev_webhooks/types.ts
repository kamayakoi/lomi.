export interface Webhook {
    webhook_id: string
    merchant_id: string
    url: string
    event: webhook_event
    is_active: boolean
    last_triggered_at: string | null
    last_payload: Record<string, unknown> | null
    last_response_status: number | null
    last_response_body: string | null
    retry_count: number | null
    metadata: Record<string, unknown> | null
    created_at: string
    updated_at: string
}

export type webhook_event = 'new_payment' | 'new_subscription' | 'payment_status_change' | 'subscription_status_change';
