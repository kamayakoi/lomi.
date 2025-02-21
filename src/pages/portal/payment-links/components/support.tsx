import { supabase } from '@/utils/supabase/client'
import { PaymentLink } from './types'
// import { config } from '@/utils/config'

export const fetchPaymentLinks = async (
    merchantId: string,
    linkType: string | null,
    currency: string | null,
    status: string | null,
    page: number,
    pageSize: number
) => {
    const { data, error } = await supabase.rpc('fetch_payment_links', {
        p_merchant_id: merchantId,
        p_link_type: linkType === 'all' ? undefined : linkType,
        p_currency_code: currency === 'all' ? undefined : currency,
        p_is_active: status === 'all' ? undefined : status === 'active',
        p_page: page,
        p_page_size: pageSize,
    });

    if (error) {
        console.error('Error fetching payment links:', error);
        return [];
    }

    return data as PaymentLink[];
};

export const generatePaymentLink = (
    linkType: string,
    productId?: string,
    planId?: string
) => {
    const baseUrl = import.meta.env['BUN_ENV'] === 'production'
        ? import.meta.env['VITE_PAYMENT_LINK_BASE_URL']
        : import.meta.env['VITE_PAYMENT_LINK_BASE_URL_DEV'];

    let linkPath = '';

    if (linkType === 'product' && productId) {
        linkPath = `/product/${encodeURIComponent(productId)}`;
    } else if (linkType === 'plan' && planId) {
        linkPath = `/plan/${encodeURIComponent(planId)}`;
    }

    return `${baseUrl}${linkPath}`;
};
