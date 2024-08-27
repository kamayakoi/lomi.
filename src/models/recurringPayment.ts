import { supabase } from '@/utils/supabase/client';
import { Database } from '@/../database.types';

type RecurringPayment = Database['public']['Tables']['recurring_payments']['Row'];
type RecurringPaymentInsert = Database['public']['Tables']['recurring_payments']['Insert'];
type RecurringPaymentUpdate = Database['public']['Tables']['recurring_payments']['Update'];

export async function createRecurringPayment(recurringPaymentData: RecurringPaymentInsert): Promise<RecurringPayment | null> {
  const { data, error } = await supabase
    .rpc('create_recurring_payment', recurringPaymentData);

  if (error) {
    console.error('Error creating recurring payment:', error);
    return null;
  }

  return data;
}

export async function getRecurringPaymentById(recurringPaymentId: string): Promise<RecurringPayment | null> {
  const { data, error } = await supabase
    .rpc('get_recurring_payment_by_id', { p_recurring_payment_id: recurringPaymentId });

  if (error) {
    console.error('Error retrieving recurring payment:', error);
    return null;
  }

  return data;
}

export async function updateRecurringPayment(recurringPaymentId: string, updates: RecurringPaymentUpdate): Promise<RecurringPayment | null> {
  const { data, error } = await supabase
    .rpc('update_recurring_payment', { p_recurring_payment_id: recurringPaymentId, ...updates });

  if (error) {
    console.error('Error updating recurring payment:', error);
    return null;
  }

  return data;
}

export async function deleteRecurringPayment(recurringPaymentId: string): Promise<boolean> {
  const { data, error } = await supabase
    .rpc('delete_recurring_payment', { p_recurring_payment_id: recurringPaymentId });

  if (error) {
    console.error('Error deleting recurring payment:', error);
    return false;
  }

  return data;
}