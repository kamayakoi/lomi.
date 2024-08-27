import express from 'express';
import { createUserOrganizationLink, getUserOrganizationLinkById, updateUserOrganizationLink, deleteUserOrganizationLink } from '@/models/userOrganizationLink';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const linkData = req.body;
    const newLink = await createUserOrganizationLink(linkData);
    if (newLink) {
      res.status(201).json(newLink);
    } else {
      res.status(400).json({ error: 'Failed to create user organization link' });
    }
  } catch (error) {
    console.error('Error creating user organization link:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:linkId', async (req, res) => {
  try {
    const linkId = req.params.linkId;
    const link = await getUserOrganizationLinkById(linkId);
    if (link) {
      res.json(link);
    } else {
      res.status(404).json({ error: 'User organization link not found' });
    }
  } catch (error) {
    console.error('Error retrieving user organization link:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:linkId', async (req, res) => {
  try {
    const linkId = req.params.linkId;
    const updates = req.body;
    const updatedLink = await updateUserOrganizationLink(linkId, updates);
    if (updatedLink) {
      res.json(updatedLink);
    } else {
      res.status(404).json({ error: 'User organization link not found' });
    }
  } catch (error) {
    console.error('Error updating user organization link:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:linkId', async (req, res) => {
  try {
    const linkId = req.params.linkId;
    const deleted = await deleteUserOrganizationLink(linkId);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'User organization link not found' });
    }
  } catch (error) {
    console.error('Error deleting user organization link:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;