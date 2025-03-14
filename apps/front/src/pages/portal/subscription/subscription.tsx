import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TopNav } from '@/components/portal/top-nav'
import { UserNav } from '@/components/portal/user-nav'
import Notifications from '@/components/portal/notifications'
import { Separator } from "@/components/ui/separator"
import { Layout } from '@/components/custom/layout'
import FeedbackForm from '@/components/portal/feedback-form'
import { useUser } from '@/lib/hooks/use-user'
import { fetchSubscriptionPlans, fetchSubscriptions } from './components/support'
import { SubscriptionPlan, Subscription, frequencyColors } from './components/types'
import { useInfiniteQuery } from '@tanstack/react-query'
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline'
import { CreatePlanForm } from './components/form'
import { SubscriptionFilters } from './components/filters'
import { SubscriptionStatus } from './components/filters'
import SupportForm from '@/components/portal/support-form'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PlusCircle, Edit, ArrowUpDown, RefreshCw } from 'lucide-react'
import SubscriptionActions from './components/actions'
import { EditPlanForm } from './components/edit'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { ClipboardList, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/actions/utils'
import React from 'react'
import Spinner from '@/components/ui/spinner'

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
      className="p-4 border-b cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
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
      className="p-4 border-b cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
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
  const [searchTerm, setSearchTerm] = useState('')
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

  const { data: subscriptionPlansData, isLoading: isSubscriptionPlansLoading, refetch: refetchPlans } = useInfiniteQuery<SubscriptionPlan[]>({
    queryKey: ['subscriptionPlans', user?.id || '', selectedStatus] as const,
    queryFn: async ({ pageParam = 1 }) => {
      return fetchSubscriptionPlans(
        user?.id || '',
        Number(pageParam),
        pageSize
      );
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: SubscriptionPlan[], allPages: SubscriptionPlan[][]) => {
      const nextPage = allPages.length + 1;
      return lastPage.length !== 0 ? nextPage : undefined;
    },
    enabled: !!user?.id
  })

  const { data: subscriptionsData, isLoading: isSubscriptionsLoading, refetch: refetchSubscriptions } = useInfiniteQuery<Subscription[]>({
    queryKey: ['subscriptions', user?.id || '', selectedStatus] as const,
    queryFn: async ({ pageParam = 1 }) => {
      return fetchSubscriptions(
        user?.id || '',
        selectedStatus,
        Number(pageParam),
        pageSize
      );
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: Subscription[], allPages: Subscription[][]) => {
      const nextPage = allPages.length + 1;
      return lastPage.length !== 0 ? nextPage : undefined;
    },
    enabled: !!user?.id
  })

  const subscriptionPlans = React.useMemo(() =>
    subscriptionPlansData?.pages?.flatMap((page: SubscriptionPlan[]) => page) || [],
    [subscriptionPlansData?.pages]
  );

  const subscriptions = React.useMemo(() =>
    subscriptionsData?.pages?.flatMap((page: Subscription[]) => page) || [],
    [subscriptionsData?.pages]
  );

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

  const filteredSubscriptionPlans = React.useMemo(() => {
    if (!searchTerm) return subscriptionPlans;
    const search = searchTerm.toLowerCase();
    return subscriptionPlans.filter(plan =>
      plan.name.toLowerCase().includes(search) ||
      plan.description?.toLowerCase().includes(search) ||
      plan.billing_frequency.toLowerCase().includes(search) ||
      // Search by price
      (plan.amount !== undefined && plan.amount.toString().includes(search)) ||
      (plan.currency_code && plan.currency_code.toLowerCase().includes(search))
    );
  }, [subscriptionPlans, searchTerm]);

  const filteredSubscriptions = React.useMemo(() => {
    if (!searchTerm) return subscriptions;
    const search = searchTerm.toLowerCase();
    return subscriptions.filter(sub =>
      sub.customer_name.toLowerCase().includes(search) ||
      sub.plan_name.toLowerCase().includes(search) ||
      sub.status.toLowerCase().includes(search) ||
      // Search by price
      (sub.amount !== undefined && sub.amount.toString().includes(search)) ||
      (sub.currency_code && sub.currency_code.toLowerCase().includes(search))
    );
  }, [subscriptions, searchTerm]);

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
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                tabsList={
                  <TabsList className="rounded-none h-[40px]">
                    <TabsTrigger value="plans" className="rounded-none h-[35px]">Plans</TabsTrigger>
                    <TabsTrigger value="subscriptions" className="rounded-none h-[35px]">Subscriptions</TabsTrigger>
                  </TabsList>
                }
              />

              <TabsContent value="plans">
                <Card className="mt-4 rounded-none">
                  <CardContent className="p-0">
                    <div id="plans-table-container" className="h-[72vh] overflow-auto relative">
                      <Button
                        variant="ghost"
                        onClick={handleRefresh}
                        className="absolute top-0.5 right-0.5 z-10 h-5 w-5 p-0 flex items-center justify-center bg-transparent text-blue-500 hover:bg-transparent hover:text-blue-600"
                        disabled={isRefreshing}
                      >
                        <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                        <span className="sr-only">Refresh</span>
                      </Button>
                      {isSubscriptionPlansLoading ? (
                        <div className="flex items-center justify-center h-[65vh]">
                          <Spinner />
                        </div>
                      ) : subscriptionPlans.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[65vh]">
                          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
                            <ClipboardList className="h-16 w-16 text-gray-400 dark:text-gray-500" />
                          </div>
                          <h3 className="text-2xl font-semibold text-gray-500 dark:text-gray-400 mt-4">
                            No subscription plans found
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto text-center mt-2">
                            Try changing your filter or create a new subscription plan.
                          </p>
                        </div>
                      ) : (
                        <>
                          {/* Desktop View */}
                          <div className="hidden md:block">
                            {sortSubscriptionPlans(filteredSubscriptionPlans).map((plan) => (
                              <div
                                key={plan.plan_id}
                                className="p-6 border-b hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors duration-200 cursor-pointer"
                                onClick={() => handlePlanClick(plan)}
                              >
                                <div className="flex gap-6">
                                  <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
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
                          <div className="md:hidden">
                            <div className="border-b">
                              {sortSubscriptionPlans(filteredSubscriptionPlans).map((plan) => (
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
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="subscriptions">
                <Card className="mt-4 rounded-none">
                  <CardContent className="p-0">
                    <div id="subscriptions-table-container" className="h-[72vh] overflow-auto relative">
                      <Button
                        variant="ghost"
                        onClick={handleRefresh}
                        className="absolute top-0.5 right-0.5 z-10 h-5 w-5 p-0 flex items-center justify-center bg-transparent text-blue-500 hover:bg-transparent hover:text-blue-600"
                        disabled={isRefreshing}
                      >
                        <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                        <span className="sr-only">Refresh</span>
                      </Button>
                      {/* Desktop View */}
                      <div className="hidden md:block">
                        <Table className="border-b">
                          <TableHeader>
                            <TableRow className="hover:bg-transparent border-b bg-muted/50">
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
                              <TableRow>
                                <TableCell colSpan={4}>
                                  <div className="flex items-center justify-center h-24">
                                    <Spinner />
                                  </div>
                                </TableCell>
                              </TableRow>
                            ) : subscriptions.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={4} className="h-[65vh]">
                                  <div className="flex flex-col items-center justify-center">
                                    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
                                      <ClipboardDocumentListIcon className="h-16 w-16 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <h3 className="text-2xl font-semibold text-gray-500 dark:text-gray-400 mt-4">
                                      No subscriptions found
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto text-center mt-2">
                                      Try changing your filter or create a new subscription.
                                    </p>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ) : (
                              sortSubscriptions(filteredSubscriptions).map((subscription: Subscription) => (
                                <TableRow
                                  key={subscription.subscription_id}
                                  className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 cursor-pointer"
                                  onClick={() => handleSubscriptionClick(subscription)}
                                >
                                  <TableCell className="text-center">{subscription.customer_name}</TableCell>
                                  <TableCell className="text-center">{subscription.plan_name}</TableCell>
                                  <TableCell className="text-center">{formatCurrency(subscription.amount, subscription.currency_code)}</TableCell>
                                  <TableCell className="text-center">
                                    <span className={cn(
                                      "inline-block px-2 py-1 text-xs font-normal",
                                      subscription.status === 'active' && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
                                      subscription.status === 'pending' && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
                                      subscription.status === 'cancelled' && "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                    )}>
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
                          <div className="flex items-center justify-center h-24">
                            <Spinner />
                          </div>
                        ) : subscriptions.length === 0 ? (
                          <div className="h-[65vh] flex items-center justify-center">
                            <div className="flex flex-col items-center">
                              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
                                <ClipboardDocumentListIcon className="h-16 w-16 text-gray-400 dark:text-gray-500" />
                              </div>
                              <h3 className="text-2xl font-semibold text-gray-500 dark:text-gray-400 mt-4">
                                No subscriptions found
                              </h3>
                              <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto text-center mt-2">
                                Try changing your filter or create a new subscription.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="border-b">
                            {sortSubscriptions(filteredSubscriptions).map((subscription: Subscription) => (
                              <SubscriptionCard
                                key={subscription.subscription_id}
                                subscription={subscription}
                                onEditClick={(e) => {
                                  e.stopPropagation();
                                  handleSubscriptionClick(subscription);
                                }}
                                onClick={() => handleSubscriptionClick(subscription)}
                              />
                            ))}
                          </div>
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

export default SubscriptionsPage;
