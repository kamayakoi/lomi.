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
import { format, subDays, subMonths, startOfYear } from 'date-fns'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import TopPerformingItems from './components/performing-items'
import ProviderDistribution from './components/provider-distribution'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/actions/utils'
import { ChartBarSquareIcon } from '@heroicons/react/24/outline'
import FeedbackForm from '@/components/portal/feedback-form'
import SupportForm from '@/components/portal/support-form'
import { withActivationCheck } from '@/components/custom/with-activation-check'

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

                        <Card className="rounded-none w-[calc(100%+2rem)] -ml-4 sm:ml-0 sm:w-full">
                            <RevenueTransactionsChart
                                revenueData={revenueData}
                                transactionVolumeData={transactionVolumeData}
                                selectedDateRange={selectedDateRange}
                                isLoading={isRevenueLoading || isTransactionVolumeLoading}
                            />
                        </Card>

                        <div className={cn(
                            "flex items-center my-8",
                            "before:content-[''] before:flex-grow before:h-0.5 before:bg-gray-200 before:dark:bg-gray-700 before:mr-4",
                            "after:content-[''] after:flex-grow after:h-0.5 after:bg-gray-200 after:dark:bg-gray-700 after:ml-4"
                        )}>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                +
                            </span>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <Card className="rounded-none w-[calc(100%+2rem)] -ml-4 sm:ml-0 sm:w-full">
                                <TopPerformingItemsCard
                                    topPerformingProducts={topPerformingProducts}
                                    topPerformingSubscriptionPlans={topPerformingSubscriptionPlans}
                                    isLoading={isTopPerformingProductsLoading || isTopPerformingSubscriptionPlansLoading}
                                />
                            </Card>

                            <Card className="rounded-none w-[calc(100%+2rem)] -ml-4 sm:ml-0 sm:w-full">
                                <ProviderDistributionCard
                                    providerDistribution={providerDistribution}
                                    isLoading={isProviderDistributionLoading}
                                />
                            </Card>
                        </div>
                    </div>
                </div>

                <SupportForm />
            </Layout.Body>
        </Layout>
    )
}

