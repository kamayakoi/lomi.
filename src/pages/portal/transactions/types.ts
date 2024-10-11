export type currency_code = 'XOF' | 'USD' | 'EUR';
export type payment_method_code = 'CARDS' | 'MOBILE_MONEY' | 'E_WALLET' | 'BANK_TRANSFER' | 'APPLE_PAY' | 'GOOGLE_PAY' | 'USSD' | 'QR_CODE';
export type transaction_status = 'pending' | 'completed' | 'failed';
export type transaction_type = 'payment' | 'refund' | 'subscription';
export type provider_code = 'ORANGE' | 'WAVE' | 'ECOBANK' | 'MTN' | 'STRIPE' | 'OTHER';