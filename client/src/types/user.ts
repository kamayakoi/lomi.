export interface User {
  user_id: string;
  name: string;
  email: string;
  phone_number: string;
  is_admin: boolean;
  verified: boolean;
  country?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
  created_by?: string;  
  updated_by?: string; 
  deleted_at?: string;
}