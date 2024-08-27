import { supabase } from '@/utils/supabase/client';
import { Database } from '@/../database.types';

type UserOrganizationLink = Database['public']['Tables']['user_organization_links']['Row'];
type UserOrganizationLinkInsert = Database['public']['Tables']['user_organization_links']['Insert'];
type UserOrganizationLinkUpdate = Database['public']['Tables']['user_organization_links']['Update'];

export async function createUserOrganizationLink(linkData: UserOrganizationLinkInsert): Promise<UserOrganizationLink | null> {
  const { data, error } = await supabase
    .rpc('create_user_organization_link', linkData);

  if (error) {
    console.error('Error creating user organization link:', error);
    return null;
  }

  return data;
}

export async function getUserOrganizationLinkById(linkId: string): Promise<UserOrganizationLink | null> {
  const { data, error } = await supabase
    .rpc('get_user_organization_link_by_id', { p_link_id: linkId });

  if (error) {
    console.error('Error retrieving user organization link:', error);
    return null;
  }

  return data;
}

export async function updateUserOrganizationLink(linkId: string, updates: UserOrganizationLinkUpdate): Promise<UserOrganizationLink | null> {
  const { data, error } = await supabase
    .rpc('update_user_organization_link', { p_link_id: linkId, ...updates });

  if (error) {
    console.error('Error updating user organization link:', error);
    return null;
  }

  return data;
}

export async function deleteUserOrganizationLink(linkId: string): Promise<boolean> {
  const { data, error } = await supabase
    .rpc('delete_user_organization_link', { p_link_id: linkId });

  if (error) {
    console.error('Error deleting user organization link:', error);
    return false;
  }

  return data;
}