function RevenueTransactionsChart({
    revenueData,
    transactionVolumeData,
    selectedDateRange,
    isLoading
}: {
    revenueData: RevenueData[];
    transactionVolumeData: TransactionVolumeData[];
    selectedDateRange: string | null;
    isLoading: boolean;
}) {
    const chartData = getChartData(revenueData, transactionVolumeData, selectedDateRange)

    return (
        <Card className="rounded-none">
            <CardHeader>
                <CardTitle>Revenue | Transactions</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="h-96">
                        <Skeleton className="h-full rounded-none" />
                    </div>
                ) : chartData === null ? (
                    <div className="flex flex-col items-center justify-center h-full pt-12">
                        <div className="text-center">
                            <div className="flex justify-center mb-6">
                                <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4">
                                    <ChartBarSquareIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold mb-2 dark:text-white">No data to show</h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                                Process transactions to see your revenue and transactions chart.
                            </p>
                        </div>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={chartData}>
                            <XAxis dataKey={selectedDateRange === '24H' ? 'hour' : (selectedDateRange === '3M' || selectedDateRange === '6M' || selectedDateRange === 'YTD' ? 'month' : 'date')} />
                            <YAxis
                                yAxisId="left"
                                orientation="left"
                                stroke="currentColor"
                                tickFormatter={(value) => `${formatAmount(value)} XOF`}
                                width={100}
                                fontSize={12}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                stroke="currentColor"
                                allowDecimals={false}
                                domain={[0, 'dataMax']}
                            />
                            <Tooltip
                                formatter={(value: number, name: string) => [
                                    name === 'Revenue' ? `${formatAmount(value)} XOF` : formatAmount(value),
                                    name
                                ]}
                                labelStyle={{ color: 'black' }}
                                cursor={false}
                                contentStyle={{
                                    borderRadius: '0px',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                                }}
                            />
                            <Legend />
                            <Bar yAxisId="left" dataKey="revenue" fill="#22c55e" name="Revenue" fillOpacity={1} />
                            <Bar yAxisId="right" dataKey="transaction_count" fill="#3b82f6" name="Transactions" fillOpacity={1} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
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

function formatAmount(amount: number): string {
    return amount.toLocaleString('en-US', { minimumFractionDigits: 0 })
}

function getChartData(revenueData: RevenueData[], transactionVolumeData: TransactionVolumeData[], selectedDateRange: string | null) {
    if (revenueData.length === 0 && transactionVolumeData.length === 0) {
        return null
    }

    if (selectedDateRange === '24H') {
        return revenueData.map((revenueItem, index) => ({
            hour: format(new Date(revenueItem.date), 'HH:mm'),
            revenue: revenueItem.revenue,
            transaction_count: transactionVolumeData[index]?.transaction_count || 0,
        }))
    } else if (selectedDateRange === '7D') {
        return fillMissingDates(revenueData, transactionVolumeData, subDays(new Date(), 7).toISOString(), new Date().toISOString()).map((d) => ({
            date: format(new Date(d.date), 'MMM dd'),
            revenue: d.revenue,
            transaction_count: d.transaction_count,
        }))
    } else if (selectedDateRange === '1M') {
        return fillMissingDates(revenueData, transactionVolumeData, subMonths(new Date(), 1).toISOString(), new Date().toISOString()).map((d) => ({
            date: format(new Date(d.date), 'MMM dd'),
            revenue: d.revenue,
            transaction_count: d.transaction_count,
        }))
    } else if (selectedDateRange === '3M' || selectedDateRange === '6M' || selectedDateRange === 'YTD') {
        const startDate = getStartDate(selectedDateRange)
        const endDate = getEndDate(selectedDateRange)
        return fillMissingMonths(revenueData, transactionVolumeData, startDate, endDate).map((d) => ({
            month: format(new Date(d.date), 'MMM yyyy'),
            revenue: d.revenue,
            transaction_count: d.transaction_count,
        }))
    }
    return []
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

function fillMissingDates(revenueData: RevenueData[], transactionVolumeData: TransactionVolumeData[], startDate?: string, endDate?: string): (RevenueData & TransactionVolumeData)[] {
    if (!startDate || !endDate) {
        return revenueData.map((revenueItem, index) => ({
            ...revenueItem,
            transaction_count: transactionVolumeData[index]?.transaction_count || 0,
        }))
    }

    const start = new Date(startDate)
    const end = new Date(endDate)
    const filledData: (RevenueData & TransactionVolumeData)[] = []

    for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
        const formattedDate = format(date, 'yyyy-MM-dd')
        const revenueItem = revenueData.find((d) => d.date === formattedDate)
        const transactionVolumeItem = transactionVolumeData.find((d) => d.date === formattedDate)

        filledData.push({
            date: formattedDate,
            revenue: revenueItem?.revenue || 0,
            transaction_count: transactionVolumeItem?.transaction_count || 0,
        })
    }

    return filledData
}

function fillMissingMonths(revenueData: RevenueData[], transactionVolumeData: TransactionVolumeData[], startDate?: string, endDate?: string): (RevenueData & TransactionVolumeData)[] {
    if (!startDate || !endDate) {
        return revenueData.map((revenueItem, index) => ({
            ...revenueItem,
            transaction_count: transactionVolumeData[index]?.transaction_count || 0,
        }))
    }

    const start = new Date(startDate)
    const end = new Date(endDate)
    const filledData: (RevenueData & TransactionVolumeData)[] = []

    for (let date = start; date <= end; date.setMonth(date.getMonth() + 1)) {
        const formattedDate = format(date, 'yyyy-MM-01')

        const revenueItem = revenueData.find((d) => d.date.slice(0, 7) === formattedDate.slice(0, 7))
        const transactionVolumeItem = transactionVolumeData.find((d) => d.date.slice(0, 7) === formattedDate.slice(0, 7))

        filledData.push({
            date: formattedDate,
            revenue: revenueItem?.revenue || 0,
            transaction_count: transactionVolumeItem?.transaction_count || 0,
        })
    }

    return filledData
}

function ReportingWithActivationCheck() {
    return withActivationCheck(ReportingPage)({});
}

export default ReportingWithActivationCheck;
