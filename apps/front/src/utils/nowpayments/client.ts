import { supabase } from '../supabase/client';
import type {
    NOWPaymentsEstimateResponse,
    NOWPaymentsCreatePaymentResponse,
    NOWPaymentsPaymentStatusResponse,
    CreatePaymentRequest,
    NOWPaymentsCurrency
} from './types';

// Define types for merchant coins response
type MerchantCoinsResponse = 
    | string[] 
    | { currencies: string[] }
    | { currency_list: string[] }
    | { [currencyCode: string]: { enabled?: boolean } };

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
     * Gets all available crypto currencies (both enabled and disabled)
     */
    async getAllCurrencies(): Promise<NOWPaymentsCurrency[]> {
        try {
            console.log('Fetching all currencies from NOWPayments');
            const response = await this.request<NOWPaymentsCurrency[] | { currencies: NOWPaymentsCurrency[] } | string[]>('/v1/currencies');
            
            // Log the raw response for debugging
            console.log('Raw currencies response:', response);

            let currencies: NOWPaymentsCurrency[] = [];

            if (Array.isArray(response)) {
                // Handle array of strings format
                if (response.length > 0 && typeof response[0] === 'string') {
                    currencies = (response as string[]).map(code => ({
                        id: code.toLowerCase(),
                        code: code.toLowerCase(),
                        name: code.toUpperCase(),
                        enabled: true,
                        is_base_currency: true,
                        is_quote_currency: true,
                        minimum_amount: "0.001"
                    }));
                } else {
                    // Handle array of currency objects
                    currencies = response as NOWPaymentsCurrency[];
                }
            } else if (response && typeof response === 'object' && 'currencies' in response && Array.isArray(response.currencies)) {
                currencies = response.currencies;
            } else {
                console.error('Invalid response format from currencies endpoint:', response);
                currencies = this.getDefaultCurrencies();
            }

            // Validate currency objects
            currencies = currencies.filter(currency => 
                currency && 
                typeof currency === 'object' && 
                'code' in currency &&
                typeof currency.code === 'string'
            );

            console.log('Processed currencies:', {
                count: currencies.length,
                sample: currencies.slice(0, 5).map(c => c.code)
            });

            // If we got no valid currencies from the API or a very limited set, add our default currencies
            if (currencies.length < 5) {
                console.warn('Limited or no currencies returned from API, adding default cryptocurrencies');
                const defaultCurrencies = this.getDefaultCurrencies();
                
                // Add default currencies that aren't already in the list
                const existingCodes = new Set(currencies.map(c => c.code.toLowerCase()));
                const additionalCurrencies = defaultCurrencies.filter(c => !existingCodes.has(c.code.toLowerCase()));
                
                if (additionalCurrencies.length > 0) {
                    console.log('Adding default currencies:', additionalCurrencies.map(c => c.code));
                    currencies = [...currencies, ...additionalCurrencies];
                }
            }

            return currencies.length > 0 ? currencies : this.getDefaultCurrencies();
        } catch (error) {
            console.error('Failed to fetch all currencies:', error);
            return this.getDefaultCurrencies();
        }
    }

    /**
     * Returns a default set of common cryptocurrencies to use as fallback
     */
    private getDefaultCurrencies(): NOWPaymentsCurrency[] {
        return [
            { id: "btc", code: "btc", name: "Bitcoin", enabled: true, is_base_currency: true, is_quote_currency: true, minimum_amount: "0.001" },
            { id: "eth", code: "eth", name: "Ethereum", enabled: true, is_base_currency: true, is_quote_currency: true, minimum_amount: "0.01" },
            { id: "usdt", code: "usdt", name: "Tether USD", enabled: true, is_base_currency: true, is_quote_currency: true, minimum_amount: "10" },
            { id: "usdc", code: "usdc", name: "USD Coin", enabled: true, is_base_currency: true, is_quote_currency: true, minimum_amount: "10" },
            { id: "dai", code: "dai", name: "Dai", enabled: true, is_base_currency: true, is_quote_currency: true, minimum_amount: "10" },
            { id: "sol", code: "sol", name: "Solana", enabled: true, is_base_currency: true, is_quote_currency: true, minimum_amount: "0.1" },
            { id: "bnb", code: "bnb", name: "Binance Coin", enabled: true, is_base_currency: true, is_quote_currency: true, minimum_amount: "0.05" },
            { id: "matic", code: "matic", name: "Polygon", enabled: true, is_base_currency: true, is_quote_currency: true, minimum_amount: "10" },
            { id: "doge", code: "doge", name: "Dogecoin", enabled: true, is_base_currency: true, is_quote_currency: true, minimum_amount: "100" },
            { id: "ada", code: "ada", name: "Cardano", enabled: true, is_base_currency: true, is_quote_currency: true, minimum_amount: "10" },
            { id: "xrp", code: "xrp", name: "Ripple", enabled: true, is_base_currency: true, is_quote_currency: true, minimum_amount: "10" },
            { id: "trx", code: "trx", name: "TRON", enabled: true, is_base_currency: true, is_quote_currency: true, minimum_amount: "100" },
            { id: "fil", code: "fil", name: "Filecoin", enabled: true, is_base_currency: true, is_quote_currency: true, minimum_amount: "0.5" },
            { id: "ton", code: "ton", name: "Toncoin", enabled: true, is_base_currency: true, is_quote_currency: true, minimum_amount: "5" },
            { id: "xtz", code: "xtz", name: "Tezos", enabled: true, is_base_currency: true, is_quote_currency: true, minimum_amount: "5" },
            { id: "ftm", code: "ftm", name: "Fantom", enabled: true, is_base_currency: true, is_quote_currency: true, minimum_amount: "10" },
            { id: "link", code: "link", name: "Chainlink", enabled: true, is_base_currency: true, is_quote_currency: true, minimum_amount: "1" },
            { id: "zec", code: "zec", name: "Zcash", enabled: true, is_base_currency: true, is_quote_currency: true, minimum_amount: "0.05" }
        ];
    }

    /**
     * Gets merchant enabled coins (currencies that are enabled in your NOWPayments account)
     */
    async getMerchantCoins(): Promise<string[]> {
        try {
            console.log('Fetching merchant enabled coins from NOWPayments');
            const response = await this.request<MerchantCoinsResponse>('/v1/merchant/coins');
            
            // Log the raw response for debugging
            console.log('Raw merchant/coins response:', response);

            let currencies: string[] = [];

            if (Array.isArray(response)) {
                // Response is a direct array of currencies
                currencies = response.map(c => typeof c === 'string' ? c.toLowerCase() : '');
                console.log('Processed array response:', currencies);
            } else if (response && typeof response === 'object') {
                // Response is an object with a currencies array
                if ('currencies' in response && Array.isArray(response.currencies)) {
                    currencies = response.currencies
                        .filter(c => c && typeof c === 'string')
                        .map(c => c.toLowerCase());
                    console.log('Processed currencies array from object:', currencies);
                    
                    // Check if we got 'selectedcurrencies' which is not a valid currency code
                    if (currencies.length === 1 && currencies[0] === 'selectedcurrencies') {
                        console.warn("Received 'selectedcurrencies' placeholder instead of actual currency codes");
                        // Use our expanded list of cryptocurrencies instead of just the basic 5
                        currencies = ['btc', 'eth', 'usdt', 'usdc', 'dai', 'sol', 'bnb', 'matic', 'doge', 'ada', 'xrp', 'trx', 'fil', 'ton', 'xtz', 'ftm', 'link', 'zec'];
                        console.log('Using expanded default currencies instead:', currencies);
                    }
                } else if ('currency_list' in response && Array.isArray(response['currency_list'])) {
                    // Some API versions might return currency_list instead
                    currencies = response['currency_list'].map(c => typeof c === 'string' ? c.toLowerCase() : '');
                    console.log('Processed currency_list array:', currencies);
                } else {
                    // Last resort: check if the response itself has string keys that could be currency codes
                    const possibleCurrencies = Object.keys(response)
                        .filter(key => typeof key === 'string' && key.length <= 5);
                    
                    if (possibleCurrencies.length > 0) {
                        currencies = possibleCurrencies.map(c => c.toLowerCase());
                        console.log('Extracted possible currencies from object keys:', currencies);
                    }
                }
            }

            // Filter out any empty strings, duplicate values, and known invalid values
            currencies = [...new Set(currencies.filter(c => {
                return c && typeof c === 'string' && c !== 'selectedcurrencies' && c !== 'currencies';
            }))];
            
            console.log('Merchant enabled coins after filtering:', {
                count: currencies.length,
                coins: currencies
            });

            if (currencies.length === 0) {
                console.warn('No valid enabled coins found in merchant account, using default cryptocurrencies');
                currencies = ['btc', 'eth', 'usdt', 'usdc', 'dai', 'sol', 'bnb', 'matic', 'doge', 'ada', 'xrp', 'trx', 'fil', 'ton', 'xtz', 'ftm', 'link', 'zec'];
                console.log('Using expanded default currencies:', currencies);
            }

            return currencies;
        } catch (error) {
            console.error('Failed to fetch merchant coins:', error);
            return ['btc', 'eth', 'usdt', 'usdc', 'dai', 'sol', 'bnb', 'matic', 'doge', 'ada', 'xrp', 'trx', 'fil', 'ton', 'xtz', 'ftm', 'link', 'zec'];
        }
    }

    /**
     * Gets the available payment currencies (only those enabled in merchant account)
     */
    async getAvailableCurrencies(): Promise<NOWPaymentsCurrency[]> {
        try {
            // Get enabled coins first
            let enabledCoins: string[] = [];
            try {
                enabledCoins = await this.getMerchantCoins();
                console.log('Enabled merchant coins:', enabledCoins);
            } catch (error) {
                console.error('Failed to fetch merchant coins, falling back to hardcoded currencies:', error);
                // Fallback to a list of common cryptocurrencies
                enabledCoins = ['btc', 'eth', 'usdt', 'usdc', 'dai', 'sol', 'bnb', 'matic', 'doge', 'ada', 'xrp', 'trx'];
                console.log('Using fallback currencies:', enabledCoins);
            }

            // If no enabled coins, return common cryptocurrencies as fallback
            if (!enabledCoins.length) {
                console.warn('No enabled coins found in merchant account, using fallback currencies');
                return [
                    { id: "btc", code: "btc", name: "Bitcoin", enabled: true, is_base_currency: true, is_quote_currency: true, minimum_amount: "0.001" },
                    { id: "eth", code: "eth", name: "Ethereum", enabled: true, is_base_currency: true, is_quote_currency: true, minimum_amount: "0.01" },
                    { id: "ltc", code: "ltc", name: "Litecoin", enabled: true, is_base_currency: true, is_quote_currency: true, minimum_amount: "0.1" },
                    { id: "usdt", code: "usdt", name: "Tether USD", enabled: true, is_base_currency: true, is_quote_currency: true, minimum_amount: "10" },
                    { id: "doge", code: "doge", name: "Dogecoin", enabled: true, is_base_currency: true, is_quote_currency: true, minimum_amount: "100" }
                ];
            }

            // Try to get all currencies to get their full details
            let allCurrencies: NOWPaymentsCurrency[] = [];
            try {
                allCurrencies = await this.getAllCurrencies();
                console.log('All available currencies:', {
                    count: allCurrencies.length,
                    currencies: allCurrencies.map(c => c.code)
                });
            } catch (error) {
                console.error('Failed to fetch all currencies, creating objects from coin codes:', error);
                // Create currency objects from the enabled coins
                allCurrencies = enabledCoins.map(code => ({
                    id: code.toLowerCase(),
                    code: code.toLowerCase(),
                    name: this.getCurrencyName(code),
                    enabled: true,
                    is_base_currency: true,
                    is_quote_currency: true,
                    minimum_amount: "0.001"
                }));
            }

            // If allCurrencies doesn't have all the enabled coins (which it should),
            // add the missing ones
            const allCurrencyCodes = allCurrencies.map(c => c.code.toLowerCase());
            const missingCoins = enabledCoins.filter(code => !allCurrencyCodes.includes(code.toLowerCase()));
            
            if (missingCoins.length > 0) {
                console.log('Adding missing currencies to allCurrencies:', missingCoins);
                const missingCurrencies = missingCoins.map(code => ({
                    id: code.toLowerCase(),
                    code: code.toLowerCase(),
                    name: this.getCurrencyName(code),
                    enabled: true,
                    is_base_currency: true,
                    is_quote_currency: true,
                    minimum_amount: "0.001"
                }));
                
                allCurrencies = [...allCurrencies, ...missingCurrencies];
            }

            // Filter by enabled coins
            const filteredCurrencies = allCurrencies.filter(
                currency => enabledCoins.includes(currency.code.toLowerCase())
            );

            console.log('Filtered available currencies:', {
                count: filteredCurrencies.length,
                currencies: filteredCurrencies.map(c => c.code)
            });

            // If we're using default currencies but filtering reduced the count, skip filtering
            const defaultCurrencies = ['btc', 'eth', 'usdt', 'usdc', 'dai', 'sol', 'bnb', 'matic', 'doge', 'ada', 'xrp', 'trx', 'fil', 'ton', 'xtz', 'ftm', 'link', 'zec'];
            
            // Check if we're using our default currencies list, or the old basic list
            const usingOldDefaultCurrencies = JSON.stringify(['btc', 'eth', 'ltc', 'usdt', 'doge'].sort()) === JSON.stringify(enabledCoins.sort());
            const usingExpandedDefaultCurrencies = JSON.stringify(defaultCurrencies.sort()) === JSON.stringify(enabledCoins.sort());
            const usingDefaultCurrencies = usingOldDefaultCurrencies || usingExpandedDefaultCurrencies;
            
            if (usingDefaultCurrencies && filteredCurrencies.length < enabledCoins.length) {
                console.warn('Using default currencies but some were filtered out - returning all defaults');
                return this.getDefaultCurrencies();
            }
            
            // If no matching currencies found at all, return default set
            if (!filteredCurrencies.length) {
                console.warn('No matching currencies found, using default set of cryptocurrencies');
                return this.getDefaultCurrencies();
            }

            return filteredCurrencies;
        } catch (error) {
            console.error('Failed to get available currencies:', error);
            return this.getDefaultCurrencies();
        }
    }

    // Helper method to get currency name from code
    private getCurrencyName(code: string): string {
        const currencyNames: Record<string, string> = {
            'btc': 'Bitcoin',
            'eth': 'Ethereum',
            'usdt': 'Tether USD',
            'usdc': 'USD Coin',
            'dai': 'Dai',
            'sol': 'Solana',
            'bnb': 'Binance Coin',
            'matic': 'Polygon',
            'doge': 'Dogecoin',
            'ada': 'Cardano',
            'xrp': 'Ripple',
            'trx': 'TRON',
            'fil': 'Filecoin',
            'ton': 'Toncoin',
            'xtz': 'Tezos',
            'ftm': 'Fantom',
            'link': 'Chainlink',
            'zec': 'Zcash'
        };

        return currencyNames[code.toLowerCase()] || code.toUpperCase();
    }

    /**
     * Gets an estimate of the crypto amount needed for a price
     */
    async getEstimate(amount: number, from: string, to: string): Promise<NOWPaymentsEstimateResponse> {
        return this.request<NOWPaymentsEstimateResponse>(
            `/v1/estimate?amount=${amount}&currency_from=${from}&currency_to=${to}`
        );
    }

    /**
     * Creates a payment
     */
    async createPayment(params: CreatePaymentRequest): Promise<NOWPaymentsCreatePaymentResponse> {
        try {
            console.log('Creating NOWPayments payment with params:', {
                ...params,
                // Don't log potential sensitive data
                ipn_callback_url: params.ipn_callback_url ? '**present**' : undefined
            });
            
            // Ensure price_currency is always uppercase
            const normalizedParams = {
                ...params,
                price_currency: params.price_currency.toUpperCase(),
                pay_currency: params.pay_currency.toLowerCase()
            };
            
            const response = await this.request<NOWPaymentsCreatePaymentResponse>('/v1/payment', {
                method: 'POST',
                body: JSON.stringify(normalizedParams)
            });
            
            console.log('NOWPayments payment created successfully:', {
                payment_id: response.payment_id,
                pay_address: response.pay_address,
                pay_amount: response.pay_amount,
                pay_currency: response.pay_currency
            });
            
            return response;
        } catch (error) {
            console.error('Failed to create NOWPayments payment:', error);
            
            // Add more context to the error
            if (error instanceof Error) {
                error.message = `NOWPayments payment creation failed: ${error.message}. Params: price_amount=${params.price_amount}, price_currency=${params.price_currency}, pay_currency=${params.pay_currency}`;
            }
            
            throw error;
        }
    }

    /**
     * Gets the status of a payment
     */
    async getPaymentStatus(paymentId: string): Promise<NOWPaymentsPaymentStatusResponse> {
        try {
            console.log(`Requesting NOWPayments payment status for ID: ${paymentId}`);
            
            const result = await this.request<NOWPaymentsPaymentStatusResponse>(`/v1/payment/${paymentId}`);
            
            // If the result doesn't have the expected fields, throw a more informative error
            if (!result || !result.payment_id || !result.pay_address) {
                console.error('Invalid response format from NOWPayments API:', result);
                throw new Error(`Invalid response format from NOWPayments API for payment ID: ${paymentId}`);
            }
            
            return result;
        } catch (error) {
            // Enhance error with payment ID for better context
            if (error instanceof Error) {
                console.error(`Failed to get NOWPayments status for payment ID ${paymentId}:`, error);
                error.message = `NOWPayments API Error (Payment ${paymentId}): ${error.message}`;
            } else {
                console.error(`Unknown error getting payment status for ID ${paymentId}:`, error);
            }
            throw error;
        }
    }

    /**
     * Updates the payment currency for an existing payment
     */
    async updatePaymentCurrency(
        transactionId: string,
        providerCheckoutId: string,
        payCurrency: string,
        payAmount: number,
        payAddress: string
    ): Promise<boolean> {
        try {
            console.log('Updating payment currency in database:', {
                transactionId,
                providerCheckoutId,
                payCurrency,
                payAmount,
                payAddress
            });

            // Instead of using RPC function, do direct updates to the tables
            // First update the providers_transactions table
            const { error: providerError } = await supabase
                .from('providers_transactions')
                .update({
                    provider_checkout_id: providerCheckoutId,
                    pay_currency: payCurrency,
                    pay_amount: payAmount,
                    pay_address: payAddress,
                    updated_at: new Date().toISOString()
                })
                .eq('transaction_id', transactionId)
                .eq('provider_code', 'NOWPAYMENTS');

            if (providerError) {
                console.error('Error updating providers_transactions:', providerError);
                throw providerError;
            }

            // Then update the transactions metadata
            // First get current metadata
            const { data: currentData, error: fetchError } = await supabase
                .from('transactions')
                .select('metadata')
                .eq('transaction_id', transactionId)
                .single();
                
            if (fetchError) {
                console.error('Error fetching current metadata:', fetchError);
                throw fetchError;
            }
            
            // Create updated metadata
            const currentMetadata = currentData?.metadata || {};
            const updatedMetadata = {
                ...currentMetadata,
                nowpayments_session: {
                    ...(currentMetadata.nowpayments_session || {}),
                    payment_id: providerCheckoutId,
                    pay_address: payAddress,
                    pay_amount: payAmount,
                    pay_currency: payCurrency,
                    updated_at: new Date().toISOString()
                }
            };
            
            // Update the transaction
            const { error: transactionError } = await supabase
                .from('transactions')
                .update({
                    metadata: updatedMetadata,
                    updated_at: new Date().toISOString()
                })
                .eq('transaction_id', transactionId);

            if (transactionError) {
                console.error('Error updating transactions metadata:', transactionError);
                throw transactionError;
            }

            return true;
        } catch (error) {
            console.error('Error updating payment currency:', error);
            throw error;
        }
    }
}

const nowPaymentsClient = new NOWPaymentsClient();
export default nowPaymentsClient;