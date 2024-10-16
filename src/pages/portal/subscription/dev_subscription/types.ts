export type subscription_status = 'pending' | 'active' | 'paused' | 'cancelled' | 'expired' | 'past_due' | 'trial';
export type frequency = 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'quaterly' | 'yearly' | 'one-time';
export type currency_code = 'XOF' | 'USD' | 'EUR';

export interface Subscription {
    subscription_id: string;
    merchant_id: string;
    organization_id: string;
    customer_id: string;
    name: string;
    description?: string;
    status: subscription_status;
    image_url?: string;
    start_date: string;
    end_date?: string;
    next_billing_date?: string;
    billing_frequency: frequency;
    amount: number;
    currency_code: currency_code;
    retry_payment_every?: number;
    total_retries?: number;
    failed_payment_action?: string;
    email_notifications?: Record<string, unknown>;
    created_at: string;
    updated_at: string;
}