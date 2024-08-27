import { User } from './user';

export interface ApiKey {
  key_id: string; 
  user_id: User['user_id'];
  api_key: string;
  is_active: boolean;
  expiration_date?: string;
  created_at: string;
  updated_at: string;
  last_used_at?: string;
}