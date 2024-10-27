import {
  IconBrandVisa,
  IconBrandMastercard,
  IconBrandApple,
} from '@tabler/icons-react'

export type Provider = {
  provider_code: string;
  name: string;
  description: string;
  logo: JSX.Element;
  includedPayments?: Array<{ name: string; icon: JSX.Element }>;
}

export const providers: Provider[] = [
  {
    provider_code: 'ORANGE',
    name: 'Orange',
    logo: <img src="/orange.png" alt="Orange Money" className="w-full h-full object-contain" />,
    description: 'Enable Orange Money payments for your customers. Widely used in West Africa, the French carrier mobile money service allows for easy transfers and payments.',
  },
  {
    provider_code: 'WAVE',
    name: 'Wave',
    logo: <img src="/wave.png" alt="Wave" className="w-full h-full object-contain" />,
    description: 'Known for its low fees and user-friendly interface, it\'s the preferred payment method in Sénégal and Côte d\'Ivoire.',
  },
  // {
  //   provider_code: 'ECOBANK',
  //   name: 'Ecobank',
  //   logo: <img src="/ecobank.png" alt="Ecobank" className="w-full h-full object-cover" />,
  //   description: 'Connect with Ecobank to enable pay-by-bank payments for your customers. Ideal for businesses operating across multiple African countries.',
  // },
  {
    provider_code: 'MTN',
    name: 'MTN',
    logo: <img src="/mtn.png" alt="MTN" className="w-full h-full object-contain" />,
    description: 'Leverage MTN Mobile Money "momo" payments, a widely used service in West and Central Africa. Perfect for reaching customers in these regions.',
  },
  {
    provider_code: 'STRIPE',
    name: 'Stripe',
    logo: <img src="/stripe.png" alt="Stripe" className="w-full h-full text-[#635BFF]" />,
    description: 'Integrate Stripe to accept card payments globally. Benefit from advanced features like multicurrency support and access to additional integrations via our partnership with this global player.',
    includedPayments: [
      { name: 'Visa', icon: <IconBrandVisa /> },
      { name: 'Mastercard', icon: <IconBrandMastercard /> },
      { name: 'Apple Pay', icon: <IconBrandApple /> },
    ],
  },
]