import { supabase } from '@/utils/supabase/client'
import { Log } from './types'

export const fetchLogs = async (
    merchantId: string,
    event: string | null,
    severity: string | null,
    page: number,
    pageSize: number
) => {
    const { data, error } = await supabase.rpc('fetch_logs', {
        p_merchant_id: merchantId,
        p_event: event === 'all' ? null : event,
        p_severity: severity === 'all' ? null : severity,
        p_page: page,
        p_page_size: pageSize,
    })

    if (error) {
        console.error('Error fetching logs:', error)
        return []
    }

    return data as Log[]
}
