import { Layout } from '@/components/custom/layout'
import Notifications from '@/components/dashboard/notifications'
import { UserNav } from '@/components/dashboard/user-nav'
import { Button } from '@/components/custom/button'
import { integrationOptions } from './data.tsx'
import { TopNav } from '@/components/dashboard/top-nav'
import { IconPlus } from '@tabler/icons-react'
import { Separator } from '@/components/ui/separator'
import FeedbackForm from '@/components/dashboard/feedback-form.tsx'
import SupportForm from '@/components/dashboard/support-form'

export default function Providers() {
  const topNav = [
    { title: 'Integrations', href: '/portal/integrations', isActive: true },
    { title: 'Settings', href: '/portal/settings/profile', isActive: false },
  ]

  const sortedIntegrations = integrationOptions.sort((a, b) =>
    a.title.localeCompare(b.title)
  )

  const handleInstallClick = (link: string) => {
    window.location.href = link;
  }

  return (
    <Layout fixed>
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
      <SupportForm />

      {/* ===== Content ===== */}
      <Layout.Body className='flex flex-col'>
        <div style={{ marginBottom: '0.5rem' }}>
          <h1 className='text-2xl font-bold tracking-tight' style={{ marginBottom: '0.5rem' }}>
            Integrations
          </h1>
          <p className='text-muted-foreground'>
            Explore our integrations to enhance your payment experience and streamline your business operations.
          </p>
        </div>
        <div className='my-4 flex items-end justify-end sm:my-0 sm:items-center'>
        </div>

        <div className='flex-grow overflow-auto' style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
          <ul className='grid gap-6 pb-16 pt-4 md:grid-cols-2 lg:grid-cols-3'>
            {sortedIntegrations.map((integration, index) => (
              <li
                key={index}
                className='rounded-none border p-6 hover:shadow-md'
              >
                <div className='mb-8 flex items-center justify-between'>
                  <div className='flex size-12 items-center justify-center rounded-lg overflow-hidden bg-black'>
                    <div className="w-full h-full flex items-center justify-center">
                      {integration.logo}
                    </div>
                  </div>
                  <Button
                    variant='outline'
                    size='sm'
                    className='flex items-center px-4 py-2 text-sm font-medium rounded-none'
                    onClick={() => handleInstallClick(integration.installLink)}
                  >
                    Install
                  </Button>
                </div>
                <div>
                  <h2 className='mb-2 text-lg font-semibold'>{integration.title}</h2>
                  <p className='text-gray-500' dangerouslySetInnerHTML={{ __html: integration.description }}></p>
                  {integration.link && (
                    <a href={integration.link} className='text-blue-600 dark:text-blue-400 font-semibold mt-4 flex items-center'>
                      <span>Learn more</span>
                    </a>
                  )}
                </div>
              </li>
            ))}

            {/* More Integrations Card - Spans 2 columns */}
            <li className="rounded-none border p-6 relative overflow-hidden hover:shadow-md md:col-span-2 lg:col-span-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200 dark:bg-amber-700 rounded-full -mr-16 -mt-16 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-200 dark:bg-emerald-700 rounded-full -ml-12 -mb-12 opacity-50"></div>
              <div className="relative z-10">
                <h2 className='text-lg font-semibold mb-4'>More integrations — coming soon!</h2>
                <p className="text-gray-500 mb-6">
                  We&apos;re constantly working on new ways to help you get started very quickly with our solutions. If there&apos;s an integration you need, let us know.
                </p>
                <a
                  href="mailto:hello@lomi.africa?subject=Integration Request"
                  className="bg-amber-500 text-white px-4 py-2 rounded-none inline-flex items-center transition-transform transform hover:scale-105 hover:shadow-lg"
                >
                  <IconPlus className="mr-2 h-4 w-4" />
                  Request an integration
                </a>
              </div>
            </li>
          </ul>
        </div>
      </Layout.Body>
    </Layout>
  )
}