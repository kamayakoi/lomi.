import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DateRange } from 'react-day-picker'
import ReportingFilters from './dev_reporting.tsx/filters_reporting'
import { useUser } from '@/lib/hooks/useUser'
import AnimatedLogoLoader from '@/components/dashboard/loader'
import { Layout } from '@/components/custom/layout'
import { TopNav } from '@/components/dashboard/top-nav'
import { UserNav } from '@/components/dashboard/user-nav'
import Notifications from '@/components/dashboard/notifications'
import { Separator } from '@/components/ui/separator'
import { fetchRevenueByMonth, fetchTransactionVolumeByDay, fetchTopPerformingProducts, fetchPaymentChannelDistribution, fetchNewCustomerCount, calculateConversionRate } from './dev_reporting.tsx/support_reporting'
import { RevenueData, TransactionVolumeData, TopPerformingProduct, PaymentChannelDistribution } from './reporting-types'
import { useQuery } from 'react-query'
import { format, subDays, subMonths, startOfYear } from 'date-fns'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function ReportingPage() {
    const { user, isLoading: isUserLoading } = useUser()
    const [selectedDateRange, setSelectedDateRange] = useState<string | null>('24H')
    const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>()

    const topNav = [
        { title: 'Reporting', href: '/portal/reporting', isActive: true },
        { title: 'Settings', href: '/portal/settings/profile', isActive: false },
    ]

    const { data: revenueData = [], isLoading: isRevenueLoading } = useQuery<RevenueData[]>(
        ['revenueByMonth', user?.id, selectedDateRange],
        () => fetchRevenueByMonth({ merchantId: user?.id || '', startDate: getStartDate(selectedDateRange), endDate: getEndDate(selectedDateRange) }),
        { enabled: !!user?.id }
    )

    const { data: transactionVolumeData = [], isLoading: isTransactionVolumeLoading } = useQuery<TransactionVolumeData[]>(
        ['transactionVolumeByDay', user?.id, selectedDateRange],
        () => fetchTransactionVolumeByDay({ merchantId: user?.id || '', startDate: getStartDate(selectedDateRange), endDate: getEndDate(selectedDateRange) }),
        { enabled: !!user?.id }
    )

    const { data: topPerformingProducts = [], isLoading: isTopPerformingProductsLoading } = useQuery<TopPerformingProduct[]>(
        ['topPerformingProducts', user?.id, selectedDateRange],
        () => fetchTopPerformingProducts({ merchantId: user?.id || '', startDate: getStartDate(selectedDateRange), endDate: getEndDate(selectedDateRange) }),
        { enabled: !!user?.id }
    )

    const { data: paymentChannelDistribution = [], isLoading: isPaymentChannelDistributionLoading } = useQuery<PaymentChannelDistribution[]>(
        ['paymentChannelDistribution', user?.id, selectedDateRange],
        () => fetchPaymentChannelDistribution({ merchantId: user?.id || '', startDate: getStartDate(selectedDateRange), endDate: getEndDate(selectedDateRange) }),
        { enabled: !!user?.id }
    )

    const { data: newCustomerCount = 0, isLoading: isNewCustomerCountLoading } = useQuery<number>(
        ['newCustomerCount', user?.id, selectedDateRange],
        () => fetchNewCustomerCount({ merchantId: user?.id || '', startDate: getStartDate(selectedDateRange), endDate: getEndDate(selectedDateRange) }),
        { enabled: !!user?.id }
    )

    const { data: conversionRate = 0, isLoading: isConversionRateLoading } = useQuery<number>(
        ['conversionRate', user?.id, selectedDateRange],
        () => calculateConversionRate({ merchantId: user?.id || '', startDate: getStartDate(selectedDateRange), endDate: getEndDate(selectedDateRange) }),
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
                <div className="h-full overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <div className="space-y-4 pb-8">
                        <h1 className="text-2xl font-bold tracking-tight mb-4">Reporting</h1>

                        <ReportingFilters
                            selectedDateRange={selectedDateRange}
                            setSelectedDateRange={setSelectedDateRange}
                            customDateRange={customDateRange}
                            setCustomDateRange={setCustomDateRange}
                        />

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Revenue</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {isRevenueLoading ? (
                                        <div>Loading...</div>
                                    ) : (
                                        <ResponsiveContainer width="100%" height={300}>
                                            <AreaChart data={revenueData}>
                                                <defs>
                                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <XAxis dataKey="month" />
                                                <YAxis />
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <Tooltip />
                                                <Area type="monotone" dataKey="revenue" stroke="#8884d8" fillOpacity={1} fill="url(#colorRevenue)" />
                                            </AreaChart>
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
                                            <LineChart data={transactionVolumeData}>
                                                <XAxis dataKey="day_of_week" />
                                                <YAxis />
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <Tooltip />
                                                <Legend />
                                                <Line type="monotone" dataKey="transaction_count" stroke="#8884d8" activeDot={{ r: 8 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Top Performing Products</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {isTopPerformingProductsLoading ? (
                                        <div>Loading...</div>
                                    ) : (
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={topPerformingProducts}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="product_name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="sales_count" fill="#8884d8" />
                                                <Bar dataKey="total_revenue" fill="#82ca9d" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Payment Channel Distribution</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {isPaymentChannelDistributionLoading ? (
                                        <div>Loading...</div>
                                    ) : (
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={paymentChannelDistribution}
                                                    dataKey="transaction_count"
                                                    nameKey="payment_method_code"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={100}
                                                    fill="#8884d8"
                                                    label
                                                >
                                                    {paymentChannelDistribution.map((_, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>New Customers</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {isNewCustomerCountLoading ? (
                                        <div>Loading...</div>
                                    ) : (
                                        <div className="text-4xl font-bold">{newCustomerCount}</div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Conversion Rate</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {isConversionRateLoading ? (
                                        <div>Loading...</div>
                                    ) : (
                                        <div className="text-4xl font-bold">{conversionRate}%</div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
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