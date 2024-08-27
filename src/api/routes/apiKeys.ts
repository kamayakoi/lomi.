import express from 'express';
import { createApiKey, getApiKeyById, updateApiKey, deleteApiKey } from '@/models/apiKey';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const apiKeyData = req.body;
    const newApiKey = await createApiKey(apiKeyData);
    if (newApiKey) {
      res.status(201).json(newApiKey);
    } else {
      res.status(400).json({ error: 'Failed to create API key' });
    }
  } catch (error) {
    console.error('Error creating API key:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:keyId', async (req, res) => {
  try {
    const keyId = req.params.keyId;
    const apiKey = await getApiKeyById(keyId);
    if (apiKey) {
      res.json(apiKey);
    } else {
      res.status(404).json({ error: 'API key not found' });
    }
  } catch (error) {
    console.error('Error retrieving API key:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:keyId', async (req, res) => {
  try {
    const keyId = req.params.keyId;
    const updates = req.body;
    const updatedApiKey = await updateApiKey(keyId, updates);
    if (updatedApiKey) {
      res.json(updatedApiKey);
    } else {
      res.status(404).json({ error: 'API key not found' });
    }
  } catch (error) {
    console.error('Error updating API key:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:keyId', async (req, res) => {
  try {
    const keyId = req.params.keyId;
    const deleted = await deleteApiKey(keyId);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'API key not found' });
    }
  } catch (error) {
    console.error('Error deleting API key:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;