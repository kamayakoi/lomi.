import express from 'express';
import {
  createEndCustomerPaymentMethod,
  getEndCustomerPaymentMethodById,
  updateEndCustomerPaymentMethod,
  deleteEndCustomerPaymentMethod
} from '@/models/endCustomerPaymentMethod';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const paymentMethodData = req.body;
    const newPaymentMethod = await createEndCustomerPaymentMethod(paymentMethodData);
    if (newPaymentMethod) {
      res.status(201).json(newPaymentMethod);
    } else {
      res.status(400).json({ error: 'Failed to create end customer payment method' });
    }
  } catch (error) {
    console.error('Error creating end customer payment method:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:paymentMethodId', async (req, res) => {
  try {
    const paymentMethodId = req.params.paymentMethodId;
    const paymentMethod = await getEndCustomerPaymentMethodById(paymentMethodId);
    if (paymentMethod) {
      res.json(paymentMethod);
    } else {
      res.status(404).json({ error: 'End customer payment method not found' });
    }
  } catch (error) {
    console.error('Error retrieving end customer payment method:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:paymentMethodId', async (req, res) => {
  try {
    const paymentMethodId = req.params.paymentMethodId;
    const updates = req.body;
    const updatedPaymentMethod = await updateEndCustomerPaymentMethod(paymentMethodId, updates);
    if (updatedPaymentMethod) {
      res.json(updatedPaymentMethod);
    } else {
      res.status(404).json({ error: 'End customer payment method not found' });
    }
  } catch (error) {
    console.error('Error updating end customer payment method:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:paymentMethodId', async (req, res) => {
  try {
    const paymentMethodId = req.params.paymentMethodId;
    const deleted = await deleteEndCustomerPaymentMethod(paymentMethodId);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'End customer payment method not found' });
    }
  } catch (error) {
    console.error('Error deleting end customer payment method:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;