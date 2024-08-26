import express from 'express';
import { createApiKey, getApiKeyById, updateApiKey, deleteApiKey } from '../../models/apiKey';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { user_id, name, key, permissions, expires_at } = req.body;
    const newApiKey = await createApiKey(user_id, name, key, permissions, expires_at);
    res.status(201).json(newApiKey);
  } catch (error) {
    console.error('Error creating API key:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:apiKeyId', async (req, res) => {
  try {
    const apiKeyId = parseInt(req.params.apiKeyId);
    const apiKey = await getApiKeyById(apiKeyId);
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

router.put('/:apiKeyId', async (req, res) => {
  try {
    const apiKeyId = parseInt(req.params.apiKeyId);
    const { name, permissions, expires_at } = req.body;
    const updatedApiKey = await updateApiKey(apiKeyId, name, permissions, expires_at);
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

router.delete('/:apiKeyId', async (req, res) => {
  try {
    const apiKeyId = parseInt(req.params.apiKeyId);
    await deleteApiKey(apiKeyId);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting API key:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;