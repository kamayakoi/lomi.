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
    description: 'Enable Orange Money payments for your customers. Widely used in Africa, this mobile money service allows for easy transfers and payments.',
    is_active: true,
  },
  {
    provider_code: 'WAVE',
    name: 'Wave Mobile Money',
    logo: <img src="/wave.png" alt="Wave" className="w-full h-full object-contain" />,
    description: 'Integrate with Wave to offer a popular mobile money solution in West Africa. Known for its low fees and user-friendly interface.',
    is_active: true,
  },
  {
    provider_code: 'ECOBANK',
    name: 'Ecobank',
    logo: <img src="/ecobank.png" alt="Ecobank" className="w-full h-full object-cover" />,
    description: 'Connect with Ecobank to provide pan-African banking services. Ideal for businesses operating across multiple African countries.',
    is_active: true,
  },
  {
    provider_code: 'MTN',
    name: 'MTN',
    logo: <img src="/mtn.png" alt="MTN" className="w-full h-full object-contain" />,
    description: 'Offer MTN Mobile Money payments, a widely used service in Africa and the Middle East. Perfect for reaching customers in these regions.',
    is_active: true,
  },
  {
    provider_code: 'STRIPE',
    name: 'Stripe',
    logo: <IconBrandStripe className="w-10 h-10 text-[#635BFF]" />,
    description: 'Integrate Stripe to accept payments globally. Benefit from advanced features like recurring billing, fraud prevention, and support for multiple currencies.',
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