import { Database } from '@/../database.types'

export type Provider = Omit<Database['public']['Tables']['providers']['Row'], 'created_at' | 'updated_at'> & {
  logo: JSX.Element;
  includedPayments?: Array<{ name: string; icon: JSX.Element }>;
  installLink: string;
}


export const integrationOptions = [
  {
    title: "Shopify",
    description: "Integrate lomi.&apos;s checkout experience with your Shopify store for a smooth payment flow.",
    link: "https://developers.lomi.africa/docs/shopify-integration",
    logo: <img src="/shopify.png" alt="Shopify" className="w-12 h-12 object-contain" />,
    installLink: "",
  },
  {
    title: "Next.js",
    description: "Jumpstart your development with our Next.js starter kit, complete with our pre-configured payment stack.",
    link: "https://github.com/lomiafrica/nextjs-starter",
    logo: <img src="/nextjs.png" alt="Next.js" className="w-12 h-12 object-contain" />,
    installLink: "https://github.com/lomiafrica/nextjs-starter",
  },
  {
    title: "WordPress",
    description: "Accept payments on your website with our easy-to-use plugin.",
    link: "https://developers.lomi.africa/docs/wordpress-integration",
    logo: <img src="/wordpress.png" alt="WordPress" className="w-12 h-12 object-contain" />,
    installLink: "",
  },
];