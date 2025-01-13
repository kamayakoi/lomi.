import { useState, useEffect } from 'react'
import {
  IconPlus,
} from '@tabler/icons-react'
import { Layout } from '@/components/custom/layout'
import { Separator } from '@/components/ui/separator'
import Notifications from '@/components/portal/notifications'
import { UserNav } from '@/components/portal/user-nav'
import { Button } from '@/components/custom/button'
import { providers, type Provider } from './data'
import { supabase } from '@/utils/supabase/client'
import { Database } from '@/../database.types'
import { TopNav } from '@/components/portal/top-nav'
import { useUser } from '@/lib/hooks/useUser'
import { useSidebarData } from '@/lib/hooks/useSidebarData'
import { motion, AnimatePresence } from 'framer-motion'
import Loader from '@/components/portal/loader'
import FeedbackForm from '@/components/portal/feedback-form'
import SupportForm from '@/components/portal/support-form'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import PhoneNumberInput from '@/components/ui/phone-number-input'

export default function PaymentChannels() {
  const [showMessage, setShowMessage] = useState<Record<string, boolean>>({})
  const [disconnectingProvider, setDisconnectingProvider] = useState<string | null>(null)
  const [disconnectDialogOpen, setDisconnectDialogOpen] = useState(false)
  const [phoneDialogOpen, setPhoneDialogOpen] = useState(false)
  const [connectingProvider, setConnectingProvider] = useState<string | null>(null)
  const [phoneNumber, setPhoneNumber] = useState("")
  const { user, isLoading: isUserLoading } = useUser()
  const { sidebarData, isLoading: isSidebarLoading } = useSidebarData()
  const [organizationProviders, setOrganizationProviders] = useState<Pick<Database['public']['Tables']['organization_providers_settings']['Row'], 'provider_code' | 'is_connected'>[]>([])

  const topNav = [
    { title: 'Payment Channels', href: '/portal/payment-channels', isActive: true },
    { title: 'Settings', href: '/portal/settings/profile', isActive: false },
  ]

  useEffect(() => {
    if (user?.id && sidebarData?.organization_id) {
      fetchOrganizationProviders(sidebarData.organization_id)
    }
  }, [user?.id, sidebarData?.organization_id])

  const fetchOrganizationProviders = async (organizationId: string) => {
    const { data, error } = await supabase
      .rpc('fetch_organization_providers_settings', { p_organization_id: organizationId })

    if (error) {
      console.error('Error fetching organization providers:', error)
    } else {
      setOrganizationProviders(data || [])
    }
  }

  const updateProviderConnection = async (providerCode: string, isConnected: boolean) => {
    if (!isConnected) {
      setDisconnectingProvider(providerCode)
      return
    }

    const provider = providers.find(p => p.provider_code === providerCode) as Provider
    if (provider && (provider.type === 'Mobile Money' || provider.type === 'E-Wallet')) {
      setConnectingProvider(providerCode)
      setPhoneDialogOpen(true)
      return
    }

    await connectProvider(providerCode)
  }

  const connectProvider = async (providerCode: string) => {
    if (sidebarData?.organization_id) {
      const { error } = await supabase
        .rpc('update_organization_provider_connection', {
          p_organization_id: sidebarData.organization_id,
          p_provider_code: providerCode,
          p_is_connected: true,
        })

      if (error) {
        console.error('Error updating provider connection:', error)
      } else {
        fetchOrganizationProviders(sidebarData.organization_id)
        setShowMessage((prevState) => ({
          ...prevState,
          [providerCode]: true,
        }))
      }
    }
  }

  const handlePhoneSubmit = async () => {
    if (!connectingProvider || !sidebarData?.organization_id || !phoneNumber) return

    // First update the phone number
    const { error: phoneError } = await supabase
      .rpc('update_organization_provider_phone', {
        p_organization_id: sidebarData.organization_id,
        p_provider_code: connectingProvider,
        p_phone_number: phoneNumber,
        p_is_phone_verified: false // Initially set as unverified
      })

    if (phoneError) {
      console.error('Error updating provider phone:', phoneError)
      return
    }

    // Then connect the provider
    await connectProvider(connectingProvider)

    // Close dialog and reset states
    setPhoneDialogOpen(false)
    setConnectingProvider(null)
    setPhoneNumber("")
  }

  const confirmDisconnect = async () => {
    if (disconnectingProvider && sidebarData?.organization_id) {
      const { error } = await supabase
        .rpc('update_organization_provider_connection', {
          p_organization_id: sidebarData.organization_id,
          p_provider_code: disconnectingProvider,
          p_is_connected: false,
        })

      if (error) {
        console.error('Error disconnecting provider:', error)
      } else {
        fetchOrganizationProviders(sidebarData.organization_id)
      }
      setDisconnectingProvider(null)
      setDisconnectDialogOpen(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage({})
    }, 1000)
    return () => clearTimeout(timer)
  }, [showMessage])

  if (isUserLoading || isSidebarLoading) {
    return <Loader />
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

      <Layout.Body className='flex flex-col'>
        <div style={{ marginBottom: '0.5rem' }}>
          <h1 className='text-2xl font-bold tracking-tight' style={{ marginBottom: '0.5rem' }}>
            Payment Channels
          </h1>
          <p className='text-muted-foreground'>
            Below is a list of our partners, powering the payment methods that you can activate for your customers.
          </p>
        </div>

        <div className='flex-grow overflow-auto' style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
          <ul className='grid gap-6 pb-16 pt-4 md:grid-cols-2 lg:grid-cols-3'>
            {providers.map((provider) => {
              const isConnected = organizationProviders.some(op => op.provider_code === provider.provider_code && op.is_connected)
              return (
                <li
                  key={provider.provider_code}
                  className='rounded-none border p-6 hover:shadow-md flex flex-col'
                >
                  <div className='mb-6 flex items-center justify-between'>
                    <div className='flex size-12 items-center justify-center rounded-lg overflow-hidden bg-black'>
                      <div className="w-full h-full flex items-center justify-center">
                        {provider.logo}
                      </div>
                    </div>
                    <Button
                      variant={isConnected ? 'default' : 'outline'}
                      size='sm'
                      className={`flex items-center px-4 py-2 text-sm font-medium rounded-none ${isConnected ? 'bg-blue-500 hover:bg-blue-600 text-white' : ''
                        }`}
                      onClick={() => {
                        if (isConnected) {
                          setDisconnectingProvider(provider.provider_code)
                          setDisconnectDialogOpen(true)
                        } else {
                          updateProviderConnection(provider.provider_code, true)
                        }
                      }}
                    >
                      {isConnected ? 'Connected' : 'Connect'}
                    </Button>
                  </div>
                  <div className="flex-grow">
                    <h2 className='mb-2 text-lg font-semibold'>{provider.name}</h2>
                    <p className='text-gray-500'>{provider.description}</p>
                  </div>
                  <AnimatePresence>
                    {showMessage[provider.provider_code] && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className='mt-4 p-2 bg-[#00A0FF] bg-opacity-10 text-[#00A0FF] rounded-lg text-sm'
                      >
                        Successfully connected to {provider.name}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              )
            })}

            {/* Coming Soon panel as a grid item */}
            <li className="rounded-none border p-6 relative overflow-hidden hover:shadow-md md:col-span-2 lg:col-span-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-indigo-900 flex flex-col justify-center min-h-[255px]">
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-200 dark:bg-blue-700 rounded-full -mr-20 -mt-20 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-200 dark:bg-indigo-700 rounded-full -ml-16 -mb-16 opacity-50"></div>

              <div className="relative z-10 flex flex-col h-full justify-center">
                <div>
                  <h2 className='text-2xl font-bold mb-4 text-gray-800 dark:text-white'>Exciting new payment channels — coming soon!</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    We&apos;re continuously expanding our payment ecosystem to offer you more options. If there&apos;s a specific payment channel you need, let us know, and we&apos;ll fast-track its development for you.
                  </p>
                </div>
                <div className="flex space-x-4">
                  <a
                    href="mailto:hello@lomi.africa?subject=New Payment Channel Request"
                    className="bg-blue-500 text-white px-4 py-2 rounded-none inline-flex items-center transition-transform transform hover:scale-105 hover:shadow-lg hover:bg-blue-600"
                  >
                    <IconPlus className="mr-2 h-4 w-4" />
                    Request a new channel
                  </a>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </Layout.Body>
      <Dialog open={phoneDialogOpen} onOpenChange={setPhoneDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Enter your {providers.find(p => p.provider_code === connectingProvider)?.name} phone number
            </DialogTitle>
            <DialogDescription>
              Please enter the phone number associated with your {providers.find(p => p.provider_code === connectingProvider)?.name} account.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <PhoneNumberInput
              value={phoneNumber}
              onChange={(value: string | undefined) => setPhoneNumber(value || "")}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setPhoneDialogOpen(false)
                setConnectingProvider(null)
                setPhoneNumber("")
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePhoneSubmit}
              disabled={!phoneNumber}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Connect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={disconnectDialogOpen} onOpenChange={setDisconnectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Disconnect {providers.find(p => p.provider_code === disconnectingProvider)?.name}?
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to disconnect this provider? This action will directly affect your customers&apos; checkout experience.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={confirmDisconnect}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  )
}
