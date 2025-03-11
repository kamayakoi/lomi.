import { supabase } from '@/utils/supabase/client';
import waveClient from './client';
import type { 
    CreateWaveCheckoutSessionParams,
    WaveAggregatedMerchant,
    WaveBusinessType,
    WavePaymentStatus,
    WavePaymentError,
    CreateWaveAggregatedMerchantParams,
    WavePayoutStatus
} from './types';

interface TransactionMetadata {
    wave_session?: {
        id: string;
        checkout_status: string;
        payment_status: string;
        last_payment_error?: WavePaymentError;
        when_created: string;
        when_expires: string;
    };
    linkId?: string;
    customerEmail?: string;
    customerPhone?: string;
    customerName?: string;
    whatsappNumber?: string;
    [key: string]: unknown;
}

// Define an interface for Wave provider settings
interface WaveProviderSettings {
    organization_id: string;
    provider_code: string;
    provider_merchant_id: string;
    is_connected: boolean;
    metadata: Record<string, unknown>;
}

// Define an interface for full provider settings
interface ProviderSettings {
    organization_id: string;
    provider_code: string;
    provider_merchant_id: string;
    is_connected: boolean;
    phone_number: string;
    is_phone_verified: boolean;
    metadata: Record<string, unknown>;
}


export class WaveService {
    /**
     * Creates or retrieves a Wave aggregated merchant for a lomi. merchant
     */
    static async ensureWaveAggregatedMerchant(merchantId: string): Promise<string> {
        try {
            // 1. Check if merchant already has Wave merchant ID
            const { data: merchant } = await supabase
                .rpc('fetch_wave_provider_settings', {
                    p_organization_id: merchantId
                })
                .single();

            const waveSettings = merchant as WaveProviderSettings;
            
            if (waveSettings?.provider_merchant_id) {
                return waveSettings.provider_merchant_id;
            }

            // 2. Get merchant details
            const { data: merchantDetails, error: detailsError } = await supabase
                .from('merchants')
                .select(`
                    name,
                    business_type,
                    description,
                    website_url,
                    registration_number,
                    organizations!inner (
                        name,
                        description
                    )
                `)
                .eq('merchant_id', merchantId)
                .single();

            if (detailsError || !merchantDetails) {
                throw new Error('Failed to get merchant details');
            }

            // 3. Create Wave aggregated merchant
            const waveAggregatedMerchant = await waveClient.createAggregatedMerchant({
                name: merchantDetails.name,
                business_type: 'other', // Most merchants aren't fintech
                business_description: merchantDetails.description || (merchantDetails.organizations?.[0]?.description ?? ''),
                business_sector: merchantDetails.business_type,
                website_url: merchantDetails.website_url,
                business_registration_identifier: merchantDetails.registration_number
            });

            // 4. Save Wave merchant ID
            await supabase
                .from('organization_providers_settings')
                .upsert({
                    merchant_id: merchantId,
                    organization_id: waveSettings?.organization_id,
                    provider_code: 'WAVE',
                    provider_merchant_id: waveAggregatedMerchant.id,
                    is_active: true,
                    metadata: {
                        wave_merchant: waveAggregatedMerchant
                    }
                });

            return waveAggregatedMerchant.id;
        } catch (error) {
            console.error('Error ensuring Wave aggregated merchant:', error);
            throw error;
        }
    }

