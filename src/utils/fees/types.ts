import { Database } from '../../../database.types';

// Database enum types
export type CurrencyCode = Database['public']['Enums']['currency_code'];
export type ProviderCode = Database['public']['Enums']['provider_code'];
export type PaymentMethodCode = Database['public']['Enums']['payment_method_code'];
export type TransactionType = Database['public']['Enums']['transaction_type'];

// Fee structure interfaces
export interface Fee {
  name: string;
  percentage: number;
  fixedAmount: number;
}

export interface CalculatedFee {
  feeAmount: number;    // Total fee amount
  netAmount: number;    // Amount after fee deduction
  feeName: string;      // Name of the fee applied
} 