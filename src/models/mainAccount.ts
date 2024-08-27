import { supabase } from '@/utils/supabase/client';
import { Database } from '@/../database.types';

type MainAccount = Database['public']['Tables']['main_accounts']['Row'];
type MainAccountInsert = Database['public']['Tables']['main_accounts']['Insert'];
type MainAccountUpdate = Database['public']['Tables']['main_accounts']['Update'];

export async function createMainAccount(mainAccountData: MainAccountInsert): Promise<MainAccount | null> {
  const { data, error } = await supabase
    .rpc('create_main_account', mainAccountData);

  if (error) {
    console.error('Error creating main account:', error);
    return null;
  }

  return data;
}

export async function getMainAccountById(mainAccountId: string): Promise<MainAccount | null> {
  const { data, error } = await supabase
    .rpc('get_main_account_by_id', { p_main_account_id: mainAccountId });

  if (error) {
    console.error('Error retrieving main account:', error);
    return null;
  }

  return data;
}

export async function updateMainAccount(mainAccountId: string, updates: MainAccountUpdate): Promise<MainAccount | null> {
  const { data, error } = await supabase
    .rpc('update_main_account', { p_main_account_id: mainAccountId, ...updates });

  if (error) {
    console.error('Error updating main account:', error);
    return null;
  }

  return data;
}

export async function deleteMainAccount(mainAccountId: string): Promise<boolean> {
  const { data, error } = await supabase
    .rpc('delete_main_account', { p_main_account_id: mainAccountId });

  if (error) {
    console.error('Error deleting main account:', error);
    return false;
  }

  return data;
}