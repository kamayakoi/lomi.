import { StripeProvider } from './stripe/stripeProvider';
import { Database } from '../database.types';

type User = Database['public']['Tables']['users']['Row'];
type Transaction = Database['public']['Tables']['transactions']['Row'];

export interface Provider {
  createConnectedAccount(user: User): Promise<any>;
  createAccountLink(accountId: string): Promise<any>;
  createPaymentIntent(transaction: Transaction, stripeAccountId: string): Promise<any>;
  createAccountSession(account: string): Promise<any>;
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