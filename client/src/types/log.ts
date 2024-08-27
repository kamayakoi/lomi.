import { User } from './user';

export interface Log {
  log_id: string;
  user_id?: User['user_id'];
  action: string;
  details?: any;
  created_at: string;
}