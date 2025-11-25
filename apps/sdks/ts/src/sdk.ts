/**
 * Main lomi. SDK class
 * AUTO-GENERATED - Do not edit manually
 */

import type { LomiConfig } from './config.js';
import { DEFAULT_CONFIG } from './config.js';
import { OpenAPI } from './generated/index.js';

// Import all generated services
import {
  BeneficiaryPayoutsService,
  CheckoutSessionsService,
  CustomerInvoicesService,
  CustomersService,
  DiscountCouponsService,
  EventsService,
  InstallmentPaymentsService,
  MeterBalancesService,
  MetersService,
  PaymentLinksService,
  PaymentRequestsService,
  PayoutMethodsService,
  PayoutsService,
  PricesService,
  ProductsService,
  RefundsService,
  SpiAccountAliasesService,
  SpiQrCodesService,
  SubscriptionsService,
  TransactionsService,
  WebhookDeliveryLogsService,
  WebhooksService,
} from './generated/index.js';

export class LomiSDK {
  public readonly beneficiaryPayouts: typeof BeneficiaryPayoutsService;
  public readonly checkoutSessions: typeof CheckoutSessionsService;
  public readonly customerInvoices: typeof CustomerInvoicesService;
  public readonly customers: typeof CustomersService;
  public readonly discountCoupons: typeof DiscountCouponsService;
  public readonly events: typeof EventsService;
  public readonly installmentPayments: typeof InstallmentPaymentsService;
  public readonly meterBalances: typeof MeterBalancesService;
  public readonly meters: typeof MetersService;
  public readonly paymentLinks: typeof PaymentLinksService;
  public readonly paymentRequests: typeof PaymentRequestsService;
  public readonly payoutMethods: typeof PayoutMethodsService;
  public readonly payouts: typeof PayoutsService;
  public readonly prices: typeof PricesService;
  public readonly products: typeof ProductsService;
  public readonly refunds: typeof RefundsService;
  public readonly spiAccountAliases: typeof SpiAccountAliasesService;
  public readonly spiQrCodes: typeof SpiQrCodesService;
  public readonly subscriptions: typeof SubscriptionsService;
  public readonly transactions: typeof TransactionsService;
  public readonly webhookDeliveryLogs: typeof WebhookDeliveryLogsService;
  public readonly webhooks: typeof WebhooksService;

  /**
   * Initialize the lomi. SDK
   */
  constructor(config: LomiConfig) {
    const baseUrl = config.environment === 'test' 
      ? 'https://sandbox.api.lomi.africa/v1'
      : config.baseUrl || DEFAULT_CONFIG.baseUrl;

    // Configure OpenAPI client
    OpenAPI.BASE = baseUrl;
    OpenAPI.HEADERS = {
      'X-API-KEY': config.apiKey,
      ...config.headers,
    };

    // Assign all generated services
    this.beneficiaryPayouts = BeneficiaryPayoutsService;
    this.checkoutSessions = CheckoutSessionsService;
    this.customerInvoices = CustomerInvoicesService;
    this.customers = CustomersService;
    this.discountCoupons = DiscountCouponsService;
    this.events = EventsService;
    this.installmentPayments = InstallmentPaymentsService;
    this.meterBalances = MeterBalancesService;
    this.meters = MetersService;
    this.paymentLinks = PaymentLinksService;
    this.paymentRequests = PaymentRequestsService;
    this.payoutMethods = PayoutMethodsService;
    this.payouts = PayoutsService;
    this.prices = PricesService;
    this.products = ProductsService;
    this.refunds = RefundsService;
    this.spiAccountAliases = SpiAccountAliasesService;
    this.spiQrCodes = SpiQrCodesService;
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
