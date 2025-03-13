import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { PlusCircle, Edit } from 'lucide-react'
import { Layout as DashboardLayout } from '@/components/custom/layout'
import { Separator } from '@/components/ui/separator'
import { TopNav } from '@/components/portal/top-nav'
import { UserNav } from '@/components/portal/user-nav'
import Notifications from '@/components/portal/notifications'
import FeedbackForm from '@/components/portal/feedback-form'
import PaymentCustomizerWithCheckout from './components/customize-form'
import { useUser } from '@/lib/hooks/use-user'
import { useInfiniteQuery } from '@tanstack/react-query'
import AnimatedLogoLoader from '@/components/portal/loader'
import { PaymentLinkFilters } from './components/filters'
import { fetchPaymentLinks } from './components/support'
import { PaymentLink, link_type, currency_code } from './components/types'
import { Link2Icon } from 'lucide-react'
import SupportForm from '@/components/portal/support-form'
import PaymentLinkActions from './components/actions'
import { EditPaymentLinkForm } from './components/edit'
import { cn } from '@/lib/actions/utils'
import React from 'react'
import Spinner from '@/components/ui/spinner'

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
      className="p-4 border-b cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
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
  const [sortColumn] = useState<keyof PaymentLink | null>(null)
  const [sortDirection] = useState<'asc' | 'desc'>('asc')
  const pageSize = 50
  const [selectedPaymentLink, setSelectedPaymentLink] = useState<PaymentLink | null>(null)
  const [isActionsOpen, setIsActionsOpen] = useState(false)
  const [isEditLinkOpen, setIsEditLinkOpen] = useState(false)

  const topNav = [
    { title: 'payment_links', href: 'payment-links', isActive: true },
    { title: 'Settings', href: 'settings', isActive: false },
  ]

  const { data: paymentLinksData, isLoading: isPaymentLinksLoading, refetch } = useInfiniteQuery({
    queryKey: ['paymentLinks', user?.id || '', selectedLinkType, selectedCurrency, selectedStatus, searchTerm] as const,
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const result = await fetchPaymentLinks(
          user?.id || '',
          selectedLinkType,
          selectedCurrency,
          selectedStatus,
          pageParam,
          pageSize,
          false
        )
        // Ensure we always return an array
        return Array.isArray(result) ? result : []
      } catch (error) {
        console.error('Error in useInfiniteQuery:', error)
        return []
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || !Array.isArray(lastPage) || lastPage.length === 0) return undefined
      const nextPage = allPages.length + 1
      return lastPage.length !== 0 ? nextPage : undefined
    },
    enabled: !!user?.id
  })

  const handleRefresh = async () => {
    await refetch()
  }

  const paymentLinks = React.useMemo(() =>
    paymentLinksData?.pages?.flatMap(page => page).filter(Boolean) || [],
    [paymentLinksData?.pages]
  );

  const filteredPaymentLinks = React.useMemo(() => {
    if (!searchTerm) return paymentLinks;

    const search = searchTerm.toLowerCase();
    return paymentLinks.filter(link =>
      link.title.toLowerCase().includes(search) ||
      link.public_description?.toLowerCase().includes(search) ||
      link.currency_code.toLowerCase().includes(search) ||
      link.link_type.toLowerCase().includes(search) ||
      // Search by price/amount
      (link.link_type === 'instant' && link.price?.toString().includes(search)) ||
      (link.link_type === 'product' && link.product_price?.toString().includes(search)) ||
      (link.link_type === 'plan' && link.plan_amount?.toString().includes(search))
    );
  }, [paymentLinks, searchTerm]);

  const sortPaymentLinks = (paymentLinks: PaymentLink[]) => {
    if (!paymentLinks || !sortColumn) return paymentLinks || []

    return [...paymentLinks].sort((a, b) => {
      const aValue = a?.[sortColumn]
      const bValue = b?.[sortColumn]

      if (sortColumn === 'price') {
        const aPrice = a?.link_type === 'instant' ? a?.price : a?.link_type === 'product' ? a?.product_price : a?.plan_amount
        const bPrice = b?.link_type === 'instant' ? b?.price : b?.link_type === 'product' ? b?.product_price : b?.plan_amount
        return sortDirection === 'asc' ? (aPrice || 0) - (bPrice || 0) : (bPrice || 0) - (aPrice || 0)
      } else if (sortColumn === 'is_active') {
        return sortDirection === 'asc' ? Number(a?.is_active) - Number(b?.is_active) : Number(b?.is_active) - Number(a?.is_active)
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
            <CardContent className="p-0">
              <div id="payment-links-table-container" className="h-[72vh] overflow-auto">
                <div className="border-0">
                  <div className="hidden md:block">
                    {isPaymentLinksLoading ? (
                      <div className="flex items-center justify-center h-[65vh]">
                        <Spinner />
                      </div>
                    ) : !filteredPaymentLinks.length ? (
                      <div className="flex flex-col items-center justify-center h-[65vh]">
                        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
                          <Link2Icon className="h-16 w-16 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-500 dark:text-gray-400 mt-4">
                          No payment links found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto text-center mt-2">
                          Try changing your filter or create a new payment link.
                        </p>
                      </div>
                    ) : (
                      <div className="border-b">
                        {sortPaymentLinks(filteredPaymentLinks).map((link: PaymentLink) => (
                          <div
                            key={link.link_id}
                            className="p-6 border-b hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors duration-200 cursor-pointer"
                            onClick={() => handlePaymentLinkClick(link)}
                          >
                            <div className="flex gap-6">
                              <div className="flex-grow">
                                <div className="flex items-start justify-between mb-2">
                                  <h3 className="font-medium text-foreground text-lg leading-tight">{link.title}</h3>
                                  <div className="flex items-center gap-1.5">
                                    <span className={cn(
                                      "px-3 py-1 text-xs font-medium",
                                      link.is_active
                                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300"
                                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                    )}>
                                      {link.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                    <span className={`
                                      inline-flex items-center px-2 h-5 text-xs font-medium rounded-none
                                      ${linkTypeColors[link.link_type]}
                                    `}>
                                      {link.link_type.charAt(0).toUpperCase() + link.link_type.slice(1)}
                                    </span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditClick(link);
                                      }}
                                      className="text-blue-500 hover:text-blue-600 p-1.5"
                                    >
                                      <Edit className="h-4.5 w-4.5" />
                                    </button>
                                  </div>
                                </div>

                                <div className="flex flex-col flex-grow justify-between">
                                  {link.public_description && (
                                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                      {link.public_description}
                                    </p>
                                  )}

                                  <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center gap-2">
                                      <span className="text-lg font-semibold tracking-tight">
                                        {link.link_type === 'instant' && link.price ? (
                                          `${formatPrice(link.price)} ${link.currency_code}`
                                        ) : link.link_type === 'product' && link.product_price ? (
                                          `${formatPrice(link.product_price)} ${link.currency_code}`
                                        ) : link.link_type === 'plan' && link.plan_amount ? (
                                          `${formatPrice(link.plan_amount)} ${link.currency_code}`
                                        ) : (
                                          '-'
                                        )}
                                      </span>
                                    </div>
                                    <a
                                      href={link.url}
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
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="md:hidden">
                    {isPaymentLinksLoading ? (
                      <div className="flex items-center justify-center h-24">
                        <Spinner />
                      </div>
                    ) : !filteredPaymentLinks.length ? (
                      <div className="h-[65vh] flex items-center justify-center">
                        <div className="flex flex-col items-center">
                          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
                            <Link2Icon className="h-16 w-16 text-gray-400 dark:text-gray-500" />
                          </div>
                          <h3 className="text-2xl font-semibold text-gray-500 dark:text-gray-400 mt-4">
                            No payment links found
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto text-center mt-2">
                            Try changing your filter or create a new payment link.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="border-b">
                        {sortPaymentLinks(filteredPaymentLinks).map((link: PaymentLink) => (
                          <PaymentLinkCard
                            key={link.link_id}
                            paymentLink={link}
                            onEditClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(link);
                            }}
                            onClick={() => handlePaymentLinkClick(link)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
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

export default PaymentLinksPage;