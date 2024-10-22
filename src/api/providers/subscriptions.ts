// import { Router } from 'express';
// import { createSubscription, getSubscriptionById, cancelSubscription } from '@/services/subscriptionService';

// const router = Router();

// router.post('/', async (req, res) => {
//   const { customerId, planId } = req.body;
//   const subscription = await createSubscription(customerId, planId);
//   res.status(201).json(subscription);
// });

// router.get('/:id', async (req, res) => {
//   const { id } = req.params;
//   const subscription = await getSubscriptionById(id);
//   if (!subscription) {
//     res.status(404).json({ error: 'Subscription not found' });
//   } else {
//     res.json(subscription);
//   }
// });

// router.patch('/:id/cancel', async (req, res) => {
//   const { id } = req.params;
//   const subscription = await cancelSubscription(id);
//   if (!subscription) {
//     res.status(404).json({ error: 'Subscription not found' });
//   } else {
//     res.json(subscription);
//   }
// });

// export default router;
