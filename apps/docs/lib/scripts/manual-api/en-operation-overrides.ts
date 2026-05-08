/* @proprietary license */

/**
 * English summary/body for hand-authored REST MDX (`*.mdx` without `.fr`).
 * OpenAPI summaries/descriptions are often French-only; `.fr.mdx` stays the source from spec.
 */
export type EnOperationOverride = {
  /** First line under Overview (+ YAML title when bootstrapping EN pages) */
  summary: string;
  /** Optional paragraph after the summary (YAML description uses summary if omitted here) */
  body?: string;
};

/** Full coverage for all public merchant operations in `openapi.json`. */
export const EN_OPERATION_COPY: Partial<Record<string, EnOperationOverride>> = {
  AccountsController_checkAvailableBalance: {
    summary: 'Check available balance',
    body: 'Checks whether sufficient funds exist in the requested currency.',
  },
  AccountsController_findAll: {
    summary: 'List accounts',
    body: 'Returns all accounts visible to your API key.',
  },
  AccountsController_findOne: {
    summary: 'Retrieve an account',
    body: 'Returns a single account. Responds with 404 when the ID is unknown or outside your scope.',
  },
  AccountsController_getBalance: {
    summary: 'Account balances',
    body: 'Returns current balances across currencies, optionally filtered by a single currency.',
  },
  AccountsController_getBalanceBreakdown: {
    summary: 'Balance breakdown',
    body: 'Returns balance components (available, pending, totals) with optional conversion to a target currency.',
  },
  BeneficiaryPayoutsController_create: {
    summary: 'Create beneficiary payout',
    body: 'Initiates a payout to a third-party beneficiary from your account balance. Processing is asynchronous; updates arrive via outbound webhooks.',
  },
  BeneficiaryPayoutsController_findAll: {
    summary: 'List beneficiary payouts',
    body: 'Returns beneficiary payouts visible to your organization.',
  },
  BeneficiaryPayoutsController_findOne: {
    summary: 'Retrieve beneficiary payout',
    body: 'Returns one beneficiary payout by ID. Responds with 404 when unknown or inaccessible.',
  },
  ChargesController_createWaveCharge: {
    summary: 'Create direct mobile-money charge',
    body: 'Initiates a payer-facing charge for supported mobile-money rails. Follow provider instructions returned in the response.',
  },
  CheckoutSessionsController_create: {
    summary: 'Create checkout session',
    body: 'Creates hosted checkout—the buyer completes payment on lomi. Defaults to a 60 minute expiry.',
  },
  CheckoutSessionsController_findAll: {
    summary: 'List checkout sessions',
    body: 'Lists sessions with optional pagination filters and checkout status filtering.',
  },
  CheckoutSessionsController_findOne: {
    summary: 'Retrieve checkout session',
    body: 'Returns session details—status and associated customer/product contexts.',
  },
  CustomersController_create: {
    summary: 'Create a customer',
    body: 'Creates a customer scoped to your organization.',
  },
  CustomersController_findAll: {
    summary: 'List customers',
    body: 'Paginated customer list with optional filters: search text, activity status, customer type.',
  },
  CustomersController_findOne: {
    summary: 'Retrieve a customer',
    body: 'Returns one customer by ID. Returns 404 if unknown or inaccessible for this API key.',
  },
  CustomersController_getTransactions: {
    summary: 'List customer transactions',
    body: 'Returns transactions tied to one customer ID. Returns 404 if unknown or inaccessible.',
  },
  CustomersController_remove: {
    summary: 'Remove a customer',
    body: 'Stops exposing the customer in list/detail responses. Returns 404 if unknown or inaccessible.',
  },
  CustomersController_update: {
    summary: 'Update a customer',
    body: 'Partial update — send only fields to change. Returns 404 if unknown or inaccessible.',
  },
  DiscountCouponsController_create: {
    summary: 'Create discount coupon',
    body: 'Creates a coupon usable at checkout according to scope and stacking rules.',
  },
  DiscountCouponsController_findAll: {
    summary: 'List discount coupons',
    body: 'Returns coupons for your organization.',
  },
  DiscountCouponsController_findOne: {
    summary: 'Retrieve discount coupon',
    body: 'Returns one coupon configuration by ID.',
  },
  DiscountCouponsController_getPerformance: {
    summary: 'Coupon performance metrics',
    body: 'Returns usage and performance metrics for a coupon.',
  },
  OrganizationsController_findAll: {
    summary: 'List organizations',
    body: 'Returns organizations visible to your API key.',
  },
  OrganizationsController_findOne: {
    summary: 'Retrieve organization',
    body: 'Returns one organization by ID. Responds with 404 when unknown or outside your scope.',
  },
  OrganizationsController_getMetrics: {
    summary: 'Organization metrics',
    body: 'Returns revenue and subscriber metrics aggregated for dashboard use.',
  },
  PaymentIntentsController_create: {
    summary: 'Create card PaymentIntent',
    body: 'Creates a card PaymentIntent for Elements-style integrations and returns `client_secret` for the client.',
  },
  PaymentLinksController_create: {
    summary: 'Create payment link',
    body: 'Product links reference catalog items; instant links collect a fixed amount.',
  },
  PaymentLinksController_findAll: {
    summary: 'List payment links',
    body: 'Paginated link list filtered by activation state and optional link-type filters.',
  },
  PaymentLinksController_findOne: {
    summary: 'Retrieve payment link',
    body: 'Returns shareable URLs, visibility settings and current status.',
  },
  PaymentRequestsController_create: {
    summary: 'Create payment request',
    body: 'Creates a payer-facing payable request carrying expiry and reconciliation metadata.',
  },
  PaymentRequestsController_findAll: {
    summary: 'List payment requests',
    body: 'Paginated ledger of requests optionally filtered by status or payer references.',
  },
  PaymentRequestsController_findOne: {
    summary: 'Retrieve payment request',
    body: 'Returns current readiness state alongside payment metadata payloads.',
  },
  PayoutsController_createWavePayout: {
    summary: 'Initiate mobile-money payout',
    body: 'Initiates a payout on supported rails. Response shape mirrors the provider payload.',
  },
  ProductsController_addPrice: {
    summary: 'Add product price',
    body: 'Adds a price option to a product; active price count limits apply.',
  },
  ProductsController_create: {
    summary: 'Create product',
    body: 'Creates a product with one or more prices in a single request. At least one price is required.',
  },
  ProductsController_findAll: {
    summary: 'List products',
    body: 'Returns catalog products with embedded prices.',
  },
  ProductsController_findOne: {
    summary: 'Retrieve product',
    body: 'Returns one product by ID including prices. Responds with 404 when unknown or inaccessible.',
  },
  ProductsController_setDefaultPrice: {
    summary: 'Set default price',
    body: 'Marks which price is used when checkout does not specify a price ID.',
  },
  RefundsController_createWaveRefund: {
    summary: 'Initiate refund',
    body: 'Initiates a refund on supported rails. Response shape mirrors the provider payload.',
  },
  SubscriptionsController_cancel: {
    summary: 'Cancel subscription',
    body: 'Cancels an active subscription. Optional cancellation reason is stored for audit.',
  },
  SubscriptionsController_findAll: {
    summary: 'List subscriptions',
    body: 'Returns subscriptions for your organization.',
  },
  SubscriptionsController_findByCustomer: {
    summary: 'List subscriptions for customer',
    body: 'Returns subscriptions for a customer ID. Responds with 404 when the customer is unknown.',
  },
  SubscriptionsController_findOne: {
    summary: 'Retrieve subscription',
    body: 'Returns one subscription by ID. Responds with 404 when unknown or inaccessible.',
  },
  TransactionsController_findAll: {
    summary: 'List transactions',
    body: 'Returns transactions for your organization with optional filters.',
  },
  TransactionsController_findOne: {
    summary: 'Retrieve transaction',
    body: 'Returns one transaction by ID. Responds with 404 when unknown or inaccessible.',
  },
  WebhookDeliveryLogsController_findAll: {
    summary: 'List webhook delivery logs',
    body: 'Returns delivery attempts for outbound webhooks filtered by webhook ID.',
  },
  WebhookDeliveryLogsController_findOne: {
    summary: 'Retrieve webhook delivery log',
    body: 'Returns one delivery log entry by ID.',
  },
  WebhooksController_findAll: {
    summary: 'List webhooks',
    body: 'Returns configured outbound webhook subscriptions for merchant events.',
  },
  WebhooksController_findOne: {
    summary: 'Retrieve webhook',
    body: 'Fetches webhook configuration keyed by outbound subscription ID.',
  },
  WebhooksController_update: {
    summary: 'Update webhook',
    body: 'Patch delivery URL, rotating secrets, subscribed events metadata or lifecycle flags.',
  },
};
