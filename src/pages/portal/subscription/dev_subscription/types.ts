export type subscription_status = 'pending' | 'active' | 'paused' | 'cancelled' | 'expired' | 'past_due' | 'trial';
export type frequency = 'weekly' | 'bi-weekly' | 'monthly' | 'bi-monthly' | 'quarterly' | 'semi-annual' | 'yearly' | 'one-time';
export type currency_code = 'XOF' | 'USD' | 'EUR';
export type failed_payment_action = 'cancel' | 'pause' | 'continue';
export type FirstPaymentType = 'initial' | 'non_initial';
export type SubscriptionLength = 'automatic' | 'fixed';

export interface SubscriptionPlan {
    plan_id: string;
    merchant_id: string;
    organization_id: string;
    name: string;
    description?: string;
    billing_frequency: frequency;
    amount: number;
    currency_code: currency_code;
    failed_payment_action?: failed_payment_action;
    charge_day?: number;
    metadata?: Record<string, unknown>;
    created_at: string;
    updated_at: string;
    first_payment_type: FirstPaymentType;
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
    amount: number
    currency_code: currency_code
}

export interface Transaction {
    transaction_id: string
    description: string
    gross_amount: number
    currency_code: string
    created_at: string
}

export interface SubscriptionPlanFormData {
    merchant_id: string
    name: string
    description: string
    billing_frequency: frequency
    amount: number
    currency_code: 'XOF'
    subscription_length: SubscriptionLength
    fixed_charges?: number
    failed_payment_action: failed_payment_action
    first_payment_type: FirstPaymentType
    collection_day?: number
    metadata: Record<string, unknown>
}
