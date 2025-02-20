import { Database } from 'database.types'

type webhook_event = Database['public']['Enums']['webhook_event']
type Webhook = Database['public']['Tables']['webhooks']['Row']

export type { webhook_event, Webhook }

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
