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
import { useParams } from 'react-router-dom'

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
  const { organizationId } = useParams()

  return [
    {
      title: t('sidebar.links.activation'),
      href: `/${organizationId}/activation`,
      icon: <IconFlag className="text-red-500" size={18} />,
      condition: 'isActivationRequired',
    },
    { type: 'section', title: t('sidebar.sections.main_menu') },
    {
      title: t('sidebar.links.home'),
      href: `/${organizationId}`,
      icon: <IconLayoutDashboard className="text-blue-600" size={18} />,
    },
    {
      title: t('sidebar.links.balance'),
      href: `/${organizationId}/balance`,
      icon: <IconCurrencyDollar className="text-green-500" size={18} />,
    },
    {
      title: t('sidebar.links.transactions'),
      href: `/${organizationId}/transactions`,
      icon: <IconExchange className="text-purple-500" size={18} />,
    },
    {
      title: t('sidebar.links.reporting'),
      href: `/${organizationId}/reporting`,
      icon: <IconChartHistogram className="text-yellow-500" size={18} />,
    },
    { type: 'section', title: t('sidebar.sections.payments') },
    {
      title: t('sidebar.links.payment_links'),
      href: `/${organizationId}/payment-links`,
      icon: <IconLinkPlus className="text-indigo-500" size={18} />,
    },
    {
      title: t('sidebar.links.storefront'),
      href: `/${organizationId}/storefront`,
      icon: <IconBuildingStore className="text-orange-500" size={18} />,
    },
    {
      title: t('sidebar.links.products'),
      href: `/${organizationId}/product`,
      icon: <IconPackage className="text-blue-400" size={18} />,
    },
    {
      title: t('sidebar.links.subscriptions'),
      href: `/${organizationId}/subscription`,
      icon: <IconRepeat className="text-teal-500" size={18} />,
    },
    {
      title: t('sidebar.links.customers'),
      href: `/${organizationId}/customers`,
      icon: <IconUsers className="text-cyan-500" size={18} />,
    },
    { type: 'section', title: t('sidebar.sections.developers') },
    {
      title: t('sidebar.links.webhooks'),
      href: `/${organizationId}/webhooks`,
      icon: <IconWebhook className="text-rose-500" size={18} />,
    },
    { type: 'section', title: t('sidebar.sections.configuration') },
    {
      title: t('sidebar.links.integrations'),
      href: `/${organizationId}/integrations`,
      icon: <IconApps className="text-fuchsia-500" size={18} />,
    },
    {
      title: t('sidebar.links.payment_channels'),
      href: `/${organizationId}/payment-channels`,
      icon: <IconRouteAltLeft className="text-emerald-500" size={18} />,
    },
    {
      title: t('sidebar.links.activity_logs'),
      href: `/${organizationId}/logs`,
      icon: <IconActivity className="text-amber-500" size={18} />,
    },
    {
      title: t('sidebar.links.settings'),
      href: `/${organizationId}/settings/profile`,
      icon: <IconSettings className="text-gray-500" size={18} />,
    },
  ]
}