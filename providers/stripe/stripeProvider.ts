import stripeClient from '../../src/utils/stripe/client';
import { Database } from '../../database.types';
import { createServerSupabaseClient } from '../../src/utils/supabase/server';
import { Provider } from '../index';
import Stripe from 'stripe';

type User = Database['public']['Tables']['users']['Row'];
type Transaction = Database['public']['Tables']['transactions']['Row'];

export class StripeProvider implements Provider {
  async createConnectedAccount(user: User, organizationId: string): Promise<Stripe.Response<Stripe.Account>> {
    try {
      if (!user.country) {
        throw new Error('User country is required for creating a Stripe account');
      }
      const account = await stripeClient.accounts.create({
        type: 'express',
        country: user.country,
        email: user.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: 'individual',
      });

      await this.saveStripeAccountId(organizationId, account.id);

      return account;
    } catch (error) {
      console.error('Error creating connected account:', error);
      throw error;
    }
  }

  async createAccountLink(accountId: string): Promise<Stripe.Response<Stripe.AccountLink>> {
    try {
      return await stripeClient.accountLinks.create({
        account: accountId,
        refresh_url: `${process.env.BASE_URL}/onboarding/refresh`,
        return_url: `${process.env.BASE_URL}/onboarding/complete`,
        type: 'account_onboarding',
      });
    } catch (error) {
      console.error('Error creating account link:', error);
      throw error;
    }
  }

  async createPaymentIntent(transaction: Transaction, stripeAccountId: string): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    try {
      return await stripeClient.paymentIntents.create({
        amount: transaction.amount,
        currency: transaction.currency_code.toLowerCase(),
        payment_method_types: ['card'],
        application_fee_amount: this.calculateApplicationFee(transaction.amount),
        transfer_data: {
          destination: stripeAccountId,
        },
      });
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  async createAccountSession(account: string): Promise<Stripe.Response<Stripe.AccountSession>> {
    try {
      return await stripeClient.accountSessions.create({
        account,
        components: {
          account_onboarding: { enabled: true }
        },
      });
    } catch (error) {
      console.error('Error creating account session:', error);
      throw error;
    }
  }

  private calculateApplicationFee(amount: number): number {
    return Math.round(amount * 0.1);
  }

  private async saveStripeAccountId(organizationId: string, stripeAccountId: string) {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('organization_providers')
      .upsert({
        organization_id: organizationId,
        provider_code: 'STRIPE',
        provider_account_id: stripeAccountId,
        is_connected: true
      });

    if (error) throw error;
    return data;
  }
}