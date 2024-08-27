import { supabase } from '@/utils/supabase/client';
import { Database } from '@/../database.types';

type User = Database['public']['Tables']['users']['Row'];
type UserInsert = Database['public']['Tables']['users']['Insert'];
type UserUpdate = Database['public']['Tables']['users']['Update'];

export async function createUser(userData: UserInsert): Promise<User | null> {
  const { data, error } = await supabase
    .rpc('create_user', userData);

  if (error) {
    console.error('Error creating user:', error);
    return null;
  }

  return data;
}

export async function getUserById(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .rpc('get_user_by_id', { p_user_id: userId });

  if (error) {
    console.error('Error retrieving user:', error);
    return null;
  }

  return data;
}

export async function updateUser(userId: string, updates: UserUpdate): Promise<User | null> {
  const { data, error } = await supabase
    .rpc('update_user', { p_user_id: userId, ...updates });

  if (error) {
    console.error('Error updating user:', error);
    return null;
  }

  return data;
}

export async function deleteUser(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .rpc('delete_user', { p_user_id: userId });

  if (error) {
    console.error('Error deleting user:', error);
    return false;
  }

  return data;
}