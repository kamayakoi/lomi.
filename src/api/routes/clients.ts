import express from 'express';
import { createClient, getClientById, updateClient } from '../../models/client';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, phone_number } = req.body;
    const newClient = await createClient(name, email, phone_number);
    res.status(201).json(newClient);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:clientId', async (req, res) => {
  try {
    const clientId = parseInt(req.params.clientId);
    const client = await getClientById(clientId);
    if (client) {
      res.json(client);
    } else {
      res.status(404).json({ error: 'Client not found' });
    }
  } catch (error) {
    console.error('Error retrieving client:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:clientId', async (req, res) => {
  try {
    const clientId = parseInt(req.params.clientId);
    const { name, email, phone_number } = req.body;
    const updatedClient = await updateClient(clientId, name, email, phone_number);
    if (updatedClient) {
      res.json(updatedClient);
    } else {
      res.status(404).json({ error: 'Client not found' });
    }
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;