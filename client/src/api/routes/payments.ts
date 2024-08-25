import express from 'express';
import { createPayment, getPaymentById } from '../../models/payment';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { transaction_id, amount, currency_id, payment_method_id, status } = req.body;
    const newPayment = await createPayment(transaction_id, amount, currency_id, payment_method_id, status);
    res.status(201).json(newPayment);
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:paymentId', async (req, res) => {
  try {
    const paymentId = parseInt(req.params.paymentId);
    const payment = await getPaymentById(paymentId);
    if (payment) {
      res.json(payment);
    } else {
      res.status(404).json({ error: 'Payment not found' });
    }
  } catch (error) {
    console.error('Error retrieving payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;