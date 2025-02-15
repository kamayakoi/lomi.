import { supabase } from '@/utils/supabase/client';
import { CheckoutData, CustomerDetails } from './types';

export async function fetchDataForCheckout(linkId: string): Promise<CheckoutData | null> {
    try {
        // Fetch checkout data using RPC
        const { data: checkoutData, error: checkoutError } = await supabase
            .rpc('fetch_data_for_checkout', { p_link_id: linkId });

        if (checkoutError) throw checkoutError;
        if (!checkoutData || checkoutData.length === 0) return null;

        const paymentLink = checkoutData[0];

        // Download product image if exists
        let productImageUrl = null;
        if (paymentLink?.product_image_url) {
            const { data: imageData, error: imageError } = await supabase
                .storage
                .from('product_images')
                .download(paymentLink.product_image_url.replace(/^.*\/product_images\//, ''))

            if (!imageError && imageData) {
                productImageUrl = URL.createObjectURL(imageData)
            }
        }

        // Download plan image if exists
        let planImageUrl = null;
        if (paymentLink?.plan_image_url) {
            const { data: imageData, error: imageError } = await supabase
                .storage
                .from('plan_images')
                .download(paymentLink.plan_image_url.replace(/^.*\/plan_images\//, ''))

            if (!imageError && imageData) {
                planImageUrl = URL.createObjectURL(imageData)
            }
        }

        // If there's a product, fetch its fees
        let productFees = [];
        if (paymentLink?.product_id) {
            const { data: fees, error: feesError } = await supabase
                .rpc('fetch_product_fees', {
                    p_product_id: paymentLink.product_id
                });

            if (!feesError) {
                productFees = fees || [];
            }
        }

        const merchantProduct = paymentLink?.product_id ? {
            product_id: paymentLink.product_id,
            name: paymentLink.product_name,
            description: paymentLink.product_description,
            price: paymentLink.product_price,
            currency_code: paymentLink.currency_code,
            image_url: productImageUrl || paymentLink.product_image_url,
            fees: productFees
        } : null;

        const subscriptionPlan = paymentLink?.plan_id ? {
            planId: paymentLink.plan_id,
            merchantId: paymentLink.merchant_id,
            organizationId: paymentLink.organization_id,
            name: paymentLink.plan_name,
            description: paymentLink.plan_description,
            billingFrequency: paymentLink.plan_billing_frequency,
            amount: paymentLink.plan_amount,
            currency_code: paymentLink.currency_code,
            image_url: planImageUrl || paymentLink.plan_image_url,
            failedPaymentAction: '',
            chargeDay: null,
            metadata: {},
            createdAt: '',
            updatedAt: '',
            firstPaymentType: '',
        } : null;

        return {
            paymentLink: {
                ...paymentLink,
                organizationLogoUrl: paymentLink.organization_logo_url,
                organizationName: paymentLink.organization_name
            },
            merchantProduct,
            subscriptionPlan
        };
    } catch (error) {
        console.error('Error fetching checkout data:', error);
        return null;
    }
}

export const fetchOrganizationDetails = async (organizationId: string) => {
    const { data, error } = await supabase
        .from('organizations')
        .select('id, logo_url')
        .eq('id', organizationId)
        .single();

    if (error) {
        console.error('Error fetching organization details:', error);
        return { organizationId: null, logoUrl: null };
    }

    return {
        organizationId: data.id,
        logoUrl: data.logo_url,
    };
};

export const createOrUpdateCustomer = async (
    merchantId: string,
    organizationId: string,
    customerDetails: CustomerDetails
): Promise<string | null> => {
    const { data, error } = await supabase.rpc('create_or_update_customer', {
        p_merchant_id: merchantId,
        p_organization_id: organizationId,
        p_name: customerDetails.name,
        p_email: customerDetails.email,
        p_phone_number: customerDetails.countryCode + customerDetails.phoneNumber,
        p_whatsapp_number: customerDetails.whatsappNumber,
        p_country: customerDetails.country,
        p_city: customerDetails.city,
        p_address: customerDetails.address,
        p_postal_code: customerDetails.postalCode,
    });

    if (error) {
        console.error('Error creating or updating customer:', error);
        return null;
    }

    return data;
};
