import express from 'express';
import { createWebhook, getWebhookById, updateWebhook } from '../../models/webhook';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { url, event_type, organization_id } = req.body;
    const newWebhook = await createWebhook(url, event_type, organization_id);
    res.status(201).json(newWebhook);
  } catch (error) {
    console.error('Error creating webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:webhookId', async (req, res) => {
  try {
    const webhookId = parseInt(req.params.webhookId);
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
    const webhookId = parseInt(req.params.webhookId);
    const { url, event_type, organization_id } = req.body;
    const updatedWebhook = await updateWebhook(webhookId, url, event_type, organization_id);
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

export default router;