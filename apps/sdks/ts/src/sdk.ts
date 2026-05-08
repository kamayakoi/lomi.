/**
 * Main lomi. SDK class
 * AUTO-GENERATED - Do not edit manually
 */

import type { LomiConfig } from './config.js';
import { DEFAULT_CONFIG } from './config.js';
import { OpenAPI } from './generated/index.js';

// Import all generated services
import {
  AccountsService,
  BeneficiaryPayoutsService,
  ChargesService,
  CheckoutSessionsService,
  CustomersService,
  DiscountCouponsService,
  OrganizationsService,
  PaymentIntentsService,
  PaymentLinksService,
  PaymentRequestsService,
  PayoutsService,
  ProductsService,
  RefundsService,
  SubscriptionsService,
  TransactionsService,
  WebhookDeliveryLogsService,
  WebhooksService,
} from './generated/index.js';

export class LomiSDK {
  public readonly accounts: typeof AccountsService;
  public readonly beneficiaryPayouts: typeof BeneficiaryPayoutsService;
  public readonly charges: typeof ChargesService;
  public readonly checkoutSessions: typeof CheckoutSessionsService;
  public readonly customers: typeof CustomersService;
  public readonly discountCoupons: typeof DiscountCouponsService;
  public readonly organizations: typeof OrganizationsService;
  public readonly paymentIntents: typeof PaymentIntentsService;
  public readonly paymentLinks: typeof PaymentLinksService;
  public readonly paymentRequests: typeof PaymentRequestsService;
  public readonly payouts: typeof PayoutsService;
  public readonly products: typeof ProductsService;
  public readonly refunds: typeof RefundsService;
  public readonly subscriptions: typeof SubscriptionsService;
  public readonly transactions: typeof TransactionsService;
  public readonly webhookDeliveryLogs: typeof WebhookDeliveryLogsService;
  public readonly webhooks: typeof WebhooksService;

  /**
   * Initialize the lomi. SDK
   */
  constructor(config: LomiConfig) {
    const baseUrl = config.environment === 'test' 
      ? 'https://sandbox.api.lomi.africa'
      : config.baseUrl || DEFAULT_CONFIG.baseUrl;

    // Configure OpenAPI client
    OpenAPI.BASE = baseUrl;
    OpenAPI.HEADERS = {
      'X-API-KEY': config.apiKey,
      ...config.headers,
    };

    // Assign all generated services
    this.accounts = AccountsService;
    this.beneficiaryPayouts = BeneficiaryPayoutsService;
    this.charges = ChargesService;
    this.checkoutSessions = CheckoutSessionsService;
    this.customers = CustomersService;
    this.discountCoupons = DiscountCouponsService;
    this.organizations = OrganizationsService;
    this.paymentIntents = PaymentIntentsService;
    this.paymentLinks = PaymentLinksService;
    this.paymentRequests = PaymentRequestsService;
    this.payouts = PayoutsService;
    this.products = ProductsService;
    this.refunds = RefundsService;
    this.subscriptions = SubscriptionsService;
    this.transactions = TransactionsService;
    this.webhookDeliveryLogs = WebhookDeliveryLogsService;
    this.webhooks = WebhooksService;
  }

  /**
   * Update the API key
   */
  setApiKey(apiKey: string): void {
    OpenAPI.HEADERS = {
      ...OpenAPI.HEADERS,
      'X-API-KEY': apiKey,
    };
  }

  /**
   * Get the current base URL
   */
  getBaseUrl(): string {
    return OpenAPI.BASE;
  }
}
