import express from 'express';
import { createEndCustomer, getEndCustomerById, updateEndCustomer, deleteEndCustomer } from '@/models/endCustomer';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const endCustomerData = req.body;
    const newEndCustomer = await createEndCustomer(endCustomerData);
    if (newEndCustomer) {
      res.status(201).json(newEndCustomer);
    } else {
      res.status(400).json({ error: 'Failed to create end customer' });
    }
  } catch (error) {
    console.error('Error creating end customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:endCustomerId', async (req, res) => {
  try {
    const endCustomerId = req.params.endCustomerId;
    const endCustomer = await getEndCustomerById(endCustomerId);
    if (endCustomer) {
      res.json(endCustomer);
    } else {
      res.status(404).json({ error: 'End customer not found' });
    }
  } catch (error) {
    console.error('Error retrieving end customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:endCustomerId', async (req, res) => {
  try {
    const endCustomerId = req.params.endCustomerId;
    const updates = req.body;
    const updatedEndCustomer = await updateEndCustomer(endCustomerId, updates);
    if (updatedEndCustomer) {
      res.json(updatedEndCustomer);
    } else {
      res.status(404).json({ error: 'End customer not found' });
    }
  } catch (error) {
    console.error('Error updating end customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:endCustomerId', async (req, res) => {
  try {
    const endCustomerId = req.params.endCustomerId;
    const deleted = await deleteEndCustomer(endCustomerId);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'End customer not found' });
    }
  } catch (error) {
    console.error('Error deleting end customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;