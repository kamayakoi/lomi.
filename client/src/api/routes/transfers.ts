import express from 'express';
import { createTransfer, getTransferById } from '../../models/transfer';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { source_account_id, destination_account_id, amount, currency_id } = req.body;
    const newTransfer = await createTransfer(source_account_id, destination_account_id, amount, currency_id);
    res.status(201).json(newTransfer);
  } catch (error) {
    console.error('Error creating transfer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:transferId', async (req, res) => {
  try {
    const transferId = parseInt(req.params.transferId);
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

export default router;