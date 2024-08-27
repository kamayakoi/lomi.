import { Currency } from './currency';
import { Account } from './account';
import { Transaction } from './transaction';

export interface Transfer {
  transfer_id: string; 
  from_account_id: Account['account_id'];  
  to_account_id: Account['account_id']; 
  transaction_id: Transaction['transaction_id']; 
  amount: number;
  currency_code: Currency['code'];
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  created_at: string;
}