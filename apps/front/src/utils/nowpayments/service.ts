import { supabase } from '@/utils/supabase/client';
import nowPaymentsClient from './client';
import { convertToCrypto, getSuggestedCrypto, convertCurrencyWithPrecision } from '@/utils/currency-utils';
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
            console.log('Fetching available currencies from NOWPayments');
            const currencies = await nowPaymentsClient.getAvailableCurrencies();
            
            if (!currencies.length) {
                console.warn('No currencies returned from NOWPayments, using default cryptocurrencies');
                return [
                    { id: "btc", code: "btc", name: "Bitcoin", enabled: true, is_base_currency: true, is_quote_currency: true, minimum_amount: "0.001" },
                    { id: "eth", code: "eth", name: "Ethereum", enabled: true, is_base_currency: true, is_quote_currency: true, minimum_amount: "0.01" },
                    { id: "ltc", code: "ltc", name: "Litecoin", enabled: true, is_base_currency: true, is_quote_currency: true, minimum_amount: "0.1" },
                    { id: "usdt", code: "usdt", name: "Tether USD", enabled: true, is_base_currency: true, is_quote_currency: true, minimum_amount: "10" },
                    { id: "doge", code: "doge", name: "Dogecoin", enabled: true, is_base_currency: true, is_quote_currency: true, minimum_amount: "100" }
                ];
            }

            console.log('Available currencies:', {
                count: currencies.length,
                currencies: currencies.map(c => c.code)
            });

            return currencies;
        } catch (error) {
            console.error('Error fetching available currencies:', error);
            // Return common cryptocurrencies as fallback
            return [
                { id: "btc", code: "btc", name: "Bitcoin", enabled: true, is_base_currency: true, is_quote_currency: true, minimum_amount: "0.001" },
                { id: "eth", code: "eth", name: "Ethereum", enabled: true, is_base_currency: true, is_quote_currency: true, minimum_amount: "0.01" },
                { id: "ltc", code: "ltc", name: "Litecoin", enabled: true, is_base_currency: true, is_quote_currency: true, minimum_amount: "0.1" },
                { id: "usdt", code: "usdt", name: "Tether USD", enabled: true, is_base_currency: true, is_quote_currency: true, minimum_amount: "10" },
                { id: "doge", code: "doge", name: "Dogecoin", enabled: true, is_base_currency: true, is_quote_currency: true, minimum_amount: "100" }
            ];
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
            // NOTE: As a payment aggregator platform, we use a single NOWPayments integration
            // managed via environment variables, not per-organization settings

            // 1. Ensure currency is supported by NOWPayments
            // NOWPayments only supports certain currencies, so convert from XOF to USD if needed
            let convertedAmount = amount;
            let useCurrency = currency;
            
            // If currency is not USD, convert to USD for NOWPayments
            if (currency !== 'USD') {
                try {
                    // Convert from local currency to USD
                    convertedAmount = convertCurrencyWithPrecision(
                        amount, 
                        currency as currency_code, 
                        'USD'
                    );
                    
                    console.log(`Converted ${amount} ${currency} to ${convertedAmount} USD for NOWPayments`);
                    useCurrency = 'USD';
                } catch (error) {
                    console.error(`Failed to convert from ${currency} to USD:`, error);
                    throw new Error(`Currency ${currency} is not supported by NOWPayments, and conversion to USD failed`);
                }
            }

            // 2. Create payment using NOWPayments API with USD
            const paymentResponse = await nowPaymentsClient.createPayment({
                price_amount: convertedAmount,
                price_currency: useCurrency, // Using USD or other supported currency
                pay_currency: payCurrency,
                ipn_callback_url: notificationUrl,
                order_id: `${merchantId}_${Date.now()}`,
                order_description: description,
                success_url: successUrl,
                cancel_url: cancelUrl
            });

            console.log('NOWPayments payment created:', {
                payment_id: paymentResponse.payment_id,
                pay_address: paymentResponse.pay_address,
                pay_amount: paymentResponse.pay_amount
            });

            // 3. Create transaction record - now using dedicated columns
            // But still store the original amount and currency for reference
            const { data: transactionId, error: transactionError } = await supabase.rpc(
                'create_nowpayments_checkout_transaction',
                {
                    p_merchant_id: merchantId,
                    p_organization_id: organizationId,
                    p_customer_id: customerId,
                    p_amount: amount, // Save original amount
                    p_currency_code: currency, // Save original currency
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
                            pay_currency: paymentResponse.pay_currency,
                            converted_amount: convertedAmount,
                            converted_currency: useCurrency
                        },
                        ...metadata,
                        original_amount: amount,
                        original_currency: currency
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
            // Map NOWPayments status to our provider_payment_status enum
            // The database expects values from the provider_payment_status enum
            let mappedStatus: string;
            
            switch (status.toLowerCase()) {
                case 'waiting':
                case 'confirming':
                case 'confirmed':
                case 'sending':
                case 'partially_paid':
                    mappedStatus = 'processing';
                    break;
                case 'finished':
                    mappedStatus = 'succeeded';
                    break;
                case 'failed':
                case 'expired':
                    mappedStatus = 'cancelled';
                    break;
                case 'refunded':
                    mappedStatus = 'refunded';
                    break;
                default:
                    mappedStatus = 'processing'; // Default fallback
            }
            
            console.log(`Mapping NOWPayments status "${status}" to provider_payment_status "${mappedStatus}"`);

            // Add provider status to metadata for reference
            const enhancedMetadata = {
                ...metadata,
                original_nowpayments_status: status
            };

            // Call the RPC function with mapped status
            const { error } = await supabase.rpc('update_nowpayments_payment_status', {
                p_provider_checkout_id: paymentId,
                p_payment_status: status, // This is for the transactions.status column
                p_provider_status: mappedStatus, // New parameter for the provider_payment_status enum column
                p_metadata: enhancedMetadata
            });

            if (error) {
                console.error('Database error updating payment status:', error);
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
            // For a payment aggregator platform, we use a platform-wide IPN secret
            // rather than per-organization settings
            
            // Create the verification payload
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
            console.log('Checking NOWPayments payment status for payment_id:', paymentId);
            const response = await nowPaymentsClient.getPaymentStatus(paymentId);
            
            console.log('NOWPayments status response:', response);
            
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
            let cryptoAmount: number | undefined;
            
            if (!payCurrency) {
                try {
                    // We need to convert to USD first for NOWPayments, since XOF isn't supported
                    const usdAmount = params.currency !== 'USD' 
                        ? convertCurrencyWithPrecision(params.amount, params.currency as currency_code, 'USD')
                        : params.amount;

                    // Get a suggested crypto based on amount and currency (using USD)
                    const suggestion = await getSuggestedCrypto(
                        usdAmount, 
                        'USD' // Always use USD when interacting with NOWPayments API
                    );
                    
                    if (suggestion.valid) {
                        payCurrency = suggestion.suggestedCrypto;
                        cryptoAmount = suggestion.suggestedAmount;
                    } else {
                        // If invalid (below minimum), default to BTC
                        payCurrency = 'btc';
                    }
                } catch (error) {
                    console.warn('Error getting suggested cryptocurrency, defaulting to BTC:', error);
                    payCurrency = 'btc';
                }
            }
            
            // If no crypto amount yet, convert the amount to the selected cryptocurrency
            // For NOWPayments, we need to use USD instead of XOF
            if (!cryptoAmount && payCurrency) {
                try {
                    // Convert to USD first if needed
                    const usdAmount = params.currency !== 'USD'
                        ? convertCurrencyWithPrecision(params.amount, params.currency as currency_code, 'USD')
                        : params.amount;
                    
                    // Then convert USD to the selected cryptocurrency
                    const conversion = await convertToCrypto(
                        usdAmount, 
                        'USD', // Always use USD with NOWPayments API
                        payCurrency
                    );
                    cryptoAmount = conversion.cryptoAmount;
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
                    cryptoAmount,
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

    /**
     * Updates the payment currency for an existing transaction
     */
    static async updatePaymentCurrency({
        transactionId,
        newCurrency,
        forceUsdConversion = false
    }: {
        transactionId: string;
        newCurrency: string;
        forceUsdConversion?: boolean;
    }): Promise<{
        success: boolean;
        payAddress: string;
        payAmount: number;
    }> {
        try {
            // Get the existing transaction details
            const { data: paymentData, error: paymentError } = await supabase
                .rpc('get_nowpayments_payment_status_by_transaction_id', {
                    p_transaction_id: transactionId
                });

            if (paymentError || !paymentData) {
                throw new Error('Transaction not found');
            }

            console.log('Existing payment data:', paymentData);

            // Use USD as intermediate currency for consistency
            let priceAmount = paymentData.amount;
            let priceCurrency = paymentData.currency;

            // If currency is not USD or we're forcing USD conversion
            if (forceUsdConversion || (priceCurrency !== 'USD' && priceCurrency !== 'usd')) {
                try {
                    // Convert from local currency to USD for NOWPayments
                    priceAmount = convertCurrencyWithPrecision(
                        paymentData.amount,
                        paymentData.currency as currency_code,
                        'USD'
                    );
                    priceCurrency = 'USD';
                    console.log(`Converted ${paymentData.amount} ${paymentData.currency} to ${priceAmount} USD for NOWPayments`);
                } catch (conversionError) {
                    console.error('Currency conversion error:', conversionError);
                    // Continue with original values if conversion fails
                }
            }

            // Create a new payment with the new currency
            console.log('Creating new payment with currency:', {
                price_amount: priceAmount,
                price_currency: priceCurrency,
                pay_currency: newCurrency
            });

            const paymentResponse = await nowPaymentsClient.createPayment({
                price_amount: priceAmount,
                price_currency: priceCurrency,
                pay_currency: newCurrency,
                ipn_callback_url: `${window.location.origin}/api/nowpayments/webhook`,
                order_id: `${paymentData.merchant_id}_${Date.now()}`,
                order_description: paymentData.description || 'Payment with updated currency',
                success_url: paymentData.success_url,
                cancel_url: paymentData.cancel_url
            });

            console.log('New payment response:', paymentResponse);

            // Update the transaction in the database with the new payment details
            const success = await nowPaymentsClient.updatePaymentCurrency(
                transactionId,
                paymentResponse.payment_id,
                newCurrency.toLowerCase(),
                paymentResponse.pay_amount,
                paymentResponse.pay_address
            );

            if (!success) {
                console.error('Database update failed');
                throw new Error('Failed to update payment currency in database');
            }

            return {
                success: true,
                payAddress: paymentResponse.pay_address,
                payAmount: paymentResponse.pay_amount
            };
        } catch (error) {
            console.error('Error updating payment currency:', error);
            throw error;
        }
    }
}

export default NOWPaymentsService;