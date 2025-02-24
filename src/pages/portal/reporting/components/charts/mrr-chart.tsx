import { format, parseISO, setDate, subDays, subMonths } from 'date-fns'
import { formatAmount as formatCurrency } from '@/lib/actions/format'
import { AreaChart, ChartType } from '@/components/charts/area-chart'
import { MRRData } from '../types'

interface ChartData {
    date: string | Date;
    value: number;
    [key: string]: string | Date | number;
}

interface MRRChartProps {
    mrrData: MRRData[];
    isLoading?: boolean;
    selectedDateRange: string | null;
    selectedChartType: 'mrr';
    onChartTypeChange: (type: 'mrr') => void;
    chartTypes: ChartType<'mrr'>[];
}

const ANIMATION_CONFIG = {
    isAnimationActive: true,
    animationBegin: 100,
    animationDuration: 1200,
    animationEasing: "ease-out"
} as const

export function MRRChart({
    mrrData,
    isLoading = false,
    selectedDateRange,
    selectedChartType,
    onChartTypeChange,
    chartTypes,
}: MRRChartProps) {
    const formatValue = (value: number) => {
        return formatCurrency({ currency: 'XOF', amount: value, maximumFractionDigits: 0 }) || '0 XOF'
    }

    const getChartData = () => {
        if (!mrrData?.length) {
            const now = new Date()
            if (selectedDateRange === '24H') {
                return []
            } else if (selectedDateRange === '7D') {
                const dailyData: ChartData[] = []
                for (let i = 6; i >= 0; i--) {
                    const date = subDays(now, i)
                    dailyData.push({
                        date: format(date, 'MMM dd'),
                        value: 0
                    })
                }
                return dailyData
            } else if (selectedDateRange === '1M') {
                const monthData: ChartData[] = []
                for (let i = 30; i >= 0; i -= 5) {
                    const date = subDays(now, i)
                    monthData.push({
                        date: format(date, 'MMM dd'),
                        value: 0
                    })
                }
                return monthData
            } else if (selectedDateRange === '3M') {
                const threeMonthData: ChartData[] = []
                for (let i = 90; i >= 0; i -= 14) {
                    const date = subDays(now, i)
                    threeMonthData.push({
                        date: format(date, 'MMM dd'),
                        value: 0
                    })
                }
                return threeMonthData
            } else if (selectedDateRange === '6M') {
                const sixMonthData: ChartData[] = []
                for (let i = 5; i >= 0; i--) {
                    const date = subMonths(now, i)
                    sixMonthData.push({
                        date: format(date, 'MMM yyyy'),
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

        mrrData.forEach((d) => {
            const parsedDate = parseISO(d.date)
            let formattedDate = ''
            const dayOfMonth = parseInt(format(parsedDate, 'd'))
            const roundedDay = Math.floor(dayOfMonth / 5) * 5 + 1

            switch (selectedDateRange) {
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
            aggregatedData.set(formattedDate, currentValue + d.mrr)
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

    const chartData = getChartData()
    const currentChart = chartTypes.find(chart => chart.id === selectedChartType)

    return (
        <AreaChart<ChartData, 'mrr'>
            data={chartData}
            areas={[{
                dataKey: 'value',
                name: currentChart?.label || 'MRR',
                color: currentChart?.color || '#10B981',
                formatter: formatValue,
                ...ANIMATION_CONFIG
            }]}
            xAxisDataKey="date"
            yAxisFormatter={formatValue}
            tooltipFormatter={(value: number, name: string) => [formatValue(value), name]}
            title="Monthly Recurring Revenue"
            isLoading={isLoading}
            selectedChartType={selectedChartType}
            onChartTypeChange={onChartTypeChange}
            chartTypes={chartTypes}
        />
    )
} 