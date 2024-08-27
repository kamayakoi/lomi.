import { User } from './user';
import { Organization } from './organization';
import { CountryCode } from './country_code';

export interface EndCustomer {
  end_customer_id: string; 
  user_id: User['user_id'];
  organization_id: Organization['organization_id'];
  name: string;
  email?: string;
  phone_number?: string;
  country_code: CountryCode['country_code'];
  data?: any;
  created_at: string;
  updated_at: string;
}