import { Router } from 'express';
import { handleWaveCheckoutWebhook } from '@/api/services/waveService';
import { validateApiKey } from './middleware/auth';

const router = Router();

// Apply API key validation middleware to all webhook routes
router.use(validateApiKey);

router.post('/wave/checkout', async (req, res) => {
  try {
    await handleWaveCheckoutWebhook(req.body);
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

// Add more webhook endpoints for other payment providers

export default router;
