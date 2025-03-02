import { Bar, BarChart as RechartsBarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ChartBarSquareIcon } from '@heroicons/react/24/outline'

export interface StackedBarChartProps<T> {
  title: string
  data: T[]
  isLoading?: boolean
  bars: {
    dataKey: keyof T
    name: string
    color: string
    stackId: string
    yAxisId?: string
    formatter?: (value: number) => string
  }[]
  xAxisDataKey: keyof T
  yAxisFormatter?: (value: number) => string
  tooltipFormatter?: (value: number, name: string) => [string, string]
}

export function StackedBarChart<T>({
  title,
  data,
  isLoading,
  bars,
  xAxisDataKey,
  yAxisFormatter,
  tooltipFormatter
}: StackedBarChartProps<T>) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <Skeleton className="h-64" />
        </CardContent>
      </Card>
    )
  }

  if (!data.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-full pt-12">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4">
                  <ChartBarSquareIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">No data to show</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                Process transactions to see your chart data.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <RechartsBarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={xAxisDataKey as string}
              stroke="currentColor"
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              stroke="currentColor"
              tickFormatter={yAxisFormatter}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="currentColor"
              tickFormatter={yAxisFormatter}
            />
            <Tooltip
              formatter={tooltipFormatter}
              contentStyle={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
              }}
            />
            <Legend />
            {bars.map((bar) => (
              <Bar
                key={bar.dataKey as string}
                dataKey={bar.dataKey as string}
                name={bar.name}
                fill={bar.color}
                stackId={bar.stackId}
                yAxisId={bar.yAxisId || "left"}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
