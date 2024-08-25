export interface User {
  user_id: number;
  name: string;
  email: string;
  phone_number: string;
  password_hash: string;
  is_admin: boolean;
  verified: boolean;
  user_type: string;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  organization_id: number;
  name: string;
  email: string;
  phone_number: string;
  country: string;
  status: string;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface UserOrganizationLink {
  id: number;
  user_id: number;
  organization_id: number;
  role: string;
  created_at: string;
}

export interface Provider {
  provider_id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentMethod {
  payment_method_id: number;
  name: string;
  description: string;
  provider_id: number;
  created_at: string;
  updated_at: string;
}

export interface OrganizationPaymentMethod {
  id: number;
  organization_id: number;
  payment_method_id: number;
  phone_number?: string;
  card_number?: string;
  created_at: string;
}

export interface Currency {
  currency_id: number;
  code: string;
  name: string;
}

export interface Account {
  account_id: number;
  user_id: number;
  payment_method_id: number;
  currency_id: number;
  created_at: string;
}

export interface MainAccount {
  main_account_id: number;
  user_id: number;
  currency_id: number;
  created_at: string;
}

export interface EndCustomer {
  end_customer_id: number;
  user_id: number;
  name: string;
  email?: string;
  phone_number?: string;
  country_code: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  transaction_id: number;
  end_customer_id: number;
  payment_method_id: number;
  organization_id: number;
  user_id: number;
  amount: number;
  fee_amount: number;
  fee_id: number;
  currency_id: number;
  status: string;
  transaction_type: string;
  payment_info: string;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface EndCustomerPaymentMethod {
  id: number;
  end_customer_id: number;
  payment_method_id: number;
  card_number?: string;
  created_at: string;
}

export interface Fee {
  fee_id: number;
  transaction_type: string;
  fee_percentage: number;
  fee_fixed: number;
  created_at: string;
  updated_at: string;
}

export interface Refund {
  refund_id: number;
  transaction_id: number;
  user_id: number;
  amount: number;
  currency_id: number;
  reason: string;
  created_at: string;
  updated_at: string;
}

export interface Entry {
  entry_id: number;
  account_id: number;
  amount: number;
  created_at: string;
}

export interface Transfer {
  transfer_id: number;
  from_account_id: number;
  to_account_id: number;
  amount: number;
  reason: string;
  created_at: string;
}

export interface Payout {
  payout_id: number;
  account_id: number;
  amount: number;
  currency_id: number;
  destination: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ApiKey {
  key_id: number;
  user_id: number;
  api_key: string;
  is_active: boolean;
  expiration_date: string;
  created_at: string;
  last_used_at: string;
}

export interface ApiProvider {
  provider_id: number;
  name: string;
  base_url: string;
  created_at: string;
  updated_at: string;
}

export interface ApiCredential {
  credential_id: number;
  provider_id: number;
  api_key: string;
  api_secret: string;
  created_at: string;
  updated_at: string;
}

export interface Webhook {
  webhook_id: number;
  user_id: number;
  url: string;
  events: string[];
  secret: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Log {
  log_id: number;
  user_id: number;
  action: string;
  details: any;
  created_at: string;
}