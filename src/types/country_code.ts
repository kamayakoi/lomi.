import { Currency } from './currency';

export interface CountryCode {
  country_code: '+233' | '+234' | '+225' | '+254' | '+27' | '+20' | '+212' | '+251' | '+256' | '+221' | '+237' | '+255' | '+222' | '+216' | '+250' | '+260' | '+263' | '+213' | '+33' | '+44' | '+49' | '+39' | '+34' | '+31' | '+46' | '+48' | '+351' | '+30' | '+32' | '+43' | '+1';
  name: string;
  currency_code: Currency['code'];
  created_at: string;
  updated_at: string;
}