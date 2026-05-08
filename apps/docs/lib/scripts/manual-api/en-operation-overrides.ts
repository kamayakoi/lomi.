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

export const EN_OPERATION_COPY: Partial<Record<string, EnOperationOverride>> = {
  PaymentIntentsController_create: {
    summary: 'Create card PaymentIntent',
    body: 'Creates a card PaymentIntent for Elements / Card integrations and exposes client_secret securely.',
  },
  AccountsController_findAll: {
    summary: 'List accounts',
    body: 'Returns all accounts visible to your API key.',
  },
  AccountsController_getBalance: {
    summary: 'Account balances',
    body: 'Returns current balances across currencies, optionally filtered by a single currency.',
  },
  AccountsController_getBalanceBreakdown: {
    summary: 'Balance breakdown',
    body: 'Returns balance components (available, pending, totals) with optional conversion to a target currency.',
  },
  AccountsController_checkAvailableBalance: {
    summary: 'Check available balance',
    body: 'Checks whether sufficient funds exist in the requested currency.',
  },
  AccountsController_findOne: {
    summary: 'Retrieve an account',
    body: 'Returns a single account. Responds with 404 when the ID is unknown or outside your scope.',
  },
  CustomersController_findAll: {
    summary: 'List customers',
    body: 'Paginated customer list with optional filters: search text, activity status, customer type.',
  },
  CustomersController_create: {
    summary: 'Create a customer',
    body: 'Creates a customer scoped to your organization.',
  },
  CustomersController_findOne: {
    summary: 'Retrieve a customer',
    body: 'Returns one customer by ID. Returns 404 if unknown or inaccessible for this API key.',
  },
  CustomersController_update: {
    summary: 'Update a customer',
    body: 'Partial update — send only fields to change. Returns 404 if unknown or inaccessible.',
  },
  CustomersController_remove: {
    summary: 'Remove a customer',
    body: 'Stops exposing the customer in list/detail responses. Returns 404 if unknown or inaccessible.',
  },
  CustomersController_getTransactions: {
    summary: 'List customer transactions',
    body: 'Returns transactions tied to one customer ID. Returns 404 if unknown or inaccessible.',
  },
  CheckoutSessionsController_create: {
    summary: 'Create checkout session',
    body: 'Creates hosted checkout—buyer completes payment on lomi. Defaults to a 60 minute expiry.',
  },
  CheckoutSessionsController_findAll: {
    summary: 'List checkout sessions',
    body: 'Lists sessions with optional pagination filters and checkout status filtering.',
  },
  CheckoutSessionsController_findOne: {
    summary: 'Retrieve checkout session',
    body: 'Returns session details—status and associated customer/product contexts.',
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
