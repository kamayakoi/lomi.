export type subscription_status = 'pending' | 'active' | 'paused' | 'cancelled' | 'expired' | 'past_due' | 'trial';
export type frequency = 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'yearly' | 'one-time';
export type currency_code = 'XOF' | 'USD' | 'EUR';

export interface SubscriptionPlan {
    plan_id: string;
    merchant_id: string;
    organization_id: string;
    name: string;
    description?: string;
    billing_frequency: frequency;
    amount: number;
    currency_code: currency_code;
    retry_payment_every?: number;
    total_retries?: number;
    failed_payment_action?: string;
    email_notifications?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
    created_at: string;
    updated_at: string;
}

export interface Subscription {
    subscription_id: string
    plan_id: string
    plan_name: string
    customer_id: string
    customer_name: string
    status: string
    start_date: string
    end_date: string | null
    next_billing_date: string | null
    metadata: Record<string, unknown>
    created_at: string
    updated_at: string
}

export interface Transaction {
    transaction_id: string
    description: string
    gross_amount: number
    currency_code: string
    created_at: string
}
