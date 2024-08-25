import express from 'express';
import { createPayout, getPayoutById, getPayoutsByAccountId } from '../../models/payout';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { account_id, amount, currency_id, destination, status } = req.body;
    const newPayout = await createPayout(account_id, amount, currency_id, destination, status);
    res.status(201).json(newPayout);
  } catch (error) {
    res.status(500).json({ error: 'Error creating payout' });
  }
});

router.get('/:payoutId', async (req, res) => {
  try {
    const payoutId = parseInt(req.params.payoutId);
    const payout = await getPayoutById(payoutId);
    if (payout) {
      res.json(payout);
    } else {
      res.status(404).json({ error: 'Payout not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving payout' });
  }
});

router.get('/account/:accountId', async (req, res) => {
  try {
    const accountId = parseInt(req.params.accountId);
    const payouts = await getPayoutsByAccountId(accountId);
    res.json(payouts);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving payouts' });
  }
});

export default router;