import { supabase } from '@/utils/supabase/client';
import waveClient from './client';
import type { 
    WaveAggregatedMerchant,
    WaveBusinessType,
    CreateWaveAggregatedMerchantParams
} from './types';

export class WaveAggregator {
    /**
     * Creates a new Wave aggregated merchant
     */
    static async createAggregatedMerchant(params: CreateWaveAggregatedMerchantParams): Promise<WaveAggregatedMerchant> {
        try {
            return await waveClient.request<WaveAggregatedMerchant>('/v1/aggregated_merchants', {
                method: 'POST',
                body: JSON.stringify(params)
            });
        } catch (error) {
            console.error('Error creating Wave aggregated merchant:', error);
            throw error;
        }
    }

    /**
     * Gets an aggregated merchant by ID
     */
    static async getAggregatedMerchant(id: string): Promise<WaveAggregatedMerchant> {
        try {
            return await waveClient.request<WaveAggregatedMerchant>(`/v1/aggregated_merchants/${id}`);
        } catch (error) {
            console.error('Error getting Wave aggregated merchant:', error);
            throw error;
        }
    }

    /**
     * Lists all aggregated merchants
     */
    static async listAggregatedMerchants(first?: number, after?: string) {
        try {
            const params = new URLSearchParams();
            if (first) params.append('first', first.toString());
            if (after) params.append('after', after);

            return await waveClient.request(
                `/v1/aggregated_merchants${params.toString() ? `?${params.toString()}` : ''}`
            );
        } catch (error) {
            console.error('Error listing Wave aggregated merchants:', error);
            throw error;
        }
    }

    /**
     * Updates an aggregated merchant
     */
    static async updateAggregatedMerchant(
        id: string,
        params: Partial<CreateWaveAggregatedMerchantParams>
    ): Promise<WaveAggregatedMerchant> {
        try {
            return await waveClient.request<WaveAggregatedMerchant>(`/v1/aggregated_merchants/${id}`, {
                method: 'PUT',
                body: JSON.stringify(params)
            });
        } catch (error) {
            console.error('Error updating Wave aggregated merchant:', error);
            throw error;
        }
    }

    /**
     * Deletes an aggregated merchant
     */
    static async deleteAggregatedMerchant(id: string): Promise<void> {
        try {
            await waveClient.request(`/v1/aggregated_merchants/${id}`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error('Error deleting Wave aggregated merchant:', error);
            throw error;
        }
    }

    /**
     * Registers a merchant with Wave as an aggregated merchant
     */
    static async registerMerchant(
        merchantId: string,
        organizationId: string
    ): Promise<WaveAggregatedMerchant> {
        try {
            // 1. Get merchant details using RPC
            const { data: merchantDetails, error: detailsError } = await supabase
                .rpc('get_merchant_details_for_wave', {
                    p_merchant_id: merchantId,
                    p_organization_id: organizationId
                });

            if (detailsError || !merchantDetails?.[0]) {
                console.error('Error fetching merchant details:', detailsError);
                throw new Error('Failed to get merchant details');
            }

            const details = merchantDetails[0];

            // 2. Create Wave aggregated merchant with required fields
            const waveAggregatedMerchant = await this.createAggregatedMerchant({
                name: details.organization_name || details.merchant_name,
                business_type: 'other', // Wave only accepts 'fintech' or 'other'
                business_description: details.business_description || `${details.merchant_name} - A merchant on lomi.`,
                business_sector: details.industry?.toLowerCase() || 'retail',
                website_url: details.website_url,
                manager_name: details.merchant_name,
                business_registration_identifier: details.registration_number
            });

            // 3. Connect provider and save Wave merchant details using RPC
            const { error: connectionError } = await supabase.rpc(
                'update_organization_provider_connection',
                {
                    p_organization_id: organizationId,
                    p_provider_code: 'WAVE',
                    p_is_connected: true,
                    p_provider_merchant_id: waveAggregatedMerchant.id,
                    p_metadata: {
                        // Store Wave-assigned values
                        wave_fees: {
                            checkout: waveAggregatedMerchant.checkout_fee_structure_name,
                            payout: waveAggregatedMerchant.payout_fee_structure_name
                        },
                        wave_status: {
                            business_type: waveAggregatedMerchant.business_type,
                            is_locked: waveAggregatedMerchant.is_locked, 
                            created_at: waveAggregatedMerchant.when_created
                        }
                    }
                }
            );

            if (connectionError) {
                console.error('Error saving Wave connection:', connectionError);
                throw new Error('Failed to connect Wave provider');
            }

            return waveAggregatedMerchant;
        } catch (error) {
            console.error('Error registering Wave merchant:', error);
            throw error;
        }
    }

    /**
     * Gets a merchant's Wave registration details
     */
    static async getMerchantRegistration(merchantId: string): Promise<{
        isRegistered: boolean;
        merchantId?: string;
        details?: WaveAggregatedMerchant;
    }> {
        try {
            const { data: verificationData, error: verificationError } = await supabase.rpc(
                'verify_wave_merchant_registration',
                { p_organization_id: merchantId }
            );

            if (verificationError) {
                throw new Error('Failed to verify Wave merchant registration');
            }

            if (!verificationData?.[0]?.provider_merchant_id) {
                return { isRegistered: false };
            }

            return {
                isRegistered: true,
                merchantId: verificationData[0].provider_merchant_id,
                details: verificationData[0].registration_details
            };
        } catch (error) {
            console.error('Error getting Wave merchant registration:', error);
            throw error;
        }
    }

    /**
     * Updates a merchant's Wave registration details
     */
    static async updateMerchantRegistration(
        merchantId: string,
        params: {
            name?: string;
            businessType?: WaveBusinessType;
            businessDescription?: string;
            businessSector?: string;
            websiteUrl?: string;
            managerName?: string;
            businessRegistrationId?: string;
        }
    ): Promise<WaveAggregatedMerchant> {
        try {
            // 1. Get current Wave merchant ID
            const { data: verificationData, error: verificationError } = await supabase.rpc(
                'verify_wave_merchant_registration',
                { p_organization_id: merchantId }
            );

            if (verificationError || !verificationData?.[0]?.provider_merchant_id) {
                throw new Error('Merchant not registered with Wave');
            }

            // 2. Update Wave merchant
            const updatedMerchant = await waveClient.request<WaveAggregatedMerchant>(
                `/v1/aggregated_merchants/${verificationData[0].provider_merchant_id}`,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        name: params.name,
                        business_type: params.businessType,
                        business_description: params.businessDescription,
                        business_sector: params.businessSector,
                        website_url: params.websiteUrl,
                        manager_name: params.managerName,
                        business_registration_identifier: params.businessRegistrationId
                    })
                }
            );

            // 3. Update provider settings using RPC
            const { error: updateError } = await supabase.rpc(
                'update_organization_provider_connection',
                {
                    p_organization_id: merchantId,
                    p_provider_code: 'WAVE',
                    p_is_connected: true,
                    p_provider_merchant_id: updatedMerchant.id,
                    p_metadata: {
                        wave_merchant: updatedMerchant
                    }
                }
            );

            if (updateError) {
                throw new Error('Failed to update Wave merchant details');
            }

            return updatedMerchant;
        } catch (error) {
            console.error('Error updating Wave merchant registration:', error);
            throw error;
        }
    }
} 