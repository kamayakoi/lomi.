import Stripe from 'stripe';

export const stripeConfig = {
  secretKey: process.env.STRIPE_SECRET_KEY!,
  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY!,
};

const stripe = new Stripe(stripeConfig.secretKey, {
  apiVersion: '2023-08-16',
});

export default stripe;