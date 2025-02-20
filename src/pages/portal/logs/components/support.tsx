import { supabase } from '@/utils/supabase/client'
import { Database } from 'database.types'

type event_type = Database['public']['Enums']['event_type']
type Log = Database['public']['Tables']['logs']['Row']

interface FetchLogsParams {
    userId: string
    event?: string | null
    severity?: string | null
    limit?: number
    offset?: number
}

interface FetchLogsResponse {
    data: Log[]
    totalCount: number
}

interface LogWithCount extends Log {
    total_count: number
}

export async function fetchLogs({
    userId,
    event,
    severity,
    limit = 50,
    offset = 0
}: FetchLogsParams): Promise<FetchLogsResponse> {
    try {
        const { data, error } = await supabase
            .rpc('fetch_logs', {
                p_merchant_id: userId,
                p_event: event === 'all' ? undefined : event as event_type,
                p_severity: severity === 'all' ? undefined : severity as string,
                p_limit: limit,
                p_offset: offset
            })

        if (error) throw error

        if (!data || data.length === 0) {
            return { data: [], totalCount: 0 }
        }

        const totalCount = (data[0] as LogWithCount).total_count || 0
        const logs = data.map(({ ...log }: LogWithCount) => log)

        return {
            data: logs,
            totalCount
        }
    } catch (error) {
        console.error('Error fetching logs:', error)
        return {
            data: [],
            totalCount: 0
        }
    }
}
