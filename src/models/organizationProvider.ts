import { supabase } from '@/utils/supabase/client';
import { Database } from '@/../database.types';

type OrganizationProvider = Database['public']['Tables']['organization_providers']['Row'];
type OrganizationProviderInsert = Database['public']['Tables']['organization_providers']['Insert'];
type OrganizationProviderUpdate = Database['public']['Tables']['organization_providers']['Update'];

export async function createOrganizationProvider(providerData: OrganizationProviderInsert): Promise<OrganizationProvider | null> {
  const { data, error } = await supabase
    .rpc('create_organization_provider', providerData);

  if (error) {
    console.error('Error creating organization provider:', error);
    return null;
  }

  return data;
}

export async function getOrganizationProviderById(orgProviderId: string): Promise<OrganizationProvider | null> {
  const { data, error } = await supabase
    .rpc('get_organization_provider_by_id', { p_org_provider_id: orgProviderId });

  if (error) {
    console.error('Error retrieving organization provider:', error);
    return null;
  }

  return data;
}

export async function updateOrganizationProvider(orgProviderId: string, updates: OrganizationProviderUpdate): Promise<OrganizationProvider | null> {
  const { data, error } = await supabase
    .rpc('update_organization_provider', { p_org_provider_id: orgProviderId, ...updates });

  if (error) {
    console.error('Error updating organization provider:', error);
    return null;
  }

  return data;
}

export async function deleteOrganizationProvider(orgProviderId: string): Promise<boolean> {
  const { data, error } = await supabase
    .rpc('delete_organization_provider', { p_org_provider_id: orgProviderId });

  if (error) {
    console.error('Error deleting organization provider:', error);
    return false;
  }

  return data;
}