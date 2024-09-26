import {
  IconApps,
  IconActivity,
  IconChartHistogram,
  IconRouteAltLeft,
  IconLayoutDashboard,
  IconSettings,
  IconUsers,
  IconRepeat,
  IconWebhook,
  IconCreditCardPay,
  IconCreditCard,
  IconLink,
  IconListNumbers,
  IconCurrencyDollar,
  IconExchange,
  IconLinkPlus,
  IconBuildingBank,
  IconWallet,
  IconSend,
} from '@tabler/icons-react'

export interface NavLink {
  title: string
  href: string
  icon: JSX.Element
  label?: string
}

export interface SubNavLink extends NavLink {
  subSub?: NavLink[]
}

export interface SideLink extends NavLink {
  sub?: SubNavLink[]
}

export interface SectionTitle {
  type: 'section'
  title: string
}

export type SidebarItem = SideLink | SectionTitle

export const sidelinks: SidebarItem[] = [
  { type: 'section', title: 'MAIN MENU' },
  {
    title: 'Home',
    href: '/portal',
    icon: <IconLayoutDashboard className="text-blue-500" size={18} />,
  },
  {
    title: 'Balance',
    href: '/portal/balance',
    icon: <IconCurrencyDollar className="text-green-500" size={18} />,
  },
  {
    title: 'Transactions',
    href: '/portal/transactions',
    icon: <IconExchange className="text-purple-500" size={18} />,
  },
  {
    title: 'Reporting',
    href: '/portal/reporting',
    icon: <IconChartHistogram className="text-yellow-500" size={18} />,
  },
  { type: 'section', title: 'PAYMENTS' },
  {
    title: 'Accept Payments',
    href: '',
    icon: <IconCreditCardPay className="text-pink-500" size={18} />,
    sub: [
      {
        title: 'Credit | Debit Cards',
        href: '/portal/cards',
        icon: <IconCreditCard className="text-red-400" size={18} />,
      },
      {
        title: 'Fixed Virtual Accounts',
        href: '/portal/virtual-accounts',
        icon: <IconBuildingBank className="text-blue-400" size={18} />,
      },
      {
        title: 'eWallets',
        href: '/portal/e-wallets',
        icon: <IconWallet className="text-green-400" size={18} />,
      },
    ],
  },
  {
    title: 'Receive Payments',
    href: '',
    icon: <IconLinkPlus className="text-indigo-500" size={18} />,
    sub: [
      {
        title: 'Payment Links',
        href: '/portal/payment-links',
        icon: <IconLink className="text-indigo-400" size={18} />,
      },
      {
        title: 'Batch Payment Links',
        href: '/portal/batch-payment-links',
        icon: <IconListNumbers className="text-purple-400" size={18} />,
      },
    ],
  },
  {
    title: 'Send Payments',
    href: '',
    icon: <IconSend className="text-orange-500" size={18} />,
    sub: [
      {
        title: 'Payout Links',
        href: '/portal/payout-links',
        icon: <IconLink className="text-orange-400" size={18} />,
      },
      {
        title: 'Batch Disbursements',
        href: '/portal/batch-disbursements',
        icon: <IconListNumbers className="text-red-400" size={18} />,
      },
    ],
  },
  {
    title: 'Subscriptions',
    href: '/portal/subscription',
    icon: <IconRepeat className="text-teal-500" size={18} />,
  },
  {
    title: 'Customers',
    href: '/portal/customers',
    icon: <IconUsers className="text-cyan-500" size={18} />,
  },
  { type: 'section', title: 'DEVELOPERS' },
  {
    title: 'Webhooks',
    href: '/portal/webhooks',
    icon: <IconWebhook className="text-rose-500" size={18} />,
  },
  { type: 'section', title: 'CONFIGURATION' },
  {
    title: 'Integrations',
    href: '/portal/integrations',
    icon: <IconApps className="text-fuchsia-500" size={18} />,
  },
  {
    title: 'Payment Channels',
    href: '/portal/payment-channels',
    icon: <IconRouteAltLeft className="text-emerald-500" size={18} />,
  },
  {
    title: 'Activity Logs',
    href: '/portal/logs',
    icon: <IconActivity className="text-amber-500" size={18} />,
  },
  {
    title: 'Settings',
    href: '/portal/settings/profile',
    icon: <IconSettings className="text-gray-500" size={18} />,
  },
]