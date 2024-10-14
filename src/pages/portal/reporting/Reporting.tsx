import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ReportingFilters from './dev_reporting/filters_reporting'
import { useUser } from '@/lib/hooks/useUser'
import AnimatedLogoLoader from '@/components/dashboard/loader'
import { Layout } from '@/components/custom/layout'
import { TopNav } from '@/components/dashboard/top-nav'
import { UserNav } from '@/components/dashboard/user-nav'
import Notifications from '@/components/dashboard/notifications'
import { Separator } from '@/components/ui/separator'
import { fetchRevenueByDate, fetchTransactionVolumeByDate, fetchTopPerformingProducts, fetchTopPerformingSubscriptions, fetchProviderDistribution } from './dev_reporting/support_reporting'
import { RevenueData, TransactionVolumeData, TopPerformingProduct, TopPerformingSubscription, ProviderDistribution as ProviderDistributionType } from './dev_reporting/reporting-types'
import { useQuery } from 'react-query'
import { format, subDays, subMonths, startOfYear } from 'date-fns'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import TopPerformingItems from './dev_reporting/top_performing_items'
import ProviderDistribution from './dev_reporting/provider_distribution'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/actions/utils'

const topNav = [
    { title: 'Reporting', href: '/portal/reporting', isActive: true },
    { title: 'Settings', href: '/portal/settings/profile', isActive: false },
]

export default function ReportingPage() {
    const { user, isLoading: isUserLoading } = useUser()
    const [selectedDateRange, setSelectedDateRange] = useState<string | null>('24H')

    const { data: revenueData = [], isLoading: isRevenueLoading } = useQuery<RevenueData[]>(
        ['revenueByDate', user?.id, selectedDateRange],
        () => fetchRevenueByDate({
            merchantId: user?.id || '',
            startDate: getStartDate(selectedDateRange),
            endDate: getEndDate(selectedDateRange),
            granularity: getGranularity(selectedDateRange),
        }),
        { enabled: !!user?.id }
    )

    const { data: transactionVolumeData = [], isLoading: isTransactionVolumeLoading } = useQuery<TransactionVolumeData[]>(
        ['transactionVolumeByDate', user?.id, selectedDateRange],
        () => fetchTransactionVolumeByDate({
            merchantId: user?.id || '',
            startDate: getStartDate(selectedDateRange),
            endDate: getEndDate(selectedDateRange),
            granularity: getGranularity(selectedDateRange),
        }),
        { enabled: !!user?.id }
    )

    const { data: topPerformingProducts = [], isLoading: isTopPerformingProductsLoading } = useQuery<TopPerformingProduct[]>(
        ['topPerformingProducts', user?.id, selectedDateRange],
        () => fetchTopPerformingProducts({ merchantId: user?.id || '', startDate: getStartDate(selectedDateRange), endDate: getEndDate(selectedDateRange) }),
        { enabled: !!user?.id }
    )

    const { data: topPerformingSubscriptions = [], isLoading: isTopPerformingSubscriptionsLoading } = useQuery<TopPerformingSubscription[]>(
        ['topPerformingSubscriptions', user?.id, selectedDateRange],
        () => fetchTopPerformingSubscriptions({ merchantId: user?.id || '', startDate: getStartDate(selectedDateRange), endDate: getEndDate(selectedDateRange) }),
        { enabled: !!user?.id }
    )

    const { data: providerDistribution = [], isLoading: isProviderDistributionLoading } = useQuery<ProviderDistributionType[]>(
        ['providerDistribution', user?.id, selectedDateRange],
        () => fetchProviderDistribution({ merchantId: user?.id || '', startDate: getStartDate(selectedDateRange), endDate: getEndDate(selectedDateRange) }),
        { enabled: !!user?.id }
    )

    if (isUserLoading) {
        return <AnimatedLogoLoader />
    }

    if (!user || !user.id) {
        return <div><AnimatedLogoLoader /> User data not available.</div>
    }

    return (
        <Layout fixed>
            <Layout.Header>
                <TopNav links={topNav} />
                <div className='ml-auto flex items-center space-x-4'>
                    <Notifications />
                    <UserNav />
                </div>
            </Layout.Header>

            <Separator className='my-0' />

            <Layout.Body>
                <div className="h-full overflow-y-auto p-8 space-y-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <h1 className="text-3xl font-bold">Reporting</h1>

                    <ReportingFilters
                        selectedDateRange={selectedDateRange}
                        setSelectedDateRange={setSelectedDateRange}
                    />

                    <RevenueTransactionsChart
                        revenueData={revenueData}
                        transactionVolumeData={transactionVolumeData}
                        selectedDateRange={selectedDateRange}
                        isLoading={isRevenueLoading || isTransactionVolumeLoading}
                    />

                    <div className={cn(
                        "flex items-center my-8",
                        "before:content-[''] before:flex-grow before:h-0.5 before:bg-gray-200 before:dark:bg-gray-700 before:mr-4",
                        "after:content-[''] after:flex-grow after:h-0.5 after:bg-gray-200 after:dark:bg-gray-700 after:ml-4"
                    )}>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Global Analysis
                        </span>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <TopPerformingItemsCard
                            topPerformingProducts={topPerformingProducts}
                            topPerformingSubscriptions={topPerformingSubscriptions}
                            isLoading={isTopPerformingProductsLoading || isTopPerformingSubscriptionsLoading}
                        />

                        <ProviderDistributionCard
                            providerDistribution={providerDistribution}
                            isLoading={isProviderDistributionLoading}
                        />
                    </div>
                </div>
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
        <Card>
            <CardHeader>
                <CardTitle>Revenue and Transactions</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="h-96">
                        <Skeleton className="h-full" />
                    </div>
                ) : chartData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full pt-12">
                        <div className="text-center">
                            <h3 className="text-xl font-semibold mb-2 dark:text-white">No data yet</h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                                Start processing transactions to see your revenue and transactions chart.
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
                                tickFormatter={(value) => `${value.toLocaleString('en-US')} XOF`}
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
                                    name === 'Revenue' ? `${value.toLocaleString('en-US')} XOF` : value,
                                    name
                                ]}
                                labelStyle={{ color: 'black' }}
                                cursor={false}
                                contentStyle={{
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                                }}
                            />
                            <Legend />
                            <Bar yAxisId="left" dataKey="revenue" fill="#4CAF50" name="Revenue" fillOpacity={1} />
                            <Bar yAxisId="right" dataKey="transaction_count" fill="#00A0FF" name="Transactions" fillOpacity={1} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    )
}

function TopPerformingItemsCard({
    topPerformingProducts,
    topPerformingSubscriptions,
    isLoading
}: {
    topPerformingProducts: TopPerformingProduct[];
    topPerformingSubscriptions: TopPerformingSubscription[];
    isLoading: boolean;
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Top Performing Items</CardTitle>
            </CardHeader>
            <CardContent>
                <TopPerformingItems
                    topPerformingProducts={topPerformingProducts}
                    topPerformingSubscriptions={topPerformingSubscriptions}
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
        <Card>
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

function getChartData(revenueData: RevenueData[], transactionVolumeData: TransactionVolumeData[], selectedDateRange: string | null) {
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
