/* @proprietary license */

/** Public merchant HTTP API only; omit internal/agent routes from curated docs coverage. */
export const AGENT_OPENAPI_PREFIX = '/agent';

/** Section folder order matches sidebar (first URL segment → folder name). */
export const REST_API_SECTION_ORDER = [
  'accounts',
  'charge',
  'checkout-sessions',
  'customer-subscriptions',
  'customers',
  'discount-coupons',
  'merchants',
  'organizations',
  'payment-links',
  'payment-requests',
  'payouts',
  'products',
  'providers',
  'refunds',
  'subscriptions',
  'transactions',
  'webhook-delivery-logs',
  'webhooks',
] as const;

export type RestApiFolder = (typeof REST_API_SECTION_ORDER)[number];

export function pathToFolder(route: string): string {
  const parts = route.split('/').filter(Boolean);
  const first = parts[0];
  if (!first) return 'general';
  return first;
}

export function isAgentRoute(route: string): boolean {
  return (
    route.startsWith(`${AGENT_OPENAPI_PREFIX}/`) ||
    route === AGENT_OPENAPI_PREFIX
  );
}
