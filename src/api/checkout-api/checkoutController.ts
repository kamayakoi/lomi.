import { Request, Response } from 'express';
import { createWaveCheckoutSession } from '@/api/services/waveService';

export async function initiateWaveCheckout(req: Request, res: Response) {
  try {
    const { amount, currency, aggregatedMerchantId, errorUrl, successUrl } = req.body;
    const checkoutSession = await createWaveCheckoutSession(
      amount,
      currency,
      aggregatedMerchantId,
      errorUrl,
      successUrl
    );
    res.json({ waveLaunchUrl: checkoutSession.wave_launch_url });
  } catch (error) {
    res.status(500).json({ error: 'Failed to initiate Wave checkout' });
  }
}
