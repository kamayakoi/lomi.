import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DateRange } from 'react-day-picker'
import ReportingFilters from './dev_reporting/filters_reporting'
import { useUser } from '@/lib/hooks/useUser'
import AnimatedLogoLoader from '@/components/dashboard/loader'
import { Layout } from '@/components/custom/layout'
import { TopNav } from '@/components/dashboard/top-nav'
import { UserNav } from '@/components/dashboard/user-nav'
import Notifications from '@/components/dashboard/notifications'
import { Separator } from '@/components/ui/separator'
import { fetchRevenueByDate, fetchTransactionVolumeByDate, fetchTopPerformingProducts, fetchTopPerformingSubscriptions, fetchNewCustomerCount, fetchNewCustomerCountChange, fetchProviderDistribution } from './dev_reporting/support_reporting'
import { RevenueData, TransactionVolumeData, TopPerformingProduct, TopPerformingSubscription, ProviderDistribution as ProviderDistributionType } from './dev_reporting/reporting-types'
import { useQuery } from 'react-query'
import { format, subDays, subMonths, startOfYear } from 'date-fns'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import TopPerformingItems from './dev_reporting/top_performing_items'
import ProviderDistribution from './dev_reporting/provider_distribution'
import { ArrowUpIcon } from "lucide-react"

export default function ReportingPage() {
    const { user, isLoading: isUserLoading } = useUser()
    const [selectedDateRange, setSelectedDateRange] = useState<string | null>('24H')
    const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>()

    const topNav = [
        { title: 'Reporting', href: '/portal/reporting', isActive: true },
        { title: 'Settings', href: '/portal/settings/profile', isActive: false },
    ]

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

    const { data: newCustomerCount = 0, isLoading: isNewCustomerCountLoading } = useQuery<number>(
        ['newCustomerCount', user?.id, selectedDateRange],
        () => fetchNewCustomerCount({ merchantId: user?.id || '', startDate: getStartDate(selectedDateRange), endDate: getEndDate(selectedDateRange) }),
        { enabled: !!user?.id }
    )

    const { data: newCustomerCountChange = 0, isLoading: isNewCustomerCountChangeLoading } = useQuery<number>(
        ['newCustomerCountChange', user?.id, selectedDateRange],
        () => fetchNewCustomerCountChange({ merchantId: user?.id || '', startDate: getStartDate(selectedDateRange), endDate: getEndDate(selectedDateRange) }),
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

    const getChartData = (data: RevenueData[] | TransactionVolumeData[], selectedDateRange: string | null) => {
        if (selectedDateRange === 'custom' && customDateRange) {
            const { from, to } = customDateRange
            if (from && to) {
                return data.map((d) => ({
                    date: format(new Date(d.date), 'MMM dd'),
                    value: (d as RevenueData).revenue || (d as TransactionVolumeData).transaction_count,
                }))
            }
        } else if (selectedDateRange === '24H') {
            return data.map((d) => ({
                hour: format(new Date(d.date), 'HH:mm'),
                value: (d as RevenueData).revenue || (d as TransactionVolumeData).transaction_count,
            }))
            return data.map((d) => ({
                date: format(new Date(d.date), 'MMM dd'),
                value: (d as RevenueData).revenue || (d as TransactionVolumeData).transaction_count,
            }))
        } else if (selectedDateRange === '1M') {
            return data.map((d) => ({
                date: format(new Date(d.date), 'MMM dd'),
                value: (d as RevenueData).revenue || (d as TransactionVolumeData).transaction_count,
            }))
        } else if (selectedDateRange === '3M' || selectedDateRange === '6M' || selectedDateRange === 'YTD') {
            return data.map((d) => ({
                month: format(new Date(d.date), 'MMM'),
                value: (d as RevenueData).revenue || (d as TransactionVolumeData).transaction_count,
            }))
        }
        return []
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
                <div className="h-full overflow-y-auto p-8 bg-gray-50" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <h1 className="text-3xl font-bold mb-6">Reporting</h1>

                    <ReportingFilters
                        selectedDateRange={selectedDateRange}
                        setSelectedDateRange={setSelectedDateRange}
                        customDateRange={customDateRange}
                        setCustomDateRange={setCustomDateRange}
                    />

                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Revenue</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isRevenueLoading ? (
                                    <div>Loading...</div>
                                ) : (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={getChartData(revenueData, selectedDateRange)}>
                                            <XAxis dataKey={selectedDateRange === '24H' ? 'hour' : 'date'} />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="value" fill="#8884d8" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Transaction Volume</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isTransactionVolumeLoading ? (
                                    <div>Loading...</div>
                                ) : (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={getChartData(transactionVolumeData, selectedDateRange)}>
                                            <XAxis dataKey={selectedDateRange === '24H' ? 'hour' : 'date'} />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="value" fill="#82ca9d" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Top Performing Items</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <TopPerformingItems
                                    topPerformingProducts={topPerformingProducts}
                                    topPerformingSubscriptions={topPerformingSubscriptions}
                                    isLoading={isTopPerformingProductsLoading || isTopPerformingSubscriptionsLoading}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Provider Distribution</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ProviderDistribution
                                    providerDistribution={providerDistribution}
                                    isLoading={isProviderDistributionLoading}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>New Customers</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isNewCustomerCountLoading || isNewCustomerCountChangeLoading ? (
                                    <div>Loading...</div>
                                ) : (
                                    <div className="flex items-center">
                                        <p className="text-4xl font-bold mr-2">{newCustomerCount}</p>
                                        <div className="flex items-center text-yellow-500">
                                            <ArrowUpIcon className="h-4 w-4 mr-1" />
                                            <span className="text-sm font-medium">
                                                {newCustomerCountChange.toFixed(2)}% since last {selectedDateRange === '3M' ? '3 months' : selectedDateRange}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </Layout.Body>
        </Layout>
    )
}

function getStartDate(selectedDateRange: string | null): string | undefined {
    switch (selectedDateRange) {
        case '24H':
            return format(subDays(new Date(), 1), 'yyyy-MM-dd HH:mm:ss')
        case '7D':
            return format(subDays(new Date(), 7), 'yyyy-MM-dd HH:mm:ss')
        case '1M':
            return format(subMonths(new Date(), 1), 'yyyy-MM-dd HH:mm:ss')
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
    if (selectedDateRange) {
        return format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    }
    return undefined
}

function getGranularity(selectedDateRange: string | null): 'hour' | 'day' | 'week' | 'month' | undefined {
    switch (selectedDateRange) {
        case '24H':
            return 'hour'
        case '7D':
        case '1M':
            return 'day'
        case '3M':
        case '6M':
        case 'YTD':
            return 'month'
        default:
            return undefined
    }
}