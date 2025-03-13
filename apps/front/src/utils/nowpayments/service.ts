import { supabase } from '@/utils/supabase/client';
import nowPaymentsClient from './client';
import { convertToCrypto, getSuggestedCrypto } from '@/utils/currency-utils';
import type {
    NOWPaymentsCurrency,
    NOWPaymentsPaymentStatusResponse,
    NOWPaymentsStatus
} from './types';
import type { currency_code } from '@/pages/portal/balance/components/types';

// Define interface for NOWPayments provider settings
interface NOWPaymentsProviderSettings {
    organization_id: string;
    provider_code: string;
    provider_merchant_id: string;
    is_connected: boolean;
    metadata: {
        api_key: string;
        ipn_secret: string;
        [key: string]: unknown;
    };
}

interface CreateCryptoCheckoutSessionParams {
    merchantId: string;
    organizationId: string;
    customerId: string;
    amount: number;
    currency: string;
    payCurrency: string;
    successUrl: string;
    cancelUrl: string;
    notificationUrl: string;
    productId?: string;
    subscriptionId?: string;
    description?: string;
    metadata?: Record<string, unknown>;
}

interface InitiateNOWPaymentsCheckoutParams {
    merchantId: string;
    organizationId: string;
    customerId: string;
    amount: number;
    currency: string;
    payCurrency?: string;
    successUrl: string;
    cancelUrl: string;
    productId?: string;
    subscriptionId?: string;
    description?: string;
    metadata?: Record<string, unknown>;
}

interface TransactionMetadata {
    nowpayments_session?: {
        payment_id: string;
        pay_address: string;
        status: NOWPaymentsStatus;
        pay_amount: number;
        pay_currency: string;
        actually_paid?: number;
        outcome_amount?: number;
        outcome_currency?: string;
    };
    [key: string]: unknown;
}

export class NOWPaymentsService {
    /**
     * Fetches NOWPayments provider settings for an organization
     */
    static async getNOWPaymentsProviderSettings(organizationId: string): Promise<NOWPaymentsProviderSettings | null> {
        try {
            const { data, error } = await supabase.rpc(
                'fetch_nowpayments_provider_settings',
                { p_organization_id: organizationId }
            ).single();

            if (error) {
                console.error('Error fetching NOWPayments provider settings:', error);
                return null;
            }

            return data as NOWPaymentsProviderSettings;
        } catch (error) {
            console.error('Error in getNOWPaymentsProviderSettings:', error);
            return null;
        }
    }

    /**
     * Gets available crypto currencies
     */
    static async getAvailableCurrencies(): Promise<NOWPaymentsCurrency[]> {
        try {
            const currencies = await nowPaymentsClient.getAvailableCurrencies();
            return currencies.filter(c => c.enabled);
        } catch (error) {
            console.error('Error fetching available currencies:', error);
            throw error;
        }
    }

    /**
     * Creates a crypto checkout session
     */
    static async createCheckoutSession({
        merchantId,
        organizationId,
        customerId,
        amount,
        currency,
        payCurrency,
        successUrl,
        cancelUrl,
        notificationUrl,
        productId,
        subscriptionId,
        description,
        metadata
    }: CreateCryptoCheckoutSessionParams): Promise<{
        transactionId: string;
        payAddress: string;
        payAmount: number;
        paymentId: string;
    }> {
        try {
            // 1. Get NOWPayments settings
            const settings = await this.getNOWPaymentsProviderSettings(organizationId);
            
            if (!settings || !settings.metadata?.api_key) {
                throw new Error('NOWPayments is not properly configured for this organization');
            }

            // 2. Create payment
            const paymentResponse = await nowPaymentsClient.createPayment({
                price_amount: amount,
                price_currency: currency,
                pay_currency: payCurrency,
                ipn_callback_url: notificationUrl,
                order_id: `${merchantId}_${Date.now()}`,
                order_description: description,
                success_url: successUrl,
                cancel_url: cancelUrl
            });

            // 3. Create transaction record - now using dedicated columns
            const { data: transactionId, error: transactionError } = await supabase.rpc(
                'create_nowpayments_checkout_transaction',
                {
                    p_merchant_id: merchantId,
                    p_organization_id: organizationId,
                    p_customer_id: customerId,
                    p_amount: amount,
                    p_currency_code: currency,
                    p_provider_checkout_id: paymentResponse.payment_id,
                    p_checkout_url: '', // NOWPayments doesn't provide a checkout URL
                    p_error_url: cancelUrl,
                    p_success_url: successUrl,
                    // Now passing the values for dedicated columns
                    p_pay_currency: paymentResponse.pay_currency,
                    p_pay_amount: paymentResponse.pay_amount,
                    p_ipn_callback_url: notificationUrl,
                    p_product_id: productId,
                    p_subscription_id: subscriptionId,
                    p_description: description,
                    p_metadata: {
                        nowpayments_session: {
                            payment_id: paymentResponse.payment_id,
                            pay_address: paymentResponse.pay_address,
                            status: paymentResponse.payment_status,
                            pay_amount: paymentResponse.pay_amount,
                            pay_currency: paymentResponse.pay_currency
                        },
                        ...metadata
                    }
                }
            );

            if (transactionError) {
                console.error('Error creating NOWPayments transaction record:', transactionError);
                throw new Error(`Failed to create transaction: ${transactionError.message}`);
            }

            return {
                transactionId,
                payAddress: paymentResponse.pay_address,
                payAmount: paymentResponse.pay_amount,
                paymentId: paymentResponse.payment_id
            };
        } catch (error) {
            console.error('Error creating NOWPayments checkout:', error);
            throw error;
        }
    }

