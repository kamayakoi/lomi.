export interface Webhook {
    webhook_id: string
    merchant_id: string
    url: string
    authorized_events: webhook_event[]
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

export type webhook_event = 
    | 'new_payment'
    | 'new_subscription'
    | 'payment_status_change'
    | 'subscription_status_change'
    | 'payout_status_change'
    | 'payment_session_completed'
    | 'payment_session_expired'
    | 'invoice_paid'
    | 'payment_succeeded'
    | 'payment_pending'
    | 'payment_failed'
    | 'payment_token_status'
    | 'recurring';

export interface WebhookEventCategory {
    name: string;
    events: Array<{
        id: webhook_event;
        label: string;
    }>;
}

export const webhookCategories: WebhookEventCategory[] = [
    {
        name: "PAYMENTS",
        events: [
            { id: 'new_payment', label: 'New Payment' },
            { id: 'payment_succeeded', label: 'Payment Succeeded' },
            { id: 'payment_pending', label: 'Payment Pending' },
            { id: 'payment_failed', label: 'Payment Failed' },
            { id: 'payment_status_change', label: 'Payment Status Change' }
        ]
    },
    {
        name: "SUBSCRIPTIONS",
        events: [
            { id: 'new_subscription', label: 'New Subscription' },
            { id: 'subscription_status_change', label: 'Subscription Status Change' },
            { id: 'recurring', label: 'Recurring Payment' }
        ]
    },
    {
        name: "PAYMENT SESSIONS",
        events: [
            { id: 'payment_session_completed', label: 'Session Completed' },
            { id: 'payment_session_expired', label: 'Session Expired' },
            { id: 'payment_token_status', label: 'Token Status Change' }
        ]
    },
    {
        name: "PAYOUTS",
        events: [
            { id: 'payout_status_change', label: 'Payout Status Change' }
        ]
    },
    {
        name: "INVOICES",
        events: [
            { id: 'invoice_paid', label: 'Invoice Paid' }
        ]
    }
];
