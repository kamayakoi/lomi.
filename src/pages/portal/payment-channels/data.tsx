import React from 'react';

export type Provider = {
  provider_code: string;
  name: string;
  description: string;
  logo: React.ReactNode;
  includedPayments?: Array<{ name: string; icon: React.ReactNode }>;
  type: 'Card' | 'Mobile Money' | 'E-Wallet' | 'Bank Transfer';
}

export const providers: Provider[] = [
  {
    provider_code: 'ORANGE',
    name: 'Orange',
    logo: <img src="/orange.webp" alt="Orange Money" className="w-full h-full object-contain" />,
    description: 'Enable Orange Money payments for your customers. Widely used in West Africa, the French carrier mobile money service allows for easy transfers and payments.',
    type: 'Mobile Money',
  },
  {
    provider_code: 'WAVE',
    name: 'Wave',
    logo: <img src="/wave.webp" alt="Wave" className="w-full h-full object-contain" />,
    description: 'Known for its low fees and user-friendly interface, it\'s the preferred payment method in Sénégal and Côte d\'Ivoire.',
    type: 'Mobile Money',
  },
  // {
  //   provider_code: 'ECOBANK',
  //   name: 'Ecobank',
  //   logo: <img src="/ecobank.webp" alt="Ecobank" className="w-full h-full object-cover" />,
  //   description: 'Connect with Ecobank to enable pay-by-bank payments for your customers. Ideal for businesses operating across multiple African countries.',
  //   type: 'Bank Transfer',
  // },
  {
    provider_code: 'MTN',
    name: 'MTN',
    logo: <img src="/mtn.webp" alt="MTN" className="w-full h-full object-contain" />,
    description: 'Leverage MTN Mobile Money "momo" payments, a widely used service in West and Central Africa. Perfect for reaching customers in these regions.',
    type: 'Mobile Money',
  },
]