import express from 'express';
import { createApiProvider, getApiProviderById, updateApiProvider, deleteApiProvider } from '../../models/apiProvider';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, description, base_url } = req.body;
    const newApiProvider = await createApiProvider(name, description, base_url);
    res.status(201).json(newApiProvider);
  } catch (error) {
    console.error('Error creating API provider:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:apiProviderId', async (req, res) => {
  try {
    const apiProviderId = parseInt(req.params.apiProviderId);
    const apiProvider = await getApiProviderById(apiProviderId);
    if (apiProvider) {
      res.json(apiProvider);
    } else {
      res.status(404).json({ error: 'API provider not found' });
    }
  } catch (error) {
    console.error('Error retrieving API provider:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:apiProviderId', async (req, res) => {
  try {
    const apiProviderId = parseInt(req.params.apiProviderId);
    const { name, description, base_url } = req.body;
    const updatedApiProvider = await updateApiProvider(apiProviderId, name, description, base_url);
    if (updatedApiProvider) {
      res.json(updatedApiProvider);
    } else {
      res.status(404).json({ error: 'API provider not found' });
    }
  } catch (error) {
    console.error('Error updating API provider:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:apiProviderId', async (req, res) => {
  try {
    const apiProviderId = parseInt(req.params.apiProviderId);
    await deleteApiProvider(apiProviderId);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting API provider:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;