    /**
     * Creates a Wave checkout session and records it in the database
     */
    static async createCheckoutSession({
        merchantId,
        organizationId,
        customerId,
        amount,
        currency,
        successUrl,
        errorUrl,
        productId,
        subscriptionId,
        description,
        metadata
    }: {
        merchantId: string;
        organizationId: string;
        customerId: string;
        amount: number;
        currency: string;
        successUrl: string;
        errorUrl: string;
        productId?: string;
        subscriptionId?: string;
        description?: string;
        metadata?: TransactionMetadata;
    }): Promise<{
        transactionId: string;
        checkoutUrl: string;
    }> {
        try {
            // 1. Get Wave merchant ID from settings - use organizationId for the lookup
            const { data: settings, error: settingsError } = await supabase
                .rpc('fetch_wave_provider_settings', {
                    p_organization_id: organizationId
                })
                .single();

            if (settingsError) {
                console.error('Error fetching Wave provider settings:', settingsError);
                throw new Error('Failed to retrieve Wave merchant settings');
            }

            const waveSettings = settings as WaveProviderSettings;

            if (!waveSettings?.provider_merchant_id) {
                throw new Error('Merchant not registered with Wave or missing provider_merchant_id');
            }

            console.log('Found Wave aggregated merchant ID:', waveSettings.provider_merchant_id);

            // 2. Create Wave checkout session
            const checkoutParams: CreateWaveCheckoutSessionParams = {
                amount,
                currency,
                success_url: successUrl,
                error_url: errorUrl,
                aggregated_merchant_id: waveSettings.provider_merchant_id,
                client_reference: metadata?.linkId
            };

            console.log('Creating Wave checkout session with params:', checkoutParams);
            const waveSession = await waveClient.createCheckoutSession(checkoutParams);
            console.log('Wave checkout session created successfully:', waveSession.id);

            // 3. Create transaction record using RPC function
            const { data: transactionId, error: transactionError } = await supabase.rpc(
                'create_wave_checkout_transaction',
                {
                    p_merchant_id: merchantId,
                    p_organization_id: organizationId,
                    p_customer_id: customerId,
                    p_amount: amount,
                    p_currency_code: currency,
                    p_provider_checkout_id: waveSession.id,
                    p_checkout_url: waveSession.wave_launch_url,
                    p_error_url: waveClient.ensureHttpsUrl(errorUrl),
                    p_success_url: waveClient.ensureHttpsUrl(successUrl),
                    p_product_id: productId,
                    p_subscription_id: subscriptionId,
                    p_description: description,
                    p_metadata: {
                        wave_session: {
                            id: waveSession.id,
                            checkout_status: waveSession.checkout_status,
                            payment_status: waveSession.payment_status,
                            last_payment_error: waveSession.last_payment_error,
                            when_created: waveSession.when_created,
                            when_expires: waveSession.when_expires
                        },
                        ...metadata
                    }
                }
            );

            if (transactionError) {
                console.error('Error creating Wave transaction record:', transactionError);
                throw new Error(`Failed to create transaction: ${transactionError.message}`);
            }

            return {
                transactionId,
                checkoutUrl: waveSession.wave_launch_url
            };
        } catch (error) {
            console.error('Error creating Wave checkout:', error);
            throw error;
        }
    }

    /**
     * Updates the status of a Wave checkout session
     */
    static async updateCheckoutStatus(
        checkoutId: string,
        status: WavePaymentStatus,
        transactionId?: string,
        errorCode?: string,
        errorMessage?: string,
        metadata?: TransactionMetadata
    ): Promise<void> {
        try {
            // Get latest session data from Wave
            const waveSession = await waveClient.getCheckoutSession(checkoutId);

            const { error } = await supabase.rpc('update_wave_checkout_status', {
                p_provider_checkout_id: checkoutId,
                p_provider_transaction_id: transactionId || waveSession.transaction_id,
                p_payment_status: status,
                p_error_code: errorCode,
                p_error_message: errorMessage,
                p_metadata: {
                    wave_session: {
                        id: waveSession.id,
                        checkout_status: waveSession.checkout_status,
                        payment_status: waveSession.payment_status,
                        last_payment_error: waveSession.last_payment_error,
                        when_created: waveSession.when_created,
                        when_expires: waveSession.when_expires
                    },
                    ...metadata
                }
            });

            if (error) {
                throw new Error(`Failed to update checkout status: ${error.message}`);
            }
        } catch (error) {
            console.error('Error updating Wave checkout status:', error);
            throw error;
        }
    }

