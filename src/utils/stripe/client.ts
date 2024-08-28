import Stripe from 'stripe';

const stripeClient = new Stripe(process.env.VITE_STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16',
});

export default stripeClient;