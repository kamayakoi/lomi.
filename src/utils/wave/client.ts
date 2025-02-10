import type { WaveCheckoutSession, WaveAggregatedMerchant, CreateWaveAggregatedMerchantParams, WaveAggregatedMerchantResponse } from './types';

export class WaveClient {
    private apiKey: string;
    private baseUrl: string;

    constructor() {
        this.apiKey = import.meta.env['VITE_WAVE_API_KEY'];
        this.baseUrl = 'https://api.wave.com';
    }

    /**
     * Makes a request to the Wave API
     */
    async request<T>(path: string, options: RequestInit = {}): Promise<T> {
        const url = `${this.baseUrl}${path}`;
        const headers = {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Origin': window.location.origin,
            ...options.headers
        };

        try {
            console.log(`Making Wave API request to ${url}`, {
                method: options.method || 'GET',
                headers,
                body: options.body
            });

            const response = await fetch(url, {
                ...options,
                headers,
                mode: 'cors',
                credentials: 'omit'
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Wave API error response:', {
                    status: response.status,
                    statusText: response.statusText,
                    body: errorText,
                    headers: Object.fromEntries(response.headers.entries())
                });

                if (response.status === 401) {
                    throw new Error('Wave API authentication failed. Please check your API key.');
                }
                if (response.status === 403) {
                    throw new Error('Access denied. Your account may not have permission for this operation.');
                }

                throw new Error(`Wave API request failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Wave API response:', data);
            return data;
        } catch (error) {
            console.error('Wave API Request Failed:', {
                url,
                method: options.method || 'GET',
                error: error instanceof Error ? error.message : 'Unknown error',
                apiKey: this.apiKey ? 'Present' : 'Missing'
            });
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
