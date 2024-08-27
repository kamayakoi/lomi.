import { User } from './user';

export interface Webhook {
  webhook_id: string;
  user_id: User['user_id']; 
  url: string;
  events: string[];
  secret: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_triggered_at?: string;
}