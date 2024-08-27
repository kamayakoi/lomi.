import express from 'express';
import { createFee, getFeeById, updateFee, deleteFee } from '@/models/fee';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const feeData = req.body;
    const newFee = await createFee(feeData);
    if (newFee) {
      res.status(201).json(newFee);
    } else {
      res.status(400).json({ error: 'Failed to create fee' });
    }
  } catch (error) {
    console.error('Error creating fee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:feeId', async (req, res) => {
  try {
    const feeId = req.params.feeId;
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
    const feeId = req.params.feeId;
    const updates = req.body;
    const updatedFee = await updateFee(feeId, updates);
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

router.delete('/:feeId', async (req, res) => {
  try {
    const feeId = req.params.feeId;
    const deleted = await deleteFee(feeId);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Fee not found' });
    }
  } catch (error) {
    console.error('Error deleting fee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;