    /**
     * Gets the current status of a Wave checkout session
     */
    static async getCheckoutStatus(checkoutId: string) {
        try {
            // 1. Get status from Wave API
            const waveSession = await waveClient.getCheckoutSession(checkoutId);
            
            // 2. Get status from our database
            const { data: dbStatus, error } = await supabase.rpc(
                'get_wave_payment_status',
                { p_provider_checkout_id: checkoutId }
            );

            if (error) {
                throw new Error(`Failed to get checkout status: ${error.message}`);
            }

            return {
                waveStatus: waveSession,
                dbStatus
            };
        } catch (error) {
            console.error('Error getting Wave checkout status:', error);
            throw error;
        }
    }

    /**
     * Creates a new aggregated merchant
     */
    static async createAggregatedMerchant(params: {
        name: string;
        businessType: WaveBusinessType;
        businessDescription: string;
        businessSector?: 'retail' | 'services' | 'manufacturing' | 'other';
        websiteUrl?: string;
        managerName?: string;
        businessRegistrationId?: string;
    }): Promise<WaveAggregatedMerchant> {
        // Transform the params to match Wave's API format
        const waveParams: CreateWaveAggregatedMerchantParams = {
            name: params.name,
            business_type: params.businessType,
            business_description: params.businessDescription,
            business_sector: params.businessSector || 'other',
            website_url: params.websiteUrl,
            manager_name: params.managerName,
            business_registration_identifier: params.businessRegistrationId
        };

        return waveClient.createAggregatedMerchant(waveParams);
    }

    /**
     * Gets an aggregated merchant by ID
     */
    static async getAggregatedMerchant(id: string): Promise<WaveAggregatedMerchant> {
        return waveClient.getAggregatedMerchant(id);
    }

    /**
     * Lists all aggregated merchants
     */
    static async listAggregatedMerchants() {
        return waveClient.listAggregatedMerchants();
    }

