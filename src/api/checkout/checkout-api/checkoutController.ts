import { Request, Response } from 'express';
import { createWaveCheckoutSession } from '@/api/services/waveService';
import { initiateCheckout } from './checkout';

interface WaveCheckoutSession {
  wave_launch_url: string;
  // Add other properties if needed
}

export async function initiateWaveCheckout(req: Request, res: Response) {
  try {
    const { amount, currency, errorUrl, successUrl, merchantId, organizationId, customerId, productId, subscriptionId, transactionType, description, referenceId, metadata, feeAmount, feeReference, providerCode, paymentMethodCode, providerTransactionId, providerPaymentStatus } = req.body;
    const checkoutSession = await createWaveCheckoutSession(
      amount,
      currency,
      errorUrl,
      successUrl
    );

    // Create a checkout record
    await initiateCheckout({
      id: '', // Generate a unique ID for the checkout
      merchantId,
      organizationId,
      customerId,
      productId,
      subscriptionId,
      transactionType,
      description,
      referenceId,
      metadata,
      amount,
      feeAmount,
      feeReference,
      currency,
      providerCode,
      paymentMethodCode,
      providerTransactionId,
      providerPaymentStatus,
    });

    res.json({ waveLaunchUrl: (checkoutSession as WaveCheckoutSession).wave_launch_url });
  } catch (error) {
    res.status(500).json({ error: 'Failed to initiate Wave checkout' });
  }
}
