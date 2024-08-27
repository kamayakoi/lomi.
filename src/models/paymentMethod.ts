import { supabase } from '@/utils/supabase/client';
import { Database } from '@/../database.types';

type PaymentMethod = Database['public']['Tables']['payment_methods']['Row'];
type PaymentMethodInsert = Database['public']['Tables']['payment_methods']['Insert'];
type PaymentMethodUpdate = Database['public']['Tables']['payment_methods']['Update'];

export async function createPaymentMethod(paymentMethodData: PaymentMethodInsert): Promise<PaymentMethod | null> {
  const { data, error } = await supabase
    .rpc('create_payment_method', paymentMethodData);

  if (error) {
    console.error('Error creating payment method:', error);
    return null;
  }

  return data;
}

export async function getPaymentMethodById(paymentMethodId: string): Promise<PaymentMethod | null> {
  const { data, error } = await supabase
    .rpc('get_payment_method_by_id', { p_payment_method_id: paymentMethodId });

  if (error) {
    console.error('Error retrieving payment method:', error);
    return null;
  }

  return data;
}

export async function updatePaymentMethod(paymentMethodId: string, updates: PaymentMethodUpdate): Promise<PaymentMethod | null> {
  const { data, error } = await supabase
    .rpc('update_payment_method', { p_payment_method_id: paymentMethodId, ...updates });

  if (error) {
    console.error('Error updating payment method:', error);
    return null;
  }

  return data;
}

export async function deletePaymentMethod(paymentMethodId: string): Promise<boolean> {
  const { data, error } = await supabase
    .rpc('delete_payment_method', { p_payment_method_id: paymentMethodId });

  if (error) {
    console.error('Error deleting payment method:', error);
    return false;
  }

  return data;
}