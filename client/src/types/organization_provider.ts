import { Organization } from './organization';
import { Provider } from './provider';

export interface OrganizationProvider {
  org_provider_id: string; 
  organization_id: Organization['organization_id']; 
  provider_code: Provider['provider_code'];
  created_at: string;
  updated_at: string;
}