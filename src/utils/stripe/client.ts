import Stripe from 'stripe';
import { stripeConfig } from './config';

const stripeClient = new Stripe(stripeConfig.secretKey, {
  apiVersion: '2023-08-16',
});

export default stripeClient;