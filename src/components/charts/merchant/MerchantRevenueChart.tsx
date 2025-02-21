import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatAmount as formatCurrency } from '@/lib/actions/format'
import { RevenueData, TransactionVolumeData } from '@/pages/portal/reporting/components/types'
import { format, subDays, subMonths, startOfYear, startOfDay, endOfDay, addHours } from 'date-fns'
import { AreaChart } from '@/components/charts/area-chart'
import Spinner from '@/components/portal/spinner'

interface ChartDataItem {
    date: string;
    revenue: number;
}

interface MerchantRevenueChartProps {
    revenueData: RevenueData[];
    transactionVolumeData: TransactionVolumeData[];
    selectedDateRange: string | null;
    isLoading?: boolean;
}

export function MerchantRevenueChart({
    revenueData,
    selectedDateRange,
    isLoading,
}: MerchantRevenueChartProps) {
    const chartData = getChartData(revenueData, selectedDateRange)
    const transactionTime = selectedDateRange === '24H' && revenueData[0]
        ? format(new Date(revenueData[0].date), 'HH:mm')
        : undefined

    if (isLoading) {
        return (
            <Card className="col-span-2">
                <CardHeader>
                    <CardTitle>Revenue</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center min-h-[315px]">
                    <Spinner size={24} />
                </CardContent>
            </Card>
        )
    }

    const formatValue = (value: number) => formatCurrency({ currency: 'XOF', amount: value, maximumFractionDigits: 0 }) || '0 XOF'

    return (
        <AreaChart
            title="Revenue"
            data={chartData}
            isLoading={isLoading}
            areas={[
                {
                    dataKey: 'revenue',
                    name: 'Revenue',
                    color: '#2563eb',
                    formatter: formatValue,
                    transactionTime
                }
            ]}
            xAxisDataKey="date"
            yAxisFormatter={formatValue}
            tooltipFormatter={(value: number) => [formatValue(value), 'Revenue']}
        />
    )
}

function getChartData(revenueData: RevenueData[], selectedDateRange: string | null): ChartDataItem[] {
    if (revenueData.length === 0) {
        return []
    }

    if (selectedDateRange === '24H') {
        // For 24H view, create hourly data points
        const today = new Date()
        const start = startOfDay(today)
        const end = endOfDay(today)
        const hourlyData: ChartDataItem[] = []
        const revenueValue = revenueData[0]?.revenue || 0

        // Create data points for each hour
        for (let i = 0; i <= 23; i++) {
            const date = addHours(start, i)
            if (date <= end) {
                hourlyData.push({
                    date: format(date, 'HH:mm'),
                    revenue: revenueValue
                })
            }
        }

        return hourlyData
    } else if (selectedDateRange === '7D') {
        return fillMissingDates(revenueData, subDays(new Date(), 7).toISOString(), new Date().toISOString()).map((d) => ({
            date: format(new Date(d.date), 'MMM dd'),
            revenue: d.revenue,
        }))
    } else if (selectedDateRange === '1M') {
        return fillMissingDates(revenueData, subMonths(new Date(), 1).toISOString(), new Date().toISOString()).map((d) => ({
            date: format(new Date(d.date), 'MMM dd'),
            revenue: d.revenue,
        }))
    } else if (selectedDateRange === '3M' || selectedDateRange === '6M' || selectedDateRange === 'YTD') {
        const startDate = getStartDate(selectedDateRange)
        const endDate = getEndDate(selectedDateRange)
        return fillMissingMonths(revenueData, startDate, endDate).map((d) => ({
            date: format(new Date(d.date), 'MMM yyyy'),
            revenue: d.revenue,
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