import { format, parseISO, subDays, subMonths, isValid } from 'date-fns'
import { formatAmount as formatCurrency } from '@/lib/actions/format'
import { AreaChart } from '@/components/charts/area-chart'
import { MRRData } from '../types'

interface ChartData {
    date: string | Date;
    value: number;
    [key: string]: string | Date | number;
}

// Define a type that includes all chart types used in the application
type ChartTypes = 'revenue' | 'mrr' | 'aov' | 'active_subscriptions' | 'new_subscriptions' | 'renewed_subscriptions' | 'new_subscriptions_revenue' | 'renewed_subscriptions_revenue' | 'providers';

interface MRRChartProps {
    mrrData: MRRData[];
    isLoading?: boolean;
    selectedDateRange: string | null;
    selectedChartType: 'mrr';
    onChartTypeChange: (type: ChartTypes) => void;
    chartTypes: {
        id: ChartTypes;
        label: string;
        color: string;
    }[];
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
        // If no data, generate placeholder data based on selected date range
        if (!mrrData?.length) {
            const now = new Date()
            if (selectedDateRange === '24H') {
                const hourlyData: ChartData[] = []
                // Generate 7 points (every 4 hours) for 24 hours
                for (let i = 0; i <= 24; i += 4) {
                    const date = new Date(now)
                    date.setHours(date.getHours() - 24 + i, 0, 0, 0)
                    const isStartOfDay = date.getHours() === 0
                    const dayPrefix = isStartOfDay ? `${format(date, 'EEE')} ` : ''
                    hourlyData.push({
                        date: `${dayPrefix}${format(date, 'HH:00')}`,
                        value: 0
                    })
                }
                return hourlyData
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
                        date: format(date, 'MMM dd, yyyy'),
                        value: 0
                    })
                }
                return threeMonthData
            } else if (selectedDateRange === '6M') {
                const sixMonthData: ChartData[] = []
                for (let i = 5; i >= 0; i--) {
                    const date = subMonths(now, i)
                    sixMonthData.push({
                        date: format(date, 'MMM dd, yyyy'),
                        value: 0
                    })
                }
                return sixMonthData
            }
            return [{
                date: format(now, 'MMM dd, yyyy'),
                value: 0
            }]
        }

        // Debug the received data
        console.log(`Processing ${mrrData.length} MRR data points for ${selectedDateRange} range`);

        // Format data based on date range and aggregate by interval
        const aggregatedData = new Map<string, { value: number, timestamp: number }>()

        // Sort data by date to ensure we process in chronological order
        const sortedData = [...mrrData].sort((a, b) => {
            const dateA = typeof a.date === 'string' ? new Date(a.date).getTime() : (a.date as Date).getTime();
            const dateB = typeof b.date === 'string' ? new Date(b.date).getTime() : (b.date as Date).getTime();
            return dateA - dateB;
        });

        sortedData.forEach((d) => {
            if (!d.date) {
                console.warn('MRR data point missing date:', d);
                return;
            }

            let parsedDate;
            try {
                parsedDate = typeof d.date === 'string' ? parseISO(d.date) : d.date;
                if (!isValid(parsedDate)) {
                    console.warn('Invalid date in MRR data:', d.date);
                    return;
                }
            } catch (e) {
                console.error('Error parsing date:', d.date, e);
                return;
            }

            let formattedDate = '';
            const timestamp = parsedDate.getTime();

            // Format date based on selected range
            if (selectedDateRange === '24H') {
                const isStartOfDay = parsedDate.getHours() === 0;
                formattedDate = isStartOfDay
                    ? `${format(parsedDate, 'EEE')} ${format(parsedDate, 'HH:00')}`
                    : format(parsedDate, 'HH:00');
            } else if (selectedDateRange === '7D') {
                formattedDate = format(parsedDate, 'MMM dd');
            } else if (selectedDateRange === '1M') {
                formattedDate = format(parsedDate, 'MMM dd');
            } else if (selectedDateRange === '3M' || selectedDateRange === '6M' || !selectedDateRange) {
                // For longer periods, include the year to avoid ambiguity
                formattedDate = format(parsedDate, 'MMM dd, yyyy');
            } else {
                formattedDate = format(parsedDate, 'MMM dd');
            }

            // Parse MRR value
            const mrrValue = typeof d.mrr === 'number' ? d.mrr : parseFloat(d.mrr as any);
            if (isNaN(mrrValue)) {
                console.warn('Invalid MRR value:', d.mrr);
                return;
            }

            // Always update with the latest value for each date point
            // This ensures we see changes in MRR over time
            aggregatedData.set(formattedDate, { value: mrrValue, timestamp });
        });

        // Convert to array format for the chart
        const chartData = Array.from(aggregatedData.entries())
            .map(([date, data]) => ({
                date,
                value: data.value,
                timestamp: data.timestamp
            }))
            .sort((a, b) => a.timestamp - b.timestamp);

        console.log(`Generated ${chartData.length} chart data points`);
        return chartData.map(({ date, value }) => ({ date, value }));
    }

    const chartData = getChartData()
    const currentChart = chartTypes.find(chart => chart.id === selectedChartType)

    return (
        <AreaChart<ChartData, ChartTypes>
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