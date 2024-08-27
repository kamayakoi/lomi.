import express from 'express';
import { createOrganization, getOrganizationById, updateOrganization, deleteOrganization } from '@/models/organization';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const organizationData = req.body;
    const newOrganization = await createOrganization(organizationData);
    if (newOrganization) {
      res.status(201).json(newOrganization);
    } else {
      res.status(400).json({ error: 'Failed to create organization' });
    }
  } catch (error) {
    console.error('Error creating organization:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:organizationId', async (req, res) => {
  try {
    const organizationId = req.params.organizationId;
    const organization = await getOrganizationById(organizationId);
    if (organization) {
      res.json(organization);
    } else {
      res.status(404).json({ error: 'Organization not found' });
    }
  } catch (error) {
    console.error('Error retrieving organization:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:organizationId', async (req, res) => {
  try {
    const organizationId = req.params.organizationId;
    const updates = req.body;
    const updatedOrganization = await updateOrganization(organizationId, updates);
    if (updatedOrganization) {
      res.json(updatedOrganization);
    } else {
      res.status(404).json({ error: 'Organization not found' });
    }
  } catch (error) {
    console.error('Error updating organization:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:organizationId', async (req, res) => {
  try {
    const organizationId = req.params.organizationId;
    const deleted = await deleteOrganization(organizationId);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Organization not found' });
    }
  } catch (error) {
    console.error('Error deleting organization:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;