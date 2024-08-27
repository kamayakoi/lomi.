import { supabase } from '@/utils/supabase/client';
import { Database } from '@/../database.types';

type Fee = Database['public']['Tables']['fees']['Row'];
type FeeInsert = Database['public']['Tables']['fees']['Insert'];
type FeeUpdate = Database['public']['Tables']['fees']['Update'];

export async function createFee(feeData: FeeInsert): Promise<Fee | null> {
  const { data, error } = await supabase
    .rpc('create_fee', feeData);

  if (error) {
    console.error('Error creating fee:', error);
    return null;
  }

  return data;
}

export async function getFeeById(feeId: string): Promise<Fee | null> {
  const { data, error } = await supabase
    .rpc('get_fee_by_id', { p_fee_id: feeId });

  if (error) {
    console.error('Error retrieving fee:', error);
    return null;
  }

  return data;
}

export async function updateFee(feeId: string, updates: FeeUpdate): Promise<Fee | null> {
  const { data, error } = await supabase
    .rpc('update_fee', { p_fee_id: feeId, ...updates });

  if (error) {
    console.error('Error updating fee:', error);
    return null;
  }

  return data;
}

export async function deleteFee(feeId: string): Promise<boolean> {
  const { data, error } = await supabase
    .rpc('delete_fee', { p_fee_id: feeId });

  if (error) {
    console.error('Error deleting fee:', error);
    return false;
  }

  return data;
}