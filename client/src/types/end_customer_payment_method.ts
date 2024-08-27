import { PaymentMethod } from './payment_method';
import { EndCustomer } from './end_customer';

export interface EndCustomerPaymentMethod {
  ecpm_id: string; 
  end_customer_id: EndCustomer['end_customer_id'];
  payment_method_code: PaymentMethod['payment_method_code'];
  created_at: string;
}