// Generated TypeScript types from OpenAPI specification

export enum CurrencyCode {
  XOF = 'XOF',
  USD = 'USD',
  EUR = 'EUR',
}

export enum TransactionType {
  payment = 'payment',
  instalment = 'instalment',
}

export enum TransactionStatus {
  pending = 'pending',
  completed = 'completed',
  failed = 'failed',
  refunded = 'refunded',
}

export enum ProviderCode {
  ORANGE = 'ORANGE',
  WAVE = 'WAVE',
  ECOBANK = 'ECOBANK',
  MTN = 'MTN',
  NOWPAYMENTS = 'NOWPAYMENTS',
  APPLE = 'APPLE',
  GOOGLE = 'GOOGLE',
  MOOV = 'MOOV',
  AIRTEL = 'AIRTEL',
  MPESA = 'MPESA',
  WIZALL = 'WIZALL',
  OPAY = 'OPAY',
  OTHER = 'OTHER',
}

export enum PaymentMethodCode {
  CARDS = 'CARDS',
  MOBILE_MONEY = 'MOBILE_MONEY',
  E_WALLET = 'E_WALLET',
  APPLE_PAY = 'APPLE_PAY',
  GOOGLE_PAY = 'GOOGLE_PAY',
  USSD = 'USSD',
  QR_CODE = 'QR_CODE',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CRYPTO = 'CRYPTO',
  OTHER = 'OTHER',
}

export enum BillingFrequency {
  weekly = 'weekly',
  bi_weekly = 'bi-weekly',
  monthly = 'monthly',
  bi_monthly = 'bi-monthly',
  quarterly = 'quarterly',
  semi_annual = 'semi-annual',
  yearly = 'yearly',
  one_time = 'one-time',
}

export enum FailedPaymentAction {
  cancel = 'cancel',
  pause = 'pause',
  continue = 'continue',
}

export enum FirstPaymentType {
  initial = 'initial',
  non_initial = 'non_initial',
}

export interface Error extends Record<string, unknown> {
  code?: string;
  message?: string;
  details?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface Merchant extends Record<string, unknown> {
  merchant_id?: string;
  name?: string;
  email?: string;
  phone_number?: string;
  onboarded?: boolean;
  country?: string;
  avatar_url?: string;
  preferred_language?: string;
  timezone?: string;
  metadata?: Record<string, unknown>;
  created_at?: Date;
  updated_at?: Date;
  [key: string]: unknown;
}

export interface ConnectedProvider extends Record<string, unknown> {
  provider_code?: ProviderCode;
  is_connected?: boolean;
  phone_number?: string;
  is_phone_verified?: boolean;
  metadata?: Record<string, unknown>;
  created_at?: Date;
  updated_at?: Date;
  [key: string]: unknown;
}

export interface CreateProduct extends Record<string, unknown> {
  name: string;
  description?: string;
  price: number;
  currency_code: CurrencyCode;
  image_url?: string;
  is_active?: boolean;
  display_on_storefront?: boolean;
  [key: string]: unknown;
}

export interface Product extends Record<string, unknown> {
  // Extends CreateProduct
  product_id?: string;
  merchant_id?: string;
  organization_id?: string;
  created_at?: Date;
  updated_at?: Date;
  [key: string]: unknown;
}

export interface CreateSubscriptionPlan extends Record<string, unknown> {
  name: string;
  description?: string;
  amount: number;
  currency_code: CurrencyCode;
  billing_frequency: BillingFrequency;
  failed_payment_action?: FailedPaymentAction;
  charge_day?: number;
  metadata?: Record<string, unknown>;
  display_on_storefront?: boolean;
  image_url?: string;
  first_payment_type?: FirstPaymentType;
  [key: string]: unknown;
}

export interface SubscriptionPlan extends Record<string, unknown> {
  // Extends CreateSubscriptionPlan
  plan_id?: string;
  merchant_id?: string;
  organization_id?: string;
  created_at?: Date;
  updated_at?: Date;
  [key: string]: unknown;
}

export interface CreateTransaction extends Record<string, unknown> {
  merchant_id: string;
  organization_id: string;
  customer_id: string;
  product_id?: string;
  subscription_id?: string;
  transaction_type: TransactionType;
  description?: string;
  reference_id: string;
  metadata?: Record<string, unknown>;
  gross_amount: number;
  fee_amount: number;
  net_amount: number;
  fee_reference: string;
  currency_code: CurrencyCode;
  provider_code: ProviderCode;
  payment_method_code: PaymentMethodCode;
  additional_fees?: Array<Record<string, unknown>>;
  [key: string]: unknown;
}

export interface Transaction extends Record<string, unknown> {
  // Extends CreateTransaction
  transaction_id?: string;
  status?: TransactionStatus;
  created_at?: Date;
  updated_at?: Date;
  [key: string]: unknown;
}

export interface CreateCheckoutSession extends Record<string, unknown> {
  merchant_id: string;
  product_id?: string;
  subscription_id?: string;
  success_url: string;
  cancel_url: string;
  provider_codes: Array<ProviderCode>;
  customer_email?: string;
  customer_phone?: string;
  customer_name?: string;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface CheckoutSession extends Record<string, unknown> {
  // Extends CreateCheckoutSession
  checkout_session_id?: string;
  url?: string;
  status?: 'open' | 'completed' | 'expired';
  created_at?: Date;
  expires_at?: Date;
  [key: string]: unknown;
}

export interface Provider extends Record<string, unknown> {
  code?: ProviderCode;
  name?: string;
  description?: string;
  [key: string]: unknown;
}

