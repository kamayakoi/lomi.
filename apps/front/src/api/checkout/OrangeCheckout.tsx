import { OrangeService } from '../../utils/orange/service';

interface OrangeCheckoutProps {
    merchantId: string;
    organizationId: string;
    customerId: string;
    amount: number;
    currency: string;
    successUrl: string;
    cancelUrl: string;
    notificationUrl: string;
    productId?: string;
    subscriptionId?: string;
    language?: string;
    reference?: string;
    description?: string;
    metadata?: {
        linkId?: string;
        customerEmail?: string;
        customerPhone?: string;
        customerName?: string;
        whatsappNumber?: string;
        planId?: string;
        [key: string]: unknown;
    };
    onError: (error: Error) => void;
    onSuccess: (data: { transactionId: string; checkoutUrl: string; payToken: string }) => void;
}

/**
 * OrangeCheckout Component for handling Orange Money payment processing
 * This component doesn't render anything; it just processes the Orange Money payment
 */
const OrangeCheckout = async ({
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
    language,
    reference,
    description,
    metadata,
    onError,
    onSuccess
}: OrangeCheckoutProps) => {
    try {
        // Add planId to metadata if it's a subscription checkout
        const enhancedMetadata = { ...metadata };

        // For subscription checkouts, ensure planId is in metadata
        if (subscriptionId) {
            console.log('Processing subscription checkout:', {
                subscriptionId,
                planId: metadata?.planId
            });

            // Make sure planId is in metadata, even if it's the same as subscriptionId
            if (!enhancedMetadata.planId && subscriptionId) {
                enhancedMetadata.planId = subscriptionId;
                console.log('Adding planId to metadata for subscription checkout:', subscriptionId);
            }
        }

        // Process the Orange Money checkout
        const result = await OrangeService.createCheckoutSession({
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
            language,
            reference,
            description,
            metadata: enhancedMetadata
        });

        onSuccess(result);
        return null;
    } catch (error) {
        console.error('Orange Money checkout error:', error);
        onError(error instanceof Error ? error : new Error('Failed to process Orange Money payment'));
        return null;
    }
};

export default OrangeCheckout; 