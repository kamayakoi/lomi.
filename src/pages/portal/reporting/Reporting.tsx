import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ReportingFilters from './components/filters'
import { useUser } from '@/lib/hooks/use-user'
import AnimatedLogoLoader from '@/components/portal/loader'
import { Layout } from '@/components/custom/layout'
import { TopNav } from '@/components/portal/top-nav'
import { UserNav } from '@/components/portal/user-nav'
import Notifications from '@/components/portal/notifications'
import { Separator } from '@/components/ui/separator'
import { fetchRevenueByDate, fetchTransactionVolumeByDate, fetchTopPerformingProducts, fetchTopPerformingSubscriptionPlans, fetchProviderDistribution } from './components/support'
import { RevenueData, TransactionVolumeData, TopPerformingProduct, TopPerformingSubscriptionPlan, ProviderDistribution as ProviderDistributionType } from './components/types'
import { useQuery } from '@tanstack/react-query'
import { format, subMonths, startOfYear } from 'date-fns'
import TopPerformingItems from './components/performing-items'
import ProviderDistribution from './components/provider-distribution'
import { cn } from '@/lib/actions/utils'
import FeedbackForm from '@/components/portal/feedback-form'
import SupportForm from '@/components/portal/support-form'
import { withActivationCheck } from '@/components/custom/with-activation-check'
import { MerchantTransactionStats } from '@/pages/portal/reporting/merchant/MerchantTransactionStats'
import { MerchantGrowthChart } from '@/pages/portal/reporting/merchant/merchant-growth-chart'
import { MerchantRefundStats } from '@/pages/portal/reporting/merchant/MerchantRefundStats'
import { MerchantCustomerStats } from '@/pages/portal/reporting/merchant/MerchantCustomerStats'
import { MerchantProductStats } from '@/pages/portal/reporting/merchant/MerchantProductStats'
import { MerchantRevenueChart } from '@/pages/portal/reporting/merchant/MerchantRevenueChart'

const topNav = [
    { title: 'Reporting', href: '/portal/reporting', isActive: true },
    { title: 'Settings', href: '/portal/settings/profile', isActive: false },
]

function ReportingPage() {
    const { user, isLoading: isUserLoading } = useUser()
    const [selectedDateRange, setSelectedDateRange] = useState<string | null>('24H')

    const { data: revenueData = [], isLoading: isRevenueLoading } = useQuery<RevenueData[]>({
        queryKey: ['revenueByDate', user?.id, selectedDateRange] as const,
        queryFn: () => fetchRevenueByDate({
            merchantId: user?.id || '',
            startDate: getStartDate(selectedDateRange),
            endDate: getEndDate(selectedDateRange),
            granularity: getGranularity(selectedDateRange),
        }),
        enabled: !!user?.id
    })

    const { data: transactionVolumeData = [], isLoading: isTransactionVolumeLoading } = useQuery<TransactionVolumeData[]>({
        queryKey: ['transactionVolumeByDate', user?.id, selectedDateRange] as const,
        queryFn: () => fetchTransactionVolumeByDate({
            merchantId: user?.id || '',
            startDate: getStartDate(selectedDateRange),
            endDate: getEndDate(selectedDateRange),
            granularity: getGranularity(selectedDateRange),
        }),
        enabled: !!user?.id
    })

    const { data: topPerformingProducts = [], isLoading: isTopPerformingProductsLoading } = useQuery<TopPerformingProduct[]>({
        queryKey: ['topPerformingProducts', user?.id, selectedDateRange] as const,
        queryFn: () => fetchTopPerformingProducts({
            merchantId: user?.id || '',
            startDate: getStartDate(selectedDateRange),
            endDate: getEndDate(selectedDateRange)
        }),
        enabled: !!user?.id
    })

    const { data: topPerformingSubscriptionPlans = [], isLoading: isTopPerformingSubscriptionPlansLoading } = useQuery<TopPerformingSubscriptionPlan[]>({
        queryKey: ['topPerformingSubscriptionPlans', user?.id, selectedDateRange] as const,
        queryFn: () => fetchTopPerformingSubscriptionPlans({
            merchantId: user?.id || '',
            startDate: getStartDate(selectedDateRange),
            endDate: getEndDate(selectedDateRange)
        }),
        enabled: !!user?.id
    })

    const { data: providerDistribution = [], isLoading: isProviderDistributionLoading } = useQuery<ProviderDistributionType[]>({
        queryKey: ['providerDistribution', user?.id, selectedDateRange] as const,
        queryFn: () => fetchProviderDistribution({
            merchantId: user?.id || '',
            startDate: getStartDate(selectedDateRange),
            endDate: getEndDate(selectedDateRange)
        }),
        enabled: !!user?.id
    })

    if (isUserLoading) {
        return <AnimatedLogoLoader />
    }

    if (!user || !user.id) {
        return <div><AnimatedLogoLoader /> User data not available.</div>
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

            <Layout.Body>
                <div className="h-full overflow-y-auto overflow-x-hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <div className="space-y-4 pb-8 px-4 md:px-0 max-w-full">
                        <div className="w-[calc(100%+2rem)] -ml-4 sm:ml-0 sm:w-full">
                            <h1 className="text-2xl font-bold tracking-tight">Reporting</h1>
                        </div>

                        <div className="w-[calc(100%+2rem)] -ml-4 sm:ml-0 sm:w-full">
                            <ReportingFilters
                                selectedDateRange={selectedDateRange}
                                setSelectedDateRange={setSelectedDateRange}
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                            <Card className="rounded-none w-[calc(100%+2rem)] -ml-4 sm:ml-0 sm:w-full">
                                <MerchantRevenueChart
                                    revenueData={revenueData}
                                    transactionVolumeData={transactionVolumeData}
                                    selectedDateRange={selectedDateRange}
                                    isLoading={isRevenueLoading || isTransactionVolumeLoading}
                                />
                            </Card>

                            <Card className="rounded-none w-[calc(100%+2rem)] -ml-4 sm:ml-0 sm:w-full">
                                <ProviderDistributionCard
                                    providerDistribution={providerDistribution}
                                    isLoading={isProviderDistributionLoading}
                                />
                            </Card>

                            <Card className="rounded-none w-[calc(100%+2rem)] -ml-4 sm:ml-0 sm:w-full">
                                <TopPerformingItemsCard
                                    topPerformingProducts={topPerformingProducts}
                                    topPerformingSubscriptionPlans={topPerformingSubscriptionPlans}
                                    isLoading={isTopPerformingProductsLoading || isTopPerformingSubscriptionPlansLoading}
                                />
                            </Card>
                        </div>

                        <div className={cn(
                            "flex items-center my-8",
                            "before:content-[''] before:flex-grow before:h-0.5 before:bg-gray-200 before:dark:bg-gray-700 before:mr-4",
                            "after:content-[''] after:flex-grow after:h-0.5 after:bg-gray-200 after:dark:bg-gray-700 after:ml-4"
                        )}>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Merchant Analytics
                            </span>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <div className="w-[calc(100%+2rem)] -ml-4 sm:ml-0 sm:w-full">
                                <MerchantTransactionStats merchantId={user.id} />
                            </div>
                            <div className="w-[calc(100%+2rem)] -ml-4 sm:ml-0 sm:w-full">
                                <MerchantGrowthChart />
                            </div>
                            <div className="w-[calc(100%+2rem)] -ml-4 sm:ml-0 sm:w-full">
                                <MerchantRefundStats merchantId={user.id} />
                            </div>
                            <div className="w-[calc(100%+2rem)] -ml-4 sm:ml-0 sm:w-full">
                                <MerchantCustomerStats merchantId={user.id} />
                            </div>
                            <div className="w-[calc(100%+2rem)] -ml-4 sm:ml-0 sm:w-full">
                                <MerchantProductStats merchantId={user.id} />
                            </div>
                        </div>
                    </div>
                </div>

                <SupportForm />
            </Layout.Body>
        </Layout>
    )
}

