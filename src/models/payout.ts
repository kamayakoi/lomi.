import { supabase } from '@/utils/supabase/client';
import { Database } from '@/../database.types';

type Payout = Database['public']['Tables']['payouts']['Row'];
type PayoutInsert = Database['public']['Tables']['payouts']['Insert'];
type PayoutUpdate = Database['public']['Tables']['payouts']['Update'];

export async function createPayout(payoutData: PayoutInsert): Promise<Payout | null> {
  const { data, error } = await supabase
    .rpc('create_payout', payoutData);

  if (error) {
    console.error('Error creating payout:', error);
    return null;
  }

  return data;
}

export async function getPayoutById(payoutId: string): Promise<Payout | null> {
  const { data, error } = await supabase
    .rpc('get_payout_by_id', { p_payout_id: payoutId });

  if (error) {
    console.error('Error retrieving payout:', error);
    return null;
  }

  return data;
}

export async function updatePayout(payoutId: string, updates: PayoutUpdate): Promise<Payout | null> {
  const { data, error } = await supabase
    .rpc('update_payout', { p_payout_id: payoutId, ...updates });

  if (error) {
    console.error('Error updating payout:', error);
    return null;
  }

  return data;
}

export async function deletePayout(payoutId: string): Promise<boolean> {
  const { data, error } = await supabase
    .rpc('delete_payout', { p_payout_id: payoutId });

  if (error) {
    console.error('Error deleting payout:', error);
    return false;
  }

  return data;
}