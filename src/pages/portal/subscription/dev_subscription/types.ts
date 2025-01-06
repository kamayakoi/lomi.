export type subscription_status = 'pending' | 'active' | 'paused' | 'cancelled' | 'expired' | 'past_due' | 'trial';
export type frequency = 'weekly' | 'bi-weekly' | 'monthly' | 'bi-monthly' | 'quarterly' | 'semi-annual' | 'yearly' | 'one-time';
export type currency_code = 'XOF' | 'USD' | 'EUR';
export type failed_payment_action = 'cancel' | 'pause' | 'continue';
export type FirstPaymentType = 'initial' | 'non_initial';
export type SubscriptionLength = 'automatic' | 'fixed';

export const frequencyColors: Record<frequency, string> = {
  'weekly': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'bi-weekly': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  'monthly': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'bi-monthly': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  'quarterly': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
  'semi-annual': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  'yearly': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  'one-time': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
} as const;

export interface SubscriptionPlan {
    plan_id: string;
    name: string;
    description: string | null;
    billing_frequency: frequency;
    amount: number;
    currency_code: string;
    failed_payment_action?: failed_payment_action;
    charge_day?: number;
    metadata: Record<string, unknown>;
    image_url: string | null;
    is_active: boolean;
    display_on_storefront: boolean;
    merchant_id: string;
    organization_id: string;
}

export interface Subscription {
    subscription_id: string;
    plan_id: string;
    plan_name: string;
    customer_id: string;
    customer_name: string;
    status: subscription_status;
    start_date: string;
    end_date: string | null;
    next_billing_date: string | null;
    metadata: Record<string, unknown>;
    created_at: string;
    updated_at: string;
    amount: number;
    currency_code: currency_code;
}

export interface Transaction {
    transaction_id: string;
    description: string;
    gross_amount: number;
    currency_code: currency_code;
    created_at: string;
}

export interface SubscriptionPlanFormData {
    merchant_id: string;
    name: string;
    description: string;
    billing_frequency: frequency;
    amount: number;
    currency_code: currency_code;
    subscription_length: SubscriptionLength;
    fixed_charges?: number;
    failed_payment_action: failed_payment_action;
    first_payment_type: FirstPaymentType;
    collection_day?: number;
    metadata: Record<string, unknown>;
}
