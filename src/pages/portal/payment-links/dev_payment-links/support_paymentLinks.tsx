import { supabase } from '@/utils/supabase/client'
import { PaymentLink } from './types'

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
        p_link_type: linkType === 'all' ? null : linkType,
        p_currency_code: currency === 'all' ? null : currency,
        p_is_active: status === 'all' ? null : status === 'active',
        p_page: page,
        p_page_size: pageSize,
    })

    if (error) {
        console.error('Error fetching payment links:', error)
        return []
    }

    return data as PaymentLink[]
}

export const generatePaymentLink = (
    merchantId: string,
    orderId: string,
    linkType: string,
    productId?: string,
    planId?: string
) => {
    const baseUrl = import.meta.env.MODE === 'production' ? import.meta.env['VITE_PAYMENT_LINK_BASE_URL'] : import.meta.env['VITE_PAYMENT_LINK_BASE_URL_DEV'];
    const encodedMerchantId = encodeURIComponent(merchantId);
    const encodedOrderId = encodeURIComponent(orderId);

    let linkPath = `/${encodedMerchantId}/${encodedOrderId}`;

    if (linkType === 'product' && productId) {
        linkPath += `/product/${encodeURIComponent(productId)}`;
    } else if (linkType === 'plan' && planId) {
        linkPath += `/plan/${encodeURIComponent(planId)}`;
    }

    return `${baseUrl}${linkPath}`;
};
