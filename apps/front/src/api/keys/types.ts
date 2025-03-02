export interface ApiKey {
  merchant_id: string;
  organization_id: string;
  api_key: string;
  name: string;
  is_active: boolean;
  expiration_date: string | null;
  environment: 'test' | 'live';
  created_at: string;
  updated_at: string;
}