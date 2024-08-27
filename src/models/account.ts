import { supabase } from '@/utils/supabase/client';
import { Database } from '@/../database.types';

type Account = Database['public']['Tables']['accounts']['Row'];
type AccountInsert = Database['public']['Tables']['accounts']['Insert'];
type AccountUpdate = Database['public']['Tables']['accounts']['Update'];

export async function createAccount(accountData: AccountInsert): Promise<Account | null> {
  const { data, error } = await supabase
    .rpc('create_account', accountData);

  if (error) {
    console.error('Error creating account:', error);
    return null;
  }

  return data;
}

export async function getAccountById(accountId: string): Promise<Account | null> {
  const { data, error } = await supabase
    .rpc('get_account_by_id', { p_account_id: accountId });

  if (error) {
    console.error('Error retrieving account:', error);
    return null;
  }

  return data;
}

export async function updateAccount(accountId: string, updates: AccountUpdate): Promise<Account | null> {
  const { data, error } = await supabase
    .rpc('update_account', { p_account_id: accountId, ...updates });

  if (error) {
    console.error('Error updating account:', error);
    return null;
  }

  return data;
}

export async function deleteAccount(accountId: string): Promise<boolean> {
  const { data, error } = await supabase
    .rpc('delete_account', { p_account_id: accountId });

  if (error) {
    console.error('Error deleting account:', error);
    return false;
  }

  return data;
}