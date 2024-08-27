import { Currency } from './currency';
import { PaymentMethod } from './payment_method';
import { User } from './user';
import { Organization } from './organization';

export interface Transaction {
  transaction_id: string; 
  user_id: User['user_id']; 
  organization_id: Organization['organization_id']; 
  end_customer_id?: string; 
  transaction_type: 'payment' | 'refund' | 'transfer' | 'payout';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  description?: string;
  metadata?: any;
  amount: number;
  currency_code: Currency['code'];
  payment_method_code: PaymentMethod['payment_method_code'];
  created_at: string;
  updated_at: string;
}