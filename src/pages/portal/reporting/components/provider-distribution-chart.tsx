import { AreaChart, ChartType } from '@/components/charts/area-chart'
import { format, parseISO } from 'date-fns'
import { ProviderDistribution } from './types'
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
    'Orange Money': '#FC6307',
    'Wave': '#71CDF4',
    'Ecobank': '#074367',
    'MTN Mobile Money': '#F7CE46',
    'NowPayments': '#037BFE',
    'Moov Money': '#0093DD',
    'Airtel Money': '#FF0000',
    'M-Pesa': '#4CAF50',
    'Wizall Money': '#FF6B00',
    'OPay': '#14B55A',
    'PayPal': '#003087'
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
        if (!providerDistribution?.length) {
            return []
        }

        // Get unique providers excluding 'OTHER'
        const uniqueProviders = Array.from(
            new Set(providerDistribution
                .map(d => formatProvider(d.provider_code))
                .filter(provider => provider !== 'Other Methods')
            )
        )

        // Group data by date and provider
        const groupedData = providerDistribution.reduce<GroupedData>((acc, curr) => {
            if (!curr.date) return acc

            const date = (() => {
                const parsedDate = parseISO(curr.date)
                if (selectedDateRange === '24H' || selectedDateRange === '7D') {
                    return format(parsedDate, 'HH:mm')
                } else {
                    // Use daily granularity for all other periods
                    return format(parsedDate, 'MMM dd')
                }
            })()

            if (!acc[date]) {
                // Initialize with 0 for all providers
                acc[date] = Object.fromEntries(uniqueProviders.map(provider => [provider, 0]))
            }

            const provider = formatProvider(curr.provider_code)
            if (acc[date] && provider !== 'Other Methods') {
                acc[date][provider] = (acc[date][provider] || 0) + curr.transaction_count
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
                const dateA = selectedDateRange === '24H' || selectedDateRange === '7D'
                    ? parseISO(`${format(new Date(), 'yyyy-MM-dd')}T${a.date}`)
                    : parseISO(a.date)
                const dateB = selectedDateRange === '24H' || selectedDateRange === '7D'
                    ? parseISO(`${format(new Date(), 'yyyy-MM-dd')}T${b.date}`)
                    : parseISO(b.date)
                return dateA.getTime() - dateB.getTime()
            })
    }

    const chartData = getChartData()
    const providers = Array.from(
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
                formatter: (value: number) => value.toString()
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