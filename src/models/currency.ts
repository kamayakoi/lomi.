import { supabase } from '@/utils/supabase/client';
import { Database } from '@/../database.types';

type Currency = Database['public']['Tables']['currencies']['Row'];
type CurrencyInsert = Database['public']['Tables']['currencies']['Insert'];
type CurrencyUpdate = Database['public']['Tables']['currencies']['Update'];

export async function createCurrency(currencyData: CurrencyInsert): Promise<Currency | null> {
  const { data, error } = await supabase
    .rpc('create_currency', currencyData);

  if (error) {
    console.error('Error creating currency:', error);
    return null;
  }

  return data;
}

export async function getCurrencyByCode(code: string): Promise<Currency | null> {
  const { data, error } = await supabase
    .rpc('get_currency_by_code', { p_code: code });

  if (error) {
    console.error('Error retrieving currency:', error);
    return null;
  }

  return data;
}

export async function updateCurrency(code: string, updates: CurrencyUpdate): Promise<Currency | null> {
  const { data, error } = await supabase
    .rpc('update_currency', { p_code: code, ...updates });

  if (error) {
    console.error('Error updating currency:', error);
    return null;
  }

  return data;
}