import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TopNav } from '@/components/portal/top-nav'
import { UserNav } from '@/components/portal/user-nav'
import Notifications from '@/components/portal/notifications'
import { Separator } from "@/components/ui/separator"
import { Layout } from '@/components/custom/layout'
import FeedbackForm from '@/components/portal/feedback-form'
import { useUser } from '@/lib/hooks/useUser'
import { fetchSubscriptionPlans, fetchSubscriptions } from './dev_subscription/support_subscriptions'
import { SubscriptionPlan, Subscription, frequencyColors } from './dev_subscription/types'
import { Skeleton } from '@/components/ui/skeleton'
import { useInfiniteQuery } from 'react-query'
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline'
import { CreatePlanForm } from './dev_subscription/form_subscriptions'
import { SubscriptionFilters } from './dev_subscription/filters_subscriptions'
import { SubscriptionStatus } from './dev_subscription/filters_subscriptions'
import SupportForm from '@/components/portal/support-form'
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
import { ClipboardList, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/actions/utils'

function formatCurrency(amount: number | undefined, currency: string | undefined): string {
  if (amount === undefined || amount === null || currency === undefined) {
    return '-';
  }
  return `${amount.toLocaleString('en-US', {
    minimumFractionDigits: amount % 1 !== 0 ? 2 : 0,
    maximumFractionDigits: amount % 1 !== 0 ? 2 : 0,
  })} ${currency}`;
}

function PlanCard({ plan, onEditClick, onClick }: {
  plan: SubscriptionPlan,
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
          <div className="font-medium">{plan.name}</div>
          <div className="flex items-center gap-1.5">
            <span className={cn(
              "px-3 py-1 text-xs font-medium",
              plan.is_active
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
            )}>
              {plan.is_active ? 'Active' : 'Inactive'}
            </span>
            <span className={cn(
              "px-3 py-1 text-xs font-medium",
              plan.display_on_storefront
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
            )}>
              Storefront
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
          {plan.description && (
            <p className="line-clamp-2 leading-relaxed">
              {plan.description}
            </p>
          )}
          <div className="pt-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold tracking-tight text-foreground">
                {formatCurrency(plan.amount, plan.currency_code)}
              </span>
              <span className={cn(
                "px-3 py-1 text-xs font-medium",
                frequencyColors[plan.billing_frequency]
              )}>
                {plan.billing_frequency.charAt(0).toUpperCase() + plan.billing_frequency.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubscriptionCard({ subscription, onEditClick, onClick }: {
  subscription: Subscription,
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
          <div className="font-medium">{subscription.customer_name}</div>
          <button
            onClick={onEditClick}
            className="text-blue-500 hover:text-blue-600 p-1.5"
          >
            <Edit className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>{subscription.plan_name}</span>
            <span className={`
                            inline-block px-2 py-1 text-xs font-normal
                            ${subscription.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : ''}
                            ${subscription.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : ''}
                            ${subscription.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : ''}
                        `}>
              {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
            </span>
          </div>
          <div className="pt-1">
            <span className="text-lg font-semibold tracking-tight text-foreground">
              {formatCurrency(subscription.amount, subscription.currency_code)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubscriptionsPage() {
  const { user } = useUser()
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<SubscriptionStatus>('all')
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
      <Layout.Body>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-tight">Subscriptions</h1>
            <Dialog open={isCreatePlanOpen} onOpenChange={setIsCreatePlanOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-1 focus:ring-offset-2 focus:ring-blue-500 rounded-none">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create
                </Button>
              </DialogTrigger>
              <DialogContent className="p-0 max-w-lg">
                <CreatePlanForm
                  onClose={() => setIsCreatePlanOpen(false)}
                  onSuccess={handleCreatePlanSuccess}
                  merchantId={user?.id || ''}
                />
              </DialogContent>
            </Dialog>
          </div>

          <Tabs defaultValue="plans">
            <div className="space-y-4">
              <SubscriptionFilters
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                refetch={handleRefresh}
                isRefreshing={isRefreshing}
                tabsList={
                  <TabsList className="rounded-none h-[40px]">
                    <TabsTrigger value="plans" className="rounded-none h-[35px]">Plans</TabsTrigger>
                    <TabsTrigger value="subscriptions" className="rounded-none h-[35px]">Subscriptions</TabsTrigger>
                  </TabsList>
                }
              />

              <TabsContent value="plans">
                <Card className="rounded-none">
                  <CardContent className="p-4 rounded-none">
                    {isSubscriptionPlansLoading ? (
                      <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <div key={index} className="p-4 border border-border">
                            <div className="flex gap-4">
                              <Skeleton className="w-32 h-32 rounded-lg flex-shrink-0" />
                              <div className="flex-grow space-y-2">
                                <Skeleton className="w-1/3 h-6" />
                                <Skeleton className="w-2/3 h-4" />
                                <Skeleton className="w-24 h-4" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : subscriptionPlans.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4">
                          <ClipboardList className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                        </div>
                        <p className="text-xl font-semibold text-gray-500 dark:text-gray-400 mt-4">
                          No subscription plans found
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs text-center mt-2">
                          Try changing your filter or create a new subscription plan.
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Desktop View */}
                        <div className="hidden md:block space-y-4">
                          {sortSubscriptionPlans(subscriptionPlans).map((plan) => (
                            <div
                              key={plan.plan_id}
                              className="p-6 border border-border hover:border-border-hover transition-colors duration-200 cursor-pointer bg-background hover:bg-gray-50/50 dark:hover:bg-gray-900/50"
                              onClick={() => handlePlanClick(plan)}
                            >
                              <div className="flex gap-6">
                                <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 shadow-sm">
                                  {plan.image_url ? (
                                    <img
                                      src={plan.image_url}
                                      alt={plan.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <ImageIcon className="h-12 w-12 text-gray-400" />
                                    </div>
                                  )}
                                </div>

                                <div className="flex-grow min-h-[128px] flex flex-col">
                                  <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-medium text-foreground text-lg leading-tight">{plan.name}</h3>
                                    <div className="flex items-center gap-1.5">
                                      <span className={cn(
                                        "px-3 py-1 text-xs font-medium",
                                        plan.is_active
                                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300"
                                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                      )}>
                                        {plan.is_active ? 'Active' : 'Inactive'}
                                      </span>
                                      <span className={cn(
                                        "px-3 py-1 text-xs font-medium",
                                        plan.display_on_storefront
                                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                                      )}>
                                        Storefront
                                      </span>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleEditPlanClick(plan)
                                        }}
                                        className="text-blue-500 hover:text-blue-600 p-1.5"
                                      >
                                        <Edit className="h-4.5 w-4.5" />
                                      </button>
                                    </div>
                                  </div>

                                  <div className="flex flex-col flex-grow justify-between">
                                    {plan.description && (
                                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                        {plan.description}
                                      </p>
                                    )}

                                    <div className="flex items-center gap-2 mt-auto pt-2">
                                      <span className="text-lg font-semibold tracking-tight">
                                        {formatCurrency(plan.amount, plan.currency_code)}
                                      </span>
                                      <span className={cn(
                                        "px-3 py-1 text-xs font-medium",
                                        frequencyColors[plan.billing_frequency]
                                      )}>
                                        {plan.billing_frequency.charAt(0).toUpperCase() + plan.billing_frequency.slice(1)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Mobile View */}
                        <div className="md:hidden border rounded-none">
                          {sortSubscriptionPlans(subscriptionPlans).map((plan) => (
                            <PlanCard
                              key={plan.plan_id}
                              plan={plan}
                              onEditClick={(e) => {
                                e.stopPropagation();
                                handleEditPlanClick(plan);
                              }}
                              onClick={() => handlePlanClick(plan)}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="subscriptions">
                <Card className="rounded-none">
                  <CardContent className="p-4">
                    <div className="border">
                      {/* Desktop View */}
                      <div className="hidden md:block">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-center">
                                <Button variant="ghost" onClick={() => handleSort('customer_name')} className="rounded-none">
                                  Customer
                                  {sortColumn === 'customer_name' && (
                                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                  )}
                                </Button>
                              </TableHead>
                              <TableHead className="text-center">
                                <Button variant="ghost" onClick={() => handleSort('plan_name')} className="rounded-none">
                                  Plan
                                  {sortColumn === 'plan_name' && (
                                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                  )}
                                </Button>
                              </TableHead>
                              <TableHead className="text-center">
                                <Button variant="ghost" onClick={() => handleSort('amount')} className="rounded-none">
                                  Price
                                  {sortColumn === 'amount' && (
                                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                  )}
                                </Button>
                              </TableHead>
                              <TableHead className="text-center">
                                <Button variant="ghost" onClick={() => handleSort('status')} className="rounded-none">
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
                                    <Skeleton className="w-full h-8 rounded-none" />
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
                                      inline-block px-2 py-1 text-xs font-normal rounded-none
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

                      {/* Mobile View */}
                      <div className="md:hidden">
                        {isSubscriptionsLoading ? (
                          Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="p-4 border-b last:border-b-0">
                              <Skeleton className="w-full h-24" />
                            </div>
                          ))
                        ) : subscriptions.length === 0 ? (
                          <div className="py-24 text-center">
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
                          </div>
                        ) : (
                          sortSubscriptions(subscriptions).map((subscription: Subscription) => (
                            <SubscriptionCard
                              key={subscription.subscription_id}
                              subscription={subscription}
                              onEditClick={(e) => {
                                e.stopPropagation();
                                handleSubscriptionClick(subscription);
                              }}
                              onClick={() => handleSubscriptionClick(subscription)}
                            />
                          ))
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
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
        <DialogContent className="p-0 max-w-lg">
          {selectedPlan && (
            <EditPlanForm
              plan={selectedPlan}
              onClose={() => setIsEditPlanOpen(false)}
              onSuccess={() => {
                handleRefresh()
                setIsEditPlanOpen(false)
              }}
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
