import express from 'express';
import { createOrganization, getOrganizationById, updateOrganization } from '../../models/organization';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, phone_number, country } = req.body;
    const newOrganization = await createOrganization(name, email, phone_number, country);
    res.status(201).json(newOrganization);
  } catch (error) {
    console.error('Error creating organization:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:organizationId', async (req, res) => {
  try {
    const organizationId = parseInt(req.params.organizationId);
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
    const organizationId = parseInt(req.params.organizationId);
    const { name, email, phone_number, country } = req.body;
    const updatedOrganization = await updateOrganization(organizationId, name, email, phone_number, country);
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

export default router;