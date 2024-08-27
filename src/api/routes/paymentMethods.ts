import express from 'express';
import { createPaymentMethod, getPaymentMethodById, updatePaymentMethod, deletePaymentMethod } from '@/models/paymentMethod';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const paymentMethodData = req.body;
    const newPaymentMethod = await createPaymentMethod(paymentMethodData);
    if (newPaymentMethod) {
      res.status(201).json(newPaymentMethod);
    } else {
      res.status(400).json({ error: 'Failed to create payment method' });
    }
  } catch (error) {
    console.error('Error creating payment method:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:paymentMethodId', async (req, res) => {
  try {
    const paymentMethodId = req.params.paymentMethodId;
    const paymentMethod = await getPaymentMethodById(paymentMethodId);
    if (paymentMethod) {
      res.json(paymentMethod);
    } else {
      res.status(404).json({ error: 'Payment method not found' });
    }
  } catch (error) {
    console.error('Error retrieving payment method:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:paymentMethodId', async (req, res) => {
  try {
    const paymentMethodId = req.params.paymentMethodId;
    const updates = req.body;
    const updatedPaymentMethod = await updatePaymentMethod(paymentMethodId, updates);
    if (updatedPaymentMethod) {
      res.json(updatedPaymentMethod);
    } else {
      res.status(404).json({ error: 'Payment method not found' });
    }
  } catch (error) {
    console.error('Error updating payment method:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:paymentMethodId', async (req, res) => {
  try {
    const paymentMethodId = req.params.paymentMethodId;
    const deleted = await deletePaymentMethod(paymentMethodId);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Payment method not found' });
    }
  } catch (error) {
    console.error('Error deleting payment method:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;