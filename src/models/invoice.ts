import { supabase } from '@/utils/supabase/client';
import { Database } from '@/../database.types';

type Invoice = Database['public']['Tables']['invoices']['Row'];
type InvoiceInsert = Database['public']['Tables']['invoices']['Insert'];
type InvoiceUpdate = Database['public']['Tables']['invoices']['Update'];

export async function createInvoice(invoiceData: InvoiceInsert): Promise<Invoice | null> {
  const { data, error } = await supabase
    .rpc('create_invoice', invoiceData);

  if (error) {
    console.error('Error creating invoice:', error);
    return null;
  }

  return data;
}

export async function getInvoiceById(invoiceId: string): Promise<Invoice | null> {
  const { data, error } = await supabase
    .rpc('get_invoice_by_id', { p_invoice_id: invoiceId });

  if (error) {
    console.error('Error retrieving invoice:', error);
    return null;
  }

  return data;
}

export async function updateInvoice(invoiceId: string, updates: InvoiceUpdate): Promise<Invoice | null> {
  const { data, error } = await supabase
    .rpc('update_invoice', { p_invoice_id: invoiceId, ...updates });

  if (error) {
    console.error('Error updating invoice:', error);
    return null;
  }

  return data;
}

export async function deleteInvoice(invoiceId: string): Promise<boolean> {
  const { data, error } = await supabase
    .rpc('delete_invoice', { p_invoice_id: invoiceId });

  if (error) {
    console.error('Error deleting invoice:', error);
    return false;
  }

  return data;
}