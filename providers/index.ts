import { StripeProvider } from './stripe/stripeProvider';
import { Database } from '../database.types';
import Stripe from 'stripe';

type User = Database['public']['Tables']['users']['Row'];
type Transaction = Database['public']['Tables']['transactions']['Row'];

export interface Provider {
  createConnectedAccount(user: User, organizationId: string): Promise<Stripe.Response<Stripe.Account>>;
  createAccountLink(accountId: string): Promise<Stripe.Response<Stripe.AccountLink>>;
  createPaymentIntent(transaction: Transaction, stripeAccountId: string): Promise<Stripe.Response<Stripe.PaymentIntent>>;
  createAccountSession(account: string): Promise<Stripe.Response<Stripe.AccountSession>>;
}

const providers: { [key: string]: Provider } = {
  stripe: new StripeProvider(),
};

export function getProvider(providerName: string): Provider {
  const provider = providers[providerName.toLowerCase()];
  if (!provider) {
    throw new Error(`Provider ${providerName} not found`);
  }
  return provider;
}