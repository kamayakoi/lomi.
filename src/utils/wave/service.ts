import { supabase } from '@/utils/supabase/client';
import waveClient from './client';
import type { 
    CreateWaveCheckoutSessionParams,
    WaveAggregatedMerchant,
    WaveBusinessType,
    WavePaymentStatus,
    WavePaymentError,
    CreateWaveAggregatedMerchantParams
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

export class WaveService {
    /**
     * Creates or retrieves a Wave aggregated merchant for a Lomi merchant
     */
    static async ensureWaveAggregatedMerchant(merchantId: string): Promise<string> {
        try {
            // 1. Check if merchant already has Wave merchant ID
            const { data: merchant } = await supabase
                .from('organization_providers_settings')
                .select('provider_merchant_id, organization_id')
                .eq('provider_code', 'WAVE')
                .eq('merchant_id', merchantId)
                .single();

            if (merchant?.provider_merchant_id) {
                return merchant.provider_merchant_id;
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
                    organization_id: merchant?.organization_id,
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
            // 1. Get Wave merchant ID from settings
            const { data: settings, error: settingsError } = await supabase
                .from('organization_providers_settings')
                .select('provider_merchant_id')
                .eq('provider_code', 'WAVE')
                .eq('merchant_id', merchantId)
                .single();

            if (settingsError || !settings?.provider_merchant_id) {
                throw new Error('Merchant not registered with Wave');
            }

            // 2. Create Wave checkout session
            const checkoutParams: CreateWaveCheckoutSessionParams = {
                amount,
                currency,
                success_url: successUrl,
                error_url: errorUrl,
                merchant_reference_id: merchantId,
                merchant_id: settings.provider_merchant_id,
                cancel_url: errorUrl,
                aggregated_merchant_id: settings.provider_merchant_id,
                client_reference: metadata?.linkId
            };

            const waveSession = await waveClient.createCheckoutSession(checkoutParams);

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
                    p_error_url: errorUrl,
                    p_success_url: successUrl,
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
}

export default WaveService; 