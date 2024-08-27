import { supabase } from '@/utils/supabase/client';
import { Database } from '@/../database.types';

type Entry = Database['public']['Tables']['entries']['Row'];
type EntryInsert = Database['public']['Tables']['entries']['Insert'];
type EntryUpdate = Database['public']['Tables']['entries']['Update'];

export async function createEntry(entryData: EntryInsert): Promise<Entry | null> {
  const { data, error } = await supabase
    .rpc('create_entry', entryData);

  if (error) {
    console.error('Error creating entry:', error);
    return null;
  }

  return data;
}

export async function getEntryById(entryId: string): Promise<Entry | null> {
  const { data, error } = await supabase
    .rpc('get_entry_by_id', { p_entry_id: entryId });

  if (error) {
    console.error('Error retrieving entry:', error);
    return null;
  }

  return data;
}

export async function updateEntry(entryId: string, updates: EntryUpdate): Promise<Entry | null> {
  const { data, error } = await supabase
    .rpc('update_entry', { p_entry_id: entryId, ...updates });

  if (error) {
    console.error('Error updating entry:', error);
    return null;
  }

  return data;
}

export async function deleteEntry(entryId: string): Promise<boolean> {
  const { data, error } = await supabase
    .rpc('delete_entry', { p_entry_id: entryId });

  if (error) {
    console.error('Error deleting entry:', error);
    return false;
  }

  return data;
}