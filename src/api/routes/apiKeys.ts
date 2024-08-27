import express from 'express';
import { createApiKey, getApiKeyById, updateApiKey, deleteApiKey } from '../../models/apiKey';
import { Database } from '../../../database.types';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const apiKeyData = req.body as Database['public']['Tables']['api_keys']['Insert'];
    const newApiKey = await createApiKey(apiKeyData);
    res.status(201).json(newApiKey);
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
    const { api_key, is_active, expiration_date } = req.body as Database['public']['Tables']['api_keys']['Update'];
    const updatedApiKey = await updateApiKey(keyId, { api_key, is_active, expiration_date });
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
    await deleteApiKey(keyId);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting API key:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;