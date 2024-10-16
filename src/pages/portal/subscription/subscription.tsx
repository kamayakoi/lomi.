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
import { fetchSubscriptions } from './dev_subscription/support_subscriptions'
import { Subscription } from './dev_subscription/types'
import { Skeleton } from '@/components/ui/skeleton'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useInfiniteQuery } from 'react-query'
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline'
import { CreatePlanForm } from './dev_subscription/form_subscriptions'
import { SubscriptionFilters } from './dev_subscription/filters_subscriptions'

export default function SubscriptionsPage() {
  const { user } = useUser()
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const pageSize = 50

  const topNav = [
    { title: 'Subscriptions', href: '/portal/subscription', isActive: true },
    { title: 'Settings', href: '/portal/settings/profile', isActive: false },
  ]

  const { data: subscriptionsData, isLoading: isSubscriptionsLoading, fetchNextPage, refetch } = useInfiniteQuery(
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

  const subscriptions = subscriptionsData?.pages?.flatMap((page) => page) || []

  const handleCreatePlanSuccess = () => {
    refetch()
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
            <Button onClick={() => setIsCreatePlanOpen(true)}>Create Plan</Button>
          </div>

          <Tabs defaultValue="plans">
            <TabsList>
              <TabsTrigger value="plans">Plans</TabsTrigger>
              <TabsTrigger value="cycles">Cycles</TabsTrigger>
            </TabsList>

            <TabsContent value="plans">
              <SubscriptionFilters
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                refetch={refetch}
              />

              <div className="rounded-md border mt-4">
                <div className="max-h-[calc(100vh-210px)] overflow-y-scroll pr-2 scrollbar-hide">
                  <InfiniteScroll
                    dataLength={subscriptions.length}
                    next={() => fetchNextPage()}
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
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <div className="rounded-full bg-transparent dark:bg-transparent p-4">
                            <ClipboardDocumentListIcon className="h-40 w-40 text-gray-400 dark:text-gray-500" />
                          </div>
                          <p className="text-xl font-semibold text-gray-500 dark:text-gray-400">
                            No subscription plans found
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs text-center">
                            Try changing your filter or create a new plan.
                          </p>
                        </div>
                      </div>
                    ) : (
                      subscriptions.map((subscription: Subscription) => (
                        <div key={subscription.subscription_id} className="py-4 px-6 border-b">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-lg font-semibold">{subscription.name}</p>
                              <p className="text-sm text-muted-foreground">{subscription.description}</p>
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

            <TabsContent value="cycles">
              {/* Add cycles content here */}
            </TabsContent>
          </Tabs>
        </div>
      </Layout.Body>

      {isCreatePlanOpen && <CreatePlanForm onClose={() => setIsCreatePlanOpen(false)} onSuccess={handleCreatePlanSuccess} />}
    </Layout>
  )
}
