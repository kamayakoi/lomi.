import { Outlet, Navigate, useParams } from 'react-router-dom'
import {
  IconBriefcase,
  IconCreditCard,
  IconReceipt,
  IconCode,
  IconWallet,
  IconMenu2,
} from '@tabler/icons-react'
import { Layout } from '@/components/custom/layout'
import { Separator } from '@/components/ui/separator'
import Notifications from '@/components/portal/notifications'
import { UserNav } from '@/components/portal/user-nav'
import SupportForm from '@/components/portal/support-form'
import FeedbackForm from '@/components/portal/feedback-form'
import SidebarNav from '@/components/portal/settings-sidebar-nav'
import { TopNav } from '@/components/portal/top-nav'
import { withActivationCheck } from '@/components/custom/with-activation-check'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Settings() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const { organizationId } = useParams()

  const topNav = [
    { title: 'Settings', href: `/${organizationId}/settings`, isActive: true },
    { title: 'Documentation', href: 'https://developers.lomi.africa', isActive: false },
  ]

  const sidebarNavItems = [
    {
      title: 'Business and Profile',
      icon: <IconBriefcase size={18} className="text-gray-500" />,
      href: `/${organizationId}/settings/profile`,
      subItems: [
        { title: 'Profile', href: `/${organizationId}/settings/profile` },
        { title: 'Business', href: `/${organizationId}/settings/business` }
      ],
      defaultOpen: true,
    },
    {
      title: 'Receiving Money',
      icon: <IconCreditCard size={18} className="text-gray-500" />,
      href: `/${organizationId}/settings/receiving-money/payment-methods`,
      subItems: [
        { title: 'Payment methods', href: `/${organizationId}/settings/receiving-money/payment-methods` },
        { title: 'Checkout options', href: `/${organizationId}/settings/receiving-money/checkout` },
      ],
    },
    {
      title: 'Billing and Fees',
      icon: <IconReceipt size={18} className="text-gray-500" />,
      href: `/${organizationId}/settings/billing/statements`,
      subItems: [
        { title: 'Billing statements', href: `/${organizationId}/settings/billing/statements` },
        { title: 'Fee structure', href: `/${organizationId}/settings/billing/fee-structure` },
      ],
    },
    {
      title: 'Developers',
      icon: <IconCode size={18} className="text-gray-500" />,
      href: `/${organizationId}/settings/developers/api-keys`,
      subItems: [
        { title: 'API keys', href: `/${organizationId}/settings/developers/api-keys` },
      ],
    },
    {
      title: 'Withdrawals',
      icon: <IconWallet size={18} className="text-gray-500" />,
      href: `/${organizationId}/settings/withdrawals/bank-accounts`,
      subItems: [
        { title: 'Bank accounts', href: `/${organizationId}/settings/withdrawals/bank-accounts` },
        { title: 'Email notifications', href: `/${organizationId}/settings/withdrawals/email-notifications` },
      ],
    },
  ]

  return (
    <Layout fixed>
      {/* ===== Top Heading ===== */}
      <Layout.Header>
        <div className='hidden md:block'>
          <TopNav links={topNav} />
        </div>

        <div className='block md:hidden'>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <IconMenu2 className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85%] p-0">
              <div className="h-full flex flex-col">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold">Settings</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage your account settings
                  </p>
                </div>
                <nav className="flex-1 overflow-y-auto">
                  {sidebarNavItems.map((section) => (
                    <div key={section.href} className="border-b last:border-b-0">
                      <div className="flex items-center gap-2 p-4 text-sm font-medium">
                        {section.icon}
                        {section.title}
                      </div>
                      <div className="pb-2">
                        {section.subItems?.map((item) => (
                          <Button
                            key={item.href}
                            variant="ghost"
                            className="w-full justify-start rounded-none h-10 px-6"
                            onClick={() => {
                              navigate(item.href)
                              setIsOpen(false)
                            }}
                          >
                            {item.title}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
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

const SettingsWithActivationCheck = withActivationCheck(Settings);

export default SettingsWithActivationCheck;

export function SettingsIndex() {
  const { organizationId } = useParams()
  return <Navigate to={`/${organizationId}/settings/profile`} replace />;
}