    /**
     * Initiates a payout to a Wave mobile money user
     */
    static async createPayout({
        merchantId,
        organizationId,
        amount,
        currency,
        reason,
        metadata
    }: {
        merchantId: string;
        organizationId: string;
        amount: number;
        currency: string;
        reason?: string;
        metadata?: Record<string, unknown>;
    }): Promise<{
        payoutId: string;
        status: WavePayoutStatus;
    }> {
        try {
            // 1. Get provider settings to retrieve the Wave merchant ID and registered phone number
            const { data: providerSettings, error: providerError } = await supabase
                .rpc('fetch_organization_provider_settings', {
                    p_organization_id: organizationId,
                    p_provider_code: 'WAVE'
                });
                
            if (providerError || !providerSettings || providerSettings.length === 0) {
                throw new Error('Error fetching payment providers configuration');
            }
            
            // Get the Wave provider settings
            const waveProvider = providerSettings[0] as ProviderSettings;
            
            if (!waveProvider || !waveProvider.is_connected || !waveProvider.phone_number) {
                throw new Error('Wave provider not configured or not connected');
            }

            // 2. Check available balance for the merchant
            const { data: availableBalance, error: balanceError } = await supabase
                .rpc('check_merchant_available_balance', {
                    p_merchant_id: merchantId,
                    p_currency_code: currency
                });

            if (balanceError) {
                throw new Error(`Error checking balance: ${balanceError.message}`);
            }

            if ((availableBalance || 0) < amount) {
                throw new Error(`Insufficient balance for withdrawal. Available: ${availableBalance || 0} ${currency}`);
            }

            // 3. Get merchant account ID for the currency
            const { data: accountData, error: accountError } = await supabase
                .from('merchant_accounts')
                .select('account_id')
                .eq('merchant_id', merchantId)
                .eq('currency_code', currency)
                .single();

            if (accountError || !accountData) {
                throw new Error(`No merchant account found for currency: ${currency}`);
            }

            // 4. Get the Wave payout fee
            const { data: fee, error: feeError } = await supabase
                .from('fees')
                .select('*')
                .eq('provider_code', 'WAVE')
                .eq('fee_type', 'payout')
                .eq('currency_code', currency)
                .single();

            if (feeError) {
                console.warn('Wave payout fee not found, using default 1%', feeError);
            }

            // Standard Wave fee is 1%
            const feePercentage = fee?.percentage || 1.0;
            const feeAmount = amount * (feePercentage / 100);

            // 5. Create a client reference ID
            const clientReference = `payout_${merchantId}_${Date.now()}`;

            // 6. Get provider merchant ID using RPC to get full provider settings
            const { data: fullProviderSettings, error: fullProviderError } = await supabase
                .rpc('fetch_organization_provider_settings', {
                    p_organization_id: organizationId,
                    p_provider_code: 'WAVE'
                });
                
            if (fullProviderError || !fullProviderSettings || fullProviderSettings.length === 0) {
                throw new Error('Wave merchant ID not found');
            }
            
            const waveProviderSettings = fullProviderSettings[0] as ProviderSettings;
            
            if (!waveProviderSettings.provider_merchant_id) {
                throw new Error('Wave merchant ID not found');
            }

            // 7. Create a Wave payout via the Edge Function
            const wavePayout = await waveClient.createPayout({
                recipient_mobile: waveProvider.phone_number,
                amount: amount.toString(),
                currency,
                client_reference: clientReference,
                aggregated_merchant_id: waveProviderSettings.provider_merchant_id,
                reason: reason || 'Merchant withdrawal'
            });

            // 8. Record the payout in the database
            const { data: recordedPayout, error: recordError } = await supabase
                .from('payouts')
                .insert({
                    merchant_id: merchantId,
                    organization_id: organizationId,
                    account_id: accountData.account_id,
                    status: 'processing',
                    amount,
                    currency_code: currency,
                    metadata: {
                        wave_payout: {
                            id: wavePayout.id,
                            status: wavePayout.payment_status,
                            recipient_mobile: waveProvider.phone_number,
                            client_reference: clientReference,
                            transaction_id: wavePayout.transaction_id,
                            when_created: wavePayout.when_created,
                            aggregated_merchant_id: waveProviderSettings.provider_merchant_id,
                            ...metadata
                        },
                        fees: {
                            percentage: feePercentage,
                            amount: feeAmount
                        }
                    }
                })
                .select('payout_id')
                .single();

            if (recordError) {
                console.error('Error recording Wave payout:', recordError);
                throw recordError;
            }

            // 9. Update the merchant account balance
            await supabase.rpc('update_merchant_account_balance', {
                p_merchant_id: merchantId,
                p_amount: -amount,
                p_currency_code: currency
            });

            return {
                payoutId: recordedPayout.payout_id,
                status: wavePayout.payment_status as WavePayoutStatus
            };
        } catch (error) {
            console.error('Error creating Wave payout:', error);
            throw error;
        }
    }

    /**
     * Updates the status of a payout in the database
     */
    static async updatePayoutStatus(
        payoutId: string,
        wavePayoutId: string
    ): Promise<void> {
        try {
            // 1. Get the current status from Wave
            const wavePayout = await waveClient.getPayout(wavePayoutId);
            
            // 2. Map Wave status to our status
            let payoutStatus: 'pending' | 'processing' | 'completed' | 'failed';
            
            switch (wavePayout.payment_status) {
                case 'pending':
                case 'processing':
                    payoutStatus = 'processing';
                    break;
                case 'completed':
                    payoutStatus = 'completed';
                    break;
                case 'failed':
                    payoutStatus = 'failed';
                    break;
                default:
                    payoutStatus = 'processing';
            }
            
            // 3. Update the payout in the database
            await supabase
                .from('payouts')
                .update({
                    status: payoutStatus,
                    metadata: {
                        wave_payout: {
                            ...wavePayout
                        }
                    },
                    updated_at: new Date().toISOString()
                })
                .eq('payout_id', payoutId);
        } catch (error) {
            console.error('Error updating payout status:', error);
            throw error;
        }
    }
}

export default WaveService; 