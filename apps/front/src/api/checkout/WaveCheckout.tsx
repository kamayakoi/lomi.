import { WaveService } from '../../utils/wave/service';

interface WaveCheckoutProps {
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
    metadata?: {
        linkId?: string;
        customerEmail?: string;
        customerPhone?: string;
        customerName?: string;
        whatsappNumber?: string;
        [key: string]: unknown;
    };
    onError: (error: Error) => void;
    onSuccess: (data: { transactionId: string; checkoutUrl: string }) => void;
}

/**
 * WaveCheckout Component for handling Wave payment processing
 * This component doesn't render anything; it just processes the Wave payment
 */
export const WaveCheckout = async ({
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
    metadata,
    onError,
    onSuccess
}: WaveCheckoutProps) => {
    try {
        // Process the Wave checkout
        const result = await WaveService.createCheckoutSession({
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
        });

        onSuccess(result);
        return null;
    } catch (error) {
        console.error('Wave checkout error:', error);
        onError(error instanceof Error ? error : new Error('Failed to process Wave payment'));
        return null;
    }
};

/**
 * Helper function to initiate a Wave checkout
 */
export const initiateWaveCheckout = async (props: WaveCheckoutProps): Promise<{ transactionId: string; checkoutUrl: string }> => {
    return new Promise((resolve, reject) => {
        WaveCheckout({
            ...props,
            onSuccess: (result) => resolve(result),
            onError: (error) => reject(error)
        });
    });
};

export default WaveCheckout; 