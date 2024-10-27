import { supabase } from '@/utils/supabase/client';
import { CheckoutData, CustomerDetails } from './checkoutTypes.ts';

export const fetchDataForCheckout = async (linkId: string, organizationId: string): Promise<CheckoutData | null> => {
    const { data, error } = await supabase.rpc('fetch_data_for_checkout', { p_link_id: linkId, p_organization_id: organizationId });
    if (error) {
        console.error('Error fetching checkout data:', error);
        return null;
    }
    const paymentLink = data[0];
    const merchantProduct = paymentLink && paymentLink.product_id ? {
        productId: paymentLink.product_id,
        merchantId: paymentLink.merchant_id,
        organizationId: paymentLink.organization_id,
        name: paymentLink.product_name,
        description: paymentLink.product_description,
        price: paymentLink.product_price,
        currencyCode: paymentLink.currency_code,
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

export const fetchOrganizationDetails = async (userId: string) => {
    const { data, error } = await supabase.rpc('fetch_organization_id', { p_merchant_id: userId });
    if (error) {
        console.error('Error fetching organization ID:', error);
        return { organizationId: null };
    }
    return {
        organizationId: data[0].organization_id,
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
