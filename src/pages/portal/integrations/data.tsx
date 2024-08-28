import {
  IconBrandVisa,
  IconBrandPaypal,
} from '@tabler/icons-react'

// Remove placeholder icon components since we will use images from the public directory

export const integrations = [
  {
    name: 'Visa',
    logo: <IconBrandVisa />,
    connected: true,
    desc: 'Easily manage Visa transactions and payments.',
  },
  {
    name: 'Paypal',
    logo: <IconBrandPaypal />,
    connected: true,
    desc: 'Easily manage Paypal transactions and payments.',
  },
  {
    name: 'Wave',
    logo: <img src="/images/wave.png" alt="Wave" style={{ width: 24, height: 24 }} />,
    connected: false,
    desc: 'Easily manage Wave transactions and payments.',
  },
  {
    name: 'Ecobank',
    logo: <img src="/images/ecobank.png" alt="Ecobank" style={{ width: 24, height: 24 }} />,
    connected: false,
    desc: 'Easily manage Ecobank transactions and payments.',
  },
  {
    name: 'UBA Bank',
    logo: <img src="/images/uba.png" alt="UBA Bank" style={{ width: 24, height: 24 }} />,
    connected: false,
    desc: 'Easily manage UBA Bank transactions and payments.',
  },
  {
    name: 'Mastercard',
    logo: <img src="/images/mastercard.png" alt="Mastercard" style={{ width: 24, height: 24 }} />,
    connected: true,
    desc: 'Easily manage Mastercard transactions and payments.',
  },
  {
    name: 'Airtel',
    logo: <img src="/images/airtel.png" alt="Airtel" style={{ width: 24, height: 24 }} />,
    connected: false,
    desc: 'Easily integrate Airtel for direct messaging.',
  },
  {
    name: 'Vodafone',
    logo: <img src="/images/vodafone.png" alt="Vodafone" style={{ width: 24, height: 24 }} />,
    connected: false,
    desc: 'Easily integrate Vodafone for direct messaging.',
  },
]