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

export enum PaymentLinkType {
  product = 'product',
  plan = 'plan',
  instant = 'instant',
}

export enum WebhookEvent {
  TRANSACTION_CREATED = 'TRANSACTION_CREATED',
  TRANSACTION_COMPLETED = 'TRANSACTION_COMPLETED',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  REFUND_CREATED = 'REFUND_CREATED',
  REFUND_COMPLETED = 'REFUND_COMPLETED',
  REFUND_FAILED = 'REFUND_FAILED',
  SUBSCRIPTION_CREATED = 'SUBSCRIPTION_CREATED',
  SUBSCRIPTION_RENEWED = 'SUBSCRIPTION_RENEWED',
  SUBSCRIPTION_FAILED = 'SUBSCRIPTION_FAILED',
  SUBSCRIPTION_CANCELLED = 'SUBSCRIPTION_CANCELLED',
  PAYMENT_LINK_CREATED = 'PAYMENT_LINK_CREATED',
  PAYMENT_LINK_USED = 'PAYMENT_LINK_USED',
  PROVIDER_CONNECTED = 'PROVIDER_CONNECTED',
  PROVIDER_DISCONNECTED = 'PROVIDER_DISCONNECTED',
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

export interface Refund extends Record<string, unknown> {
  refund_id: string;
  transaction_id: string;
  amount: number;
  currency_code: CurrencyCode;
  status: 'pending' | 'completed' | 'failed';
  reason?: string;
  metadata?: Record<string, unknown>;
  created_at?: Date;
  updated_at?: Date;
  [key: string]: unknown;
}

export interface CreateRefund extends Record<string, unknown> {
  transaction_id: string;
  amount: number;
  reason?: string;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface Customer extends Record<string, unknown> {
  customer_id: string;
  merchant_id: string;
  email?: string;
  phone_number?: string;
  first_name?: string;
  last_name?: string;
  address?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  created_at?: Date;
  updated_at?: Date;
  [key: string]: unknown;
}

export interface CreateCustomer extends Record<string, unknown> {
  merchant_id: string;
  email?: string;
  phone_number?: string;
  first_name?: string;
  last_name?: string;
  address?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface CreatePaymentLink extends Record<string, unknown> {
  merchant_id: string;
  link_type: PaymentLinkType;
  product_id?: string;
  plan_id?: string;
  title: string;
  public_description?: string;
  private_description?: string;
  price?: number;
  currency_code: CurrencyCode;
  allowed_providers: Array<ProviderCode>;
  allow_coupon_code?: boolean;
  is_active?: boolean;
  expires_at?: Date;
  success_url?: string;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface PaymentLink extends Record<string, unknown> {
  // Extends CreatePaymentLink
  link_id?: string;
  organization_id?: string;
  url?: string;
  created_at?: Date;
  updated_at?: Date;
  [key: string]: unknown;
}

export interface CreateWebhook extends Record<string, unknown> {
  merchant_id: string;
  url: string;
  authorized_events: Array<WebhookEvent>;
  is_active?: boolean;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface Webhook extends Record<string, unknown> {
  // Extends CreateWebhook
  webhook_id?: string;
  verification_token?: string;
  last_triggered_at?: Date;
  last_payload?: Record<string, unknown>;
  last_response_status?: number;
  last_response_body?: string;
  retry_count?: number;
  created_at?: Date;
  updated_at?: Date;
  [key: string]: unknown;
}

