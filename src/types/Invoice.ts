import { Currency } from './currency';
import { User } from './user';
import { Organization } from './organization';

export interface Invoice {
  invoice_id: string; 
  user_id: User['user_id'];
  organization_id: Organization['organization_id'];
  amount: number;
  description?: string;
  currency_code: Currency['code'];
  due_date: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  created_at: string;
  updated_at: string;
}