import { useState } from 'react'
import ReportingFilters from './components/filters'
import { useUser } from '@/lib/hooks/use-user'
import AnimatedLogoLoader from '@/components/portal/loader'
import { Layout } from '@/components/custom/layout'
import { TopNav } from '@/components/portal/top-nav'
import { UserNav } from '@/components/portal/user-nav'
import Notifications from '@/components/portal/notifications'
import { Separator } from '@/components/ui/separator'
import { fetchRevenueByDate, fetchProviderDistribution, fetchMRRMetrics } from './components/support'
import { RevenueData, ProviderDistribution, MRRData } from './components/types'
import { useQuery } from '@tanstack/react-query'
import { format, subMonths, startOfYear, subDays } from 'date-fns'
import FeedbackForm from '@/components/portal/feedback-form'
import SupportForm from '@/components/portal/support-form'
import { withActivationCheck } from '@/components/custom/with-activation-check'
import { MerchantRevenueChart } from '@/pages/portal/reporting/components/charts/merchant-revenue-chart'
import { ProviderDistributionChart } from '@/pages/portal/reporting/components/charts/provider-distribution-chart'
import type { ChartType } from '@/components/charts/area-chart'
import { DateRange } from 'react-day-picker'
import { MRRChart } from '@/pages/portal/reporting/components/charts/mrr-chart'

const topNav = [
    { title: 'Reporting', href: '/portal/reporting', isActive: true },
    { title: 'Settings', href: '/portal/settings/profile', isActive: false },
]

const chartTypes: ChartType<'revenue' | 'mrr' | 'aov' | 'active_subscriptions' | 'new_subscriptions' | 'renewed_subscriptions' | 'new_subscriptions_revenue' | 'renewed_subscriptions_revenue' | 'providers'>[] = [
    { id: 'revenue', label: 'Revenue', color: '#2563eb' },
    { id: 'mrr', label: 'Monthly Recurring Revenue', color: '#10B981' },
    { id: 'aov', label: 'Average Order Value', color: '#6366F1' },
    { id: 'providers', label: 'Provider Distribution', color: '#6366F1' },
    { id: 'active_subscriptions', label: 'Active Subscriptions', color: '#EC4899' },
    { id: 'new_subscriptions', label: 'New Subscriptions', color: '#F59E0B' },
    { id: 'renewed_subscriptions', label: 'Renewed Subscriptions', color: '#8B5CF6' },
    { id: 'new_subscriptions_revenue', label: 'New Subscriptions Revenue', color: '#14B8A6' },
    { id: 'renewed_subscriptions_revenue', label: 'Renewed Subscriptions Revenue', color: '#F43F5E' },
] as const

function ReportingPage() {
    const { user, isLoading: isUserLoading } = useUser()
    const [selectedDateRange, setSelectedDateRange] = useState<string | null>('24H')
    const [date, setDate] = useState<DateRange | undefined>()
    const [selectedChartType, setSelectedChartType] = useState<'revenue' | 'mrr' | 'aov' | 'active_subscriptions' | 'new_subscriptions' | 'renewed_subscriptions' | 'new_subscriptions_revenue' | 'renewed_subscriptions_revenue' | 'providers'>('revenue')

    const { data: revenueData = [], isLoading: isRevenueLoading } = useQuery<RevenueData[]>({
        queryKey: ['revenueByDate', user?.id, selectedDateRange, date] as const,
        queryFn: () => fetchRevenueByDate({
            merchantId: user?.id || '',
            startDate: getStartDate(selectedDateRange, date),
            endDate: getEndDate(selectedDateRange, date),
            granularity: getGranularity(selectedDateRange),
        }),
        enabled: !!user?.id && !['providers', 'mrr'].includes(selectedChartType)
    })

    const { data: providerDistribution = [], isLoading: isProviderLoading } = useQuery<ProviderDistribution[]>({
        queryKey: ['providerDistribution', user?.id, selectedDateRange, date] as const,
        queryFn: () => fetchProviderDistribution({
            merchantId: user?.id || '',
            startDate: getStartDate(selectedDateRange, date) || '',
            endDate: getEndDate(selectedDateRange, date) || '',
        }),
        enabled: !!user?.id && selectedChartType === 'providers'
    })

    const { data: mrrData = [], isLoading: isMRRLoading } = useQuery<MRRData[]>({
        queryKey: ['mrrMetrics', user?.id, selectedDateRange, date] as const,
        queryFn: () => fetchMRRMetrics({
            merchantId: user?.id || '',
            startDate: getStartDate(selectedDateRange, date) || '',
            endDate: getEndDate(selectedDateRange, date) || '',
        }),
        enabled: !!user?.id && selectedChartType === 'mrr'
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
                                date={date}
                                setDate={setDate}
                            />
                        </div>

                        <div className="w-full min-h-[470px]">
                            {selectedChartType === 'providers' ? (
                                <ProviderDistributionChart
                                    providerDistribution={providerDistribution}
                                    selectedChartType={selectedChartType}
                                    onChartTypeChange={setSelectedChartType}
                                    chartTypes={chartTypes}
                                    isLoading={isProviderLoading}
                                    selectedDateRange={selectedDateRange}
                                />
                            ) : selectedChartType === 'mrr' ? (
                                <MRRChart
                                    mrrData={mrrData}
                                    selectedDateRange={selectedDateRange}
                                    selectedChartType="mrr"
                                    onChartTypeChange={setSelectedChartType}
                                    chartTypes={chartTypes.filter(type => type.id === 'mrr') as ChartType<'mrr'>[]}
                                    isLoading={isMRRLoading}
                                />
                            ) : (
                                <MerchantRevenueChart
                                    revenueData={revenueData}
                                    transactionVolumeData={[]}
                                    selectedDateRange={selectedDateRange}
                                    selectedChartType={selectedChartType}
                                    onChartTypeChange={setSelectedChartType}
                                    chartTypes={chartTypes}
                                    isLoading={isRevenueLoading}
                                />
                            )}
                        </div>
                    </div>
                </div>

                <SupportForm />
            </Layout.Body>
        </Layout>
    )
}

function getStartDate(selectedDateRange: string | null, date?: DateRange): string | undefined {
    if (!selectedDateRange && date?.from) {
        return format(date.from, 'yyyy-MM-dd HH:mm:ss')
    }

    const now = new Date()
    switch (selectedDateRange) {
        case '24H':
            return format(subDays(now, 1), 'yyyy-MM-dd HH:mm:ss')
        case '7D':
            return format(subDays(now, 7), 'yyyy-MM-dd HH:mm:ss')
        case '1M':
            return format(subMonths(now, 1), 'yyyy-MM-dd HH:mm:ss')
        case '3M':
            return format(subMonths(now, 3), 'yyyy-MM-dd HH:mm:ss')
        case '6M':
            return format(subMonths(now, 6), 'yyyy-MM-dd HH:mm:ss')
        case 'YTD':
            return format(startOfYear(now), 'yyyy-MM-dd HH:mm:ss')
        default:
            return undefined
    }
}

function getEndDate(selectedDateRange: string | null, date?: DateRange): string | undefined {
    if (!selectedDateRange && date?.to) {
        return format(date.to, 'yyyy-MM-dd HH:mm:ss')
    }

    return format(new Date(), 'yyyy-MM-dd HH:mm:ss')
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
            if (!selectedDateRange) {
                return '1M' // Use same granularity as 30D for custom ranges
            }
            return undefined
    }
}

function ReportingWithActivationCheck() {
    return withActivationCheck(ReportingPage)({});
}
export default ReportingWithActivationCheck;

