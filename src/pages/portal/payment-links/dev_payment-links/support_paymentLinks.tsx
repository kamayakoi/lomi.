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
