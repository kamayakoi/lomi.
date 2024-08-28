import {
  IconBrandStripe,
  IconBrandVisa,
  IconBrandMastercard,
  IconBrandPaypal,
  IconBrandApple,
  IconBrandGoogle,
} from '@tabler/icons-react'
import { Database } from '@/../database.types'

export type Provider = Omit<Database['public']['Tables']['providers']['Row'], 'created_at' | 'updated_at'> & {
  logo: JSX.Element;
  includedPayments?: Array<{ name: string; icon: JSX.Element }>;
}

export const providers: Provider[] = [
  {
    provider_code: 'ORANGE',
    name: 'Orange',
    logo: <img src="/orange.png" alt="Orange Money" className="w-12 h-12 object-contain" />,
    description: 'Easily manage Orange Money transactions and payments.',
    is_active: true,
  },
  {
    provider_code: 'WAVE',
    name: 'Wave Mobile Money',
    logo: <img src="/wave.png" alt="Wave" className="w-full h-full object-contain" />,
    description: 'Easily manage Wave transactions and payments.',
    is_active: true,
  },
  {
    provider_code: 'ECOBANK',
    name: 'Ecobank',
    logo: <img src="/ecobank.png" alt="Ecobank" className="w-full h-full object-cover" />,
    description: 'Easily manage Ecobank transactions and payments.',
    is_active: true,
  },
  {
    provider_code: 'MTN',
    name: 'MTN',
    logo: <img src="/mtn.png" alt="MTN" className="w-full h-full object-contain" />,
    description: 'Easily manage MTN transactions and payments.',
    is_active: true,
  },
  {
    provider_code: 'STRIPE',
    name: 'Stripe',
    logo: <IconBrandStripe className="w-10 h-10 text-[#635BFF]" />,
    description: 'Create or connect a Stripe account to enable credit card payments and access advanced features via our API.',
    is_active: true,
    includedPayments: [
      { name: 'Visa', icon: <IconBrandVisa /> },
      { name: 'Mastercard', icon: <IconBrandMastercard /> },
      { name: 'PayPal', icon: <IconBrandPaypal /> },
      { name: 'Apple Pay', icon: <IconBrandApple /> },
      { name: 'Google Pay', icon: <IconBrandGoogle /> },
    ],
  },
]