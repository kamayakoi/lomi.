import { supabase } from '@/utils/supabase/client';
import { Transaction } from '@/api/types';

export async function createTransaction(
  merchantId: string,
  organizationId: string,
  customerId: string,
  productId: string | null,
  subscriptionId: string | null,
  transactionType: string,
  description: string,
  referenceId: string,
  metadata: Record<string, unknown>,
  grossAmount: number,
  feeAmount: number,
  netAmount: number,
  feeReference: string,
  currencyCode: string,
  providerCode: string,
  paymentMethodCode: string
): Promise<Transaction> {
  const { data, error } = await supabase.rpc('create_transaction', {
    merchant_id: merchantId,
    organization_id: organizationId,
    customer_id: customerId,
    product_id: productId,
    subscription_id: subscriptionId,
    transaction_type: transactionType,
    description,
    reference_id: referenceId,
    metadata,
    gross_amount: grossAmount,
    fee_amount: feeAmount,
    net_amount: netAmount,
    fee_reference: feeReference,
    currency_code: currencyCode,
    provider_code: providerCode,
    payment_method_code: paymentMethodCode,
  });

  if (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }

  return data as Transaction;
}

export async function getTransactionById(id: string): Promise<Transaction | null> {
  const { data, error } = await supabase.rpc('get_transaction_by_id', {
    transaction_id: id,
  });

  if (error) {
    console.error('Error retrieving transaction:', error);
    throw error;
  }

  return data ? (data as Transaction) : null;
}

export async function updateTransactionStatus(id: string, status: string): Promise<Transaction | null> {
  const { data, error } = await supabase.rpc('update_transaction_status', {
    transaction_id: id,
    new_status: status,
  });

  if (error) {
    console.error('Error updating transaction status:', error);
    throw error;
  }

  return data ? (data as Transaction) : null;
}

export async function createTransactionWithProvider(
  merchantId: string,
  organizationId: string,
  customerId: string,
  productId: string | null,
  subscriptionId: string | null,
  transactionType: string,
  description: string,
  referenceId: string,
  metadata: Record<string, unknown>,
  grossAmount: number,
  feeAmount: number,
  netAmount: number,
  feeReference: string,
  currencyCode: string,
  providerCode: string,
  paymentMethodCode: string,
  providerTransactionId: string,
  providerPaymentStatus: string
): Promise<Transaction> {
  const { data, error } = await supabase.rpc('create_transaction_with_provider', {
    merchant_id: merchantId,
    organization_id: organizationId,
    customer_id: customerId,
    product_id: productId,
    subscription_id: subscriptionId,
    transaction_type: transactionType,
    description,
    reference_id: referenceId,
    metadata,
    gross_amount: grossAmount,
    fee_amount: feeAmount,
    net_amount: netAmount,
    fee_reference: feeReference,
    currency_code: currencyCode,
    provider_code: providerCode,
    payment_method_code: paymentMethodCode,
    provider_transaction_id: providerTransactionId,
    provider_payment_status: providerPaymentStatus,
  });

  if (error) {
    console.error('Error creating transaction with provider:', error);
    throw error;
  }

  return data as Transaction;
}
