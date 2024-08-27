import { supabase } from '@/utils/supabase/client';
import { Database } from '@/../database.types';

type EndCustomerPaymentMethod = Database['public']['Tables']['end_customer_payment_methods']['Row'];
type EndCustomerPaymentMethodInsert = Database['public']['Tables']['end_customer_payment_methods']['Insert'];
type EndCustomerPaymentMethodUpdate = Database['public']['Tables']['end_customer_payment_methods']['Update'];

export async function createEndCustomerPaymentMethod(paymentMethodData: EndCustomerPaymentMethodInsert): Promise<EndCustomerPaymentMethod | null> {
  const { data, error } = await supabase
    .rpc('create_end_customer_payment_method', paymentMethodData);

  if (error) {
    console.error('Error creating end customer payment method:', error);
    return null;
  }

  return data;
}

export async function getEndCustomerPaymentMethodById(ecpmId: string): Promise<EndCustomerPaymentMethod | null> {
  const { data, error } = await supabase
    .rpc('get_end_customer_payment_method_by_id', { p_ec_payment_method_id: ecpmId });

  if (error) {
    console.error('Error retrieving end customer payment method:', error);
    return null;
  }

  return data;
}

export async function updateEndCustomerPaymentMethod(ecpmId: string, updates: EndCustomerPaymentMethodUpdate): Promise<EndCustomerPaymentMethod | null> {
  const { data, error } = await supabase
    .rpc('update_end_customer_payment_method', { p_ec_payment_method_id: ecpmId, ...updates });

  if (error) {
    console.error('Error updating end customer payment method:', error);
    return null;
  }

  return data;
}

export async function deleteEndCustomerPaymentMethod(ecpmId: string): Promise<boolean> {
  const { data, error } = await supabase
    .rpc('delete_end_customer_payment_method', { p_ec_payment_method_id: ecpmId });

  if (error) {
    console.error('Error deleting end customer payment method:', error);
    return false;
  }

  return data;
}