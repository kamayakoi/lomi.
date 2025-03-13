import OrangeCheckout from './OrangeCheckout';

// Interfaces shared with OrangeCheckout component
interface OrangeCheckoutParams {
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
}

/**
 * Helper function to initiate an Orange Money checkout
 */
export const initiateOrangeCheckout = async (
    params: OrangeCheckoutParams
): Promise<{ transactionId: string; checkoutUrl: string; payToken: string }> => {
    return new Promise((resolve, reject) => {
        OrangeCheckout({
            ...params,
            onSuccess: (result) => resolve(result),
            onError: (error) => reject(error)
        });
    });
}; 