import Stripe from 'stripe';

const stripeSecretKey = process.env.VITE_STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('VITE_STRIPE_SECRET_KEY is not defined in the environment variables');
}

const stripeClient = new Stripe(stripeSecretKey, {
  apiVersion: '2023-08-16',
});

export default stripeClient;