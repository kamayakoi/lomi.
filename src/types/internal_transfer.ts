import { Currency } from './currency';
import { Account } from './account';
import { MainAccount } from './main_account';

export interface InternalTransfer {
  internal_transfer_id: string;
  from_account_id: Account['account_id'];
  to_main_account_id: MainAccount['main_account_id'];
  amount: number;
  currency_code: Currency['code'];
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}