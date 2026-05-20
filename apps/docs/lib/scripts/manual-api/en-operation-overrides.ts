/* @proprietary license */

/**
 * English summary/body for hand-authored REST MDX (`*.mdx` without `.fr`).
 * OpenAPI summaries/descriptions are often French-only; `.fr.mdx` stays the source from spec.
 *
 * Style guide: `DOC-STYLE-CONTRACT.md`
 */
export type EnOperationOverride = {
  /** First line under Overview (+ YAML title when bootstrapping EN pages) */
  summary: string;
  /** Optional paragraph after the summary (YAML description uses summary if omitted here) */
  body?: string;
  /** Job-to-be-done: when an integrator should choose this endpoint */
  whenToUse?: string;
  /** Async behavior, retries, provider or compliance caveats */
  caveats?: string;
  /** Markdown links to related guides or REST pages (trusted repo content) */
  related?: string;
};

/** Full coverage for all public merchant operations in `openapi.json` (enforced by verify script). */
export const EN_OPERATION_COPY: Partial<Record<string, EnOperationOverride>> = {
  AccountsController_checkAvailableBalance: {
    summary: 'Check available balance',
    body: 'Checks whether sufficient funds exist in the requested currency before you move money out or reserve balance.',
    whenToUse:
      'Call before initiating a payout, beneficiary payout, or any flow where you must guarantee spendable balance.',
    related:
      '[Account balances](/api/accounts/AccountsController_getBalance) · [Payouts](/api/payout/PayoutsController_createWavePayout)',
  },
  AccountsController_findAll: {
    summary: 'List accounts',
    body: 'Returns every account your API key can see, typically for reconciliation or routing funds.',
    whenToUse:
      'Use when building dashboards, ledgers, or any automation that needs the list of settlement accounts.',
  },
  AccountsController_findOne: {
    summary: 'Retrieve an account',
    body: 'Returns a single account record. Responds with **404** when the ID is unknown or outside your scope.',
    whenToUse:
      'Use after you have an account ID from a prior list call or from a payment/payout response.',
  },
  AccountsController_getBalance: {
    summary: 'Account balances',
    body: 'Returns current balances across currencies; optionally filter to one currency for simpler UI.',
    whenToUse:
      'Use for wallet surfaces, “available funds” displays, or pre-checking balances without fetching every account object.',
  },
  AccountsController_getBalanceBreakdown: {
    summary: 'Balance breakdown',
    body: 'Returns balance components (available, pending, totals) and may convert amounts into a target currency for reporting.',
    whenToUse:
      'Use when finance or support teams need a split between pending and available, not just a single number.',
  },
  BeneficiaryPayoutsController_create: {
    summary: 'Create beneficiary payout',
    body: 'Initiates a payout from your balance to a third-party beneficiary on supported rails.',
    whenToUse:
      'Use when paying suppliers or partners to a saved beneficiary profile—not the same as a standard organization payout.',
    caveats:
      'Processing is **asynchronous**. Treat the response as accepted for processing; definitive status arrives via [outbound webhooks](/api/webhooks/WebhooksController_findAll) and reconciliation APIs.',
    related:
      '[List beneficiary payouts](/api/beneficiary-payouts/BeneficiaryPayoutsController_findAll) · [Check balance](/api/accounts/AccountsController_checkAvailableBalance)',
  },
  BeneficiaryPayoutsController_findAll: {
    summary: 'List beneficiary payouts',
    body: 'Returns beneficiary payouts for your organization with pagination and filters as exposed by the API.',
    whenToUse:
      'Use for ops dashboards, support lookup, or syncing payout state into your back office.',
    related:
      '[Retrieve beneficiary payout](/api/beneficiary-payouts/BeneficiaryPayoutsController_findOne)',
  },
  BeneficiaryPayoutsController_findOne: {
    summary: 'Retrieve beneficiary payout',
    body: 'Returns one beneficiary payout by ID. Responds with **404** when unknown or inaccessible.',
    whenToUse:
      'Use when a webhook references a payout ID or a user opens a payout detail screen.',
  },
  ChargesController_createWaveCharge: {
    summary: 'Create direct mobile-money charge',
    body: 'Starts a payer-facing mobile-money charge on a supported rail; the response includes the next step for the customer.',
    whenToUse:
      'Use for server-initiated mobile-money collection when you are **not** using a hosted checkout session.',
    caveats:
      'Follow the provider instructions in the response; UX is rail-specific (USSD, app redirect, etc.).',
    related:
      '[Create checkout session](/api/checkout-sessions/CheckoutSessionsController_create) · [Transactions](/api/transactions/TransactionsController_findAll)',
  },
  CheckoutSessionsController_create: {
    summary: 'Create checkout session',
    body: 'Creates a hosted checkout session so the buyer completes payment on the hosted checkout experience. Sessions expire—create a fresh session if the link lapses.',
    whenToUse:
      'Use for e-commerce, invoices, or any flow where you want lomi. to host payment collection and return the customer to your site.',
    caveats:
      'Prefer checkout sessions over ad-hoc charges when you need a consistent buyer experience across payment methods.',
    related:
      '[Payment links](/api/payment-links/PaymentLinksController_create) · [Retrieve checkout session](/api/checkout-sessions/CheckoutSessionsController_findOne)',
  },
  CheckoutSessionsController_findAll: {
    summary: 'List checkout sessions',
    body: 'Lists checkout sessions with filters for status, time range, and pagination per your integration needs.',
    whenToUse:
      'Use for reconciliation, support tools, or exporting recent checkout attempts.',
    related:
      '[Retrieve checkout session](/api/checkout-sessions/CheckoutSessionsController_findOne)',
  },
  CheckoutSessionsController_findOne: {
    summary: 'Retrieve checkout session',
    body: 'Returns session details including status and associated customer and line items where applicable.',
    whenToUse:
      'Poll or display after redirect from checkout, or when handling async notifications keyed by session ID.',
    related:
      '[List transactions](/api/transactions/TransactionsController_findAll)',
  },
  CustomersController_create: {
    summary: 'Create a customer',
    body: 'Creates a customer record scoped to your organization for repeat purchases and reporting.',
    whenToUse:
      'Use when you have stable customer identity in your system and want card-on-file, subscriptions, or clean transaction history.',
    related:
      '[List customers](/api/customers/CustomersController_findAll) · [Update customer](/api/customers/CustomersController_update)',
  },
  CustomersController_findAll: {
    summary: 'List customers',
    body: 'Returns a paginated customer directory with optional filters such as search text and activity.',
    whenToUse:
      'Use for CRM-style search, back-office lists, and exporting buyer records.',
  },
  CustomersController_findOne: {
    summary: 'Retrieve a customer',
    body: 'Returns one customer by ID. Responds with **404** if the record is unknown or not visible to this API key.',
    whenToUse:
      'Use on profile pages or before updating a customer or creating a subscription.',
    related:
      '[Customer transactions](/api/customers/CustomersController_getTransactions)',
  },
  CustomersController_getTransactions: {
    summary: 'List customer transactions',
    body: 'Returns transactions linked to a single customer ID for statements and dispute handling.',
    whenToUse:
      'Use on customer detail pages or when answering support questions tied to one buyer.',
    related:
      '[List transactions](/api/transactions/TransactionsController_findAll)',
  },
  CustomersController_remove: {
    summary: 'Remove a customer',
    body: 'Stops returning the customer in list and detail views for your organization.',
    whenToUse:
      'Use for GDPR-style deletion requests or when you must disable a buyer record from merchant-facing APIs.',
    caveats:
      'Behavior follows platform rules for retained financial records; confirm with your compliance team for legal holds.',
  },
  CustomersController_update: {
    summary: 'Update a customer',
    body: 'Partial update—send only fields that change (email, phone, metadata, etc.).',
    whenToUse:
      'Use when buyers edit their profile or when syncing CRM changes into lomi.',
  },
  DiscountCouponsController_create: {
    summary: 'Create discount coupon',
    body: 'Creates a coupon with scope and redemption rules for use at checkout or payment links.',
    whenToUse: 'Use when launching promotions or segment-specific discounts.',
    related:
      '[List coupons](/api/discount-coupons/DiscountCouponsController_findAll) · [Checkout session](/api/checkout-sessions/CheckoutSessionsController_create)',
  },
  DiscountCouponsController_findAll: {
    summary: 'List discount coupons',
    body: 'Returns coupons configured for your organization.',
    whenToUse: 'Use to populate an admin UI or audit active promotions.',
  },
  DiscountCouponsController_findOne: {
    summary: 'Retrieve discount coupon',
    body: 'Returns one coupon definition by ID including constraints and redemption settings.',
    whenToUse:
      'Use before editing copy or validating a code’s rules in your own checkout.',
  },
  DiscountCouponsController_getPerformance: {
    summary: 'Coupon performance metrics',
    body: 'Returns usage and performance metrics for a coupon (redemptions, revenue impact) for reporting.',
    whenToUse: 'Use in marketing dashboards to measure campaign effectiveness.',
    related:
      '[Retrieve coupon](/api/discount-coupons/DiscountCouponsController_findOne)',
  },
  OrganizationsController_findAll: {
    summary: 'List organizations',
    body: 'Returns organizations visible to your API key (merchant users often have one; partners may see several).',
    whenToUse: 'Use at login or when building org-switcher experiences.',
  },
  OrganizationsController_findOne: {
    summary: 'Retrieve organization',
    body: 'Returns one organization by ID. Responds with **404** when unknown or outside your scope.',
    whenToUse:
      'Use to load merchant profile, branding, or settlement settings for a known org ID.',
  },
  OrganizationsController_getMetrics: {
    summary: 'Organization metrics',
    body: 'Returns revenue and subscriber-oriented aggregates suitable for dashboard cards.',
    whenToUse:
      'Use for home screens and executive summaries rather than low-level transaction drill-down.',
    related: '[Transactions](/api/transactions/TransactionsController_findAll)',
  },
  PaymentIntentsController_create: {
    summary: 'Create card PaymentIntent',
    body: 'Creates a card PaymentIntent for Elements-style integrations and returns `client_secret` for client-side confirmation.',
    whenToUse:
      "Use for in-app card entry where you own the product UI and tokenization flow against lomi.'s card stack.",
    caveats:
      'Never log or expose `client_secret` publicly; treat it like a short-lived capability for the client SDK.',
    related:
      '[Create checkout session](/api/checkout-sessions/CheckoutSessionsController_create) if you prefer hosted card collection.',
  },
  PaymentLinksController_create: {
    summary: 'Create payment link',
    body: 'Creates a shareable link: product-backed links pull catalog amounts; instant links collect a fixed amount you specify.',
    whenToUse:
      'Use for invoices, social selling, or lightweight payment pages without building full checkout.',
    related:
      '[List payment links](/api/payment-links/PaymentLinksController_findAll) · [Checkout sessions](/api/checkout-sessions/CheckoutSessionsController_create)',
  },
  PaymentLinksController_findAll: {
    summary: 'List payment links',
    body: 'Returns payment links with optional filters for state and purpose.',
    whenToUse:
      'Use to audit which links are still active and their target amounts or products.',
  },
  PaymentLinksController_findOne: {
    summary: 'Retrieve payment link',
    body: 'Returns URLs, visibility, and status for a single link.',
    whenToUse: 'Use before resharing a link or embedding it in messaging.',
  },
  PaymentRequestsController_create: {
    summary: 'Create payment request',
    body: 'Creates a payer-facing request with amount, expiry, and metadata for reconciliation.',
    whenToUse:
      'Use for “pay this invoice” or POS-style requests where the payer confirms on their device.',
    related:
      '[Retrieve payment request](/api/payment-requests/PaymentRequestsController_findOne) · [Transactions](/api/transactions/TransactionsController_findAll)',
  },
  PaymentRequestsController_findAll: {
    summary: 'List payment requests',
    body: 'Returns a paginated ledger of requests with optional filters for status or references.',
    whenToUse: 'Use for finance teams tracking outstanding requests.',
  },
  PaymentRequestsController_findOne: {
    summary: 'Retrieve payment request',
    body: 'Returns the latest state, amounts, and payer reference data for one request.',
    whenToUse: 'Use on status pages and after callbacks keyed by request ID.',
  },
  PayoutsController_createWavePayout: {
    summary: 'Initiate mobile-money payout',
    body: 'Initiates an organization payout to a configured mobile-money destination on supported rails.',
    whenToUse:
      'Use to settle funds from your lomi. balance to your wallet when beneficiary APIs are not involved.',
    caveats:
      'Rail availability and provider payloads vary; always reconcile using transaction and balance APIs.',
    related:
      '[Check available balance](/api/accounts/AccountsController_checkAvailableBalance) · [Transactions](/api/transactions/TransactionsController_findAll)',
  },
  ProductsController_addPrice: {
    summary: 'Add product price',
    body: 'Adds another price point to an existing product (currency, billing cadence, or amount variants).',
    whenToUse:
      'Use when expanding to new markets or adding a second billing option to the same product.',
    related: '[Retrieve product](/api/products/ProductsController_findOne)',
  },
  ProductsController_create: {
    summary: 'Create product',
    body: 'Creates a catalog product with at least one price in a single request.',
    whenToUse:
      'Use when onboarding catalog data for checkout, subscriptions, or payment links backed by SKUs.',
    related:
      '[List products](/api/products/ProductsController_findAll) · [Payment links](/api/payment-links/PaymentLinksController_create)',
  },
  ProductsController_findAll: {
    summary: 'List products',
    body: 'Returns catalog products with embedded price options.',
    whenToUse:
      'Use to populate storefront admins or pick line items programmatically.',
  },
  ProductsController_findOne: {
    summary: 'Retrieve product',
    body: 'Returns a single product by ID including prices. Responds with **404** when unknown or inaccessible.',
    whenToUse:
      'Use before checkout composition or when validating a stored product ID.',
  },
  ProductsController_setDefaultPrice: {
    summary: 'Set default price',
    body: 'Marks which price lomi. uses when a flow does not specify an explicit price ID.',
    whenToUse:
      'Use after adding multiple prices so checkout and links have a clear fallback.',
    related: '[Add product price](/api/products/ProductsController_addPrice)',
  },
  RefundsController_create: {
    summary: 'Create refund',
    body: 'Refunds a completed transaction (card or mobile money). Merchant balance updates immediately.',
    whenToUse:
      'Use for buyer reversals on eligible completed transactions; supports full and partial amounts.',
    caveats:
      'Card customer credit is completed separately by operations. Mobile money partial refunds require a customer phone on file.',
    related:
      '[List refunds](/api/refunds/RefundsController_findAll) · [Retrieve transaction](/api/transactions/TransactionsController_findOne)',
  },
  RefundsController_findAll: {
    summary: 'List refunds',
    body: 'Returns refunds for your organization with optional status and date filters.',
    whenToUse: 'Use for reconciliation, support, and dashboards.',
    related: '[Get refund](/api/refunds/RefundsController_findOne)',
  },
  RefundsController_findOne: {
    summary: 'Get refund',
    body: 'Returns a single refund by ID scoped to your organization.',
    whenToUse: 'Use after create or from webhook-driven flows to confirm refund details.',
    related: '[Create refund](/api/refunds/RefundsController_create)',
  },
  SubscriptionsController_cancel: {
    summary: 'Cancel subscription',
    body: 'Cancels an active subscription; optional reason is stored for analytics and chargeback context.',
    whenToUse:
      'Use when the customer ends service or you enforce policy cancellations.',
    related:
      '[Retrieve subscription](/api/subscriptions/SubscriptionsController_findOne)',
  },
  SubscriptionsController_findAll: {
    summary: 'List subscriptions',
    body: 'Returns subscriptions for your organization with filters as supported by the API.',
    whenToUse:
      'Use for billing ops, dunning dashboards, and revenue reporting.',
  },
  SubscriptionsController_findByCustomer: {
    summary: 'List subscriptions for customer',
    body: 'Returns subscriptions tied to one customer ID. Responds with **404** when the customer is unknown.',
    whenToUse: 'Use on customer portals showing active plans.',
    related: '[Retrieve customer](/api/customers/CustomersController_findOne)',
  },
  SubscriptionsController_findOne: {
    summary: 'Retrieve subscription',
    body: 'Returns one subscription by ID including cycle and price references. Responds with **404** when unknown or inaccessible.',
    whenToUse: 'Use before upgrades, cancelations, or invoicing integration.',
  },
  TransactionsController_findAll: {
    summary: 'List transactions',
    body: 'Returns ledger transactions with filters for status, provider, method, currency, and time range.',
    whenToUse:
      'Use as the primary reconciliation feed for payments, refunds, and payouts visible to your org.',
    related:
      'See also [payment state machine](/reference/reference/payment-state-machine) for status semantics.',
  },
  TransactionsController_findOne: {
    summary: 'Retrieve transaction',
    body: 'Returns one transaction by ID. Responds with **404** when unknown or inaccessible.',
    whenToUse:
      'Use for receipt screens, support tickets, and webhook-triggered deep links.',
  },
  WebhookDeliveryLogsController_findAll: {
    summary: 'List webhook delivery logs',
    body: 'Returns delivery attempts for an outbound webhook endpoint, including HTTP status and retry hints.',
    whenToUse:
      'Use when debugging missed events or proving delivery to auditors.',
    related: '[Retrieve webhook](/api/webhooks/WebhooksController_findOne)',
  },
  WebhookDeliveryLogsController_findOne: {
    summary: 'Retrieve webhook delivery log',
    body: 'Returns a single delivery attempt record.',
    whenToUse:
      'Use when correlating one failure with a specific HTTP response body your server returned.',
  },
  WebhooksController_findAll: {
    summary: 'List webhooks',
    body: 'Returns configured outbound webhook subscriptions (URL, events, signing configuration).',
    whenToUse:
      'Use during setup to confirm which environments receive production traffic.',
  },
  WebhooksController_findOne: {
    summary: 'Retrieve webhook',
    body: 'Returns one outbound subscription by ID for editing forms.',
    whenToUse: 'Use before rotating secrets or changing the event filter.',
  },
  WebhooksController_update: {
    summary: 'Update webhook',
    body: 'Patches delivery URL, secrets, subscribed events, or lifecycle flags for an existing subscription.',
    whenToUse:
      'Use when rotating signing secrets without re-creating the endpoint record.',
    caveats:
      'Coordinate secret rotation with your receiver to avoid rejecting signed payloads.',
    related:
      '[Webhook delivery logs](/api/webhook-delivery-logs/WebhookDeliveryLogsController_findAll)',
  },
};
