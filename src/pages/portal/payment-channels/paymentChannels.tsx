import { useState, useEffect } from 'react'
import {
  IconAdjustmentsHorizontal,
  IconSortAscendingLetters,
  IconSortDescendingLetters,
  IconExternalLink,
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
import ThemeSwitch from '@/components/dashboard/theme-switch'
import { UserNav } from '@/components/dashboard/user-nav'
import { Button } from '@/components/custom/button'
import { providers, Provider } from './data'
import { supabase } from '@/utils/supabase/client'
import { Database } from '@/../database.types'
import { TopNav } from '@/components/dashboard/top-nav'

const integrationText = new Map<string, string>([
  ['all', 'All Integrations'],
  ['connected', 'Connected'],
  ['notConnected', 'Not Connected'],
])

export default function PaymentChannels() {
  const [sort, setSort] = useState('ascending')
  const [integrationType, setIntegrationType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [organizationProviders, setOrganizationProviders] = useState<Database['public']['Tables']['organization_providers_settings']['Row'][]>([])

  const topNav = [
    { title: 'Payment Channels', href: '/portal/payment-channels', isActive: true },
    { title: 'Settings', href: '/portal/settings', isActive: false },
  ]

  useEffect(() => {
    fetchOrganizationProviders()
  }, [])

  const fetchOrganizationProviders = async () => {
    const { data, error } = await supabase
      .from('organization_providers_settings')
      .select('*')

    if (error) {
      console.error('Error fetching organization providers:', error)
    } else {
      setOrganizationProviders(data || [])
    }
  }

  const updateProviderConnection = async (providerCode: string, isConnected: boolean) => {
    const { error } = await supabase
      .from('organization_providers_settings')
      .upsert({
        provider_code: providerCode,
        is_connected: isConnected
      })

    if (error) {
      console.error('Error updating provider connection:', error)
    } else {
      fetchOrganizationProviders()
    }
  }

  const handleStripeConnect = async () => {
    try {
      const response = await fetch("/api/stripe/account_link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to create Stripe account link")
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error("Error creating Stripe account link:", error)
    }
  }

  const filteredProviders = providers
    .sort((a, b) =>
      sort === 'ascending'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    )
    .filter((provider) => {
      const isConnected = organizationProviders.some(op => op.provider_code === provider.provider_code && op.is_connected)
      if (integrationType === 'connected' && !isConnected) return false
      if (integrationType === 'notConnected' && isConnected) return false
      return provider.name.toLowerCase().includes(searchTerm.toLowerCase())
    })

  const directProviders = filteredProviders.filter(provider => provider.provider_code !== 'STRIPE')
  const stripeProvider = filteredProviders.find(provider => provider.provider_code === 'STRIPE')

  const isStripeProvider = (provider: Provider): provider is Provider & { includedPayments: Array<{ name: string; icon: JSX.Element }> } => {
    return provider.provider_code === 'STRIPE' && 'includedPayments' in provider;
  };

  return (
    <Layout fixed>
      <Layout.Header>
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      <Separator className='my-0' />

      <Layout.Body className='flex flex-col'>
        <div style={{ marginBottom: '0.5rem' }}>
          <h1 className='text-2xl font-bold tracking-tight' style={{ marginBottom: '0.5rem' }}>
            Providers
          </h1>
          <p className='text-muted-foreground'>
            Below is a list of payment methods you can activate for your customers.
          </p>
        </div>
        <div className='my-4 flex items-end justify-between sm:my-0 sm:items-center'>
          <div className='flex flex-col gap-4 sm:my-4 sm:flex-row'>
            <Input
              placeholder='Filter integrations...'
              className='h-9 w-40 lg:w-[250px]'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={integrationType} onValueChange={setIntegrationType}>
              <SelectTrigger className='w-36'>
                <SelectValue>{integrationText.get(integrationType)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Integrations</SelectItem>
                <SelectItem value='connected'>Connected</SelectItem>
                <SelectItem value='notConnected'>Not Connected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className='w-16'>
              <SelectValue>
                <IconAdjustmentsHorizontal size={18} />
              </SelectValue>
            </SelectTrigger>
            <SelectContent align='end'>
              <SelectItem value='ascending'>
                <div className='flex items-center gap-4'>
                  <IconSortAscendingLetters size={16} />
                  <span>Ascending</span>
                </div>
              </SelectItem>
              <SelectItem value='descending'>
                <div className='flex items-center gap-4'>
                  <IconSortDescendingLetters size={16} />
                  <span>Descending</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='flex-grow overflow-auto' style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
          <h2 className='text-xl font-semibold mb-4 mt-8'>Direct Integrations</h2>
          <ul className='grid gap-6 pb-16 pt-4 md:grid-cols-2 lg:grid-cols-3'>
            {directProviders.map((provider) => (
              <li
                key={provider.provider_code}
                className='rounded-lg border p-6 hover:shadow-md'
              >
                <div className='mb-8 flex items-center justify-between'>
                  <div className='flex size-12 items-center justify-center rounded-lg overflow-hidden bg-gray-100'>
                    {provider.logo}
                  </div>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => updateProviderConnection(provider.provider_code, !organizationProviders.some(op => op.provider_code === provider.provider_code && op.is_connected))}
                    className='flex items-center px-4 py-2 text-sm font-medium'
                  >
                    {organizationProviders.some(op => op.provider_code === provider.provider_code && op.is_connected) ? 'Disconnect' : 'Connect'}
                  </Button>
                </div>
                <div>
                  <h2 className='mb-2 text-lg font-semibold'>{provider.name}</h2>
                  <p className='line-clamp-3 text-gray-500'>{provider.description}</p>
                </div>
              </li>
            ))}
          </ul>
          <Separator className='my-8' />
          <h2 className='text-xl font-semibold mb-4'>Other</h2>
          <ul className='grid gap-6 pb-16 pt-4 md:grid-cols-2 lg:grid-cols-3'>
            {stripeProvider && (
              <li
                key={stripeProvider.provider_code}
                className='rounded-lg border p-6 hover:shadow-md'
              >
                <div className='mb-8 flex items-center justify-between'>
                  <div className='flex size-12 items-center justify-center rounded-lg overflow-hidden bg-gray-100'>
                    {stripeProvider.logo}
                  </div>
                  <Button
                    variant='default'
                    size='sm'
                    onClick={handleStripeConnect}
                    className='flex items-center px-4 py-2 text-sm font-medium bg-gray-800 text-white hover:bg-[#635BFF]'
                  >
                    <IconExternalLink size={14} className="mr-2" />
                    Setup
                  </Button>
                </div>
                <div>
                  <h2 className='mb-2 text-lg font-semibold'>{stripeProvider.name}</h2>
                  <p className='text-gray-500'>{stripeProvider.description}</p>
                  <p className='text-xs text-blue-600 mt-2 flex items-center'>
                    <IconExternalLink size={12} className="mr-1" />
                    External sign-up required
                  </p>
                  {isStripeProvider(stripeProvider) && (
                    <div className='mt-4'>
                      <p className='text-sm font-medium mb-2'>Includes:</p>
                      <div className='flex flex-wrap gap-2'>
                        {stripeProvider.includedPayments.map((payment) => (
                          <div key={payment.name} className='flex items-center bg-gray-100 rounded-full px-2 py-1'>
                            <span className='mr-1'>{payment.icon}</span>
                            <span className='text-xs'>{payment.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </li>
            )}
          </ul>
        </div>
      </Layout.Body>
    </Layout>
  )
}