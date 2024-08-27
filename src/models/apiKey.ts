import { supabase } from '@/utils/supabase/client';
import { Database } from '@/../database.types';

type ApiKey = Database['public']['Tables']['api_keys']['Row'];
type ApiKeyInsert = Database['public']['Tables']['api_keys']['Insert'];
type ApiKeyUpdate = Database['public']['Tables']['api_keys']['Update'];

export async function createApiKey(apiKeyData: ApiKeyInsert): Promise<ApiKey | null> {
  const { data, error } = await supabase
    .rpc('create_api_key', apiKeyData);

  if (error) {
    console.error('Error creating API key:', error);
    return null;
  }

  return data;
}

export async function getApiKeyById(keyId: string): Promise<ApiKey | null> {
  const { data, error } = await supabase
    .rpc('get_api_key_by_id', { p_api_key_id: keyId });

  if (error) {
    console.error('Error retrieving API key:', error);
    return null;
  }

  return data;
}

export async function updateApiKey(keyId: string, updates: ApiKeyUpdate): Promise<ApiKey | null> {
  const { data, error } = await supabase
    .rpc('update_api_key', { p_api_key_id: keyId, ...updates });

  if (error) {
    console.error('Error updating API key:', error);
    return null;
  }

  return data;
}

export async function deleteApiKey(keyId: string): Promise<boolean> {
  const { data, error } = await supabase
    .rpc('delete_api_key', { p_api_key_id: keyId });

  if (error) {
    console.error('Error deleting API key:', error);
    return false;
  }

  return data;
}