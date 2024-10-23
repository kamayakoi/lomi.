import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { PlusCircle, ArrowUpDown, Edit } from 'lucide-react'
import { Layout as DashboardLayout } from '@/components/custom/layout'
import { Separator } from '@/components/ui/separator'
import { TopNav } from '@/components/dashboard/top-nav'
import { UserNav } from '@/components/dashboard/user-nav'
import Notifications from '@/components/dashboard/notifications'
import FeedbackForm from '@/components/dashboard/feedback-form'
import PaymentCustomizerWithCheckout from './dev_payment-links/customize-form'
import { useUser } from '@/lib/hooks/useUser'
import { Skeleton } from '@/components/ui/skeleton'
import { useInfiniteQuery } from 'react-query'
import AnimatedLogoLoader from '@/components/dashboard/loader'
import { PaymentLinkFilters } from './dev_payment-links/filters_paymentLinks'
import { fetchPaymentLinks } from './dev_payment-links/support_paymentLinks'
import { PaymentLink, link_type, currency_code } from './dev_payment-links/types'
import { withActivationCheck } from '@/components/custom/withActivationCheck'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Link2Icon } from 'lucide-react'
import PaymentLinkActions from './dev_payment-links/actions_paymentLink'
import { EditPaymentLinkForm } from './dev_payment-links/edit_paymentlink.tsx'

const linkTypeColors: Record<link_type, string> = {
  'instant': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'product': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  'plan': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
};

