import express from 'express';
import { createFee, getFeeById, updateFee } from '../../models/fee';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, description, amount, currency_id } = req.body;
    const newFee = await createFee(name, description, amount, currency_id);
    res.status(201).json(newFee);
  } catch (error) {
    console.error('Error creating fee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:feeId', async (req, res) => {
  try {
    const feeId = parseInt(req.params.feeId);
    const fee = await getFeeById(feeId);
    if (fee) {
      res.json(fee);
    } else {
      res.status(404).json({ error: 'Fee not found' });
    }
  } catch (error) {
    console.error('Error retrieving fee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:feeId', async (req, res) => {
  try {
    const feeId = parseInt(req.params.feeId);
    const { name, description, amount, currency_id } = req.body;
    const updatedFee = await updateFee(feeId, name, description, amount, currency_id);
    if (updatedFee) {
      res.json(updatedFee);
    } else {
      res.status(404).json({ error: 'Fee not found' });
    }
  } catch (error) {
    console.error('Error updating fee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;