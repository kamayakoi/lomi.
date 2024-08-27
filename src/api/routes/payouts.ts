import express from 'express';
import { createPayout, getPayoutById, updatePayout, deletePayout } from '@/models/payout';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const payoutData = req.body;
    const newPayout = await createPayout(payoutData);
    if (newPayout) {
      res.status(201).json(newPayout);
    } else {
      res.status(400).json({ error: 'Failed to create payout' });
    }
  } catch (error) {
    console.error('Error creating payout:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:payoutId', async (req, res) => {
  try {
    const payoutId = req.params.payoutId;
    const payout = await getPayoutById(payoutId);
    if (payout) {
      res.json(payout);
    } else {
      res.status(404).json({ error: 'Payout not found' });
    }
  } catch (error) {
    console.error('Error retrieving payout:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:payoutId', async (req, res) => {
  try {
    const payoutId = req.params.payoutId;
    const updates = req.body;
    const updatedPayout = await updatePayout(payoutId, updates);
    if (updatedPayout) {
      res.json(updatedPayout);
    } else {
      res.status(404).json({ error: 'Payout not found' });
    }
  } catch (error) {
    console.error('Error updating payout:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:payoutId', async (req, res) => {
  try {
    const payoutId = req.params.payoutId;
    const deleted = await deletePayout(payoutId);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Payout not found' });
    }
  } catch (error) {
    console.error('Error deleting payout:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;