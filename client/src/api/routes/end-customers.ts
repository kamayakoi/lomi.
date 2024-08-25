import express from 'express';
import { createEndCustomer, getEndCustomerById, updateEndCustomer } from '../../models/endCustomer';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, phone_number } = req.body;
    const newEndCustomer = await createEndCustomer(name, email, phone_number);
    res.status(201).json(newEndCustomer);
  } catch (error) {
    console.error('Error creating end customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:endCustomerId', async (req, res) => {
  try {
    const endCustomerId = parseInt(req.params.endCustomerId);
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
    const endCustomerId = parseInt(req.params.endCustomerId);
    const { name, email, phone_number } = req.body;
    const updatedEndCustomer = await updateEndCustomer(endCustomerId, name, email, phone_number);
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

export default router;