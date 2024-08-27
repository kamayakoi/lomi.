import express from 'express';
import { createRecurringPayment, getRecurringPaymentById, updateRecurringPayment, deleteRecurringPayment } from '@/models/recurringPayment';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const recurringPaymentData = req.body;
    const newRecurringPayment = await createRecurringPayment(recurringPaymentData);
    if (newRecurringPayment) {
      res.status(201).json(newRecurringPayment);
    } else {
      res.status(400).json({ error: 'Failed to create recurring payment' });
    }
  } catch (error) {
    console.error('Error creating recurring payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:recurringPaymentId', async (req, res) => {
  try {
    const recurringPaymentId = req.params.recurringPaymentId;
    const recurringPayment = await getRecurringPaymentById(recurringPaymentId);
    if (recurringPayment) {
      res.json(recurringPayment);
    } else {
      res.status(404).json({ error: 'Recurring payment not found' });
    }
  } catch (error) {
    console.error('Error retrieving recurring payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:recurringPaymentId', async (req, res) => {
  try {
    const recurringPaymentId = req.params.recurringPaymentId;
    const updates = req.body;
    const updatedRecurringPayment = await updateRecurringPayment(recurringPaymentId, updates);
    if (updatedRecurringPayment) {
      res.json(updatedRecurringPayment);
    } else {
      res.status(404).json({ error: 'Recurring payment not found' });
    }
  } catch (error) {
    console.error('Error updating recurring payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:recurringPaymentId', async (req, res) => {
  try {
    const recurringPaymentId = req.params.recurringPaymentId;
    const deleted = await deleteRecurringPayment(recurringPaymentId);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Recurring payment not found' });
    }
  } catch (error) {
    console.error('Error deleting recurring payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;