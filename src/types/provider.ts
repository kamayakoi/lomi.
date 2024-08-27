export interface Provider {
  provider_code: 'MTN' | 'WAVE' | 'ORANGE' | 'STRIPE' | 'PAYPAL' | 'LOMI';
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}