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
import SupportForm from '@/components/dashboard/support-form'
import PaymentLinkActions from './dev_payment-links/actions_paymentLink'
import { EditPaymentLinkForm } from './dev_payment-links/edit_paymentlink.tsx'

const linkTypeColors: Record<link_type, string> = {
  'instant': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'product': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  'plan': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
};

function formatPrice(price: number | undefined): string {
  if (price === undefined) {
    return '-';
  }

  const formattedPrice = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);

  return formattedPrice;
}

function PaymentLinkCard({ paymentLink, onEditClick, onClick }: {
  paymentLink: PaymentLink,
  onEditClick: (e: React.MouseEvent) => void,
  onClick: () => void
}) {
  return (
    <div
      className="p-4 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
      onClick={onClick}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="font-medium">{paymentLink.title}</div>
          <div className="flex items-center gap-2">
            <span className={`
              inline-flex items-center px-2 h-5 text-xs font-medium rounded-none
              ${linkTypeColors[paymentLink.link_type]}
            `}>
              {paymentLink.link_type.charAt(0).toUpperCase() + paymentLink.link_type.slice(1)}
            </span>
            <span className={`
              inline-flex items-center px-2 h-5 text-xs font-medium rounded-none
              ${paymentLink.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}
            `}>
              {paymentLink.is_active ? 'Active' : 'Inactive'}
            </span>
            <button
              onClick={onEditClick}
              className="text-blue-500 hover:text-blue-600 p-1.5"
            >
              <Edit className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div>{paymentLink.public_description}</div>
          <div className="flex items-center justify-between">
            <span>
              {paymentLink.link_type === 'instant' && paymentLink.price ? (
                `${formatPrice(paymentLink.price)} ${paymentLink.currency_code}`
              ) : paymentLink.link_type === 'product' && paymentLink.product_price ? (
                `${formatPrice(paymentLink.product_price)} ${paymentLink.currency_code}`
              ) : paymentLink.link_type === 'plan' && paymentLink.plan_amount ? (
                `${formatPrice(paymentLink.plan_amount)} ${paymentLink.currency_code}`
              ) : (
                '-'
              )}
            </span>
            <a
              href={paymentLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              View Link
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

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

  const { data: paymentLinksData, isLoading: isPaymentLinksLoading, fetchNextPage, refetch } = useInfiniteQuery(
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

      if (sortColumn === 'price') {
        const aPrice = a.link_type === 'instant' ? a.price : a.link_type === 'product' ? a.product_price : a.plan_amount
        const bPrice = b.link_type === 'instant' ? b.price : b.link_type === 'product' ? b.product_price : b.plan_amount
        return sortDirection === 'asc' ? (aPrice || 0) - (bPrice || 0) : (bPrice || 0) - (aPrice || 0)
      } else if (sortColumn === 'is_active') {
        return sortDirection === 'asc' ? Number(a.is_active) - Number(b.is_active) : Number(b.is_active) - Number(a.is_active)
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
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

  const handleRefresh = async () => {
    await fetchNextPage()
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
      </DashboardLayout.Header>

      <Separator className='my-0' />
      <SupportForm />
      <DashboardLayout.Body>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-tight">Payment Links</h1>
            <Button
              variant="outline"
              onClick={() => setIsCreateLinkOpen(true)}
              className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-1 focus:ring-offset-2 focus:ring-blue-500 rounded-none"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create
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
            isRefreshing={isPaymentLinksLoading}
            onRefresh={handleRefresh}
          />

          <Card className="rounded-none">
            <CardContent className="p-4">
              <div className="border">
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-center">
                          <Button variant="ghost" onClick={() => handleSort('title')} className="rounded-none">
                            Title
                            {sortColumn === 'title' && (
                              <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                            )}
                          </Button>
                        </TableHead>
                        <TableHead className="text-center">
                          <Button variant="ghost" onClick={() => handleSort('public_description')} className="rounded-none">
                            Description
                            {sortColumn === 'public_description' && (
                              <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                            )}
                          </Button>
                        </TableHead>
                        <TableHead className="text-center">
                          <Button variant="ghost" onClick={() => handleSort('price')} className="rounded-none">
                            Price
                            {sortColumn === 'price' && (
                              <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                            )}
                          </Button>
                        </TableHead>
                        <TableHead className="text-center">
                          URL
                        </TableHead>
                        <TableHead className="text-center">
                          <Button variant="ghost" onClick={() => handleSort('link_type')} className="rounded-none">
                            Type
                            {sortColumn === 'link_type' && (
                              <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                            )}
                          </Button>
                        </TableHead>
                        <TableHead className="text-center">
                          <Button variant="ghost" onClick={() => handleSort('is_active')} className="rounded-none">
                            Status
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
                              <Skeleton className="w-full h-8 rounded-none" />
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
                            <TableCell className="text-center">{link.title}</TableCell>
                            <TableCell className="text-center">{link.public_description}</TableCell>
                            <TableCell className="text-center">
                              {link.link_type === 'instant' && link.price ? (
                                `${formatPrice(link.price)} ${link.currency_code}`
                              ) : link.link_type === 'product' && link.product_price ? (
                                `${formatPrice(link.product_price)} ${link.currency_code}`
                              ) : link.link_type === 'plan' && link.plan_amount ? (
                                `${formatPrice(link.plan_amount)} ${link.currency_code}`
                              ) : (
                                '-'
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                {link.url}
                              </a>
                            </TableCell>
                            <TableCell className="text-center">
                              <span className={`
                                inline-block px-2 py-1 text-xs font-normal rounded-none
                                ${linkTypeColors[link.link_type]}
                              `}>
                                {link.link_type.charAt(0).toUpperCase() + link.link_type.slice(1)}
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              <span className={`
                                inline-block px-2 py-1 text-xs font-normal rounded-none
                                ${link.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}
                              `}>
                                {link.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditClick(link);
                                }}
                                className="text-blue-500 hover:text-blue-600 p-1.5"
                              >
                                <Edit className="h-4.5 w-4.5" />
                              </button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div className="md:hidden">
                  {isPaymentLinksLoading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="p-4 border-b last:border-b-0">
                        <Skeleton className="w-full h-24" />
                      </div>
                    ))
                  ) : paymentLinks.length === 0 ? (
                    <div className="py-24 text-center">
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
                    </div>
                  ) : (
                    sortPaymentLinks(paymentLinks).map((link: PaymentLink) => (
                      <PaymentLinkCard
                        key={link.link_id}
                        paymentLink={link}
                        onEditClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(link);
                        }}
                        onClick={() => handlePaymentLinkClick(link)}
                      />
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout.Body>

      <Dialog open={isCreateLinkOpen} onOpenChange={setIsCreateLinkOpen}>
        <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh] sm:w-full sm:h-full overflow-hidden p-0">
          <div className="h-full overflow-auto">
            <div className="p-0">
              <PaymentCustomizerWithCheckout setIsCreateLinkOpen={setIsCreateLinkOpen} refetch={refetch} />
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
              onSuccess={() => {
                setIsEditLinkOpen(false)
              }}
              onRefresh={handleRefresh}
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
