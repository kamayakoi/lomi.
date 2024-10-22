import axios from 'axios';
import { updateTransactionStatus } from './transactionService';

const WAVE_API_URL = 'https://api.wave.com/v1';
const WAVE_API_KEY = "import.meta.env.['VITE_WAVE_API_KEY']"

// ... existing functions ...

export async function createWaveCheckoutSession(
  amount: number,
  currency: string,
  aggregatedMerchantId: string,
  errorUrl: string,
  successUrl: string
) {
  try {
    const response = await axios.post(`${WAVE_API_URL}/checkout/sessions`, {
      amount,
      currency,
      aggregated_merchant_id: aggregatedMerchantId,
      error_url: errorUrl,
      success_url: successUrl,
    }, {
      headers: {
        'Authorization': `Bearer ${WAVE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating Wave checkout session:', error);
    throw error;
  }
}

interface WaveCheckoutWebhookPayload {
  id: string;
  payment_status: string;
  // Add other relevant properties
}

export async function handleWaveCheckoutWebhook(body: WaveCheckoutWebhookPayload) {
  try {
    const { id, payment_status } = body;
    
    // Update the transaction status based on the payment_status
    if (payment_status === 'succeeded') {
      await updateTransactionStatus(id, 'success');
    } else if (payment_status === 'cancelled') {
      await updateTransactionStatus(id, 'failed');
    }
  } catch (error) {
    console.error('Error handling Wave checkout webhook:', error);
    throw error;
  }
}
