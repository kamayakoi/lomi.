import { useState, useEffect } from 'react'
import {
  IconSearch,
  IconPlus,
} from '@tabler/icons-react'
import { Layout } from '@/components/custom/layout'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import Notifications from '@/components/dashboard/notifications'
import { UserNav } from '@/components/dashboard/user-nav'
import { Button } from '@/components/custom/button'
import { providers } from './data'
import { supabase } from '@/utils/supabase/client'
import { Database } from '@/../database.types'
import { TopNav } from '@/components/dashboard/top-nav'
import { useUser } from '@/lib/hooks/useUser'
import { useSidebarData } from '@/lib/hooks/useSidebarData'
import { motion, AnimatePresence } from 'framer-motion'
import Loader from '@/components/dashboard/loader'
import FeedbackForm from '@/components/dashboard/feedback-form'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

const integrationText = new Map<string, string>([
  ['all', 'All Integrations'],
  ['connected', 'Connected'],
  ['notConnected', 'Not Connected'],
])

export default function PaymentChannels() {
  const [integrationType, setIntegrationType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const { user, isLoading: isUserLoading } = useUser()
  const { sidebarData, isLoading: isSidebarLoading } = useSidebarData()
  const [organizationProviders, setOrganizationProviders] = useState<Pick<Database['public']['Tables']['organization_providers_settings']['Row'], 'provider_code' | 'is_connected'>[]>([])
  const [showMessage, setShowMessage] = useState<Record<string, boolean>>({})
  const [disconnectingProvider, setDisconnectingProvider] = useState<string | null>(null)
  const [disconnectDialogOpen, setDisconnectDialogOpen] = useState(false)

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

    if (sidebarData?.organization_id) {
      const { error } = await supabase
        .rpc('update_organization_provider_connection', {
          p_organization_id: sidebarData.organization_id,
          p_provider_code: providerCode,
          p_is_connected: isConnected,
        })

      if (error) {
        console.error('Error updating provider connection:', error)
      } else {
        fetchOrganizationProviders(sidebarData.organization_id)
        if (isConnected) {
          setShowMessage((prevState) => ({
            ...prevState,
            [providerCode]: true,
          }))
        }
      }
    }
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
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage({})
    }, 1000)
    return () => clearTimeout(timer)
  }, [showMessage])

  const filteredProviders = providers
    .filter((provider) => {
      const isConnected = organizationProviders.some(op => op.provider_code === provider.provider_code && op.is_connected)
      if (integrationType === 'connected' && !isConnected) return false
      if (integrationType === 'notConnected' && isConnected) return false
      return provider.name.toLowerCase().includes(searchTerm.toLowerCase())
    })

  const directProviders = filteredProviders

  const handleDisconnectClick = (providerCode: string) => {
    setDisconnectingProvider(providerCode)
    setDisconnectDialogOpen(true)
  }

  const handleConfirmDisconnect = () => {
    confirmDisconnect()
    setDisconnectDialogOpen(false)
    setDisconnectingProvider(null)
  }

  if (isUserLoading || isSidebarLoading) {
    return <Loader />
  }

  return (
    <Layout fixed>
      <Layout.Header>
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-4'>
          <FeedbackForm />
          <Notifications />
          <UserNav />
        </div>
      </Layout.Header>

      <Separator className='my-0' />

      <Layout.Body className='flex flex-col'>
        <div style={{ marginBottom: '0.5rem' }}>
          <h1 className='text-2xl font-bold tracking-tight' style={{ marginBottom: '0.5rem' }}>
            Payment Channels
          </h1>
          <p className='text-muted-foreground'>
            Below is a list of our partners, powering the payment methods that you can activate for your customers.
          </p>
        </div>
        <div className='my-4 flex items-center justify-between sm:my-0'>
          <div className='flex items-center space-x-4'>
            <div className='relative w-60'>
              <Input
                placeholder='Filter integrations...'
                className='w-full pl-10 pr-4 py-2 rounded-none'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <IconSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            </div>
            <Select value={integrationType} onValueChange={setIntegrationType}>
              <SelectTrigger className='w-[150px] rounded-none'>
                <SelectValue>{integrationText.get(integrationType)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Integrations</SelectItem>
                <SelectItem value='connected'>Connected</SelectItem>
                <SelectItem value='notConnected'>Not Connected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className='flex-grow overflow-auto' style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
          <h2 className='text-xl font-semibold mb-4 mt-8'>Direct Integrations</h2>
          <ul className='grid gap-6 pb-16 pt-4 md:grid-cols-2 lg:grid-cols-3'>
            {directProviders.map((provider) => {
              const isConnected = organizationProviders.some(op => op.provider_code === provider.provider_code && op.is_connected)
              return (
                <li
                  key={provider.provider_code}
                  className='rounded-lg border p-6 hover:shadow-md'
                >
                  <div className='mb-8 flex items-center justify-between'>
                    <div className='flex size-14 items-center justify-center rounded-lg overflow-hidden bg-gray-100'>
                      {provider.logo}
                    </div>
                    <motion.button
                      className={`px-5 py-2 rounded-md text-lg font-medium transition-colors duration-200 ease-in-out ${isConnected
                        ? 'bg-[#00A0FF] text-white'
                        : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'
                        }`}
                      onClick={() => {
                        if (isConnected) {
                          handleDisconnectClick(provider.provider_code)
                        } else {
                          updateProviderConnection(provider.provider_code, true)
                        }
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isConnected ? 'Disconnect' : 'Connect'}
                    </motion.button>
                  </div>
                  <div>
                    <h2 className='mb-2 text-lg font-semibold'>{provider.name}</h2>
                    <p className='line-clamp-3 text-gray-500'>{provider.description}</p>
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
          </ul>
          <Separator className='my-8' />
          <h2 className='text-xl font-semibold mb-4'>Advanced</h2>
          <ul className='grid gap-6 pb-16 pt-4 md:grid-cols-2 lg:grid-cols-3'>
            {/* Remove the Stripe-specific code */}
          </ul>

          {/* Updated "Coming Soon" panel */}
          <div className="mt-4 mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-indigo-900 rounded-lg p-8 shadow-lg relative overflow-hidden border border-blue-100 dark:border-indigo-700 transition-all duration-300 hover:shadow-xl hover:border-blue-200 dark:hover:border-indigo-600">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-200 dark:bg-blue-700 rounded-full -mr-20 -mt-20 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-200 dark:bg-indigo-700 rounded-full -ml-16 -mb-16 opacity-50"></div>

            <h2 className='text-2xl font-bold mb-4 relative z-10 text-gray-800 dark:text-white'>Exciting new payment channels — coming soon!</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 relative z-10">
              We&apos;re continuously expanding our payment ecosystem to offer you more options. If there&apos;s a specific payment channel you need, let us know, and we&apos;ll fast-track its development for you.
            </p>
            <div className="flex space-x-4">
              <a
                href="mailto:hello@lomi.africa?subject=New Payment Channel Request"
                className="relative z-10 bg-blue-600 text-white px-4 py-2 rounded-md inline-flex items-center transition-transform transform hover:scale-105 hover:shadow-lg hover:bg-blue-700"
              >
                <IconPlus className="mr-2 h-4 w-4" />
                Request a new channel
              </a>
            </div>
          </div>
        </div>
      </Layout.Body>
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
              onClick={handleConfirmDisconnect}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  )
}
