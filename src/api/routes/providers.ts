import express from 'express';
import { createProvider, getProviderById, updateProvider, deleteProvider } from '@/models/provider';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const providerData = req.body;
    const newProvider = await createProvider(providerData);
    if (newProvider) {
      res.status(201).json(newProvider);
    } else {
      res.status(400).json({ error: 'Failed to create provider' });
    }
  } catch (error) {
    console.error('Error creating provider:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:providerId', async (req, res) => {
  try {
    const providerId = req.params.providerId;
    const provider = await getProviderById(providerId);
    if (provider) {
      res.json(provider);
    } else {
      res.status(404).json({ error: 'Provider not found' });
    }
  } catch (error) {
    console.error('Error retrieving provider:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:providerId', async (req, res) => {
  try {
    const providerId = req.params.providerId;
    const updates = req.body;
    const updatedProvider = await updateProvider(providerId, updates);
    if (updatedProvider) {
      res.json(updatedProvider);
    } else {
      res.status(404).json({ error: 'Provider not found' });
    }
  } catch (error) {
    console.error('Error updating provider:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:providerId', async (req, res) => {
  try {
    const providerId = req.params.providerId;
    const deleted = await deleteProvider(providerId);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Provider not found' });
    }
  } catch (error) {
    console.error('Error deleting provider:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;