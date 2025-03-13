import { supabase } from '@/utils/supabase/client';
import orangeClient from './client';
import type {
    // OrangeWebPaymentResponse,
    OrangePaymentStatus,
    CreateOrangeCheckoutSessionParams
} from './types';

// Define an interface for Orange provider settings
interface OrangeProviderSettings {
    organization_id: string;
    provider_code: string;
    provider_merchant_id: string;
    is_connected: boolean;
    phone_number: string;
    is_phone_verified: boolean;
    metadata: {
        merchant_key: string;
        merchant_code: string;
        [key: string]: unknown;
    };
}

interface TransactionMetadata {
    orange_session?: {
        pay_token: string;
        notif_token: string;
        payment_url: string;
        status: OrangePaymentStatus;
        order_id: string;
        txnid?: string;
    };
    linkId?: string;
    customerEmail?: string;
    customerPhone?: string;
    customerName?: string;
    whatsappNumber?: string;
    [key: string]: unknown;
}

export class OrangeService {
    /**
     * Fetches Orange provider settings for an organization
     */
    static async getOrangeProviderSettings(organizationId: string): Promise<OrangeProviderSettings | null> {
        try {
            const { data, error } = await supabase.rpc(
                'fetch_orange_provider_settings',
                { p_organization_id: organizationId }
            ).single();

            if (error) {
                console.error('Error fetching Orange provider settings:', error);
                return null;
            }

            return data as OrangeProviderSettings;
        } catch (error) {
            console.error('Error in getOrangeProviderSettings:', error);
            return null;
        }
    }

    /**
     * Creates an Orange checkout session and records it in the database
     */
    static async createCheckoutSession({
        merchantId,
        organizationId,
        customerId,
        amount,
        currency,
        successUrl,
        cancelUrl,
        notificationUrl,
        productId,
        subscriptionId,
        language = 'fr',
        reference,
        description,
        metadata
    }: CreateOrangeCheckoutSessionParams): Promise<{
        transactionId: string;
        checkoutUrl: string;
        payToken: string;
    }> {
        try {
            // 1. Get Orange merchant settings
            const settings = await this.getOrangeProviderSettings(organizationId);
            
            if (!settings || !settings.metadata?.merchant_key) {
                throw new Error('Orange Money is not properly configured for this organization');
            }

            // 2. Generate a unique order ID
            const orderId = orangeClient.generateOrderId('LOMI');

            // 3. Create Orange checkout session
            const webPaymentResponse = await orangeClient.createWebPayment({
                merchant_key: settings.metadata.merchant_key,
                currency: currency === 'XOF' ? 'XOF' : 'OUV', // Use 'OUV' for dev environment if not XOF
                order_id: orderId,
                amount,
                return_url: successUrl,
                cancel_url: cancelUrl,
                notif_url: notificationUrl,
                lang: language,
                reference: reference || `${merchantId}_${Date.now()}`
            });

            // 4. Create transaction record
            const { data: transactionId, error: transactionError } = await supabase.rpc(
                'create_orange_checkout_transaction',
                {
                    p_merchant_id: merchantId,
                    p_organization_id: organizationId,
                    p_customer_id: customerId,
                    p_amount: amount,
                    p_currency_code: currency,
                    p_provider_checkout_id: webPaymentResponse.pay_token,
                    p_checkout_url: webPaymentResponse.payment_url,
                    p_error_url: cancelUrl,
                    p_success_url: successUrl,
                    p_product_id: productId,
                    p_subscription_id: subscriptionId,
                    p_description: description,
                    p_metadata: {
                        orange_session: {
                            pay_token: webPaymentResponse.pay_token,
                            notif_token: webPaymentResponse.notif_token,
                            payment_url: webPaymentResponse.payment_url,
                            status: 'INITIATED',
                            order_id: orderId
                        },
                        ...metadata
                    }
                }
            );

            if (transactionError) {
                console.error('Error creating Orange transaction record:', transactionError);
                throw new Error(`Failed to create transaction: ${transactionError.message}`);
            }

            return {
                transactionId,
                checkoutUrl: webPaymentResponse.payment_url,
                payToken: webPaymentResponse.pay_token
            };
        } catch (error) {
            console.error('Error creating Orange checkout:', error);
            throw error;
        }
    }

    /**
     * Updates the status of an Orange payment transaction
     */
    static async updateTransactionStatus(
        payToken: string,
        status: OrangePaymentStatus,
        txnid?: string,
        errorCode?: string,
        errorMessage?: string,
        metadata?: TransactionMetadata
    ): Promise<void> {
        try {
            const { error } = await supabase.rpc('update_orange_payment_status', {
                p_provider_checkout_id: payToken,
                p_provider_transaction_id: txnid,
                p_payment_status: status,
                p_error_code: errorCode,
                p_error_message: errorMessage,
                p_metadata: metadata
            });

            if (error) {
                throw new Error(`Failed to update payment status: ${error.message}`);
            }
        } catch (error) {
            console.error('Error updating Orange payment status:', error);
            throw error;
        }
    }

    /**
     * Verifies a notification from Orange Money
     */
    static async verifyNotification(
        notifToken: string,
        status: OrangePaymentStatus,
        txnid: string
    ): Promise<boolean> {
        try {
            const { data, error } = await supabase.rpc('verify_orange_notification', {
                p_notif_token: notifToken,
                p_status: status,
                p_txnid: txnid
            });

            if (error) {
                console.error('Error verifying Orange notification:', error);
                return false;
            }

            return data as boolean;
        } catch (error) {
            console.error('Error verifying Orange notification:', error);
            return false;
        }
    }

    /**
     * Checks the status of a transaction using the Orange API
     */
    static async checkTransactionStatus(
        payToken: string,
        orderId: string,
        amount: number
    ): Promise<OrangePaymentStatus> {
        try {
            const response = await orangeClient.getTransactionStatus({
                pay_token: payToken,
                order_id: orderId,
                amount
            });

            // Update the transaction status in our database
            await this.updateTransactionStatus(
                payToken,
                response.status,
                response.txnid
            );

            return response.status;
        } catch (error) {
            console.error('Error checking Orange transaction status:', error);
            throw error;
        }
    }
}

export default OrangeService; 