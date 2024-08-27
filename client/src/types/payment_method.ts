import { CountryCode } from './country_code';
import { Provider } from './provider';

export interface PaymentMethod {
  payment_method_code:
    'CREDIT_CARD' | 'DEBIT_CARD' | 'MOBILE_MONEY' | 'BANK_TRANSFER' | 'SEPA' | 'PAYPAL' |
    'APPLE_PAY' | 'GOOGLE_PAY' | 'CASH' | 'CRYPTOCURRENCY' | 'IDEAL' | 'COUNTER' | 'WAVE' |
    'AIRTEL_MONEY' | 'MPESA' | 'AIRTIME' | 'POS' | 'BANK_USSD' | 'E_WALLET' | 'QR_CODE' | 'USSD';
  name: string;
  description?: string;
  provider_code?: Provider['provider_code'];
  phone_number?: string;
  card_number?: string;
  country_code: CountryCode['country_code'];
  created_at: string;
  updated_at: string;
}