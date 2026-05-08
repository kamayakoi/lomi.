export interface APIResourceConfig {
  tableName: string;
  path?: string;
  displayName?: string;
  idField?: string;
  enabled: boolean;
  operations?: {
    list?: boolean;
    get?: boolean;
    create?: boolean;
    update?: boolean;
    delete?: boolean;
  };
  tag?: string;
  description?: string;
}

export const API_RESOURCES: APIResourceConfig[] = [
  {
    tableName: 'accounts',
    enabled: true,
    tag: 'Accounts',
    idField: 'account_id',
    description:
      'Account balances - view organization account balances and SPI account information',
    operations: {
      list: true,
      get: true,
      create: false, // Accounts are system-managed
      update: false,
      delete: false,
    },
  },
  {
    tableName: 'organizations',
    enabled: true,
    tag: 'Organizations',
    idField: 'organization_id',
    description:
      'Organization metrics - view MRR, ARR, total revenue, merchant lifetime value, and other organization metrics',
    operations: {
      list: true,
      get: true,
      create: false, // Organizations are system-managed
      update: false,
      delete: false,
    },
  },
  {
    tableName: 'customers',
    enabled: true,
    tag: 'Customers',
    description: 'Customer management - create and manage customer profiles',
    operations: {
      list: true,
      get: true,
      create: true,
      update: true,
      delete: true,
    },
  },
  {
    tableName: 'payment_requests',
    enabled: true,
    tag: 'Payment Requests',
    idField: 'request_id',
    description: 'Payment requests - create payment intents and track status',
    operations: {
      list: true,
      get: true,
      create: true,
      update: false,
      delete: false,
    },
  },
  {
    tableName: 'transactions',
    enabled: true,
    tag: 'Transactions',
    idField: 'transaction_id',
    description:
      'Transaction history - view completed and pending transactions',
    operations: {
      list: true,
      get: true,
      create: false, // Transactions are created by the system, not by merchants
      update: false,
      delete: false,
    },
  },
  {
    tableName: 'refunds',
    enabled: true,
    tag: 'Refunds',
    idField: 'refund_id',
    description: 'Refund management - process and track refunds',
    operations: {
      list: true,
      get: true,
      create: true,
      update: false,
      delete: false,
    },
  },
  {
    tableName: 'products',
    enabled: true,
    tag: 'Products',
    idField: 'product_id',
    description: 'Products - manage one-time and recurring products',
    operations: {
      list: true,
      get: true,
      create: true,
      update: false,
      delete: false,
    },
  },
  {
    tableName: 'subscriptions',
    enabled: true,
    tag: 'Subscriptions',
    idField: 'subscription_id',
    description:
      'Subscription management - create and manage recurring billing',
    operations: {
      list: true,
      get: true,
      create: false,
      update: true,
      delete: false,
    },
  },
  {
    tableName: 'discount_coupons',
    enabled: true,
    tag: 'Discount Coupons',
    idField: 'coupon_id',
    description: 'Discount coupons - create and manage promotional codes',
    operations: {
      list: true,
      get: true,
      create: true,
      update: false,
      delete: false,
    },
  },
  {
    tableName: 'checkout_sessions',
    enabled: true,
    tag: 'Checkout Sessions',
    idField: 'checkout_session_id',
    description: 'Checkout sessions - create hosted payment pages',
    operations: {
      list: true,
      get: true,
      create: true,
      update: false,
      delete: false,
    },
  },
  {
    tableName: 'payment_links',
    enabled: true,
    tag: 'Payment Links',
    idField: 'link_id',
    description: 'Payment links - shareable payment URLs',
    operations: {
      list: true,
      get: true,
      create: true,
      update: false,
      delete: false,
    },
  },
  {
    tableName: 'payouts',
    enabled: true,
    tag: 'Payouts',
    idField: 'payout_id',
    description: 'Payout management - transfer funds to beneficiaries',
    operations: {
      list: true,
      get: true,
      create: true,
      update: false,
      delete: false,
    },
  },
  {
    tableName: 'beneficiary_payouts',
    enabled: true,
    tag: 'Beneficiary Payouts',
    idField: 'payout_id',
    description: 'Beneficiary payouts - track individual payout transfers',
    operations: {
      list: true,
      get: true,
      create: true,
      update: false,
      delete: false,
    },
  },
  {
    tableName: 'webhooks',
    enabled: true,
    tag: 'Webhooks',
    idField: 'webhook_id',
    description:
      'Webhook configuration - receive real-time event notifications',
    operations: {
      list: true,
      get: true,
      create: false,
      update: true,
      delete: false,
    },
  },
  {
    tableName: 'webhook_delivery_logs',
    enabled: true,
    tag: 'Webhook Delivery Logs',
    idField: 'log_id',
    description: 'Webhook event log - history of webhook deliveries',
    operations: {
      list: true,
      get: true,
      create: false, // Logs are system-generated
      update: false,
      delete: false,
    },
  },
];

