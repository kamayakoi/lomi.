import { PaymentMethod } from './payment_method';
import { Currency } from './currency';
import { User } from './user';

export interface Account {
  account_id: string;
  user_id: User['user_id'];
  balance: number;
  payment_method_code: PaymentMethod['payment_method_code'];
  currency_code: Currency['code'];
  created_at: string;
  is_active: boolean;
}