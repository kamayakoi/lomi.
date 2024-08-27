import express from 'express';
import { createOrganizationProvider, getOrganizationProviderById, updateOrganizationProvider, deleteOrganizationProvider } from '@/models/organizationProvider';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const providerData = req.body;
    const newProvider = await createOrganizationProvider(providerData);
    if (newProvider) {
      res.status(201).json(newProvider);
    } else {
      res.status(400).json({ error: 'Failed to create organization provider' });
    }
  } catch (error) {
    console.error('Error creating organization provider:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:orgProviderId', async (req, res) => {
  try {
    const orgProviderId = req.params.orgProviderId;
    const provider = await getOrganizationProviderById(orgProviderId);
    if (provider) {
      res.json(provider);
    } else {
      res.status(404).json({ error: 'Organization provider not found' });
    }
  } catch (error) {
    console.error('Error retrieving organization provider:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:orgProviderId', async (req, res) => {
  try {
    const orgProviderId = req.params.orgProviderId;
    const updates = req.body;
    const updatedProvider = await updateOrganizationProvider(orgProviderId, updates);
    if (updatedProvider) {
      res.json(updatedProvider);
    } else {
      res.status(404).json({ error: 'Organization provider not found' });
    }
  } catch (error) {
    console.error('Error updating organization provider:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:orgProviderId', async (req, res) => {
  try {
    const orgProviderId = req.params.orgProviderId;
    const deleted = await deleteOrganizationProvider(orgProviderId);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Organization provider not found' });
    }
  } catch (error) {
    console.error('Error deleting organization provider:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;