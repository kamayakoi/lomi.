import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import Stripe from 'stripe';
import {
  LomiPaymentEnvironment,
  normalizePaymentEnvironment,
} from '../payment-environment';
import { createStripeClient, resolveStripeSecretKey } from './stripe-keys';

@Injectable()
export class StripeClientsService {
  private readonly logger = new Logger(StripeClientsService.name);
  private readonly clients = new Map<LomiPaymentEnvironment, Stripe>();

  getClient(environment: unknown): Stripe {
    const paymentEnv = normalizePaymentEnvironment(environment);
    const cached = this.clients.get(paymentEnv);
    if (cached) {
      return cached;
    }

    const secretKey = resolveStripeSecretKey(paymentEnv);
    if (!secretKey) {
      throw new ServiceUnavailableException(
        paymentEnv === 'test'
          ? 'Stripe test mode is not configured (set STRIPE_SECRET_KEY_TEST)'
          : 'Stripe is not configured for this API instance',
      );
    }

    if (
      paymentEnv === 'test' &&
      !process.env.STRIPE_SECRET_KEY_TEST?.trim() &&
      process.env.STRIPE_SECRET_KEY?.trim()
    ) {
      this.logger.warn(
        'Test mode requested but STRIPE_SECRET_KEY_TEST is unset; using STRIPE_SECRET_KEY',
      );
    }

    const client = createStripeClient(secretKey);
    this.clients.set(paymentEnv, client);
    return client;
  }

  /** Webhook follow-up calls after signature verify (uses event.livemode). */
  getClientForStripeLivemode(livemode: boolean): Stripe | undefined {
    const paymentEnv: LomiPaymentEnvironment = livemode ? 'live' : 'test';
    try {
      return this.getClient(paymentEnv);
    } catch {
      this.logger.warn(
        `Stripe secret not configured for livemode=${livemode}`,
      );
      return undefined;
    }
  }
}
