import { Currency } from './currency';
import { User } from './user';

export interface MainAccount {
  main_account_id: string; 
  user_id: User['user_id'];
  balance: number;
  currency_code: Currency['code'];
  created_at: string;
}