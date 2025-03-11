import type { WaveCheckoutSession, WaveAggregatedMerchant, CreateWaveAggregatedMerchantParams, WaveAggregatedMerchantResponse, WavePayout } from './types';
import { supabase } from '../supabase/client';

export class WaveClient {
    /**
     * Makes a request to our Wave API Edge Function
     */
    async request<T>(path: string, options: RequestInit = {}): Promise<T> {
        try {
            // Log the request for debugging
            console.log(`Requesting Wave API: ${path}`, { 
                method: options.method || 'GET',
                bodyLength: options.body ? JSON.stringify(options.body).length : 0 
            });

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
            // Add more context to the error
            if (error instanceof Error) {
                console.error('Context:', { path, method: options.method || 'GET' });
            }
            throw error;
        }
    }

    /**
     * Creates a new checkout session
     */
    async createCheckoutSession(params: {
        amount: number;
        currency: string;
        success_url: string;
        error_url: string;
        cancel_url?: string;
        merchant_id?: string;
        aggregated_merchant_id?: string;
        client_reference?: string;
        restrict_payer_mobile?: string;
    }): Promise<WaveCheckoutSession> {
        // Make sure we convert parameters to what Wave API expects
        const requestBody = {
            amount: params.amount.toString(), // Wave API expects amount as string
            currency: params.currency,
            // Ensure URLs use HTTPS - convert localhost URLs to use a dummy https domain for testing
            success_url: this.ensureHttpsUrl(params.success_url),
            error_url: this.ensureHttpsUrl(params.error_url),
            // Only include valid optional parameters
            ...(params.aggregated_merchant_id && { aggregated_merchant_id: params.aggregated_merchant_id }),
            ...(params.client_reference && { client_reference: params.client_reference }),
            ...(params.restrict_payer_mobile && { restrict_payer_mobile: params.restrict_payer_mobile })
        };

        console.log('Sending Wave API request with body:', requestBody);

        return this.request<WaveCheckoutSession>('/v1/checkout/sessions', {
            method: 'POST',
            body: JSON.stringify(requestBody)
        });
    }

    /**
     * Ensures a URL uses HTTPS scheme
     * For local development URLs, it substitutes a dummy HTTPS domain
     */
    ensureHttpsUrl(url: string): string {
        if (url.startsWith('https://')) {
            return url;
        }
        
        // If it's a localhost URL, substitute with a placeholder HTTPS domain
        if (url.includes('localhost') || url.includes('127.0.0.1')) {
            try {
                const originalUrl = new URL(url);
                // Use your production domain as a placeholder for local testing
                return `https://africanledger.com/wave-redirect?path=${encodeURIComponent(originalUrl.pathname)}${originalUrl.search ? '&' + originalUrl.search.substring(1) : ''}`;
            } catch (e) {
                console.error('Invalid URL format:', url);
                // Fallback to a valid HTTPS URL
                return 'https://africanledger.com/wave-redirect';
            }
        }
        
        // For other HTTP URLs, simply replace http:// with https://
        return url.replace('http://', 'https://');
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

    /**
     * Creates a payout to a mobile money user
     * 
     * According to Wave's Payout API documentation, the endpoint is /v1/payouts
     * and requires recipient_mobile, amount, currency, and optionally client_reference
     */
    async createPayout(params: {
        recipient_mobile: string;
        amount: string;
        currency: string;
        client_reference?: string;
        aggregated_merchant_id?: string;
        reason?: string;
    }): Promise<WavePayout> {
        // Ensure mobile number is in the correct format (E.164 standard)
        const formattedMobile = params.recipient_mobile.startsWith('+') 
            ? params.recipient_mobile 
            : `+${params.recipient_mobile}`;

        const payloadParams = {
            ...params,
            recipient_mobile: formattedMobile
        };

        console.log('Creating Wave payout with params:', {
            ...payloadParams,
            recipient_mobile: `${formattedMobile.substring(0, 5)}****` // Log partial number for privacy
        });

        return this.request<WavePayout>('/v1/payouts', {
            method: 'POST',
            body: JSON.stringify(payloadParams)
        });
    }

    /**
     * Gets the status of a payout
     */
    async getPayout(id: string): Promise<WavePayout> {
        return this.request<WavePayout>(`/v1/payouts/${id}`);
    }
}

const waveClient = new WaveClient();
export default waveClient;
