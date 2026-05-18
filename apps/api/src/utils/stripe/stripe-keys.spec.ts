import Stripe from 'stripe';
import {
  constructStripeWebhookEvent,
  normalizePaymentEnvironment,
  resolveStripeSecretKey,
  resolveStripeWebhookSecrets,
} from './stripe-keys';

describe('stripe-keys', () => {
  const envBackup = { ...process.env };

  afterEach(() => {
    process.env = { ...envBackup };
  });

  it('normalizePaymentEnvironment defaults to live', () => {
    expect(normalizePaymentEnvironment(undefined)).toBe('live');
    expect(normalizePaymentEnvironment('TEST')).toBe('test');
  });

  it('resolveStripeSecretKey prefers test key in test mode', () => {
    process.env.STRIPE_SECRET_KEY = 'sk_live';
    process.env.STRIPE_SECRET_KEY_TEST = 'sk_test';
    expect(resolveStripeSecretKey('test')).toBe('sk_test');
    expect(resolveStripeSecretKey('live')).toBe('sk_live');
  });

  it('resolveStripeSecretKey does not fall back to live secret in production test mode', () => {
    const prevNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    process.env.STRIPE_SECRET_KEY = 'sk_live';
    delete process.env.STRIPE_SECRET_KEY_TEST;
    expect(resolveStripeSecretKey('test')).toBeUndefined();
    process.env.NODE_ENV = prevNodeEnv;
  });

  it('resolveStripeWebhookSecrets dedupes live and test secrets', () => {
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_live';
    process.env.STRIPE_WEBHOOK_SECRET_TEST = 'whsec_test';
    expect(resolveStripeWebhookSecrets()).toEqual([
      'whsec_live',
      'whsec_test',
    ]);
  });

  it('constructStripeWebhookEvent verifies with matching secret', () => {
    const payload = JSON.stringify({ id: 'evt_1', type: 'payment_intent.succeeded' });
    const secret = 'whsec_test_construct';
    process.env.STRIPE_WEBHOOK_SECRET = secret;
    delete process.env.STRIPE_WEBHOOK_SECRET_TEST;

    const signature = Stripe.webhooks.generateTestHeaderString({
      payload,
      secret,
    });

    const event = constructStripeWebhookEvent(payload, signature);
    expect(event.type).toBe('payment_intent.succeeded');
  });
});
