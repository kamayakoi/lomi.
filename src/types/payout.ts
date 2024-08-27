import { Transaction } from './transaction';
import { Currency } from './currency';
import { Account } from './account';

export interface Payout {
  payout_id: string; 
  transaction_id: Transaction['transaction_id']; 
  account_id: Account['account_id']; 
  amount: number;
  currency_code: Currency['code'];
  destination: string;
  metadata?: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}