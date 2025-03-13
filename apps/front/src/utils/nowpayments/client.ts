import { supabase } from '../supabase/client';
import type {
    NOWPaymentsEstimateResponse,
    NOWPaymentsCreatePaymentResponse,
    NOWPaymentsPaymentStatusResponse,
    CreatePaymentRequest,
    NOWPaymentsCurrency
} from './types';

export class NOWPaymentsClient {
    /**
     * Makes a request to our NOWPayments API Edge Function
     */
    async request<T>(path: string, options: RequestInit = {}): Promise<T> {
        try {
            // Log the request for debugging
            console.log(`Requesting NOWPayments API: ${path}`, { 
                method: options.method || 'GET',
                bodyLength: options.body ? JSON.stringify(options.body).length : 0 
            });

            const { data, error } = await supabase.functions.invoke('nowpayments', {
                body: {
                    path,
                    method: options.method || 'GET',
                    body: options.body ? JSON.parse(options.body as string) : undefined
                }
            });

            if (error) {
                console.error('NOWPayments API Request Failed:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('NOWPayments API Request Failed:', error);
            if (error instanceof Error) {
                error.message = `NOWPayments API Error (${path}): ${error.message}`;
            }
            throw error;
        }
    }

    /**
     * Gets the available payment currencies
     */
    async getAvailableCurrencies(): Promise<NOWPaymentsCurrency[]> {
        return this.request<NOWPaymentsCurrency[]>('/v1/currencies');
    }

    /**
     * Gets an estimate of the crypto amount needed for a price
     */
    async getEstimate(amount: number, from: string, to: string): Promise<NOWPaymentsEstimateResponse> {
        return this.request<NOWPaymentsEstimateResponse>(
            `/v1/estimate?amount=${amount}&from_currency=${from}&to_currency=${to}`
        );
    }

    /**
     * Creates a payment
     */
    async createPayment(params: CreatePaymentRequest): Promise<NOWPaymentsCreatePaymentResponse> {
        return this.request<NOWPaymentsCreatePaymentResponse>('/v1/payment', {
            method: 'POST',
            body: JSON.stringify(params)
        });
    }

    /**
     * Gets the status of a payment
     */
    async getPaymentStatus(paymentId: string): Promise<NOWPaymentsPaymentStatusResponse> {
        return this.request<NOWPaymentsPaymentStatusResponse>(`/v1/payment/${paymentId}`);
    }
}

const nowPaymentsClient = new NOWPaymentsClient();
export default nowPaymentsClient;