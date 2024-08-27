import { Transaction } from './transaction';

export interface Refund {
  refund_id: string; 
  transaction_id: Transaction['transaction_id']; 
  amount: number;
  reason?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  created_at: string;
  updated_at: string;
}