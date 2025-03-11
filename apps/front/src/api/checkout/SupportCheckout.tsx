import { supabase } from '@/utils/supabase/client';
import { CheckoutData } from './types';

export async function fetchDataForCheckout(linkId: string): Promise<CheckoutData | null> {
    try {
        // Fetch checkout data using RPC
        const { data: checkoutData, error: checkoutError } = await supabase
            .rpc('fetch_data_for_checkout', { p_link_id: linkId });

        if (checkoutError) throw checkoutError;
        if (!checkoutData || checkoutData.length === 0) return null;

        const paymentLink = checkoutData[0];

        console.log('Raw payment link data:', {
            merchantId: paymentLink.merchant_id,
            organizationId: paymentLink.organization_id
        });

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

        // Add debug logging to verify properties
        console.log('Payment link data before return:', {
            merchant_id: paymentLink.merchant_id,
            organization_id: paymentLink.organization_id,
            converted_merchantId: paymentLink.merchant_id,
            converted_organizationId: paymentLink.organization_id
        });

        return {
            paymentLink: {
                ...paymentLink,
                merchantId: paymentLink.merchant_id,
                organizationId: paymentLink.organization_id,
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
    customerDetails: {
        firstName?: string;
        lastName?: string;
        name?: string;
        email?: string;
        phoneNumber?: string;
        countryCode?: string;
        whatsappNumber?: string;
        country?: string;
        city?: string;
        address?: string;
        postalCode?: string;
    }
): Promise<string | null> => {
    try {
        // Check for required parameters
        if (!merchantId || !organizationId) {
            console.error('Missing required parameters:', { merchantId, organizationId });
            return null;
        }

        // Construct the full name if not provided
        const fullName = customerDetails.name ||
            `${customerDetails.firstName || ''} ${customerDetails.lastName || ''}`.trim();

        // Format phone number with country code if available
        const formattedPhone = customerDetails.countryCode
            ? customerDetails.countryCode + customerDetails.phoneNumber
            : customerDetails.phoneNumber;

        console.log('Creating customer with RPC call:', {
            merchantId,
            organizationId,
            name: fullName,
            email: customerDetails.email,
            phone: formattedPhone,
        });

        // Call the SQL function directly via RPC with parameters in the exact order expected
        const { data, error } = await supabase.rpc('create_or_update_customer', {
            p_merchant_id: merchantId,
            p_organization_id: organizationId,
            p_name: fullName,
            p_email: customerDetails.email || null,
            p_city: customerDetails.city || null,
            p_address: customerDetails.address || null,
            p_country: customerDetails.country || null,
            p_phone_number: formattedPhone || null,
            p_postal_code: customerDetails.postalCode || null,
            p_whatsapp_number: customerDetails.whatsappNumber || null
        });

        if (error) {
            console.error('Error creating or updating customer via RPC:', error);
            return null;
        }

        console.log('Customer created or updated successfully via RPC:', data);
        return data;
    } catch (error) {
        console.error('Error creating or updating customer:', error);
        return null;
    }
};
