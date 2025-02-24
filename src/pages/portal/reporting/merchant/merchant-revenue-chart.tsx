import { formatAmount as formatCurrency } from '@/lib/actions/format'
import { RevenueData, TransactionVolumeData, ProviderDistribution } from '@/pages/portal/reporting/components/types'
import { format, subDays, subMonths, startOfYear, startOfDay, endOfDay, addHours, parseISO } from 'date-fns'
import { AreaChart, ChartType } from '@/components/charts/area-chart'
import { formatProvider } from '@/lib/actions/utils'

interface ChartDataItem {
    date: string | Date;
    value: number;
    [key: string]: string | Date | number;
}

interface MerchantRevenueChartProps {
    revenueData: RevenueData[];
    transactionVolumeData: TransactionVolumeData[];
    selectedDateRange: string | null;
    selectedChartType: 'revenue' | 'mrr' | 'aov' | 'active_subscriptions' | 'new_subscriptions' | 'renewed_subscriptions' | 'new_subscriptions_revenue' | 'renewed_subscriptions_revenue' | 'providers';
    onChartTypeChange: (type: 'revenue' | 'mrr' | 'aov' | 'active_subscriptions' | 'new_subscriptions' | 'renewed_subscriptions' | 'new_subscriptions_revenue' | 'renewed_subscriptions_revenue' | 'providers') => void;
    chartTypes: ChartType<'revenue' | 'mrr' | 'aov' | 'active_subscriptions' | 'new_subscriptions' | 'renewed_subscriptions' | 'new_subscriptions_revenue' | 'renewed_subscriptions_revenue' | 'providers'>[];
    isLoading?: boolean;
    providerDistribution?: ProviderDistribution[];
}

export function MerchantRevenueChart({
    revenueData,
    selectedDateRange,
    selectedChartType,
    onChartTypeChange,
    chartTypes,
    isLoading,
    providerDistribution = [],
}: MerchantRevenueChartProps) {
    const currentChart = chartTypes.find(chart => chart.id === selectedChartType)
    const formatValue = (value: number) => {
        if (selectedChartType === 'providers') {
            return value.toString()
        }
        return formatCurrency({ currency: 'XOF', amount: value, maximumFractionDigits: 0 }) || '0 XOF'
    }

    const getProviderChartData = () => {
        if (!providerDistribution?.length) {
            return []
        }

        // Group data by date and provider
        const groupedData = providerDistribution.reduce((acc, curr) => {
            const date = curr.date ? format(startOfDay(parseISO(curr.date)), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
            if (!acc[date]) {
                acc[date] = {}
            }
            const provider = formatProvider(curr.provider_code)
            acc[date][provider] = (acc[date][provider] || 0) + curr.transaction_count
            return acc
        }, {} as Record<string, Record<string, number>>)

        // Convert grouped data to chart format
        return Object.entries(groupedData).map(([date, providers]) => ({
            date: new Date(date),
            ...providers
        }))
    }

    const getRevenueChartData = () => {
        if (selectedChartType === 'revenue') {
            if (selectedDateRange === '24H') {
                // For 24H view, create hourly data points with zero value if no data
                const today = new Date()
                const start = startOfDay(today)
                const end = endOfDay(today)
                const hourlyData: ChartDataItem[] = []
                const value = revenueData[0]?.revenue || 0

                // Create data points for each hour
                for (let i = 0; i <= 23; i++) {
                    const date = addHours(start, i)
                    if (date <= end) {
                        hourlyData.push({
                            date: format(date, 'HH:mm'),
                            value
                        })
                    }
                }

                return hourlyData
            } else if (selectedDateRange === '7D') {
                return fillMissingDates(revenueData, subDays(new Date(), 7).toISOString(), new Date().toISOString()).map((d) => ({
                    date: format(new Date(d.date), 'MMM dd'),
                    value: d.revenue,
                }))
            } else if (selectedDateRange === '1M') {
                return fillMissingDates(revenueData, subMonths(new Date(), 1).toISOString(), new Date().toISOString()).map((d) => ({
                    date: format(new Date(d.date), 'MMM dd'),
                    value: d.revenue,
                }))
            } else if (selectedDateRange === '3M' || selectedDateRange === '6M' || selectedDateRange === 'YTD') {
                const startDate = getStartDate(selectedDateRange)
                const endDate = getEndDate(selectedDateRange)
                return fillMissingMonths(revenueData, startDate, endDate).map((d) => ({
                    date: format(new Date(d.date), 'MMM yyyy'),
                    value: d.revenue,
                }))
            }
        }

        return []
    }

    const chartData = selectedChartType === 'providers' ? getProviderChartData() : getRevenueChartData()
    const providers = selectedChartType === 'providers' ? Array.from(
        new Set(providerDistribution.map(d => formatProvider(d.provider_code)))
    ) : []

    const colors = [
        'rgb(99, 102, 241)',
        'rgb(168, 85, 247)',
        'rgb(236, 72, 153)',
        'rgb(239, 68, 68)',
        'rgb(234, 179, 8)',
        'rgb(34, 197, 94)',
        'rgb(59, 130, 246)',
        'rgb(147, 51, 234)'
    ] as const

    const transactionTime = selectedDateRange === '24H' && revenueData[0]
        ? format(new Date(revenueData[0].date), 'HH:mm')
        : undefined

    return (
        <AreaChart
            title={currentChart?.label || ''}
            data={chartData as ChartDataItem[]}
            isLoading={isLoading}
            areas={selectedChartType === 'providers' ? providers.map((provider, index) => ({
                dataKey: provider,
                name: provider,
                color: colors[index % colors.length] || colors[0],
                formatter: formatValue
            })) : [{
                dataKey: 'value',
                name: currentChart?.label || 'Value',
                color: currentChart?.color || '#2563eb',
                formatter: formatValue,
                transactionTime
            }]}
            xAxisDataKey="date"
            yAxisFormatter={formatValue}
            tooltipFormatter={(value: number, name: string) => [formatValue(value), name]}
            chartTypes={chartTypes}
            selectedChartType={selectedChartType}
            onChartTypeChange={onChartTypeChange}
        />
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

function fillMissingDates(revenueData: RevenueData[], startDate?: string, endDate?: string): RevenueData[] {
    if (!startDate || !endDate) {
        return revenueData
    }

    const start = new Date(startDate)
    const end = new Date(endDate)
    const filledData: RevenueData[] = []

    for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
        const formattedDate = format(date, 'yyyy-MM-dd')
        const revenueItem = revenueData.find((d) => d.date === formattedDate)

        filledData.push({
            date: formattedDate,
            revenue: revenueItem?.revenue || 0,
        })
    }

    return filledData
}

function fillMissingMonths(revenueData: RevenueData[], startDate?: string, endDate?: string): RevenueData[] {
    if (!startDate || !endDate) {
        return revenueData
    }

    const start = new Date(startDate)
    const end = new Date(endDate)
    const filledData: RevenueData[] = []

    for (let date = start; date <= end; date.setMonth(date.getMonth() + 1)) {
        const formattedDate = format(date, 'yyyy-MM-01')
        const revenueItem = revenueData.find((d) => d.date.slice(0, 7) === formattedDate.slice(0, 7))

        filledData.push({
            date: formattedDate,
            revenue: revenueItem?.revenue || 0,
        })
    }

    return filledData
} 