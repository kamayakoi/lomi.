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
import { useInfiniteQuery } from 'react-query'
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline'
import { CreatePlanForm } from './dev_subscription/form_subscriptions'
import { SubscriptionFilters } from './dev_subscription/filters_subscriptions'
import SupportForm from '@/components/dashboard/support-form'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PlusCircle, Edit, ArrowUpDown } from 'lucide-react'
import SubscriptionActions from './dev_subscription/actions_subscriptions'
import { EditPlanForm } from './dev_subscription/edit_plan_subscriptions'
import { withActivationCheck } from '@/components/custom/withActivationCheck'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"

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
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)
  const [isEditPlanOpen, setIsEditPlanOpen] = useState(false)
  const [isPlanActionsOpen, setIsPlanActionsOpen] = useState(false)
  const [isSubscriptionActionsOpen, setIsSubscriptionActionsOpen] = useState(false)
  const [sortColumn, setSortColumn] = useState<keyof SubscriptionPlan | keyof Subscription | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const topNav = [
    { title: 'Subscriptions', href: '/portal/subscription', isActive: true },
    { title: 'Settings', href: '/portal/settings/profile', isActive: false },
  ]

  const { data: subscriptionPlansData, isLoading: isSubscriptionPlansLoading, refetch: refetchPlans } = useInfiniteQuery(
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

  const { data: subscriptionsData, isLoading: isSubscriptionsLoading, refetch: refetchSubscriptions } = useInfiniteQuery(
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
    setIsSubscriptionActionsOpen(true)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await Promise.all([refetchPlans(), refetchSubscriptions()])
    setIsRefreshing(false)
  }

  const handlePlanClick = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan)
    setIsPlanActionsOpen(true)
  }

  const handleEditPlanClick = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan)
    setIsEditPlanOpen(true)
  }

  const handleEditPlanSuccess = () => {
    refetchPlans()
  }

  const handleSort = (column: keyof SubscriptionPlan | keyof Subscription) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const sortSubscriptionPlans = (plans: SubscriptionPlan[]) => {
    if (!sortColumn) return plans

    return plans.sort((a, b) => {
      const aValue = a[sortColumn as keyof SubscriptionPlan]
      const bValue = b[sortColumn as keyof SubscriptionPlan]

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
      } else {
        return 0
      }
    })
  }

  const sortSubscriptions = (subscriptions: Subscription[]) => {
    if (!sortColumn) return subscriptions

    return subscriptions.sort((a, b) => {
      const aValue = a[sortColumn as keyof Subscription]
      const bValue = b[sortColumn as keyof Subscription]

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
      } else {
        return 0
      }
    })
  }

  function formatCurrency(amount: number | undefined, currency: string | undefined): string {
    if (amount === undefined || amount === null || currency === undefined) {
      return '-';
    }
    return `${amount.toLocaleString('en-US', {
      minimumFractionDigits: amount % 1 !== 0 ? 2 : 0,
      maximumFractionDigits: amount % 1 !== 0 ? 2 : 0,
    })} ${currency}`;
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
      <SupportForm />
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

              <Card className="mt-4">
                <CardContent className="p-4">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-center">
                            <Button variant="ghost" onClick={() => handleSort('name')}>
                              Name
                              {sortColumn === 'name' && (
                                <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                              )}
                            </Button>
                          </TableHead>
                          <TableHead className="text-center">
                            <Button variant="ghost" onClick={() => handleSort('description')}>
                              Description
                              {sortColumn === 'description' && (
                                <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                              )}
                            </Button>
                          </TableHead>
                          <TableHead className="text-center">
                            <Button variant="ghost" onClick={() => handleSort('amount')}>
                              Price
                              {sortColumn === 'amount' && (
                                <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                              )}
                            </Button>
                          </TableHead>
                          <TableHead className="text-center">
                            <Button variant="ghost" onClick={() => handleSort('billing_frequency')}>
                              Frequency
                              {sortColumn === 'billing_frequency' && (
                                <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                              )}
                            </Button>
                          </TableHead>
                          <TableHead className="text-center"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isSubscriptionPlansLoading ? (
                          Array.from({ length: 5 }).map((_, index) => (
                            <TableRow key={index}>
                              <TableCell colSpan={5}>
                                <Skeleton className="w-full h-8" />
                              </TableCell>
                            </TableRow>
                          ))
                        ) : subscriptionPlans.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8">
                              <div className="flex flex-col items-center justify-center space-y-4">
                                <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4">
                                  <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                                </div>
                                <p className="text-xl font-semibold text-gray-500 dark:text-gray-400">
                                  No subscription plans found
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs text-center">
                                  Try changing your filter or create a new plan.
                                </p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          sortSubscriptionPlans(subscriptionPlans).map((plan: SubscriptionPlan) => (
                            <TableRow
                              key={plan.plan_id}
                              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                              onClick={(e) => {
                                if (!(e.target instanceof HTMLButtonElement)) {
                                  handlePlanClick(plan);
                                }
                              }}
                            >
                              <TableCell className="text-center">{plan.name}</TableCell>
                              <TableCell className="text-center">{plan.description}</TableCell>
                              <TableCell className="text-center">{formatCurrency(plan.amount, plan.currency_code)}</TableCell>
                              <TableCell className="text-center">
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-normal ${frequencyColors[plan.billing_frequency]}`}>
                                  {plan.billing_frequency.charAt(0).toUpperCase() + plan.billing_frequency.slice(1)}
                                </span>
                              </TableCell>
                              <TableCell className="text-center">
                                <div className="flex justify-center space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditPlanClick(plan);
                                    }}
                                  >
                                    <Edit className="h-4 w-4 text-blue-500" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subscriptions">
              <SubscriptionFilters
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                refetch={handleRefresh}
                isRefreshing={isRefreshing}
              />

              <Card className="mt-4">
                <CardContent className="p-4">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-center">
                            <Button variant="ghost" onClick={() => handleSort('customer_name')}>
                              Customer
                              {sortColumn === 'customer_name' && (
                                <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                              )}
                            </Button>
                          </TableHead>
                          <TableHead className="text-center">
                            <Button variant="ghost" onClick={() => handleSort('plan_name')}>
                              Plan
                              {sortColumn === 'plan_name' && (
                                <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                              )}
                            </Button>
                          </TableHead>
                          <TableHead className="text-center">
                            <Button variant="ghost" onClick={() => handleSort('amount')}>
                              Price
                              {sortColumn === 'amount' && (
                                <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                              )}
                            </Button>
                          </TableHead>
                          <TableHead className="text-center">
                            <Button variant="ghost" onClick={() => handleSort('status')}>
                              Status
                              {sortColumn === 'status' && (
                                <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                              )}
                            </Button>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isSubscriptionsLoading ? (
                          Array.from({ length: 5 }).map((_, index) => (
                            <TableRow key={index}>
                              <TableCell colSpan={4}>
                                <Skeleton className="w-full h-8" />
                              </TableCell>
                            </TableRow>
                          ))
                        ) : subscriptions.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8">
                              <div className="flex flex-col items-center justify-center space-y-4">
                                <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4">
                                  <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                                </div>
                                <p className="text-xl font-semibold text-gray-500 dark:text-gray-400">
                                  No subscriptions found
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs text-center">
                                  Try changing your filter or create a new subscription.
                                </p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          sortSubscriptions(subscriptions).map((subscription: Subscription) => (
                            <TableRow
                              key={subscription.subscription_id}
                              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                              onClick={() => handleSubscriptionClick(subscription)}
                            >
                              <TableCell className="text-center">{subscription.customer_name}</TableCell>
                              <TableCell className="text-center">{subscription.plan_name}</TableCell>
                              <TableCell className="text-center">{formatCurrency(subscription.amount, subscription.currency_code)}</TableCell>
                              <TableCell className="text-center">
                                <span className={`
                                  inline-block px-2 py-1 rounded-full text-xs font-normal
                                  ${subscription.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : ''}
                                  ${subscription.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : ''}
                                  ${subscription.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : ''}
                                `}>
                                  {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Layout.Body>

      <SubscriptionActions
        plan={selectedPlan}
        isOpen={isPlanActionsOpen}
        onClose={() => setIsPlanActionsOpen(false)}
      />

      <SubscriptionActions
        subscription={selectedSubscription}
        isOpen={isSubscriptionActionsOpen}
        onClose={() => setIsSubscriptionActionsOpen(false)}
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
