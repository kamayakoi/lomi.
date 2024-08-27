import { supabase } from '@/utils/supabase/client';
import { Database } from '@/../database.types';

type Refund = Database['public']['Tables']['refunds']['Row'];
type RefundInsert = Database['public']['Tables']['refunds']['Insert'];
type RefundUpdate = Database['public']['Tables']['refunds']['Update'];

export async function createRefund(refundData: RefundInsert): Promise<Refund | null> {
  const { data, error } = await supabase
    .rpc('create_refund', refundData);

  if (error) {
    console.error('Error creating refund:', error);
    return null;
  }

  return data;
}

export async function getRefundById(refundId: string): Promise<Refund | null> {
  const { data, error } = await supabase
    .rpc('get_refund_by_id', { p_refund_id: refundId });

  if (error) {
    console.error('Error retrieving refund:', error);
    return null;
  }

  return data;
}

export async function updateRefund(refundId: string, updates: RefundUpdate): Promise<Refund | null> {
  const { data, error } = await supabase
    .rpc('update_refund', { p_refund_id: refundId, ...updates });

  if (error) {
    console.error('Error updating refund:', error);
    return null;
  }

  return data;
}