function TopPerformingItemsCard({
    topPerformingProducts,
    topPerformingSubscriptionPlans,
    isLoading
}: {
    topPerformingProducts: TopPerformingProduct[];
    topPerformingSubscriptionPlans: TopPerformingSubscriptionPlan[];
    isLoading: boolean;
}) {
    return (
        <Card className="rounded-none">
            <CardHeader>
                <CardTitle>Performing Items</CardTitle>
            </CardHeader>
            <CardContent>
                <TopPerformingItems
                    topPerformingProducts={topPerformingProducts}
                    topPerformingSubscriptionPlans={topPerformingSubscriptionPlans}
                    isLoading={isLoading}
                />
            </CardContent>
        </Card>
    )
}

function ProviderDistributionCard({
    providerDistribution,
    isLoading
}: {
    providerDistribution: ProviderDistributionType[];
    isLoading: boolean;
}) {
    return (
        <Card className="rounded-none">
            <CardHeader>
                <CardTitle>Providers Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                <ProviderDistribution
                    providerDistribution={providerDistribution}
                    isLoading={isLoading}
                />
            </CardContent>
        </Card>
    )
}

function getStartDate(selectedDateRange: string | null): string | undefined {
    switch (selectedDateRange) {
        case '3M':
            return format(subMonths(new Date(), 3), 'yyyy-MM-dd HH:mm:ss')
        case '6M':
            return format(subMonths(new Date(), 6), 'yyyy-MM-dd HH:mm:ss')
        case 'YTD':
            return format(startOfYear(new Date()), 'yyyy-MM-dd HH:mm:ss')
        default:
            return undefined
    }
}

function getEndDate(selectedDateRange: string | null): string | undefined {
    switch (selectedDateRange) {
        case '3M':
        case '6M':
        case 'YTD':
            return format(new Date(), 'yyyy-MM-dd HH:mm:ss')
        default:
            return undefined
    }
}

function getGranularity(selectedDateRange: string | null): '24H' | '7D' | '1M' | 'hour' | 'day' | 'week' | 'month' | undefined {
    switch (selectedDateRange) {
        case '24H':
            return '24H'
        case '7D':
            return '7D'
        case '1M':
            return '1M'
        case '3M':
        case '6M':
        case 'YTD':
            return 'month'
        default:
            return undefined
    }
}

function ReportingWithActivationCheck() {
    return withActivationCheck(ReportingPage)({});
}

export default ReportingWithActivationCheck;
