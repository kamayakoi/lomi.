import { User } from './user';
import { Organization } from './organization';

export interface UserOrganizationLink {
  user_org_id: string; 
  user_id: User['user_id']; 
  organization_id: Organization['organization_id'];
  role: 'admin' | 'user';
  created_at: string;
}