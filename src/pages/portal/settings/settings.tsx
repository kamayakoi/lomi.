import { Outlet, Navigate } from 'react-router-dom'
import {
  IconBuildingStore,
  IconCreditCard,
  IconReceipt,
  IconCode,
  IconWallet,
} from '@tabler/icons-react'
import { Layout } from '@/components/custom/layout'
import { Separator } from '@/components/ui/separator'
import Notifications from '@/components/dashboard/notifications'
import { UserNav } from '@/components/dashboard/user-nav'
import SidebarNav from '../../../components/dashboard/sidebar-nav'
import { TopNav } from '@/components/dashboard/top-nav'
import { withActivationCheck } from '@/components/custom/withActivationCheck'

function Settings() {
  const topNav = [
    { title: 'Settings', href: '/portal/settings', isActive: true },
    { title: 'Documentation', href: 'https://developers.lomi.africa', isActive: false },
  ]

  return (
    <Layout fixed>
      {/* ===== Top Heading ===== */}
      <Layout.Header>
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-4'>
          <Notifications />
          <UserNav />
        </div>
      </Layout.Header>

      <Separator className='my-0' />

      <Layout.Body className='flex flex-col h-full'>
        <div style={{ marginBottom: '1rem' }}>
          <h1 className='text-2xl font-bold tracking-tight' style={{ marginBottom: '0.5rem' }}>
            Settings
          </h1>
          <p className='text-muted-foreground'>
            Configure your account, set up payments and payouts, and customize your experience.
          </p>
        </div>
        <Separator className='my-4 lg:my-6' />
        <div className='flex flex-1 flex-col space-y-8 md:space-y-2 md:overflow-hidden lg:flex-row lg:space-x-8 lg:space-y-0'>
          <aside className='top-0 lg:sticky lg:w-1/4 h-full overflow-y-auto'>
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className='flex-1 lg:max-w-3xl p-1 pr-4 md:overflow-y-auto'>
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
    href: '/portal/settings/profile',
    subItems: [
      { title: 'Profile', href: '/portal/settings/profile' },
      { title: 'Business', href: '/portal/settings/business' }
    ],
    defaultOpen: true,
  },
  {
    title: 'Receiving Money',
    icon: <IconCreditCard size={18} />,
    href: '/portal/settings/receiving-money/payment-methods',
    subItems: [
      { title: 'Payment Methods', href: '/portal/settings/receiving-money/payment-methods' },
      { title: 'Checkout', href: '/portal/settings/receiving-money/checkout' },
    ],
  },
  // {
  //   title: 'Sending Money',
  //   icon: <IconSend size={18} />,
  //   href: '/portal/settings/sending-money/disbursements',
  //   subItems: [
  //     { title: 'Disbursements', href: '/portal/settings/sending-money/disbursements' },
  //     { title: 'Notifications', href: '/portal/settings/sending-money/notifications' },
  //   ],
  // },
  // {
  //   title: 'Your Team',
  //   icon: <IconUsers size={18} />,
  //   href: 'portal/settings/team/members',
  //   subItems: [
  //     { title: 'Members', href: '/portal/settings/team/members' },
  //     { title: 'Email Recipients', href: '/portal/settings/team/email-recipients' },
  //   ],
  // },
  {
    title: 'Billing and Fees',
    icon: <IconReceipt size={18} />,
    href: '/portal/settings/billing/statements',
    subItems: [
      { title: 'Billing', href: '/portal/settings/billing/statements' },
      { title: 'Fee Structure', href: '/portal/settings/billing/fee-structure' },
    ],
  },
  {
    title: 'Developers',
    icon: <IconCode size={18} />,
    href: '/portal/settings/developers/api-keys',
    subItems: [
      { title: 'API Keys', href: '/portal/settings/developers/api-keys' },
      { title: 'Webhooks', href: '/portal/settings/developers/webhooks' },
      { title: 'IP Allowlist', href: '/portal/settings/developers/ip-allowlist' },
    ],
  },
  {
    title: 'Withdrawals',
    icon: <IconWallet size={18} />,
    href: '/portal/settings/withdrawals/bank-accounts',
    subItems: [
      { title: 'Bank Accounts', href: '/portal/settings/withdrawals/bank-accounts' },
      { title: 'Phone numbers', href: '/portal/settings/withdrawals/phone-numbers' },
      { title: 'Notifications', href: '/portal/settings/withdrawals/email-notifications' },
      { title: 'Automated Payouts', href: '/portal/settings/withdrawals/auto-withdrawal' },
    ],
  },
]

const SettingsWithActivationCheck = withActivationCheck(Settings);

export default SettingsWithActivationCheck;

export function SettingsIndex() {
  return <Navigate to="/portal/settings/profile" replace />;
}
