import axios from 'axios';
import { updateTransactionStatus } from './transactionService';
import { supabase } from '@/utils/supabase/client';

const WAVE_API_URL = 'https://api.wave.com/v1';
const WAVE_API_KEY = Bun.env['VITE_WAVE_API_KEY']

// ... existing functions ...

export async function createWaveCheckoutSession(
  amount: number,
  currency: string,
  errorUrl: string,
  successUrl: string
) {
  try {
    const response = await axios.post(`${WAVE_API_URL}/checkout/sessions`, {
      amount,
      currency,
      aggregated_merchant_id: Bun.env['VITE_WAVE_MERCHANT_ID'],
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
    
    // Update the transaction status and provider details based on the payment_status
    if (payment_status === 'succeeded') {
      await supabase
        .from('providers_transactions')
        .update({ wave_payment_status: 'succeeded' })
        .eq('wave_transaction_id', id);

      await updateTransactionStatus(id, 'success');
    } else if (payment_status === 'cancelled') {
      await supabase
        .from('providers_transactions')
        .update({ wave_payment_status: 'cancelled' })
        .eq('wave_transaction_id', id);

      await updateTransactionStatus(id, 'failed');
    }
  } catch (error) {
    console.error('Error handling Wave checkout webhook:', error);
    throw error;
  }
}
