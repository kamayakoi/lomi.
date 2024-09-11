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
    icon: <IconLayoutDashboard size={18} />,
  },
  {
    title: 'Balance',
    href: '/portal/balance',
    icon: <IconCurrencyDollar size={18} />,
  },
  {
    title: 'Transactions',
    href: '/portal/transactions',
    icon: <IconExchange size={18} />,
  },
  {
    title: 'Reporting',
    href: '/portal/reporting',
    icon: <IconChartHistogram size={18} />,
  },
  { type: 'section', title: 'PAYMENTS' },
  {
    title: 'Accept Payments',
    href: '',
    icon: <IconCreditCardPay size={18} />,
    sub: [
      {
        title: 'Credit | Debit Cards',
        href: '/portal/cards',
        icon: <IconCreditCard size={18} />,
      },
      {
        title: 'Fixed Virtual Accounts',
        href: '/portal/virtual-accounts',
        icon: <IconBuildingBank size={18} />,
      },
      {
        title: 'eWallets',
        href: '/portal/e-wallets',
        icon: <IconWallet size={18} />,
      },
    ],
  },
  {
    title: 'Receive Payments',
    href: '',
    icon: <IconLinkPlus size={18} />,
    sub: [
      {
        title: 'Payment Links',
        href: '/portal/payment-links',
        icon: <IconLink size={18} />,
      },
      {
        title: 'Batch Payment Links',
        href: '/portal/batch-payment-links',
        icon: <IconListNumbers size={18} />,
      },
    ],
  },
  {
    title: 'Send Payments',
    href: '',
    icon: <IconSend size={18} />,
    sub: [
      {
        title: 'Payout Links',
        href: '/portal/payout-links',
        icon: <IconLink size={18} />,
      },
      {
        title: 'Batch Disbursements',
        href: '/portal/batch-disbursements',
        icon: <IconListNumbers size={18} />,
      },
    ],
  },
  {
    title: 'Subscriptions',
    href: '/portal/subscription',
    icon: <IconRepeat size={18} />,
  },
  {
    title: 'Customers',
    href: '/portal/customers',
    icon: <IconUsers size={18} />,
  },
  { type: 'section', title: 'DEVELOPERS' },
  {
    title: 'Webhooks',
    href: '/portal/webhooks',
    icon: <IconWebhook size={18} />,
  },
  { type: 'section', title: 'CONFIGURATION' },
  {
    title: 'Integrations',
    href: '/portal/integrations',
    icon: <IconApps size={18} />,
  },
  {
    title: 'Payment Channels',
    href: '/portal/payment-channels',
    icon: <IconRouteAltLeft size={18} />,
  },
  {
    title: 'Activity Logs',
    href: '/portal/logs',
    icon: <IconActivity size={18} />,
  },
  {
    title: 'Settings',
    href: '/portal/settings/profile',
    icon: <IconSettings size={18} />,
  },
]