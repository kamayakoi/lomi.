import { supabase } from '@/utils/supabase/client';
import { Database } from '@/../database.types';

type EndCustomer = Database['public']['Tables']['customers']['Row'];
type EndCustomerInsert = Database['public']['Tables']['customers']['Insert'];
type EndCustomerUpdate = Database['public']['Tables']['customers']['Update'];

export async function createEndCustomer(endCustomerData: EndCustomerInsert): Promise<EndCustomer | null> {
  const { data, error } = await supabase
    .rpc('create_end_customer', endCustomerData);

  if (error) {
    console.error('Error creating end customer:', error);
    return null;
  }

  return data;
}

export async function getEndCustomerById(endCustomerId: string): Promise<EndCustomer | null> {
  const { data, error } = await supabase
    .rpc('get_end_customer_by_id', { p_end_customer_id: endCustomerId });

  if (error) {
    console.error('Error retrieving end customer:', error);
    return null;
  }

  return data;
}

export async function updateEndCustomer(endCustomerId: string, updates: EndCustomerUpdate): Promise<EndCustomer | null> {
  const { data, error } = await supabase
    .rpc('update_end_customer', { p_end_customer_id: endCustomerId, ...updates });

  if (error) {
    console.error('Error updating end customer:', error);
    return null;
  }

  return data;
}

export async function deleteEndCustomer(endCustomerId: string): Promise<boolean> {
  const { data, error } = await supabase
    .rpc('delete_end_customer', { p_end_customer_id: endCustomerId });

  if (error) {
    console.error('Error deleting end customer:', error);
    return false;
  }

  return data;
}