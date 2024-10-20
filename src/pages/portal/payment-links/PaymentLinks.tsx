import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { PlusCircle, Link2Icon } from 'lucide-react'
import { Layout as DashboardLayout } from '@/components/custom/layout'
import { Separator } from '@/components/ui/separator'
import { TopNav } from '@/components/dashboard/top-nav'
import { UserNav } from '@/components/dashboard/user-nav'
import Notifications from '@/components/dashboard/notifications'
import FeedbackForm from '@/components/dashboard/feedback-form'
import PaymentCustomizerWithCheckout from './dev_payment-links/customize-form'
import { useUser } from '@/lib/hooks/useUser'
import { Skeleton } from '@/components/ui/skeleton'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useInfiniteQuery } from 'react-query'
import AnimatedLogoLoader from '@/components/dashboard/loader'
import PaymentLinkFilters from './dev_payment-links/filters_paymentLinks'
import { fetchPaymentLinks } from './dev_payment-links/support_paymentLinks'
import { PaymentLink } from './dev_payment-links/types'
import { withActivationCheck } from '@/components/custom/withActivationCheck'

function PaymentLinksPage() {
  const { user, isLoading: isUserLoading } = useUser()
  const [isCreateLinkOpen, setIsCreateLinkOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLinkType, setSelectedLinkType] = useState<string | null>(null)
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const pageSize = 50

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
          />

          <Card>
            <CardContent className="p-6">
              <div className="rounded-md border">
                <InfiniteScroll
                  dataLength={paymentLinks.length}
                  next={() => fetchNextPage()}
                  hasMore={!!(paymentLinksData?.pages && paymentLinksData.pages[paymentLinksData.pages.length - 1]?.length === pageSize)}
                  loader={<Skeleton className="w-full h-8" />}
                >
                  {isPaymentLinksLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} className="p-4 border-b last:border-b-0">
                        <Skeleton className="w-full h-4" />
                        <Skeleton className="w-1/2 h-4 mt-2" />
                      </div>
                    ))
                  ) : paymentLinks.length === 0 ? (
                    <div className="p-4 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="rounded-full bg-transparent dark:bg-transparent p-4">
                          <Link2Icon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                        </div>
                        <p className="text-xl font-semibold text-gray-500 dark:text-gray-400">
                          No payment links found
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs text-center">
                          Start creating payment links to see them here.
                        </p>
                      </div>
                    </div>
                  ) : (
                    paymentLinks.map((link: PaymentLink) => (
                      <div key={link.link_id} className="p-4 border-b last:border-b-0">
                        <h3 className="text-lg font-semibold">{link.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{link.public_description}</p>
                        <p className="text-sm text-blue-500 mt-1">{link.url}</p>
                      </div>
                    ))
                  )}
                </InfiniteScroll>
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
    </DashboardLayout>
  )
}

function PaymentLinksWithActivationCheck() {
  return withActivationCheck(PaymentLinksPage)({});
}

export default PaymentLinksWithActivationCheck;
