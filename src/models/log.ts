import { supabase } from '@/utils/supabase/client';
import { Database } from '@/../database.types';

type Log = Database['public']['Tables']['logs']['Row'];
type LogInsert = Database['public']['Tables']['logs']['Insert'];

export async function createLog(logData: LogInsert): Promise<Log | null> {
  const { data, error } = await supabase
    .rpc('create_log', logData);

  if (error) {
    console.error('Error creating log:', error);
    return null;
  }

  return data;
}

export async function getLogById(logId: string): Promise<Log | null> {
  const { data, error } = await supabase
    .rpc('get_log_by_id', { p_log_id: logId });

  if (error) {
    console.error('Error retrieving log:', error);
    return null;
  }

  return data;
}