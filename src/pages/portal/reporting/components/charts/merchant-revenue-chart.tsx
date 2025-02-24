import { format, parseISO, startOfDay, addHours, subDays, subMonths, setDate } from 'date-fns'
import { formatAmount as formatCurrency } from '@/lib/actions/format'
import { formatProvider } from '@/lib/actions/utils'
import { RevenueData, TransactionVolumeData, ProviderDistribution } from '@/pages/portal/reporting/components/types'
import { AreaChart, ChartType } from '@/components/charts/area-chart'

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

const ANIMATION_CONFIG = {
    isAnimationActive: true,
    animationBegin: 0,
    animationDuration: 1200,
    animationEasing: "ease"
} as const

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
            if (!revenueData?.length) {
                const now = new Date()
                if (selectedDateRange === '24H') {
                    const hourlyData: ChartDataItem[] = []
                    // Start from current hour and go back 24 hours
                    const currentHour = now.getHours()
                    const startHour = currentHour

                    // Generate 7 points (every 4 hours) starting from 24 hours ago
                    for (let i = 0; i <= 24; i += 4) {
                        const date = new Date(now)
                        date.setHours(startHour - 24 + i, 0, 0, 0)
                        const isStartOfDay = date.getHours() === 0
                        const dayPrefix = isStartOfDay ? `${format(date, 'EEE')} ` : ''
                        hourlyData.push({
                            date: `${dayPrefix}${format(date, 'HH:00')}`,
                            value: 0
                        })
                    }
                    return hourlyData
                } else if (selectedDateRange === '7D') {
                    const dailyData: ChartDataItem[] = []
                    // Generate 7 points (one per day)
                    for (let i = 6; i >= 0; i--) {
                        const date = subDays(now, i)
                        dailyData.push({
                            date: format(date, 'MMM dd'),
                            value: 0
                        })
                    }
                    return dailyData
                } else if (selectedDateRange === '1M') {
                    const monthData: ChartDataItem[] = []
                    // Generate 6 points for 30 days (every 5 days)
                    for (let i = 30; i >= 0; i -= 5) {
                        const date = subDays(now, i)
                        monthData.push({
                            date: format(date, 'MMM dd'),
                            value: 0
                        })
                    }
                    return monthData
                } else if (selectedDateRange === '3M') {
                    const threeMonthData: ChartDataItem[] = []
                    // Generate 7 points for 3 months (every 14 days)
                    for (let i = 90; i >= 0; i -= 14) {
                        const date = subDays(now, i)
                        threeMonthData.push({
                            date: format(date, 'MMM dd'),
                            value: 0
                        })
                    }
                    return threeMonthData
                } else if (selectedDateRange === '6M') {
                    const sixMonthData: ChartDataItem[] = []
                    // Generate 6 points for 6 months (one per month)
                    for (let i = 5; i >= 0; i--) {
                        const date = subMonths(now, i)
                        sixMonthData.push({
                            date: format(date, `MMM yyyy`),
                            value: 0
                        })
                    }
                    return sixMonthData
                }
                return [{
                    date: format(now, 'MMM dd'),
                    value: 0
                }]
            }

            // Format data based on date range and aggregate by interval
            const aggregatedData = new Map<string, number>()

            revenueData.forEach((d) => {
                const parsedDate = parseISO(d.date)
                let formattedDate = ''
                const hourNum = parseInt(format(parsedDate, 'H'))
                const roundedHour = Math.floor(hourNum / 4) * 4
                const roundedDate = addHours(startOfDay(parsedDate), roundedHour)
                const dayOfMonth = parseInt(format(parsedDate, 'd'))
                const roundedDay = Math.floor(dayOfMonth / 5) * 5 + 1

                switch (selectedDateRange) {
                    case '24H':
                        formattedDate = roundedHour === 0
                            ? `${format(roundedDate, 'EEE')} ${format(roundedDate, 'HH:00')}`
                            : format(roundedDate, 'HH:00')
                        break
                    case '7D':
                        formattedDate = format(parsedDate, 'MMM dd')
                        break
                    case '1M':
                        formattedDate = format(setDate(parsedDate, roundedDay), 'MMM dd')
                        break
                    case '3M':
                        formattedDate = format(parsedDate, 'MMM dd')
                        break
                    case '6M':
                        formattedDate = format(parsedDate, 'MMM yyyy')
                        break
                    default:
                        formattedDate = format(parsedDate, 'MMM dd')
                }

                const currentValue = aggregatedData.get(formattedDate) || 0
                aggregatedData.set(formattedDate, currentValue + d.revenue)
            })

            return Array.from(aggregatedData.entries())
                .map(([date, value]) => ({
                    date,
                    value
                }))
                .sort((a, b) => {
                    const dateA = parseISO(a.date)
                    const dateB = parseISO(b.date)
                    return dateA.getTime() - dateB.getTime()
                })
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
                formatter: formatValue,
                ...ANIMATION_CONFIG
            })) : [{
                dataKey: 'value',
                name: currentChart?.label || 'Value',
                color: currentChart?.color || '#2563eb',
                formatter: formatValue,
                transactionTime,
                ...ANIMATION_CONFIG
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