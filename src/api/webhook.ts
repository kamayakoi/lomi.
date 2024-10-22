import { Router } from 'express';
import { handleWaveCheckoutWebhook } from '@/api/services/waveService';

const router = Router();

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