function PaymentLinksPage() {
  const { user, isLoading: isUserLoading } = useUser()
  const [isCreateLinkOpen, setIsCreateLinkOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLinkType, setSelectedLinkType] = useState<link_type | 'all' | null>(null)
  const [selectedCurrency, setSelectedCurrency] = useState<currency_code | null>('XOF')
  const [selectedStatus, setSelectedStatus] = useState<'active' | 'inactive' | 'all' | null>('all')
  const [sortColumn, setSortColumn] = useState<keyof PaymentLink | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const pageSize = 50
  const [selectedPaymentLink, setSelectedPaymentLink] = useState<PaymentLink | null>(null)
  const [isActionsOpen, setIsActionsOpen] = useState(false)
  const [isEditLinkOpen, setIsEditLinkOpen] = useState(false)

  const topNav = [
    { title: 'Payment Links', href: 'payment-links', isActive: true },
    { title: 'Settings', href: 'settings', isActive: false },
  ]

  const { data: paymentLinksData, isLoading: isPaymentLinksLoading, fetchNextPage } = useInfiniteQuery(
    ['paymentLinks', user?.id || '', selectedLinkType, selectedCurrency, selectedStatus],
    ({ pageParam = 1 }) =>
      fetchPaymentLinks(
        user?.id || '',
        selectedLinkType,
        selectedCurrency,
        selectedStatus,
        pageParam,
        pageSize
      ),
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1
        return lastPage.length !== 0 ? nextPage : undefined
      },
      enabled: !!user?.id,
    }
  )

  const paymentLinks = paymentLinksData?.pages?.flatMap((page) => page) || []

  const handleSort = (column: keyof PaymentLink) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const sortPaymentLinks = (paymentLinks: PaymentLink[]) => {
    if (!sortColumn) return paymentLinks

    return paymentLinks.sort((a, b) => {
      const aValue = a[sortColumn]
      const bValue = b[sortColumn]

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
      } else {
        return 0
      }
    })
  }

  const handlePaymentLinkClick = (paymentLink: PaymentLink) => {
    setSelectedPaymentLink(paymentLink)
    setIsActionsOpen(true)
  }

  const handleEditClick = (paymentLink: PaymentLink) => {
    setSelectedPaymentLink(paymentLink)
    setIsEditLinkOpen(true)
  }

  if (isUserLoading) {
    return <AnimatedLogoLoader />
  }

  if (!user || !user.id) {
    return <div><AnimatedLogoLoader /> User data not available.</div>
  }

  return (
    <DashboardLayout>
      <DashboardLayout.Header>
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-4'>
          <FeedbackForm />
          <Notifications />
          <UserNav />
        </div>
      </DashboardLayout.Header>

      <Separator className='my-0' />

      <DashboardLayout.Body>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-tight">Payment Links</h1>
            <Button
              variant="outline"
              onClick={() => setIsCreateLinkOpen(true)}
              className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Payment Link
            </Button>
          </div>

          <PaymentLinkFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedLinkType={selectedLinkType}
            setSelectedLinkType={setSelectedLinkType}
            selectedCurrency={selectedCurrency}
            setSelectedCurrency={setSelectedCurrency}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            refetch={() => {
              fetchNextPage()
                .then(() => {
                  // Handle success if needed
                })
                .catch((error) => {
                  console.error('Error fetching next page:', error)
                })
            }}
            isRefreshing={isPaymentLinksLoading}
          />

          <Card>
            <CardContent className="p-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-left">
                        Title
                        {sortColumn === 'title' && (
                          <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                        )}
                      </TableHead>
                      <TableHead className="text-left">
                        Description
                      </TableHead>
                      <TableHead className="text-left">
                        URL
                      </TableHead>
                      <TableHead className="text-center">
                        <Button variant="ghost" onClick={() => handleSort('link_type')}>
                          Type
                          {sortColumn === 'link_type' && (
                            <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                          )}
                        </Button>
                      </TableHead>
                      <TableHead className="text-center">
                        <Button variant="ghost" onClick={() => handleSort('price')}>
                          Price
                          {sortColumn === 'price' && (
                            <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                          )}
                        </Button>
                      </TableHead>
                      <TableHead className="text-center">
                        <Button variant="ghost" onClick={() => handleSort('is_active')}>
                          Status
                          {sortColumn === 'is_active' && (
                            <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                          )}
                        </Button>
                      </TableHead>
                      <TableHead className="text-center">
                        <Button variant="ghost" onClick={() => handleSort('is_active')}>
                          Edit
                          {sortColumn === 'is_active' && (
                            <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                          )}
                        </Button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isPaymentLinksLoading ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell colSpan={6}>
                            <Skeleton className="w-full h-8" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : paymentLinks.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4">
                              <Link2Icon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                            </div>
                            <p className="text-xl font-semibold text-gray-500 dark:text-gray-400">
                              No payment links found
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs text-center">
                              Try changing your filter or create a new payment link.
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortPaymentLinks(paymentLinks).map((link: PaymentLink) => (
                        <TableRow
                          key={link.link_id}
                          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                          onClick={() => handlePaymentLinkClick(link)}
                        >
                          <TableCell className="text-left">{link.title}</TableCell>
                          <TableCell className="text-left">{link.public_description}</TableCell>
                          <TableCell className="text-left">
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                              {link.url}
                            </a>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className={`
                              inline-block px-2 py-1 rounded-full text-xs font-normal
                              ${linkTypeColors[link.link_type]}
                            `}>
                              {link.link_type.charAt(0).toUpperCase() + link.link_type.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            {link.link_type === 'instant' && link.price ? (
                              `${link.price} ${link.currency_code}`
                            ) : link.link_type === 'product' && link.product_price ? (
                              `${link.product_price} ${link.currency_code}`
                            ) : link.link_type === 'plan' && link.plan_amount ? (
                              `${link.plan_amount} ${link.currency_code}`
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <span className={`
                              inline-block px-2 py-1 rounded-full text-xs font-normal
                              ${link.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}
                            `}>
                              {link.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditClick(link)
                              }}
                              className="hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <Edit className="h-4 w-4 text-blue-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout.Body>

      <Dialog open={isCreateLinkOpen} onOpenChange={setIsCreateLinkOpen}>
        <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh] sm:w-full sm:h-full overflow-hidden p-0">
          <div className="h-full overflow-auto">
            <div className="p-0">
              <PaymentCustomizerWithCheckout />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditLinkOpen} onOpenChange={setIsEditLinkOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Payment Link</DialogTitle>
            <DialogDescription>
              Modify the details of the selected payment link.
            </DialogDescription>
          </DialogHeader>
          {selectedPaymentLink && (
            <EditPaymentLinkForm
              paymentLink={selectedPaymentLink}
              onClose={() => setIsEditLinkOpen(false)}
              onSuccess={() => {
                fetchNextPage()
                setIsEditLinkOpen(false)
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <PaymentLinkActions
        paymentLink={selectedPaymentLink}
        isOpen={isActionsOpen}
        onClose={() => setIsActionsOpen(false)}
      />
    </DashboardLayout>
  )
}

function PaymentLinksWithActivationCheck() {
  return withActivationCheck(PaymentLinksPage)({});
}

export default PaymentLinksWithActivationCheck;
