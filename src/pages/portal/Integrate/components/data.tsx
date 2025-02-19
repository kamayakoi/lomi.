import { Database } from '@/../database.types'

export type Provider = Omit<Database['public']['Tables']['providers']['Row'], 'created_at' | 'updated_at'> & {
  logo: JSX.Element;
  includedPayments?: Array<{ name: string; icon: JSX.Element }>;
  installLink: string;
}


export const integrationOptions = [
  {
    title: "Shopify",
    description: "Integrate lomi.&apos;s checkout experience with your store for a smooth and localized payment flow.",
    link: "#",
    logo: <img src="/integrations/shopify.webp" alt="Shopify" className="w-12 h-12 object-contain" />,
    installLink: "#",
  },
  {
    title: "Next.js",
    description: "Jumpstart your development with our Next.js starter kit, complete with our pre-configured payment stack.",
    link: "https://github.com/lomiafrica/nextjs.lomi.boilerplate",
    logo: <img src="/integrations/nextjs.webp" alt="Next.js" className="w-12 h-12 object-contain" />,
    installLink: "https://github.com/lomiafrica/nextjs.lomi.boilerplate",
  },
  {
    title: "WordPress",
    description: "Accept payments on your website with our easy-to-use plugin.",
    link: "#",
    logo: <img src="/integrations/wordpress.webp" alt="WordPress" className="w-12 h-12 object-contain" />,
    installLink: "#",
  },
  {
    title: "Xero",
    description: "Integrating with Xero allows you to synchronize lomi. transactions and payment processing in your bookkeeping software.",
    link: "#",
    logo: <img src="/integrations/xero.webp" alt="Xero" className="w-12 h-12 object-contain" />,
    installLink: "#",
  },
  {
    title: "Zapier",
    description: "Zapier lets you connect lomi. to other apps and automate powerful workflows.",
    link: "#",
    logo: <img src="/integrations/zapier.webp" alt="Zapier" className="w-12 h-12 object-contain" />,
    installLink: "#",
  },
  {
    title: "WhatsApp",
    description: "Accept payments directly on WhatsApp with our generated storefront pages.",
    link: "#",
    logo: <img src="/integrations/whatsapp.webp" alt="WhatsApp" className="w-12 h-12 object-contain" />,
    installLink: "#",
  },
];