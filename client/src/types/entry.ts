import { Account } from './account';
import { Transaction } from './transaction';

export interface Entry {
  entry_id: string; 
  account_id: Account['account_id']; 
  transaction_id?: Transaction['transaction_id']; 
  amount: number;
  entry_type: 'debit' | 'credit';
  created_at: string;
}