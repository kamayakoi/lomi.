import { Transaction } from './transaction';
import { Currency } from './currency';

export interface Fee {
  fee_id: string; 
  transaction_type: Transaction['transaction_type'];
  amount: number;
  currency_code: Currency['code'];
  created_at: string;
  updated_at: string;
}