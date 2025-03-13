import React from 'react';
import {
  IconCurrencyBitcoin,
  IconDeviceMobile,
  IconCreditCard,
  IconWallet,
  IconBan
} from '@tabler/icons-react';

export type PaymentMethod = {
  code: string;
  name: string;
  description: string;
  logo: React.ReactNode;
  provider_code: string;
  type: 'Digital Payments' | 'Mobile Money' | 'e-Wallets' | 'Banks' | 'Crypto';
  status?: 'active' | 'coming_soon';
  category: string;
  isMainCrypto?: boolean;
  parentCrypto?: string;
  isViewMore?: boolean;
}

export const paymentMethods: PaymentMethod[] = [
  // Digital Payments Section
  {
    code: 'VISA',
    name: 'Visa',
    description: 'Enable Visa card payments for your customers. Widely accepted worldwide, it is the perfect payment method for businesses serving international customers.',
    logo: <img src="/payment_channels/visa.webp" alt="Visa" className="w-full h-full object-contain" />,
    provider_code: 'ECOBANK',
    type: 'Digital Payments',
    status: 'coming_soon',
    category: 'Cards'
  },
  {
    code: 'MASTERCARD',
    name: 'Mastercard',
    description: 'Accept Mastercard payments globally. Ideal for businesses looking to expand internationally with reliable card processing and strong security.',
    logo: <img src="/payment_channels/mastercard.webp" alt="Mastercard" className="w-full h-full object-contain" />,
    provider_code: 'ECOBANK',
    type: 'Digital Payments',
    status: 'coming_soon',
    category: 'Cards'
  },
  {
    code: 'PAYPAL',
    name: 'PayPal',
    description: 'Enable secure PayPal payments for global reach. Trusted worldwide for easy, protected transactions with built-in buyer and seller protection.',
    logo: <img src="/payment_channels/paypal.webp" alt="PayPal" className="w-full h-full object-contain" />,
    provider_code: 'PAYPAL',
    type: 'Digital Payments',
    status: 'coming_soon',
    category: 'Cards'
  },
  {
    code: 'APPLE_PAY',
    name: 'Apple Pay',
    description: 'Enable seamless one-touch payments with Apple Pay. Offer your iOS users a fast, secure checkout experience with built-in biometric authentication.',
    logo: <img src="/payment_channels/apple_pay.webp" alt="Apple Pay" className="w-full h-full object-contain" />,
    provider_code: 'APPLE',
    type: 'Digital Payments',
    status: 'coming_soon',
    category: 'Cards'
  },
  // {
  //   code: 'GOOGLE_PAY',
  //   name: 'Google Pay',
  //   description: 'Integrate Google Pay to provide Android and Google users with a seamless checkout experience. Enable fast, secure payments with advanced fraud protection.',
  //   logo: <img src="/payment_channels/google-pay.webp" alt="Google Pay" className="w-full h-full object-contain" />,
  //   provider_code: 'GOOGLE',
  //   type: 'Digital Payments',
  //   status: 'coming_soon',
  //   category: 'Cards'
  // },

  // E-Wallet Section
  {
    code: 'WAVE',
    name: 'Wave',
    description: 'Known for its low fees and user-friendly interface, it\'s the preferred payment method in Sénégal and Côte d\'Ivoire.',
    logo: <img src="/payment_channels/wave.webp" alt="Wave" className="w-full h-full object-contain" />,
    provider_code: 'WAVE',
    type: 'e-Wallets',
    category: 'E-Wallets'
  },
  {
    code: 'OPAY',
    name: 'OPay',
    description: 'Unlock OPay, a fast-growing mobile payment platform in Nigeria. Benefit from their innovative technology, and extensive agent network.',
    logo: <img src="/payment_channels/opay.webp" alt="OPay" className="w-full h-full object-contain" />,
    provider_code: 'OPAY',
    type: 'e-Wallets',
    status: 'coming_soon',
    category: 'E-Wallets'
  },

  // Mobile Money Section
  {
    code: 'ORANGE',
    name: 'Orange',
    description: 'Enable Orange Money payments for your customers. Widely used in West Africa, the French carrier mobile money service allows for easy transfers and payments.',
    logo: <img src="/payment_channels/orange.webp" alt="Orange Money" className="w-full h-full object-contain" />,
    provider_code: 'ORANGE',
    type: 'Mobile Money',
    category: 'Mobile Money'
  },
  {
    code: 'MTN',
    name: 'MTN',
    description: 'Leverage MTN "momo" payments, a widely used service in West and Central Africa. Perfect for reaching customers in these regions.',
    logo: <img src="/payment_channels/mtn.webp" alt="MTN" className="w-full h-full object-contain" />,
    provider_code: 'MTN',
    type: 'Mobile Money',
    status: 'coming_soon',
    category: 'Mobile Money'
  },
  {
    code: 'MOOV',
    name: 'Moov Money',
    description: 'Expand your payment options with Moov a trusted mobile money service across francophone West Africa. Ideal for secure, hassle-free transactions in the region.',
    logo: <img src="/payment_channels/moov.webp" alt="Moov Money" className="w-full h-full object-contain" />,
    provider_code: 'MOOV',
    type: 'Mobile Money',
    status: 'coming_soon',
    category: 'Mobile Money'
  },
  {
    code: 'AIRTEL',
    name: 'Airtel',
    description: 'Enable payments through Airtel. Benefit from instant transactions and a broad mobile money user base with extensive regional coverage.',
    logo: <img src="/payment_channels/airtel.webp" alt="Airtel" className="w-full h-full object-contain" />,
    provider_code: 'AIRTEL',
    type: 'Mobile Money',
    status: 'coming_soon',
    category: 'Mobile Money'
  },
  {
    code: 'MPESA',
    name: 'M-Pesa',
    description: 'Offer M-Pesa as a payment option for your customers. Access a large network of users in Kenya with fast, reliable transactions and wide-ranging reach.',
    logo: <img src="/payment_channels/mpesa.webp" alt="M-Pesa" className="w-full h-full object-contain" />,
    provider_code: 'MPESA',
    type: 'Mobile Money',
    status: 'coming_soon',
    category: 'Mobile Money'
  },

  // Crypto Section
  {
    code: 'BTC',
    name: 'Bitcoin',
    description: 'Accept Bitcoin and enable your business to receive instant, secure, and borderless transactions with the world\'s leading cryptocurrency.',
    logo: <img src="/crypto/btc.webp" alt="BTC" className="w-8 h-8" />,
    provider_code: 'NOWPAYMENTS',
    type: 'Crypto',
    category: 'Crypto',
    parentCrypto: 'BTC'
  },
  {
    code: 'USDC',
    name: 'USDC',
    description: 'Enable USDC payments on Ethereum. Ideal for businesses seeking price stability with the benefits of blockchain technology.',
    logo: <img src="/crypto/usdc.webp" alt="USDC" className="w-8 h-8 " />,
    provider_code: 'NOWPAYMENTS',
    type: 'Crypto',
    category: 'Crypto',
    parentCrypto: 'BTC'
  },
  {
    code: 'BNB',
    name: 'BNB',
    description: 'Support BNB transactions via the BNB Smart Chain, ensuring lightning-fast payments with minimal fees within the Binance ecosystem.',
    logo: <img src="/crypto/bnb.webp" alt="BNB" className="w-8 h-8" />,
    provider_code: 'NOWPAYMENTS',
    type: 'Crypto',
    category: 'Crypto',
    parentCrypto: 'BTC'
  },
  {
    code: 'CRYPTO_MORE',
    name: 'More cryptocurrencies',
    description: 'We have built-in support for a wide range of cryptocurrencies including stablecoins and major tokens. Connect once to enable all our supported cryptocurrencies on your platform.',
    logo: <div className="relative w-full">
      <div className="flex items-center -space-x-3">
        <div className="relative">
          <img src="/crypto/usdt.webp" alt="USDT" className="relative w-12 h-12 rounded-full border-2 border-white bg-white" />
        </div>
        <div className="relative">
          <img src="/crypto/eth.webp" alt="ETH" className="relative w-12 h-12 rounded-full border-2 border-white bg-white" />
        </div>
        <div className="relative">
          <img src="/crypto/sol.webp" alt="SOL" className="relative w-12 h-12 rounded-full border-2 border-white bg-white" />
        </div>
        <div className="relative">
          <img src="/crypto/ton.webp" alt="TON" className="relative w-12 h-12 rounded-full border-2 border-white bg-white" />
        </div>
        <div className="relative">
          <img src="/crypto/ada.webp" alt="ADA" className="relative w-12 h-12 rounded-full border-2 border-white bg-white" />
        </div>
        <div className="relative">
          <img src="/crypto/fil.webp" alt="FIL" className="relative w-12 h-12 rounded-full border-2 border-white bg-white" />
        </div>
      </div>
    </div>,
    provider_code: 'NOWPAYMENTS',
    type: 'Crypto',
    category: 'Crypto',
    parentCrypto: 'BTC',
    isViewMore: true,
    isMainCrypto: true
  }

];

export const categoryIcons: Record<string, React.ReactNode> = {
  'Cards': <IconCreditCard className="w-5 h-5" />,
  'Mobile Money': <IconDeviceMobile className="w-5 h-5" />,
  'e-Wallets': <IconWallet className="w-5 h-5" />,
  'Banks': <IconBan className="w-5 h-5" />,
  'Crypto': <IconCurrencyBitcoin className="w-5 h-5" />
};


