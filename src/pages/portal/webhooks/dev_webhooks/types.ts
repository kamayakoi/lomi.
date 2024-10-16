export interface Webhook {
    webhook_id: string
    merchant_id: string
    url: string
    event: webhook_event
    is_active: boolean
    last_triggered_at: string
    last_payload: Record<string, unknown>
    last_response_status: number
    last_response_body: string
    retry_count: number
    metadata: Record<string, unknown>
    created_at: string
    updated_at: string
}

export type webhook_event = 'new_payment' | 'new_subscription' | 'payment_status_change' | 'subscription_status_change';
