import { Outlet, Navigate } from 'react-router-dom'
import {
  IconBriefcase,
  IconCreditCard,
  IconReceipt,
  IconCode,
  IconWallet,
} from '@tabler/icons-react'
import { Layout } from '@/components/custom/layout'
import { Separator } from '@/components/ui/separator'
import Notifications from '@/components/dashboard/notifications'
import { UserNav } from '@/components/dashboard/user-nav'
import SupportForm from '@/components/dashboard/support-form'
import FeedbackForm from '@/components/dashboard/feedback-form'
import SidebarNav from '@/components/dashboard/sidebar-nav'
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
        <div className='hidden md:block'>
          <TopNav links={topNav} />
        </div>

        <div className='block md:hidden'>
          <FeedbackForm />
        </div>

        <div className='ml-auto flex items-center space-x-4'>
          <div className='hidden md:block'>
            <FeedbackForm />
          </div>
          <Notifications />
          <UserNav />
        </div>
      </Layout.Header>

      <Separator className='my-0' />

      <Layout.Body className='flex flex-col h-full'>
        <div className='mb-4'>
          <h1 className='text-2xl font-bold tracking-tight mb-2'>
            Settings
          </h1>
          <p className='text-muted-foreground'>
            Configure your account, set up payments and payouts, and customize your experience.
          </p>
        </div>

        <Separator className='my-4' />
        <div className='flex flex-1 flex-col lg:flex-row lg:gap-8 min-h-0'>
          <aside className='lg:w-1/4 lg:border-r overflow-y-auto'>
            <nav className='grid gap-1 p-1'>
              <div className='lg:hidden'>
                <select
                  className='w-full p-2 mb-4 border rounded-none bg-background focus:ring-0 focus:outline-none hover:bg-background'
                  onChange={(e) => {
                    const selectedHref = e.target.value;
                    window.location.href = selectedHref;
                  }}
                >
                  {sidebarNavItems.map((section) => (
                    <>
                      <option value={section.href} key={section.title}>
                        {section.title}
                      </option>
                      {section.subItems?.map((subItem) => (
                        <option value={subItem.href} key={subItem.href}>
                          &nbsp;&nbsp;{subItem.title}
                        </option>
                      ))}
                    </>
                  ))}
                </select>
              </div>
              <div className='hidden lg:block'>
                <SidebarNav items={sidebarNavItems} />
              </div>
            </nav>
          </aside>
          <div className='flex-1 lg:max-w-3xl p-1 overflow-y-auto'>
            <Outlet />
          </div>
        </div>
        <SupportForm />
      </Layout.Body>
    </Layout>
  )
}

const sidebarNavItems = [
  {
    title: 'Business and Profile',
    icon: <IconBriefcase size={18} className="text-gray-500" />,
    href: '/portal/settings/profile',
    subItems: [
      { title: 'Profile', href: '/portal/settings/profile' },
      { title: 'Business', href: '/portal/settings/business' }
    ],
    defaultOpen: true,
  },
  {
    title: 'Receiving Money',
    icon: <IconCreditCard size={18} className="text-gray-500" />,
    href: '/portal/settings/receiving-money/payment-methods',
    subItems: [
      { title: 'Payment methods', href: '/portal/settings/receiving-money/payment-methods' },
      { title: 'Checkout options', href: '/portal/settings/receiving-money/checkout' },
    ],
  },
  {
    title: 'Billing and Fees',
    icon: <IconReceipt size={18} className="text-gray-500" />,
    href: '/portal/settings/billing/statements',
    subItems: [
      { title: 'Billing statements', href: '/portal/settings/billing/statements' },
      { title: 'Fee structure', href: '/portal/settings/billing/fee-structure' },
    ],
  },
  {
    title: 'Developers',
    icon: <IconCode size={18} className="text-gray-500" />,
    href: '/portal/settings/developers/api-keys',
    subItems: [
      { title: 'API keys', href: '/portal/settings/developers/api-keys' },
    ],
  },
  {
    title: 'Withdrawals',
    icon: <IconWallet size={18} className="text-gray-500" />,
    href: '/portal/settings/withdrawals/bank-accounts',
    subItems: [
      { title: 'Bank accounts', href: '/portal/settings/withdrawals/bank-accounts' },
      { title: 'Email notifications', href: '/portal/settings/withdrawals/email-notifications' },
    ],
  },
]

const SettingsWithActivationCheck = withActivationCheck(Settings);

export default SettingsWithActivationCheck;

export function SettingsIndex() {
  return <Navigate to="/portal/settings/profile" replace />;
}
