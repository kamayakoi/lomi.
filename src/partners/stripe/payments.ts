import stripe from './config';
import { Transaction } from '@/types';

export async function createPaymentIntent(transaction: Transaction, stripeAccountId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: transaction.amount,
      currency: transaction.currency_id.toString(),
      payment_method_types: ['card'],
      application_fee_amount: calculateApplicationFee(transaction.amount),
      transfer_data: {
        destination: stripeAccountId,
      },
    });

    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

function calculateApplicationFee(amount: number): number {
  return Math.round(amount * 0.1);
}