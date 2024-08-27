import { supabase } from '@/utils/supabase/client';
import { Database } from '@/../database.types';

type Organization = Database['public']['Tables']['organizations']['Row'];
type OrganizationInsert = Database['public']['Tables']['organizations']['Insert'];
type OrganizationUpdate = Database['public']['Tables']['organizations']['Update'];

export async function createOrganization(organizationData: OrganizationInsert): Promise<Organization | null> {
  const { data, error } = await supabase
    .rpc('create_organization', organizationData);

  if (error) {
    console.error('Error creating organization:', error);
    return null;
  }

  return data;
}

export async function getOrganizationById(organizationId: string): Promise<Organization | null> {
  const { data, error } = await supabase
    .rpc('get_organization_by_id', { p_organization_id: organizationId });

  if (error) {
    console.error('Error retrieving organization:', error);
    return null;
  }

  return data;
}

export async function updateOrganization(organizationId: string, updates: OrganizationUpdate): Promise<Organization | null> {
  const { data, error } = await supabase
    .rpc('update_organization', { p_organization_id: organizationId, ...updates });

  if (error) {
    console.error('Error updating organization:', error);
    return null;
  }

  return data;
}

export async function deleteOrganization(organizationId: string): Promise<boolean> {
  const { data, error } = await supabase
    .rpc('delete_organization', { p_organization_id: organizationId });

  if (error) {
    console.error('Error deleting organization:', error);
    return false;
  }

  return data;
}