    /**
     * Updates the status of a NOWPayments payment transaction
     */
    static async updateTransactionStatus(
        paymentId: string,
        status: NOWPaymentsStatus,
        metadata?: TransactionMetadata
    ): Promise<void> {
        try {
            const { error } = await supabase.rpc('update_nowpayments_payment_status', {
                p_provider_checkout_id: paymentId,
                p_payment_status: status,
                p_metadata: metadata
            });

            if (error) {
                throw new Error(`Failed to update payment status: ${error.message}`);
            }
        } catch (error) {
            console.error('Error updating NOWPayments payment status:', error);
            throw error;
        }
    }

    /**
     * Verifies a notification from NOWPayments (IPN callback)
     */
    static async verifyNotification(
        payload: Record<string, unknown>,
        xNowpaymentsSignature: string,
        organizationId: string
    ): Promise<boolean> {
        try {
            const settings = await this.getNOWPaymentsProviderSettings(organizationId);
            
            if (!settings || !settings.metadata?.ipn_secret) {
                console.error('NOWPayments IPN secret not configured');
                return false;
            }

            const { data, error } = await supabase.rpc('verify_nowpayments_notification', {
                p_payload: payload,
                p_signature: xNowpaymentsSignature,
                p_organization_id: organizationId
            });

            if (error) {
                console.error('Error verifying NOWPayments notification:', error);
                return false;
            }

            return data as boolean;
        } catch (error) {
            console.error('Error verifying NOWPayments notification:', error);
            return false;
        }
    }

    /**
     * Checks the status of a payment
     */
    static async checkPaymentStatus(paymentId: string): Promise<NOWPaymentsPaymentStatusResponse> {
        try {
            const response = await nowPaymentsClient.getPaymentStatus(paymentId);
            
            // Update the transaction status in our database
            await this.updateTransactionStatus(
                paymentId,
                response.payment_status,
                {
                    nowpayments_session: {
                        payment_id: response.payment_id,
                        pay_address: response.pay_address,
                        status: response.payment_status,
                        pay_amount: response.pay_amount,
                        pay_currency: response.pay_currency,
                        actually_paid: response.actually_paid,
                        outcome_amount: response.outcome_amount,
                        outcome_currency: response.outcome_currency
                    }
                }
            );

            return response;
        } catch (error) {
            console.error('Error checking NOWPayments payment status:', error);
            throw error;
        }
    }

    /**
     * Gets the status of a payment (alias for checkPaymentStatus)
     */
    static async getPaymentStatus(paymentId: string): Promise<NOWPaymentsPaymentStatusResponse> {
        return this.checkPaymentStatus(paymentId);
    }

    /**
     * Initiates a NOWPayments checkout session with automatic currency selection if needed
     */
    static async initiateCheckout(params: InitiateNOWPaymentsCheckoutParams): Promise<{
        transactionId: string;
        providerCheckoutId: string;
        checkoutUrl: string;
    }> {
        try {
            // Generate notification URL for IPN callbacks
            const notificationUrl = `${window.location.origin}/api/nowpayments/webhook`;
            
            // If no payCurrency is specified, get a suggested one based on amount
            let payCurrency = params.payCurrency;
            let convertedAmount: number | undefined;
            
            if (!payCurrency) {
                try {
                    // Get a suggested crypto based on amount and currency
                    const suggestion = await getSuggestedCrypto(
                        params.amount, 
                        params.currency as currency_code
                    );
                    
                    if (suggestion.valid) {
                        payCurrency = suggestion.suggestedCrypto;
                        convertedAmount = suggestion.suggestedAmount;
                    } else {
                        // If invalid (below minimum), default to BTC
                        payCurrency = 'btc';
                    }
                } catch (error) {
                    console.warn('Error getting suggested cryptocurrency, defaulting to BTC:', error);
                    payCurrency = 'btc';
                }
            }
            
            // If no converted amount yet, convert the amount to the selected cryptocurrency
            if (!convertedAmount && payCurrency) {
                try {
                    const conversion = await convertToCrypto(
                        params.amount, 
                        params.currency as currency_code,
                        payCurrency
                    );
                    convertedAmount = conversion.cryptoAmount;
                } catch (error) {
                    console.warn('Error converting to cryptocurrency:', error);
                    // Continue without converted amount, the service will handle it
                }
            }

            // Create a crypto payment through the NOWPayments service
            const result = await this.createCheckoutSession({
                merchantId: params.merchantId,
                organizationId: params.organizationId,
                customerId: params.customerId,
                amount: params.amount,
                currency: params.currency,
                payCurrency: payCurrency || 'btc', // Default to BTC if no suggestion
                successUrl: params.successUrl,
                cancelUrl: params.cancelUrl,
                notificationUrl: notificationUrl,
                productId: params.productId,
                subscriptionId: params.subscriptionId,
                description: params.description,
                metadata: {
                    ...params.metadata,
                    convertedAmount,
                    originalCurrency: params.currency
                }
            });

            // Create a checkout URL for NOWPayments with needed query parameters
            const checkoutUrl = `/nowpayments-checkout/${result.transactionId}?currency=${params.currency}&amount=${params.amount}&payCurrency=${payCurrency || 'btc'}`;

            return {
                transactionId: result.transactionId,
                providerCheckoutId: result.paymentId,
                checkoutUrl: checkoutUrl
            };
        } catch (error) {
            console.error('Error initiating NOWPayments checkout:', error);
            throw error;
        }
    }
}

export default NOWPaymentsService;