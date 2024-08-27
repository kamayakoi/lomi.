import { Currency } from './currency';
import { PaymentMethod } from './payment_method';
import { User } from './user';
import { Organization } from './organization';

export interface RecurringPayment {
  recurring_payment_id: string; 
  user_id: User['user_id']; 
  organization_id: Organization['organization_id']; 
  amount: number;
  currency_code: Currency['code'];
  payment_method_code: PaymentMethod['payment_method_code'];
  payment_type: 'subscription' | 'installment' | 'debt' | 'utility' | 'other';
  frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'yearly' | 'one-time';
  next_payment_date: string;
  end_date?: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}