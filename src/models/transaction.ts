import { supabase } from '@/utils/supabase/client';
import { Database } from '@/../database.types';

type Transaction = Database['public']['Tables']['transactions']['Row'];
type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];
type TransactionUpdate = Database['public']['Tables']['transactions']['Update'];

export async function createTransaction(transactionData: TransactionInsert): Promise<Transaction | null> {
  const { data, error } = await supabase
    .rpc('create_transaction', transactionData);

  if (error) {
    console.error('Error creating transaction:', error);
    return null;
  }

  return data;
}

export async function getTransactionById(transactionId: string): Promise<Transaction | null> {
  const { data, error } = await supabase
    .rpc('get_transaction_by_id', { p_transaction_id: transactionId });

  if (error) {
    console.error('Error retrieving transaction:', error);
    return null;
  }

  return data;
}

export async function updateTransaction(transactionId: string, updates: TransactionUpdate): Promise<Transaction | null> {
  const { data, error } = await supabase
    .rpc('update_transaction', { p_transaction_id: transactionId, ...updates });

  if (error) {
    console.error('Error updating transaction:', error);
    return null;
  }

  return data;
}

export async function getTransactionsByUserId(userId: string): Promise<Transaction[]> {
  const { data, error } = await supabase
    .rpc('get_transactions_by_user_id', { p_user_id: userId });

  if (error) {
    console.error('Error retrieving transactions:', error);
    return [];
  }

  return data || [];
}

export async function getTransactionsByOrganizationId(organizationId: string): Promise<Transaction[]> {
  const { data, error } = await supabase
    .rpc('get_transactions_by_organization_id', { p_organization_id: organizationId });

  if (error) {
    console.error('Error retrieving transactions:', error);
    return [];
  }

  return data || [];
}