import type { WaveCheckoutSession, WaveAggregatedMerchant, CreateWaveAggregatedMerchantParams, WaveAggregatedMerchantResponse } from './types';
import { supabase } from '../supabase/client';

export class WaveClient {
    /**
     * Makes a request to our Wave API Edge Function
     */
    async request<T>(path: string, options: RequestInit = {}): Promise<T> {
        try {
            const { data, error } = await supabase.functions.invoke('wave', {
                body: {
                    path,
                    method: options.method || 'GET',
                    body: options.body ? JSON.parse(options.body as string) : undefined
                }
            });

            if (error) {
                console.error('Wave API Request Failed:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Wave API Request Failed:', error);
            throw error;
        }
    }

    /**
     * Creates a new checkout session
     */
    async createCheckoutSession(params: {
        amount: number;
        currency: string;
        merchant_reference_id: string;
        merchant_id: string;
        success_url: string;
        cancel_url: string;
    }): Promise<WaveCheckoutSession> {
        return this.request<WaveCheckoutSession>('/v1/checkout/sessions', {
            method: 'POST',
            body: JSON.stringify(params)
        });
    }

    /**
     * Gets a checkout session by ID
     */
    async getCheckoutSession(id: string): Promise<WaveCheckoutSession> {
        return this.request<WaveCheckoutSession>(`/v1/checkout/sessions/${id}`);
    }

    async getCheckoutSessionByTransactionId(
        transactionId: string
    ): Promise<WaveCheckoutSession> {
        return this.request<WaveCheckoutSession>(`/v1/checkout/sessions?transaction_id=${transactionId}`);
    }

    async refundCheckoutSession(id: string): Promise<void> {
        await this.request(`/v1/checkout/sessions/${id}/refund`, {
            method: 'POST',
        });
    }

    async expireCheckoutSession(id: string): Promise<void> {
        await this.request(`/v1/checkout/sessions/${id}/expire`, {
            method: 'POST',
        });
    }

    async createAggregatedMerchant(params: CreateWaveAggregatedMerchantParams): Promise<WaveAggregatedMerchant> {
        return this.request<WaveAggregatedMerchant>('/v1/aggregated_merchants', {
            method: 'POST',
            body: JSON.stringify(params)
        });
    }

    async getAggregatedMerchant(id: string): Promise<WaveAggregatedMerchant> {
        return this.request<WaveAggregatedMerchant>(`/v1/aggregated_merchants/${id}`);
    }

    async listAggregatedMerchants(first?: number, after?: string): Promise<WaveAggregatedMerchantResponse> {
        const params = new URLSearchParams();
        if (first) params.append('first', first.toString());
        if (after) params.append('after', after);

        return this.request<WaveAggregatedMerchantResponse>(
            `/v1/aggregated_merchants${params.toString() ? `?${params.toString()}` : ''}`
        );
    }
}

const waveClient = new WaveClient();
export default waveClient;