export function getEnabledResources(): APIResourceConfig[] {
  return API_RESOURCES.filter((r) => r.enabled);
}

/**
 * Enum names that should be exposed in the API types
 * These enums will be included in the generated api.ts file
 */
export const EXPOSED_ENUMS = [
  'currency_code',
  'payment_method_code',
  'provider_code',
  'provider_payment_status',
  'transaction_status',
  'transaction_type',
  'refund_status',
  'payout_status',
  'subscription_status',
  'product_type',
  'pricing_model',
  'usage_frequency',
  'checkout_session_status',
  'invoice_status',
  'webhook_event',
  'spi_payment_status',
  'spi_account_status',
  'spi_account_type',
  'spi_payment_category',
  'spi_payment_flow_type',
  'spi_payment_request_category',
  'spi_document_type',
  'spi_rejection_reason',
  'spi_webhook_event_code',
  'organization_status',
  'organization_verification_status',
  'billing_interval',
  'customer_type',
  'discount_type',
  'qr_code_type',
  'link_type',
  'failed_payment_action',
  'first_payment_type',
  'usage_aggregation',
  'bnpl_status',
  'integration_source',
];

/**
 * Check if an enum should be exposed
 */
export function isEnumExposed(enumName: string): boolean {
  return EXPOSED_ENUMS.includes(enumName);
}

/**
 * RPC function names that should be exposed in the API types
 * These functions will be included in the generated api.ts file
 */
export const EXPOSED_FUNCTIONS = [
  'fetch_balance_breakdown',
  'fetch_account_balance',
  'list_accounts',
  'update_webhook',
  'get_account',
  'check_merchant_available_balance',
  'verify_api_key',
  'create_checkout_session',
  'create_checkout_session_with_line_items',
  'list_checkout_sessions',
  'get_webhook',
  'get_webhook_by_id',
  'fetch_organization_webhooks',
  'get_merchant_from_organization',
  'log_webhook_delivery',
  'create_beneficiary_payout',
  'fetch_beneficiary_payouts',
  'fetch_customers_with_status',
  'create_customer',
  'update_customer',
  'delete_customer',
  'fetch_customer_transactions',
  'create_payment_link',
  'list_payment_links',
  'list_payment_requests',
  'initiate_withdrawal',
  'fetch_payouts',
  'fetch_products',
  'create_product',
  'create_price',
  'set_default_price',
  'create_refund',
  'list_refunds',
  'list_organizations',
  'fetch_organization_details',
  'get_webhook_delivery_logs',
  'get_product_api',
  'get_payment_link_api',
  'create_payment_request_api',
  'create_discount_coupon',
  'get_product_prices_api',
  'get_product_fees_api',
  'get_coupon_details_for_management',
  'fetch_wave_provider_settings',
  // Wave webhook functions
  'get_wave_transaction_by_checkout_id',
  'get_checkout_session_by_wave_id',
  'update_transaction_status',
  'update_balances_for_transaction',
  // Stripe webhook functions
  'update_stripe_checkout_status',
  'handle_stripe_payment_success',
  'handle_stripe_payment_failure',
  'handle_stripe_dispute_created',
  'handle_stripe_dispute_updated',
  'handle_stripe_refund',
];

/**
 * Check if a function should be exposed
 */
export function isFunctionExposed(functionName: string): boolean {
  return EXPOSED_FUNCTIONS.includes(functionName);
}
