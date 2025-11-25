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
    tableName: 'customers',
    enabled: true,
    tag: 'Customers',
    description: 'Customer management - create and manage customer profiles',
  },
  {
    tableName: 'payment_requests',
    enabled: true,
    tag: 'Payment Requests',
    idField: 'request_id',
    description: 'Payment requests - create payment intents and track status',
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
      create: false,
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
  },
  {
    tableName: 'products',
    enabled: true,
    tag: 'Products',
    idField: 'product_id',
    description: 'Product catalog - manage one-time and recurring products',
  },
  {
    tableName: 'prices',
    enabled: true,
    tag: 'Prices',
    idField: 'price_id',
    description: 'Pricing tiers - manage product pricing',
  },
  {
    tableName: 'subscriptions',
    enabled: true,
    tag: 'Subscriptions',
    idField: 'subscription_id',
    description:
      'Subscription management - create and manage recurring billing',
  },
  {
    tableName: 'discount_coupons',
    enabled: true,
    tag: 'Discount Coupons',
    idField: 'coupon_id',
    description: 'Discount coupons - create and manage promotional codes',
  },
  {
    tableName: 'customer_invoices',
    enabled: true,
    tag: 'Customer Invoices',
    idField: 'invoice_id',
    description: 'Customer invoices - view subscription invoices',
    operations: {
      list: true,
      get: true,
      create: false, // Invoices are auto-generated
      update: false,
      delete: false,
    },
  },
  {
    tableName: 'checkout_sessions',
    enabled: true,
    tag: 'Checkout Sessions',
    idField: 'session_id',
    description: 'Checkout sessions - create hosted payment pages',
  },
  {
    tableName: 'payment_links',
    enabled: true,
    tag: 'Payment Links',
    idField: 'link_id',
    description: 'Payment links - shareable payment URLs',
  },
  {
    tableName: 'payouts',
    enabled: true,
    tag: 'Payouts',
    idField: 'payout_id',
    description: 'Payout management - transfer funds to beneficiaries',
  },
  {
    tableName: 'payout_methods',
    enabled: true,
    tag: 'Payout Methods',
    idField: 'payout_method_id',
    description: 'Payout methods - manage beneficiary payout details',
    operations: {
      list: true,
      get: true,
      create: false,
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
    tableName: 'installment_payments',
    enabled: true,
    tag: 'Installment Payments',
    idField: 'payment_id',
    description: 'BNPL installment payments - track installment payments',
    operations: {
      list: true,
      get: true,
      create: false,
      update: false,
      delete: false,
    },
  },
  {
    tableName: 'spi_qr_codes',
    enabled: true,
    tag: 'SPI QR Codes',
    idField: 'qr_code_id',
    description: 'SPI QR codes - generate and manage SPI QR payment codes',
  },
  {
    tableName: 'spi_account_aliases',
    enabled: true,
    tag: 'SPI Account Aliases',
    idField: 'alias_id',
    description: 'SPI account aliases - manage SPI payment aliases',
    operations: {
      list: true,
      get: true,
      create: false,
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
      create: false,
      update: false,
      delete: false,
    },
  },
  {
    tableName: 'events',
    enabled: true,
    tag: 'Events',
    idField: 'event_id',
    description: 'Events - view account activity events',
    operations: {
      list: true,
      get: true,
      create: false,
      update: false,
      delete: false,
    },
  },
  {
    tableName: 'meters',
    enabled: true,
    tag: 'Meters',
    idField: 'meter_id',
    description: 'Usage meters - track usage for usage-based billing',
  },
  {
    tableName: 'meter_balances',
    enabled: true,
    tag: 'Meter Balances',
    idField: 'balance_id',
    description: 'Meter balances - view current usage balances',
    operations: {
      list: true,
      get: true,
      create: false,
      update: false,
      delete: false,
    },
  },
];

export function getEnabledResources(): APIResourceConfig[] {
  return API_RESOURCES.filter((r) => r.enabled);
}

export function getResourceConfig(
  tableName: string,
): APIResourceConfig | undefined {
  return API_RESOURCES.find((r) => r.tableName === tableName);
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  API_RESOURCES.filter((r) => r.enabled).forEach((r) => {
    if (r.tag) tags.add(r.tag);
  });
  return Array.from(tags);
}

export const EXPOSED_ENUMS = [
  'currency_code',
  'payment_method_code',
  'provider_code',
  'transaction_status',
  'refund_status',
  'payout_status',
  'subscription_status',
  'product_type_enum',
  'pricing_model_enum',
  'frequency',
  'checkout_session_status',
  'invoice_status',
  'webhook_event',
  'spi_payment_status',
  'spi_account_status',
  'spi_account_type',
  'bnpl_status',
];

export function isEnumExposed(enumName: string): boolean {
  return EXPOSED_ENUMS.includes(enumName);
}
