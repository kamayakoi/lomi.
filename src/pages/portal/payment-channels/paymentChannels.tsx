import { useState, useEffect } from 'react'
import { IconPlus } from '@tabler/icons-react'
import { Loader2 } from 'lucide-react'
import { Layout } from '@/components/custom/layout'
import { Separator } from '@/components/ui/separator'
import Notifications from '@/components/portal/notifications'
import { UserNav } from '@/components/portal/user-nav'
import { Button } from '@/components/custom/button'
import { paymentMethods } from './components/data'
import { supabase } from '@/utils/supabase/client'
import { Database } from '@/../database.types'
import { TopNav } from '@/components/portal/top-nav'
import { useUser } from '@/lib/hooks/use-user'
import { useSidebarData } from '@/lib/hooks/use-sidebar-data'
import Loader from '@/components/portal/loader'
import FeedbackForm from '@/components/portal/feedback-form'
import SupportForm from '@/components/portal/support-form'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import PhoneNumberInput from '@/components/ui/phone-number-input'
import { useToast } from '@/lib/hooks/use-toast'
import { cn } from '@/lib/actions/utils'

export default function PaymentChannels() {
  const { toast } = useToast()
  const [disconnectingProvider, setDisconnectingProvider] = useState<string | null>(null)
  const [disconnectDialogOpen, setDisconnectDialogOpen] = useState(false)
  const [phoneDialogOpen, setPhoneDialogOpen] = useState(false)
  const [connectingProvider, setConnectingProvider] = useState<string | null>(null)
  const [phoneNumber, setPhoneNumber] = useState("")
  const { user, isLoading: isUserLoading } = useUser()
  const { sidebarData, isLoading: isSidebarLoading } = useSidebarData()
  const [organizationProviders, setOrganizationProviders] = useState<Pick<Database['public']['Tables']['organization_providers_settings']['Row'], 'provider_code' | 'is_connected'>[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const topNav = [
    { title: 'payment_channels', href: '/portal/payment-channels', isActive: true },
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

    const method = paymentMethods.find(m => m.provider_code === providerCode)

    // All mobile money and e-wallet providers need phone number
    if (method && (method.type === 'Mobile Money' || method.type === 'e-Wallets')) {
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
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to connect to provider. Please try again.",
        })
      } else {
        fetchOrganizationProviders(sidebarData.organization_id)
        const method = paymentMethods.find(m => m.provider_code === providerCode)
        toast({
          title: "Success",
          description: `Successfully connected to ${method?.name}`,
        })
      }
    }
  }

  const handlePhoneSubmit = async () => {
    if (!connectingProvider || !sidebarData?.organization_id || !phoneNumber) return

    try {
      setIsProcessing(true);

      // Special handling for Wave provider
      if (connectingProvider === 'WAVE' && user?.id) {
        const { WaveAggregator } = await import('@/utils/wave/aggregator');
        await WaveAggregator.registerMerchant(
          user.id,
          sidebarData.organization_id,
          phoneNumber
        );

        const method = paymentMethods.find(m => m.provider_code === connectingProvider);
        toast({
          title: "Success",
          description: `Successfully connected to ${method?.name}`,
        });

        fetchOrganizationProviders(sidebarData.organization_id);
        setPhoneDialogOpen(false);
        setConnectingProvider(null);
        setPhoneNumber("");
        return;
      }

      // Handle other providers
      const { error: phoneError } = await supabase
        .rpc('update_organization_provider_phone', {
          p_organization_id: sidebarData.organization_id,
          p_provider_code: connectingProvider,
          p_phone_number: phoneNumber,
          p_is_phone_verified: false
        })

      if (phoneError) {
        console.error('Error updating provider phone:', phoneError)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update phone number. Please try again.",
        })
        return
      }

      await connectProvider(connectingProvider)
      setPhoneDialogOpen(false)
      setConnectingProvider(null)
      setPhoneNumber("")
    } catch (error) {
      console.error('Error connecting provider:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to connect provider. Please try again.",
      });
    } finally {
      setIsProcessing(false);
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
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to disconnect provider. Please try again.",
        })
      } else {
        const method = paymentMethods.find(m => m.provider_code === disconnectingProvider)
        fetchOrganizationProviders(sidebarData.organization_id)
        toast({
          title: "Success",
          description: `Successfully disconnected from ${method?.name}`,
        })
      }
      setDisconnectingProvider(null)
      setDisconnectDialogOpen(false)
    }
  }

  const categories = Array.from(new Set(paymentMethods.map(m => m.category)))

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
          <div className="space-y-8 pb-16 pt-4">
            {categories.map((category) => (
              <section key={category}>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{category}</h2>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {paymentMethods
                    .filter(method => method.category === category)
                    .map((method) => (
                      <div
                        key={method.code}
                        className={cn(
                          "border p-6 rounded-none transition-shadow relative overflow-hidden",
                          method.status !== 'coming_soon' && "hover:shadow-md",
                          method.isViewMore && "md:col-span-2 lg:col-span-2 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900",
                          !method.isViewMore && "bg-background"
                        )}
                      >
                        <div className='mb-6 flex items-center justify-between'>
                          <div className={cn(
                            'flex items-center justify-center rounded-lg overflow-hidden',
                            !method.isViewMore && 'size-12 bg-white'
                          )}>
                            <div className={cn(
                              "w-full h-full flex items-center justify-center",
                              method.isViewMore && "w-auto h-auto"
                            )}>
                              {method.logo}
                            </div>
                          </div>
                          {method.type === 'Crypto' ? (
                            method.isMainCrypto ? (
                              <Button
                                variant={organizationProviders.some(op => op.provider_code === method.provider_code && op.is_connected) ? 'default' : 'outline'}
                                size='sm'
                                className={cn(
                                  'flex items-center px-3 py-2 text-sm font-medium rounded-sm transition-all duration-200',
                                  organizationProviders.some(op => op.provider_code === method.provider_code && op.is_connected)
                                    ? 'bg-blue-500/90 hover:bg-blue-600 text-white border-blue-500'
                                    : 'hover:border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-950'
                                )}
                                onClick={() => {
                                  const isConnected = organizationProviders.some(op =>
                                    op.provider_code === method.provider_code && op.is_connected
                                  )
                                  if (isConnected) {
                                    setDisconnectingProvider(method.provider_code)
                                    setDisconnectDialogOpen(true)
                                  } else {
                                    updateProviderConnection(method.provider_code, true)
                                  }
                                }}
                              >
                                {organizationProviders.some(op =>
                                  op.provider_code === method.provider_code && op.is_connected
                                ) ? 'Connected' : 'Connect'}
                              </Button>
                            ) : null
                          ) : (
                            <Button
                              variant={organizationProviders.some(op => op.provider_code === method.provider_code && op.is_connected) ? 'default' : 'outline'}
                              size='sm'
                              disabled={method.status === 'coming_soon'}
                              className={cn(
                                'flex items-center px-3 py-2 text-sm font-medium rounded-sm transition-all duration-200',
                                organizationProviders.some(op => op.provider_code === method.provider_code && op.is_connected)
                                  ? 'bg-blue-500/90 hover:bg-blue-600 text-white border-blue-500'
                                  : 'hover:border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-950',
                                method.status === 'coming_soon' && 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                              )}
                              onClick={() => {
                                const isConnected = organizationProviders.some(op =>
                                  op.provider_code === method.provider_code && op.is_connected
                                )
                                if (isConnected) {
                                  setDisconnectingProvider(method.provider_code)
                                  setDisconnectDialogOpen(true)
                                } else {
                                  updateProviderConnection(method.provider_code, true)
                                }
                              }}
                            >
                              {method.status === 'coming_soon'
                                ? 'Coming Soon'
                                : organizationProviders.some(op =>
                                  op.provider_code === method.provider_code && op.is_connected
                                ) ? 'Connected' : isProcessing && connectingProvider === method.provider_code ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Connecting...
                                  </>
                                ) : 'Connect'
                              }
                            </Button>
                          )}
                        </div>
                        <div className="flex-grow">
                          <h2 className='text-lg font-semibold mb-2'>{method.name}</h2>
                          <p className='text-gray-500'>{method.description}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </section>
            ))}

            {/* Coming Soon panel */}
            <section className="rounded-[2px] border-2 border-blue-100 dark:border-blue-900 p-6 relative overflow-hidden hover:shadow-md bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-indigo-900 flex flex-col justify-center min-h-[255px]">
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-200 dark:bg-blue-700 rounded-none -mr-20 -mt-20 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-200 dark:bg-indigo-700 rounded-none -ml-16 -mb-16 opacity-50"></div>

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
                    className="bg-blue-500/90 hover:bg-blue-600 text-white px-3 py-2 rounded-sm inline-flex items-center transition-all duration-200"
                  >
                    <IconPlus className="mr-2 h-4 w-4" />
                    Request a new channel
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </Layout.Body>

      <Dialog open={phoneDialogOpen} onOpenChange={setPhoneDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Enter your {paymentMethods.find(m => m.provider_code === connectingProvider)?.name} phone number
            </DialogTitle>
            <DialogDescription>
              Please enter the phone number associated with your {paymentMethods.find(m => m.provider_code === connectingProvider)?.name} account.
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
              Disconnect {paymentMethods.find(m => m.provider_code === disconnectingProvider)?.name}?
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
