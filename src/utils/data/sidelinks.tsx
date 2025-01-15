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
  IconCurrencyDollar,
  IconExchange,
  IconLinkPlus,
  IconPackage,
  IconFlag,
  IconBuildingStore
} from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

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
  sub?: SubNavLink[];
  condition?: string;
}

export interface SectionTitle {
  type: 'section'
  title: string
}

export type SidebarItem = SideLink | SectionTitle

export function useSidelinks(): SidebarItem[] {
  const { t } = useTranslation()

  return [
    {
      title: t('sidebar.links.activation'),
      href: '/portal/activation',
      icon: <IconFlag className="text-red-500" size={18} />,
      condition: 'isActivationRequired',
    },
    { type: 'section', title: t('sidebar.sections.main_menu') },
    {
      title: t('sidebar.links.home'),
      href: '/portal',
      icon: <IconLayoutDashboard className="text-blue-600" size={18} />,
    },
    {
      title: t('sidebar.links.balance'),
      href: '/portal/balance',
      icon: <IconCurrencyDollar className="text-green-500" size={18} />,
    },
    {
      title: t('sidebar.links.transactions'),
      href: '/portal/transactions',
      icon: <IconExchange className="text-purple-500" size={18} />,
    },
    {
      title: t('sidebar.links.reporting'),
      href: '/portal/reporting',
      icon: <IconChartHistogram className="text-yellow-500" size={18} />,
    },
    { type: 'section', title: t('sidebar.sections.payments') },
    {
      title: t('sidebar.links.payment_links'),
      href: '/portal/payment-links',
      icon: <IconLinkPlus className="text-indigo-500" size={18} />,
    },
    {
      title: t('sidebar.links.storefront'),
      href: '/portal/storefront',
      icon: <IconBuildingStore className="text-orange-500" size={18} />,
    },
    {
      title: t('sidebar.links.products'),
      href: '/portal/product',
      icon: <IconPackage className="text-blue-400" size={18} />,
    },
    {
      title: t('sidebar.links.subscriptions'),
      href: '/portal/subscription',
      icon: <IconRepeat className="text-teal-500" size={18} />,
    },
    {
      title: t('sidebar.links.customers'),
      href: '/portal/customers',
      icon: <IconUsers className="text-cyan-500" size={18} />,
    },
    { type: 'section', title: t('sidebar.sections.developers') },
    {
      title: t('sidebar.links.webhooks'),
      href: '/portal/webhooks',
      icon: <IconWebhook className="text-rose-500" size={18} />,
    },
    { type: 'section', title: t('sidebar.sections.configuration') },
    {
      title: t('sidebar.links.integrations'),
      href: '/portal/integrations',
      icon: <IconApps className="text-fuchsia-500" size={18} />,
    },
    {
      title: t('sidebar.links.payment_channels'),
      href: '/portal/payment-channels',
      icon: <IconRouteAltLeft className="text-emerald-500" size={18} />,
    },
    {
      title: t('sidebar.links.activity_logs'),
      href: '/portal/logs',
      icon: <IconActivity className="text-amber-500" size={18} />,
    },
    {
      title: t('sidebar.links.settings'),
      href: '/portal/settings/profile',
      icon: <IconSettings className="text-gray-500" size={18} />,
    },
  ]
}