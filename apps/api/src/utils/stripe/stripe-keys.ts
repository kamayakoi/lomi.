import Stripe from 'stripe';
import {
  LomiPaymentEnvironment,
  normalizePaymentEnvironment,
} from '../payment-environment';

export type { LomiPaymentEnvironment } from '../payment-environment';
export { normalizePaymentEnvironment } from '../payment-environment';

const STRIPE_API_VERSION =
  '2025-11-17.clover' as Stripe.StripeConfig['apiVersion'];

/**
 * Aligns with dashboard edge `resolveStripeSecretKey`: test mode prefers
 * STRIPE_SECRET_KEY_TEST, live mode prefers STRIPE_SECRET_KEY.
 * In production, test mode does not fall back to the live secret.
 */
export function resolveStripeSecretKey(
  paymentEnvironment?: string | null,
): string | undefined {
  const env = normalizePaymentEnvironment(paymentEnvironment);
  const testKey = process.env.STRIPE_SECRET_KEY_TEST?.trim();
  const liveKey = process.env.STRIPE_SECRET_KEY?.trim();

  if (env === 'test') {
    if (testKey) {
      return testKey;
    }
    if (process.env.NODE_ENV === 'production') {
      return undefined;
    }
    return liveKey;
  }
  return liveKey || testKey;
}

export function resolveStripeWebhookSecrets(): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of [
    process.env.STRIPE_WEBHOOK_SECRET,
    process.env.STRIPE_WEBHOOK_SECRET_TEST,
  ]) {
    const secret = raw?.trim();
    if (secret && !seen.has(secret)) {
      seen.add(secret);
      out.push(secret);
    }
  }
  return out;
}

export function createStripeClient(secretKey: string): Stripe {
  return new Stripe(secretKey, { apiVersion: STRIPE_API_VERSION });
}

/**
 * Verify Stripe webhook signature against live and/or test endpoint secrets.
 */
export function constructStripeWebhookEvent(
  rawBody: Buffer | string,
  signature: string,
): Stripe.Event {
  const secrets = resolveStripeWebhookSecrets();
  if (secrets.length === 0) {
    throw new Error('No Stripe webhook secrets configured');
  }

  let lastError: unknown;
  for (const secret of secrets) {
    try {
      return Stripe.webhooks.constructEvent(rawBody, signature, secret);
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('Stripe webhook signature verification failed');
}

/** Map Stripe `livemode` flag to Lomi ledger / API key environment. */
export function stripeLivemodeToPaymentEnvironment(
  livemode: boolean,
): LomiPaymentEnvironment {
  return livemode ? 'live' : 'test';
}
