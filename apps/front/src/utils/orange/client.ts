import { supabase } from '../supabase/client';
import type {
    OrangeTokenResponse,
    OrangeWebPaymentResponse,
    OrangeTransactionStatusResponse,
    OrangeWebPaymentRequest,
    OrangeTransactionStatusRequest,
    OrangePaymentStatus
} from './types';

export class OrangeClient {
    /**
     * Makes a request to our Orange API Edge Function
     */
    async request<T>(path: string, options: RequestInit = {}): Promise<T> {
        try {
            // Log the request for debugging
            console.log(`Requesting Orange API: ${path}`, { 
                method: options.method || 'GET',
                bodyLength: options.body ? JSON.stringify(options.body).length : 0 
            });

            const { data, error } = await supabase.functions.invoke('orange', {
                body: {
                    path,
                    method: options.method || 'GET',
                    body: options.body ? JSON.parse(options.body as string) : undefined
                }
            });

            if (error) {
                console.error('Orange API Request Failed:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Orange API Request Failed:', error);
            // Add more context to the error
            if (error instanceof Error) {
                error.message = `Orange API Error (${path}): ${error.message}`;
            }
            throw error;
        }
    }

    /**
     * Gets an OAuth token from Orange
     */
    async getToken(): Promise<OrangeTokenResponse> {
        return this.request<OrangeTokenResponse>('/oauth/v3/token', {
            method: 'POST',
            body: JSON.stringify({
                grant_type: 'client_credentials'
            })
        });
    }

    /**
     * Creates a new web payment session
     */
    async createWebPayment(params: OrangeWebPaymentRequest): Promise<OrangeWebPaymentResponse> {
        // Log sensitive data securely (partial masking)
        console.log('Creating Orange Web Payment with params:', {
            ...params,
            merchant_key: params.merchant_key ? '***' + params.merchant_key.slice(-4) : undefined,
            amount: params.amount
        });

        return this.request<OrangeWebPaymentResponse>('/orange-money-webpay/dev/v1/webpayment', {
            method: 'POST',
            body: JSON.stringify(params)
        });
    }

    /**
     * Gets the status of a transaction
     */
    async getTransactionStatus(params: OrangeTransactionStatusRequest): Promise<OrangeTransactionStatusResponse> {
        return this.request<OrangeTransactionStatusResponse>('/orange-money-webpay/dev/v1/transactionstatus', {
            method: 'POST',
            body: JSON.stringify(params)
        });
    }

    /**
     * Utility function to generate a unique order ID based on timestamp and random string
     */
    generateOrderId(prefix = 'ORDER'): string {
        const timestamp = Date.now().toString();
        const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `${prefix}_${timestamp}_${randomStr}`;
    }

    /**
     * Maps Orange payment status to our standardized payment status
     */
    mapPaymentStatus(orangeStatus: OrangePaymentStatus): 'pending' | 'completed' | 'failed' {
        switch(orangeStatus) {
            case 'SUCCESS':
                return 'completed';
            case 'FAILED':
                return 'failed';
            case 'INITIATED':
            case 'PENDING':
            case 'EXPIRED':
            default:
                return 'pending';
        }
    }
}

const orangeClient = new OrangeClient();
export default orangeClient; 