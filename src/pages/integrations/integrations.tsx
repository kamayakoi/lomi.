import { useState } from 'react'
import {
  IconAdjustmentsHorizontal,
  IconSortAscendingLetters,
  IconSortDescendingLetters,
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
import { Search } from '@/components/dashboard/search'
import ThemeSwitch from '@/components/dashboard/theme-switch'
import { UserNav } from '@/components/dashboard/user-nav'
import { Button } from '@/components/custom/button'
import { integrations } from './data'

const integrationText = new Map<string, string>([
  ['all', 'All Integrations'],
  ['connected', 'Connected'],
  ['notConnected', 'Not Connected'],
])

export default function Integrations() {
  const [sort, setSort] = useState('ascending')
  const [integrationType, setIntegrationType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredIntegrations = integrations
    .sort((a, b) =>
      sort === 'ascending'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    )
    .filter((integration) =>
      integrationType === 'connected'
        ? integration.connected
        : integrationType === 'notConnected'
          ? !integration.connected
          : true
    )
    .filter((integration) => integration.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <Layout fixed>
      {/* ===== Top Heading ===== */}
      <Layout.Header>
        <div className='flex w-full items-center justify-between'>
          <Search />
          <div className='flex items-center space-x-4'>
            <ThemeSwitch />
            <UserNav />
          </div>
        </div>
      </Layout.Header>

      {/* ===== Content ===== */}
      <Layout.Body className='flex flex-col'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            Payment methods
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
        <Separator className='shadow' />
        <ul className='faded-bottom no-scrollbar grid gap-4 overflow-auto pb-16 pt-4 md:grid-cols-2 lg:grid-cols-3'>
          {filteredIntegrations.map((integration) => (
            <li
              key={integration.name}
              className='rounded-lg border p-4 hover:shadow-md'
            >
              <div className='mb-8 flex items-center justify-between'>
                <div
                  className={`flex size-10 items-center justify-center rounded-lg bg-muted p-2`}
                >
                  {integration.logo}
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  className={`${integration.connected ? 'border border-blue-300 bg-blue-50 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900' : ''}`}
                >
                  {integration.connected ? 'Connected' : 'Connect'}
                </Button>
              </div>
              <div>
                <h2 className='mb-1 font-semibold'>{integration.name}</h2>
                <p className='line-clamp-2 text-gray-500'>{integration.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </Layout.Body>
    </Layout>
  )
}