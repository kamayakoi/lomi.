import { Database } from '@/../database.types'

export type Provider = Omit<Database['public']['Tables']['providers']['Row'], 'created_at' | 'updated_at'> & {
  logo: JSX.Element;
  includedPayments?: Array<{ name: string; icon: JSX.Element }>;
  installLink: string;
  status?: 'coming_soon' | 'available';
}

export const integrationOptions = [
  {
    title: "Shopify",
    description: "Integrate lomi.&apos;s checkout experience with your store for a smooth and localized payment flow.",
    link: "https://www.shopify.com/",
    logo: <img src="/integrations/shopify.webp" alt="Shopify" className="w-12 h-12 object-contain" />,
    installLink: "#",
    status: 'available',
  },
  {
    title: "Next.js",
    description: "Jumpstart your development with our Next.js starter kit, complete with our pre-configured payment stack.",
    link: "https://nextjs.org/docs/",
    logo: <img src="/integrations/nextjs.webp" alt="Next.js" className="w-12 h-12 object-contain" />,
    installLink: "https://github.com/lomiafrica/store.lomi.africa/",
    status: 'available',
  },
  {
    title: "WordPress",
    description: "Accept payments directly on your website built with WordPress with our easy-to-use plugin for WooCommerce.",
    link: "https://woocommerce.com/",
    logo: <img src="/integrations/wordpress.webp" alt="WordPress" className="w-12 h-12 object-contain" />,
    installLink: "",
    status: 'coming_soon',
  },
  {
    title: "Xero",
    description: "Integrating with Xero allows you to synchronize lomi. transactions and payment processing in your bookkeeping software.",
    link: "https://www.xero.com/",
    logo: <img src="/integrations/xero.webp" alt="Xero" className="w-12 h-12 object-contain" />,
    installLink: "",
    status: 'coming_soon',
  },
  {
    title: "Make.com",
    description: "Make is a platform that allows you to create automated workflows between different apps.",
    link: "https://make.com/",
    logo: <img src="/integrations/make.webp" alt="Make.com" className="w-12 h-12 object-contain" />,
    installLink: "",
    status: 'coming_soon',
  },
  {
    title: "Zapier",
    description: "Like Make, Zapier lets you connect lomi. to other apps and automate powerful workflows.",
    link: "https://zapier.com/",
    logo: <img src="/integrations/zapier.webp" alt="Zapier" className="w-12 h-12 object-contain" />,
    installLink: "",
    status: 'coming_soon',
  },
  {
    title: "WhatsApp",
    description: 'Connect WhatsApp Business API to send subscription renewal reminders, payment notifications, and more to your customers.',
    link: "https://business.whatsapp.com/",
    logo: <img src="/integrations/whatsapp.webp" alt="WhatsApp" className="w-12 h-12 object-contain" />,
    installLink: "#",
    status: 'available',
  },
];