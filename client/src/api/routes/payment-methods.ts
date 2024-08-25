import express from 'express';
import { createPaymentMethod, getPaymentMethodById, updatePaymentMethod } from '../../models/paymentMethod';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, description, provider_id } = req.body;
    const newPaymentMethod = await createPaymentMethod(name, description, provider_id);
    res.status(201).json(newPaymentMethod);
  } catch (error) {
    console.error('Error creating payment method:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:paymentMethodId', async (req, res) => {
  try {
    const paymentMethodId = parseInt(req.params.paymentMethodId);
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
    const paymentMethodId = parseInt(req.params.paymentMethodId);
    const { name, description, provider_id } = req.body;
    const updatedPaymentMethod = await updatePaymentMethod(paymentMethodId, name, description, provider_id);
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

export default router;