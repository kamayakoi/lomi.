import { Layout } from '@/components/custom/layout'
import Notifications from '@/components/portal/notifications'
import { UserNav } from '@/components/portal/user-nav'
import { Button } from '@/components/custom/button'
import { integrationOptions } from './components/data'
import { TopNav } from '@/components/portal/top-nav'
import { IconPlus } from '@tabler/icons-react'
import { Separator } from '@/components/ui/separator'
import FeedbackForm from '@/components/portal/feedback-form'
import SupportForm from '@/components/portal/support-form'
import { useParams } from 'react-router-dom'
import { useState, useEffect, useContext, useCallback } from 'react'
import { toast } from '@/lib/hooks/use-toast'
import { OrganizationContext } from '@/lib/contexts/organization-context'
import { supabase } from '@/utils/supabase/client'
import { type CustomerNotifications } from '@/lib/types/checkout-settings'

// Define a helper interface for the notifications setting value
interface NotificationSetting {
  email: boolean;
  whatsapp: boolean;
}

export default function Providers() {
  const { organizationId } = useParams()
  const { organizationId: contextOrgId } = useContext(OrganizationContext)
  const [whatsAppStatus, setWhatsAppStatus] = useState<'install' | 'installed' | 'loading'>('install')
  const [customerNotifications, setCustomerNotifications] = useState<CustomerNotifications | null>(null)

  const topNav = [
    { title: 'Integrations', href: `/portal/${organizationId}/integrations`, isActive: true },
    { title: 'Settings', href: `/portal/${organizationId}/settings/profile`, isActive: false },
  ]

  // Function to fetch notification settings
  const fetchNotificationSettings = useCallback(async () => {
    if (!organizationId && !contextOrgId) return

    console.log('Fetching notification settings for organization:', organizationId || contextOrgId)

    try {
      const { data, error } = await supabase.rpc('fetch_organization_checkout_settings', {
        p_organization_id: organizationId || contextOrgId
      })

      if (error) throw error

      console.log('Received settings data:', data)

      const settings = data?.[0]
      if (settings?.customer_notifications) {
        setCustomerNotifications(settings.customer_notifications as CustomerNotifications)

        // Check if WhatsApp is installed (all WhatsApp notifications are true)
        const notificationValues = Object.values(settings.customer_notifications) as { email: boolean; whatsapp: boolean }[]
        const isWhatsAppInstalled = notificationValues.every(
          (notif) => notif.whatsapp === true
        )

        console.log('WhatsApp installed status:', isWhatsAppInstalled)
        setWhatsAppStatus(isWhatsAppInstalled ? 'installed' : 'install')
      }
    } catch (error) {
      console.error('Error fetching notification settings:', error)
    }
  }, [organizationId, contextOrgId])

  // Function to update WhatsApp notification settings
  const updateWhatsAppSettings = async (enable: boolean) => {
    if (!organizationId && !contextOrgId || !customerNotifications) {
      console.error('Cannot update WhatsApp settings: missing organization ID or customer notifications data')
      return
    }

    console.log('Updating WhatsApp settings:', enable ? 'enable' : 'disable')
    setWhatsAppStatus('loading')

    try {
      // Create updated notifications with all WhatsApp flags set to the desired value
      const updatedNotifications = { ...customerNotifications } as CustomerNotifications

      Object.keys(updatedNotifications).forEach(key => {
        const typedKey = key as keyof CustomerNotifications
        if (updatedNotifications[typedKey]) {
          (updatedNotifications[typedKey] as NotificationSetting).whatsapp = enable
        }
      })

      console.log('Sending updated notifications:', updatedNotifications)

      // Update settings in the database
      const { error } = await supabase.rpc('update_organization_checkout_settings', {
        p_organization_id: organizationId || contextOrgId,
        p_settings: {
          customer_notifications: updatedNotifications
        }
      })

      if (error) throw error

      // Update local state
      setCustomerNotifications(updatedNotifications)
      setWhatsAppStatus(enable ? 'installed' : 'install')

      toast({
        title: enable ? "WhatsApp Integration Installed" : "WhatsApp Integration Removed",
        description: enable
          ? "WhatsApp notifications have been enabled for all notification types."
          : "WhatsApp notifications have been disabled.",
      })
    } catch (error) {
      console.error('Error updating WhatsApp settings:', error)
      setWhatsAppStatus(enable ? 'install' : 'installed')
      toast({
        title: "Error",
        description: `Failed to ${enable ? 'install' : 'uninstall'} WhatsApp integration`,
        variant: "destructive",
      })
    }
  }

  // Load settings on component mount
  useEffect(() => {
    fetchNotificationSettings()
  }, [fetchNotificationSettings])

  const sortedIntegrations = integrationOptions.sort((a, b) =>
    a.title.localeCompare(b.title)
  )

  const handleInstallClick = (title: string, link: string) => {
    console.log(`Clicked on ${title} integration`)
    if (title === 'WhatsApp') {
      if (whatsAppStatus === 'installed') {
        // Uninstall WhatsApp
        updateWhatsAppSettings(false)
      } else {
        // Install WhatsApp
        updateWhatsAppSettings(true)
      }
    } else {
      // Handle other integrations
      window.location.href = link;
    }
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
                    variant={integration.title === 'WhatsApp' && whatsAppStatus === 'installed' ? 'default' : 'outline'}
                    size='sm'
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-none ${integration.title === 'WhatsApp' && whatsAppStatus === 'installed'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : ''
                      }`}
                    onClick={() => integration.status !== 'coming_soon' && handleInstallClick(integration.title, integration.installLink)}
                    disabled={integration.status === 'coming_soon' || (integration.title === 'WhatsApp' && whatsAppStatus === 'loading')}
                  >
                    {integration.status === 'coming_soon'
                      ? 'Coming Soon'
                      : integration.title === 'WhatsApp'
                        ? whatsAppStatus === 'loading'
                          ? 'Loading...'
                          : whatsAppStatus === 'installed'
                            ? 'Installed!'
                            : 'Install'
                        : 'Install'}
                  </Button>
                </div>
                <div>
                  <h2 className='mb-2 text-lg font-semibold'>{integration.title}</h2>
                  <p className='text-gray-500' dangerouslySetInnerHTML={{ __html: integration.description }}></p>
                  {integration.link && (
                    <a
                      href={integration.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className='text-blue-600 dark:text-blue-400 font-semibold mt-4 flex items-center'
                    >
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
                  href="https://github.com/lomiafrica/lomi./issues/new?labels=enhancement"
                  target="_blank"
                  rel="noopener noreferrer"
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