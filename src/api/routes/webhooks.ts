import express from 'express';
import { createWebhook, getWebhookById, updateWebhook, deleteWebhook } from '@/models/webhook';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const webhookData = req.body;
    const newWebhook = await createWebhook(webhookData);
    if (newWebhook) {
      res.status(201).json(newWebhook);
    } else {
      res.status(400).json({ error: 'Failed to create webhook' });
    }
  } catch (error) {
    console.error('Error creating webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:webhookId', async (req, res) => {
  try {
    const webhookId = req.params.webhookId;
    const webhook = await getWebhookById(webhookId);
    if (webhook) {
      res.json(webhook);
    } else {
      res.status(404).json({ error: 'Webhook not found' });
    }
  } catch (error) {
    console.error('Error retrieving webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:webhookId', async (req, res) => {
  try {
    const webhookId = req.params.webhookId;
    const updates = req.body;
    const updatedWebhook = await updateWebhook(webhookId, updates);
    if (updatedWebhook) {
      res.json(updatedWebhook);
    } else {
      res.status(404).json({ error: 'Webhook not found' });
    }
  } catch (error) {
    console.error('Error updating webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:webhookId', async (req, res) => {
  try {
    const webhookId = req.params.webhookId;
    const deleted = await deleteWebhook(webhookId);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Webhook not found' });
    }
  } catch (error) {
    console.error('Error deleting webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;