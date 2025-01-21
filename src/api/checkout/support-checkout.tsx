import { supabase } from '@/utils/supabase/client';
import { CheckoutData, CustomerDetails } from './checkoutTypes.ts';

export const fetchDataForCheckout = async (linkId: string): Promise<CheckoutData | null> => {
    const { data, error } = await supabase.rpc('fetch_data_for_checkout', { p_link_id: linkId });
    if (error) {
        console.error('Error fetching checkout data:', error);
        return null;
    }
    const paymentLink = data[0];

    // Download product image if exists
    let productImageUrl = null;
    if (paymentLink?.product_image_url) {
        const { data: imageData, error: imageError } = await supabase
            .storage
            .from('product_images')
            .download(paymentLink.product_image_url.replace(/^.*\/product_images\//, ''))

        if (!imageError) {
            productImageUrl = URL.createObjectURL(imageData)
        }
    }

    // Download plan image if exists
    let planImageUrl = null;
    if (paymentLink?.plan_image_url) {
        const { data: imageData, error: imageError } = await supabase
            .storage
            .from('subscription_plans')
            .download(paymentLink.plan_image_url.replace(/^.*\/subscription_plans\//, ''))

        if (!imageError) {
            planImageUrl = URL.createObjectURL(imageData)
        }
    }

    const merchantProduct = paymentLink && paymentLink.product_id ? {
        productId: paymentLink.product_id,
        merchantId: paymentLink.merchant_id,
        organizationId: paymentLink.organization_id,
        name: paymentLink.product_name,
        description: paymentLink.product_description,
        price: paymentLink.product_price,
        currencyCode: paymentLink.currency_code,
        image_url: productImageUrl || paymentLink.product_image_url,
        isActive: true,
        createdAt: '',
        updatedAt: '',
    } : null;
    const subscriptionPlan = paymentLink && paymentLink.plan_id ? {
        planId: paymentLink.plan_id,
        merchantId: paymentLink.merchant_id,
        organizationId: paymentLink.organization_id,
        name: paymentLink.plan_name,
        description: paymentLink.plan_description,
        billingFrequency: paymentLink.plan_billing_frequency,
        amount: paymentLink.plan_amount,
        currencyCode: paymentLink.currency_code,
        image_url: planImageUrl || paymentLink.plan_image_url,
        failedPaymentAction: '',
        chargeDay: null,
        metadata: {},
        createdAt: '',
        updatedAt: '',
        firstPaymentType: '',
    } : null;
    return {
        paymentLink: paymentLink ? {
            ...paymentLink,
            organizationLogoUrl: paymentLink.organization_logo_url,
        } : null,
        merchantProduct,
        subscriptionPlan,
    };
};

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
