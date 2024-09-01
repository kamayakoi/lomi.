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
  IconCashBanknote,
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
    href: '/portal/tasks',
    icon: <IconCurrencyDollar size={18} />,
  },
  {
    title: 'Transactions',
    href: '/portal/chats',
    icon: <IconExchange size={18} />,
  },
  {
    title: 'Reporting',
    href: '',
    icon: <IconChartHistogram size={18} />,
  },
  { type: 'section', title: 'PAYMENTS' },
  {
    title: 'Accept Payments',
    href: '/portal/users',
    icon: <IconCreditCardPay size={18} />,
    sub: [
      {
        title: 'Credit | Debit Cards',
        href: '/sign-in-2',
        icon: <IconCreditCard size={18} />,
      },
      {
        title: 'Fixed Virtual Accounts',
        href: '/sign-in-2',
        icon: <IconBuildingBank size={18} />,
      },
      {
        title: 'eWallets',
        href: '/sign-up',
        icon: <IconWallet size={18} />,
      },
    ],
  },
  {
    title: 'Payment Links',
    href: '/portal/requests',
    icon: <IconLinkPlus size={18} />,
    sub: [
      {
        title: 'Payment Links',
        href: '/sign-in',
        icon: <IconLink size={18} />,
      },
      {
        title: 'Batch Payment Links',
        href: '/sign-in-2',
        icon: <IconListNumbers size={18} />,
      },
    ],
  },
  {
    title: 'Subscriptions',
    href: '/portal/analysis',
    icon: <IconRepeat size={18} />,
  },
  {
    title: 'Send Payments',
    href: '/portal/extra-components',
    icon: <IconSend size={18} />,
    sub: [
      {
        title: 'Payout Links',
        href: '/sign-in-2',
        icon: <IconCashBanknote size={18} />,
      },
      {
        title: 'Batch Disbursements',
        href: '/sign-in',
        icon: <IconListNumbers size={18} />,
      },
    ],
  },
  {
    title: 'Customers',
    href: '',
    icon: <IconUsers size={18} />,
  },
  { type: 'section', title: 'DEVELOPERS' },
  {
    title: 'Webhooks',
    href: '/portal/settings',
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
    href: '/portal/activity-logs',
    icon: <IconActivity size={18} />,
  },
  {
    title: 'Settings',
    href: '/portal/settings',
    icon: <IconSettings size={18} />,
  },
]