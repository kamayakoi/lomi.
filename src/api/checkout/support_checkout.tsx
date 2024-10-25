import { supabase } from '@/utils/supabase/client';
import { CheckoutData } from './CheckoutTypes';

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
    const { data, error } = await supabase.rpc('fetch_organization_details', { p_merchant_id: userId });
    if (error) {
        console.error('Error fetching organization details:', error);
        return { organizationId: null, logoUrl: null };
    }
    return {
        organizationId: data[0].organization_id,
        logoUrl: data[0].logo_url,
    };
};
