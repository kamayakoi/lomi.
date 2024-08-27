export interface Organization {
  organization_id: string; 
  name: string;
  email: string;
  phone_number: string;
  country: string;
  status: 'active' | 'inactive' | 'suspended';
  metadata?: any;
  max_transactions_per_day?: number;
  max_providers?: number;
  max_transaction_amount?: number;
  max_monthly_volume?: number;
  max_api_calls_per_minute?: number;
  max_webhooks?: number;
  logo_url?: string;
  created_at: string;
  updated_at: string;
  created_by?: string; 
  updated_by?: string; 
  deleted_at?: string;
}