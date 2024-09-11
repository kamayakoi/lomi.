import { Outlet, Navigate } from 'react-router-dom'
import {
  IconBuildingStore,
  IconCreditCard,
  IconSend,
  IconUsers,
  IconReceipt,
  IconCode,
  IconWallet,
} from '@tabler/icons-react'
import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/dashboard/search'
import { Separator } from '@/components/ui/separator'
import ThemeSwitch from '@/components/dashboard/theme-switch'
import { UserNav } from '@/components/dashboard/user-nav'
import SidebarNav from './components/sidebar-nav'

export default function Settings() {
  return (
    <Layout fixed>
      {/* ===== Top Heading ===== */}
      <Layout.Header>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      <Layout.Body className='flex flex-col h-full'>
        <div className='space-y-0.5'>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
            Settings
          </h1>
          <p className='text-muted-foreground'>
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Separator className='my-4 lg:my-6' />
        <div className='flex flex-1 flex-col space-y-8 md:space-y-2 md:overflow-hidden lg:flex-row lg:space-x-12 lg:space-y-0'>
          <aside className='top-0 lg:sticky lg:w-1/5 h-full overflow-y-auto'>
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className='flex w-full p-1 pr-4 md:overflow-y-auto'>
            <Outlet />
          </div>
        </div>
      </Layout.Body>
    </Layout>
  )
}

const sidebarNavItems = [
  {
    title: 'Business and Profile',
    icon: <IconBuildingStore size={18} />,
    href: '/portal/settings',
    subItems: [
      { title: 'Profile', href: '/portal/settings/profile' },
      { title: 'Business', href: '/portal/settings/business' }
    ],
    defaultOpen: true,
  },
  {
    title: 'Receiving Money',
    icon: <IconCreditCard size={18} />,
    href: '/settings/receiving-money',
    subItems: [
      { title: 'Payment Methods', href: '/portal/settings/receiving-money/payment-methods' },
      { title: 'Checkout', href: '/portal/settings/receiving-money/checkout' },
    ],
  },
  {
    title: 'Sending Money',
    icon: <IconSend size={18} />,
    href: '/settings/sending-money',
    subItems: [
      { title: 'Disbursements', href: '/portal/settings/sending-money/disbursements' },
      { title: 'Notifications', href: '/portal/settings/sending-money/notifications' },
    ],
  },
  {
    title: 'Your Team',
    icon: <IconUsers size={18} />,
    href: '/settings/team',
    subItems: [
      { title: 'Your Team', href: '/portal/settings/team/members' },
      { title: 'Email Recipients', href: '/portal/settings/team/email-recipients' },
    ],
  },
  {
    title: 'Billing and Fees',
    icon: <IconReceipt size={18} />,
    href: '/settings/billing',
    subItems: [
      { title: 'Billing', href: '/portal/settings/billing/statements' },
      { title: 'Fee Structure', href: '/portal/settings/billing/fee-structure' },
    ],
  },
  {
    title: 'Developers',
    icon: <IconCode size={18} />,
    href: '/settings/developers',
    subItems: [
      { title: 'API Keys', href: '/portal/settings/developers/api-keys' },
      { title: 'Webhooks', href: '/portal/settings/developers/webhooks' },
      { title: 'IP Allowlist', href: '/portal/settings/developers/ip-allowlist' },
    ],
  },
  {
    title: 'Withdrawals',
    icon: <IconWallet size={18} />,
    href: '/settings/withdrawals',
    subItems: [
      { title: 'Bank Accounts', href: '/portal/settings/withdrawals/bank-accounts' },
      { title: 'Phone numbers', href: '/portal/settings/withdrawals/phone-numbers' },
      { title: 'Notifications', href: '/portal/settings/withdrawals/email-notifications' },
      { title: 'Auto Withdrawal', href: '/portal/settings/withdrawals/auto-withdrawal' },
    ],
  },
]

// Add this at the end of the file
export function SettingsIndex() {
  return <Navigate to="/portal/settings/profile" replace />;
}
