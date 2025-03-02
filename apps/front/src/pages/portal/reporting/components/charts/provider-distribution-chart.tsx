import { AreaChart, ChartType } from '@/components/charts/area-chart'
import { format, parseISO, setDate } from 'date-fns'
import { ProviderDistribution } from '../types'
import { formatProvider } from '@/lib/actions/utils'

interface ChartData {
    date: string;
    [key: string]: string | number;
}

interface GroupedData {
    [date: string]: {
        [provider: string]: number;
    };
}

type ChartTypes = 'revenue' | 'mrr' | 'aov' | 'active_subscriptions' | 'new_subscriptions' | 'renewed_subscriptions' | 'new_subscriptions_revenue' | 'renewed_subscriptions_revenue' | 'providers'

interface ProviderDistributionChartProps {
    providerDistribution: ProviderDistribution[]
    isLoading?: boolean
    selectedChartType: ChartTypes
    onChartTypeChange: (type: ChartTypes) => void
    chartTypes: ChartType<ChartTypes>[]
    selectedDateRange: string | null
}

const PROVIDER_COLORS = {
    'Orange': '#FC6307',
    'Wave': '#71CDF4',
    'Cards': '#074367',
    'MTN': '#F7CE46',
    'Crypto': '#037BFE',
    'Moov': '#0093DD',
    'Airtel': '#FF0000',
    'M-Pesa': '#4CAF50',
    'Wizall': '#FF6B00',
    'OPay': '#14B55A',
    'PayPal': '#003087',
    'Activity': '#2563eb'
} as const

const ANIMATION_CONFIG = {
    isAnimationActive: true,
    animationBegin: 0,
    animationDuration: 1200,
    animationEasing: "ease"
} as const

export function ProviderDistributionChart({
    providerDistribution,
    isLoading = false,
    selectedChartType,
    onChartTypeChange,
    chartTypes,
    selectedDateRange
}: ProviderDistributionChartProps) {
    const getChartData = () => {
        if (!providerDistribution?.length && selectedDateRange === '24H') {
            const now = new Date()
            const hourlyData = []
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
                    'Activity': 0
                })
            }
            return hourlyData
        }

        // Group data by date and provider
        const groupedData = providerDistribution.reduce<GroupedData>((acc, curr) => {
            if (!curr.date) return acc

            const parsedDate = parseISO(curr.date)
            let formattedDate = ''

            switch (selectedDateRange) {
                case '24H': {
                    const isStartOfDay = parsedDate.getHours() === 0
                    formattedDate = isStartOfDay
                        ? `${format(parsedDate, 'EEE')} ${format(parsedDate, 'HH:00')}`
                        : format(parsedDate, 'HH:00')
                    break
                }
                case '7D':
                    formattedDate = format(parsedDate, 'MMM dd')
                    break
                case '1M': {
                    const dayOfMonth = parseInt(format(parsedDate, 'd'))
                    const roundedDay = Math.floor(dayOfMonth / 5) * 5 + 1
                    formattedDate = format(setDate(parsedDate, roundedDay), 'MMM dd')
                    break
                }
                case '3M':
                    formattedDate = format(parsedDate, 'MMM dd')
                    break
                case '6M':
                    formattedDate = format(parsedDate, 'MMM yyyy')
                    break
                default:
                    formattedDate = format(parsedDate, 'MMM dd')
            }

            // Initialize the date in the accumulator if it doesn't exist
            if (!acc[formattedDate]) {
                acc[formattedDate] = {}
            }

            const provider = formatProvider(curr.provider_code)
            if (provider !== 'Other Methods') {
                const dateGroup = acc[formattedDate]
                if (dateGroup) {
                    dateGroup[provider] = (dateGroup[provider] || 0) + curr.transaction_count
                }
            }

            return acc
        }, {})

        // Convert to array and sort by date
        return Object.entries(groupedData)
            .map(([date, providers]) => ({
                date,
                ...providers
            }))
            .sort((a, b) => {
                if (selectedDateRange === '24H') {
                    const now = new Date()
                    const timeA = a.date.split(' ').pop() || '00:00'
                    const timeB = b.date.split(' ').pop() || '00:00'
                    const dateA = new Date(now)
                    const dateB = new Date(now)
                    const [hoursA = 0] = timeA.split(':').map(Number)
                    const [hoursB = 0] = timeB.split(':').map(Number)
                    dateA.setHours(hoursA, 0, 0, 0)
                    dateB.setHours(hoursB, 0, 0, 0)
                    return dateA.getTime() - dateB.getTime()
                }
                return parseISO(a.date).getTime() - parseISO(b.date).getTime()
            })
    }

    const chartData = getChartData()
    const providers = !providerDistribution?.length && selectedDateRange === '24H'
        ? ['Activity']
        : Array.from(
            new Set(providerDistribution
                .map(d => formatProvider(d.provider_code))
                .filter(provider => provider !== 'Other Methods')
            )
        )

    return (
        <AreaChart<ChartData, ChartTypes>
            data={chartData}
            areas={providers.map(provider => ({
                dataKey: provider as keyof ChartData,
                name: provider,
                color: PROVIDER_COLORS[provider as keyof typeof PROVIDER_COLORS] || '#6366F1',
                formatter: (value: number) => value.toString(),
                ...ANIMATION_CONFIG
            }))}
            xAxisDataKey="date"
            yAxisFormatter={(value: number) => value.toString()}
            tooltipFormatter={(value: number, name: string) => [`${value} transactions`, name]}
            title="Provider Distribution"
            isLoading={isLoading}
            selectedChartType={selectedChartType}
            onChartTypeChange={onChartTypeChange}
            chartTypes={chartTypes}
        />
    )
} 