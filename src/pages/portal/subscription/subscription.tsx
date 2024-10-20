import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TopNav } from '@/components/dashboard/top-nav'
import { UserNav } from '@/components/dashboard/user-nav'
import Notifications from '@/components/dashboard/notifications'
import { Separator } from "@/components/ui/separator"
import { Layout } from '@/components/custom/layout'
import FeedbackForm from '@/components/dashboard/feedback-form'
import { useUser } from '@/lib/hooks/useUser'
import { fetchSubscriptionPlans, fetchSubscriptions } from './dev_subscription/support_subscriptions'
import { SubscriptionPlan, Subscription, frequency } from './dev_subscription/types'
import { Skeleton } from '@/components/ui/skeleton'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useInfiniteQuery } from 'react-query'
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline'
import { CreatePlanForm } from './dev_subscription/form_subscriptions'
import { SubscriptionFilters } from './dev_subscription/filters_subscriptions'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PlusCircle } from 'lucide-react'
import SubscriptionActions from './dev_subscription/actions_subscriptions'
import { EditPlanForm } from './dev_subscription/edit_plan_subscriptions'
import { withActivationCheck } from '@/components/custom/withActivationCheck'

const frequencyColors: Record<frequency, string> = {
  'weekly': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'bi-weekly': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  'monthly': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'bi-monthly': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  'quarterly': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
  'semi-annual': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  'yearly': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  'one-time': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};

