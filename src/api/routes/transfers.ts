import express from 'express';
import { createTransfer, getTransferById, updateTransfer, deleteTransfer } from '@/models/transfer';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const transferData = req.body;
    const newTransfer = await createTransfer(transferData);
    if (newTransfer) {
      res.status(201).json(newTransfer);
    } else {
      res.status(400).json({ error: 'Failed to create transfer' });
    }
  } catch (error) {
    console.error('Error creating transfer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:transferId', async (req, res) => {
  try {
    const transferId = req.params.transferId;
    const transfer = await getTransferById(transferId);
    if (transfer) {
      res.json(transfer);
    } else {
      res.status(404).json({ error: 'Transfer not found' });
    }
  } catch (error) {
    console.error('Error retrieving transfer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:transferId', async (req, res) => {
  try {
    const transferId = req.params.transferId;
    const updates = req.body;
    const updatedTransfer = await updateTransfer(transferId, updates);
    if (updatedTransfer) {
      res.json(updatedTransfer);
    } else {
      res.status(404).json({ error: 'Transfer not found' });
    }
  } catch (error) {
    console.error('Error updating transfer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:transferId', async (req, res) => {
  try {
    const transferId = req.params.transferId;
    const deleted = await deleteTransfer(transferId);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Transfer not found' });
    }
  } catch (error) {
    console.error('Error deleting transfer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;