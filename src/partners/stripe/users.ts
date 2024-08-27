import stripe from './config';
import { User } from '@/types';

export async function createConnectedAccount(user: User) {
  try {
    const account = await stripe.accounts.create({
      type: 'express',
      country: user.country,
      email: user.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual',
    });

    await saveUserStripeId(user.user_id, account.id);

    return account;
  } catch (error) {
    console.error('Error creating connected account:', error);
    throw error;
  }
}

export async function createAccountLink(accountId: string) {
  try {
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.BASE_URL}/onboarding/refresh`,
      return_url: `${process.env.BASE_URL}/onboarding/complete`,
      type: 'account_onboarding',
    });

    return accountLink;
  } catch (error) {
    console.error('Error creating account link:', error);
    throw error;
  }
}

async function saveUserStripeId(userId: number, stripeAccountId: string) {
  // Save the Stripe account ID to your merchant record in the database
}