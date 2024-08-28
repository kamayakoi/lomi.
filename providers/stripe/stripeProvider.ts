import stripeClient from '../../src/utils/stripe/client';
import { Database } from '../../database.types';

type User = Database['public']['Tables']['users']['Row'];
type Transaction = Database['public']['Tables']['transactions']['Row'];

export class StripeProvider {
  async createConnectedAccount(user: User) {
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

      await this.saveUserStripeId(user.user_id, account.id);

      return account;
    } catch (error) {
      console.error('Error creating connected account:', error);
      throw error;
    }
  }

  async createAccountLink(accountId: string) {
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

  async createPaymentIntent(transaction: Transaction, stripeAccountId: string) {
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

async createAccountSession(account: string) {
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

  private async saveUserStripeId(userId: string, stripeAccountId: string) {
    // Implement the logic to save the Stripe account ID to your database
    // You might want to use your Supabase client here to update the user record
  }
}