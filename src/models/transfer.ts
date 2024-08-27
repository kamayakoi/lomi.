import { supabase } from '@/utils/supabase/client';
import { Database } from '@/../database.types';

type Transfer = Database['public']['Tables']['transfers']['Row'];
type TransferInsert = Database['public']['Tables']['transfers']['Insert'];
type TransferUpdate = Database['public']['Tables']['transfers']['Update'];

export async function createTransfer(transferData: TransferInsert): Promise<Transfer | null> {
  const { data, error } = await supabase
    .rpc('create_transfer', transferData);

  if (error) {
    console.error('Error creating transfer:', error);
    return null;
  }

  return data;
}

export async function getTransferById(transferId: string): Promise<Transfer | null> {
  const { data, error } = await supabase
    .rpc('get_transfer_by_id', { p_transfer_id: transferId });

  if (error) {
    console.error('Error retrieving transfer:', error);
    return null;
  }

  return data;
}

export async function updateTransfer(transferId: string, updates: TransferUpdate): Promise<Transfer | null> {
  const { data, error } = await supabase
    .rpc('update_transfer', { p_transfer_id: transferId, ...updates });

  if (error) {
    console.error('Error updating transfer:', error);
    return null;
  }

  return data;
}

export async function deleteTransfer(transferId: string): Promise<boolean> {
  const { data, error } = await supabase
    .rpc('delete_transfer', { p_transfer_id: transferId });

  if (error) {
    console.error('Error deleting transfer:', error);
    return false;
  }

  return data;
}