function SubscriptionsPage() {
  const { user } = useUser()
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const pageSize = 50
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)
  const [isActionsOpen, setIsActionsOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)
  const [isEditPlanOpen, setIsEditPlanOpen] = useState(false)

  const topNav = [
    { title: 'Subscriptions', href: '/portal/subscription', isActive: true },
    { title: 'Settings', href: '/portal/settings/profile', isActive: false },
  ]

  const { data: subscriptionPlansData, isLoading: isSubscriptionPlansLoading, fetchNextPage: fetchNextPagePlans, refetch: refetchPlans } = useInfiniteQuery(
    ['subscriptionPlans', user?.id || ''],
    ({ pageParam = 1 }) =>
      fetchSubscriptionPlans(
        user?.id || '',
        pageParam,
        pageSize
      ),
    {
      getNextPageParam: (lastPage: SubscriptionPlan[], allPages: SubscriptionPlan[][]) => {
        const nextPage = allPages.length + 1
        return lastPage.length !== 0 ? nextPage : undefined
      },
      enabled: !!user?.id,
    }
  )

  const { data: subscriptionsData, isLoading: isSubscriptionsLoading, fetchNextPage: fetchNextPageSubscriptions, refetch: refetchSubscriptions } = useInfiniteQuery(
    ['subscriptions', user?.id || '', selectedStatus],
    ({ pageParam = 1 }) =>
      fetchSubscriptions(
        user?.id || '',
        selectedStatus,
        pageParam,
        pageSize
      ),
    {
      getNextPageParam: (lastPage: Subscription[], allPages: Subscription[][]) => {
        const nextPage = allPages.length + 1
        return lastPage.length !== 0 ? nextPage : undefined
      },
      enabled: !!user?.id,
    }
  )

  const subscriptionPlans = subscriptionPlansData?.pages?.flatMap((page) => page) || []
  const subscriptions = subscriptionsData?.pages?.flatMap((page) => page) || []

  const handleCreatePlanSuccess = () => {
    refetchPlans()
  }

  const handleSubscriptionClick = (subscription: Subscription) => {
    setSelectedSubscription(subscription)
    setIsActionsOpen(true)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await Promise.all([refetchPlans(), refetchSubscriptions()])
    setIsRefreshing(false)
  }

  const handlePlanClick = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan)
    setIsEditPlanOpen(true)
  }

  const handleEditPlanSuccess = () => {
    refetchPlans()
  }

  function formatCurrency(amount: number | undefined, currency: string | undefined): string {
    if (amount === undefined || amount === null || currency === undefined) {
      return '-';
    }
    return `${amount.toLocaleString('en-US', { minimumFractionDigits: 0 })} ${currency}`;
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

      <Layout.Body>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-tight">Subscriptions</h1>
            <Dialog open={isCreatePlanOpen} onOpenChange={setIsCreatePlanOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[845px]">
                <CreatePlanForm
                  onClose={() => setIsCreatePlanOpen(false)}
                  onSuccess={handleCreatePlanSuccess}
                  merchantId={user?.id || ''}
                />
              </DialogContent>
            </Dialog>
          </div>

          <Tabs defaultValue="plans">
            <TabsList>
              <TabsTrigger value="plans">Plans</TabsTrigger>
              <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            </TabsList>

            <TabsContent value="plans">
              <SubscriptionFilters
                refetch={handleRefresh}
                isRefreshing={isRefreshing}
              />

              <div className="rounded-md border mt-4">
                <div className="max-h-[calc(100vh-250px)] overflow-y-auto pr-2 scrollbar-hide">
                  <InfiniteScroll
                    dataLength={subscriptionPlans.length}
                    next={() => fetchNextPagePlans()}
                    hasMore={subscriptionPlansData?.pages[subscriptionPlansData.pages.length - 1]?.length === pageSize}
                    loader={<Skeleton className="w-full h-8" />}
                  >
                    {isSubscriptionPlansLoading ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="py-4 px-6 border-b">
                          <Skeleton className="w-full h-8" />
                        </div>
                      ))
                    ) : subscriptionPlans.length === 0 ? (
                      <div className="py-24 text-center">
                        <div className="flex justify-center mb-6">
                          <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4">
                            <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400">
                          No subscription plans found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                          Try changing your filter or create a new plan.
                        </p>
                      </div>
                    ) : (
                      subscriptionPlans.map((plan: SubscriptionPlan) => (
                        <div key={plan.plan_id} className="py-4 px-6 border-b">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-lg font-semibold">{plan.name}</p>
                              <p className="text-sm text-muted-foreground">{plan.description}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-normal ${frequencyColors[plan.billing_frequency]}`}>
                                {plan.billing_frequency.charAt(0).toUpperCase() + plan.billing_frequency.slice(1)}
                              </span>
                              <Button variant="ghost" size="sm" onClick={() => handlePlanClick(plan)}>
                                Edit
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </InfiniteScroll>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="subscriptions">
              <SubscriptionFilters
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                refetch={handleRefresh}
                isRefreshing={isRefreshing}
              />

              <div className="rounded-md border mt-4">
                <div className="max-h-[calc(100vh-250px)] overflow-y-auto pr-2 scrollbar-hide">
                  <InfiniteScroll
                    dataLength={subscriptions.length}
                    next={() => fetchNextPageSubscriptions()}
                    hasMore={subscriptionsData?.pages[subscriptionsData.pages.length - 1]?.length === pageSize}
                    loader={<Skeleton className="w-full h-8" />}
                  >
                    {isSubscriptionsLoading ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="py-4 px-6 border-b">
                          <Skeleton className="w-full h-8" />
                        </div>
                      ))
                    ) : subscriptions.length === 0 ? (
                      <div className="py-24 text-center">
                        <div className="flex justify-center mb-6">
                          <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4">
                            <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400">
                          No subscriptions found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                          Try changing your filter or create a new subscription.
                        </p>
                      </div>
                    ) : (
                      subscriptions.map((subscription: Subscription) => (
                        <div
                          key={subscription.subscription_id}
                          className="py-4 px-6 border-b cursor-pointer"
                          onClick={() => handleSubscriptionClick(subscription)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-lg font-semibold">{subscription.customer_name}</p>
                              <p className="text-sm text-muted-foreground">{subscription.plan_name}</p>
                              <p className="text-sm text-muted-foreground">{formatCurrency(subscription.amount, subscription.currency_code)}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`
                                inline-block px-2 py-1 rounded-full text-xs font-normal
                                ${subscription.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : ''}
                                ${subscription.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : ''}
                                ${subscription.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : ''}
                              `}>
                                {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                              </span>
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </InfiniteScroll>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Layout.Body>

      <SubscriptionActions
        subscription={selectedSubscription}
        isOpen={isActionsOpen}
        onClose={() => setIsActionsOpen(false)}
      />

      <Dialog open={isEditPlanOpen} onOpenChange={setIsEditPlanOpen}>
        <DialogContent className="sm:max-w-[845px]">
          {selectedPlan && (
            <EditPlanForm
              onClose={() => setIsEditPlanOpen(false)}
              onSuccess={handleEditPlanSuccess}
              plan={selectedPlan}
            />
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  )
}

function SubscriptionsWithActivationCheck() {
  return withActivationCheck(SubscriptionsPage)({});
}

export default SubscriptionsWithActivationCheck;
