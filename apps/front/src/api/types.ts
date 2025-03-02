export interface Transaction {
  transaction_id: string;
  merchant_id: string;
  organization_id: string;
  customer_id: string;
  product_id: string;
  subscription_id: string;
  transaction_type: string;
  status: string;
  description: string;
  reference_id: string;
  metadata: Record<string, unknown>;
  gross_amount: number;
  fee_amount: number;
  net_amount: number;
  fee_reference: string;
  currency_code: string;
  provider_code: string;
  payment_method_code: string;
  created_at: string;
  updated_at: string;
  provider_transaction_id: string;
  provider_payment_status: string;
}

export interface Merchant {
  merchant_id: string;
  name: string;
  email: string;
  phone_number: string;
  onboarded: boolean;
  country: string;
  avatar_url: string;
  preferred_language: string;
  timezone: string;
  referral_code: string;
  pin_code: string;
  mrr: number;
  arr: number;
  merchant_lifetime_value: number;
  retry_payment_every: number;
  total_retries: number;
  subscription_notifications: Record<string, unknown>;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  deleted_at: string;
}

export interface Customer {
  customer_id: string;
  merchant_id: string;
  organization_id: string;
  name: string;
  email: string;
  phone_number: string;
  country: string;
  city: string;
  address: string;
  postal_code: string;
  is_business: boolean;
  is_deleted: boolean;
  deleted_at: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}
