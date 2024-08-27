import { supabase } from '@/utils/supabase/client';
import { Database } from '@/../database.types';

type InternalTransfer = Database['public']['Tables']['internal_transfers']['Row'];
type InternalTransferInsert = Database['public']['Tables']['internal_transfers']['Insert'];
type InternalTransferUpdate = Database['public']['Tables']['internal_transfers']['Update'];

export async function createInternalTransfer(transferData: InternalTransferInsert): Promise<InternalTransfer | null> {
  const { data, error } = await supabase
    .rpc('create_internal_transfer', transferData);

  if (error) {
    console.error('Error creating internal transfer:', error);
    return null;
  }

  return data;
}

export async function getInternalTransferById(transferId: string): Promise<InternalTransfer | null> {
  const { data, error } = await supabase
    .rpc('get_internal_transfer_by_id', { p_internal_transfer_id: transferId });

  if (error) {
    console.error('Error retrieving internal transfer:', error);
    return null;
  }

  return data;
}

export async function updateInternalTransfer(transferId: string, updates: InternalTransferUpdate): Promise<InternalTransfer | null> {
  const { data, error } = await supabase
    .rpc('update_internal_transfer', { p_internal_transfer_id: transferId, ...updates });

  if (error) {
    console.error('Error updating internal transfer:', error);
    return null;
  }

  return data;
}

export async function deleteInternalTransfer(transferId: string): Promise<boolean> {
  const { data, error } = await supabase
    .rpc('delete_internal_transfer', { p_internal_transfer_id: transferId });

  if (error) {
    console.error('Error deleting internal transfer:', error);
    return false;
  }

  return data;
}