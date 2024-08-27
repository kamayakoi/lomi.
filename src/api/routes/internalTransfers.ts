import express from 'express';
import { createInternalTransfer, getInternalTransferById, updateInternalTransfer, deleteInternalTransfer } from '@/models/internalTransfer';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const transferData = req.body;
    const newTransfer = await createInternalTransfer(transferData);
    if (newTransfer) {
      res.status(201).json(newTransfer);
    } else {
      res.status(400).json({ error: 'Failed to create internal transfer' });
    }
  } catch (error) {
    console.error('Error creating internal transfer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:transferId', async (req, res) => {
  try {
    const transferId = req.params.transferId;
    const transfer = await getInternalTransferById(transferId);
    if (transfer) {
      res.json(transfer);
    } else {
      res.status(404).json({ error: 'Internal transfer not found' });
    }
  } catch (error) {
    console.error('Error retrieving internal transfer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:transferId', async (req, res) => {
  try {
    const transferId = req.params.transferId;
    const updates = req.body;
    const updatedTransfer = await updateInternalTransfer(transferId, updates);
    if (updatedTransfer) {
      res.json(updatedTransfer);
    } else {
      res.status(404).json({ error: 'Internal transfer not found' });
    }
  } catch (error) {
    console.error('Error updating internal transfer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:transferId', async (req, res) => {
  try {
    const transferId = req.params.transferId;
    const deleted = await deleteInternalTransfer(transferId);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Internal transfer not found' });
    }
  } catch (error) {
    console.error('Error deleting internal transfer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;