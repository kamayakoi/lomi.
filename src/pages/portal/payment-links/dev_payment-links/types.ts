export type link_type = 'product' | 'plan' | 'instant';
export type currency_code = 'XOF' | 'USD' | 'EUR';
export type provider_code = 'ORANGE' | 'WAVE' | 'ECOBANK' | 'MTN' | 'STRIPE' | 'OTHER';

export type PaymentLink = {
  link_id: string
  merchant_id: string
  organization_id: string
  link_type: link_type
  url: string
  product_id?: string
  plan_id?: string
  title: string
  public_description?: string
  private_description?: string
  price?: number
  currency_code: currency_code
  allowed_providers: provider_code[]
  allow_coupon_code: boolean
  is_active: boolean
  expires_at?: string
  success_url?: string
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}
