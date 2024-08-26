import express from 'express';
import { createApiCredential, getApiCredentialById, updateApiCredential, deleteApiCredential } from '../../models/apiCredential';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { provider_id, name, api_key, api_secret } = req.body;
    const newApiCredential = await createApiCredential(provider_id, name, api_key, api_secret);
    res.status(201).json(newApiCredential);
  } catch (error) {
    console.error('Error creating API credential:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:apiCredentialId', async (req, res) => {
  try {
    const apiCredentialId = parseInt(req.params.apiCredentialId);
    const apiCredential = await getApiCredentialById(apiCredentialId);
    if (apiCredential) {
      res.json(apiCredential);
    } else {
      res.status(404).json({ error: 'API credential not found' });
    }
  } catch (error) {
    console.error('Error retrieving API credential:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:apiCredentialId', async (req, res) => {
  try {
    const apiCredentialId = parseInt(req.params.apiCredentialId);
    const { name, api_key, api_secret } = req.body;
    const updatedApiCredential = await updateApiCredential(apiCredentialId, name, api_key, api_secret);
    if (updatedApiCredential) {
      res.json(updatedApiCredential);
    } else {
      res.status(404).json({ error: 'API credential not found' });
    }
  } catch (error) {
    console.error('Error updating API credential:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:apiCredentialId', async (req, res) => {
  try {
    const apiCredentialId = parseInt(req.params.apiCredentialId);
    await deleteApiCredential(apiCredentialId);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting API credential:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;