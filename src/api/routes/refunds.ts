import express from 'express';
import { createRefund, getRefundById } from '../../models/refund';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { transaction_id, amount, currency_id, reason } = req.body;
    const newRefund = await createRefund(transaction_id, amount, currency_id, reason);
    res.status(201).json(newRefund);
  } catch (error) {
    res.status(500).json({ error: 'Error creating refund' });
  }
});

router.get('/:refundId', async (req, res) => {
  try {
    const refundId = parseInt(req.params.refundId);
    const refund = await getRefundById(refundId);
    if (refund) {
      res.json(refund);
    } else {
      res.status(404).json({ error: 'Refund not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving refund' });
  }
});

export default router;