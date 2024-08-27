import { supabase } from '@/utils/supabase/client';
import { Database } from '@/../database.types';

type Provider = Database['public']['Tables']['providers']['Row'];
type ProviderInsert = Database['public']['Tables']['providers']['Insert'];
type ProviderUpdate = Database['public']['Tables']['providers']['Update'];

export async function createProvider(providerData: ProviderInsert): Promise<Provider | null> {
  const { data, error } = await supabase
    .rpc('create_provider', providerData);

  if (error) {
    console.error('Error creating provider:', error);
    return null;
  }

  return data;
}

export async function getProviderById(providerId: string): Promise<Provider | null> {
  const { data, error } = await supabase
    .rpc('get_provider_by_id', { p_provider_id: providerId });

  if (error) {
    console.error('Error retrieving provider:', error);
    return null;
  }

  return data;
}

export async function updateProvider(providerId: string, updates: ProviderUpdate): Promise<Provider | null> {
  const { data, error } = await supabase
    .rpc('update_provider', { p_provider_id: providerId, ...updates });

  if (error) {
    console.error('Error updating provider:', error);
    return null;
  }

  return data;
}

export async function deleteProvider(providerId: string): Promise<boolean> {
  const { data, error } = await supabase
    .rpc('delete_provider', { p_provider_id: providerId });

  if (error) {
    console.error('Error deleting provider:', error);
    return false;
  }

  return data;
}