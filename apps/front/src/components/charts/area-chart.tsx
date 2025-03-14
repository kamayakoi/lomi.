import { Area, AreaChart as RechartsAreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Fragment } from 'react'
import { format } from 'date-fns'
import Spinner from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from 'lucide-react'

// Chart Configuration Constants
const CHART_CONFIG = {
  height: 470,
  mobileHeight: 350,
  margin: { top: 5, right: 5, left: 20, bottom: -30 },
  mobileMargin: { top: 5, right: 0, left: 0, bottom: -20 },
  colors: {
    axis: '#6b7280',
    tooltip: {
      cursor: '#9ca3af'
    }
  },
  gradientOpacity: {
    start: 0.15,
    end: 0.05
  }
} as const

// Animation Configuration
const ANIMATION_CONFIG = {
  isAnimationActive: true,
  animationBegin: 100,
  animationDuration: 1200,
  animationEasing: "ease-out"
} as const

const AXIS_CONFIG = {
  fontSize: 10,
  tickLine: false,
  axisLine: false,
  stroke: CHART_CONFIG.colors.axis
} as const

const X_AXIS_CONFIG = {
  ...AXIS_CONFIG,
  interval: 'preserveStartEnd',
  minTickGap: 30,
  dy: 10,
  angle: 0,
  textAnchor: 'middle' as const,
  height: 60,
  padding: { left: 30, right: 30 }
} as const

const Y_AXIS_CONFIG = {
  ...AXIS_CONFIG,
  width: 35,
  orientation: 'left' as const,
  allowDataOverflow: true,
  minTickGap: 20,
  padding: { top: -30, bottom: 130 },
  hide: false,
  tickFormatter: (value: number) => value === 0 ? '0' : '',
  interval: 0,
  ticks: [0] as number[]
} as const

const TOOLTIP_STYLES = {
  contentStyle: {
    backgroundColor: 'hsl(var(--sidebar-background))',
    border: '1px solid hsl(var(--sidebar-border))',
    borderRadius: '5px',
    fontSize: '12px',
    padding: '8px 12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    backdropFilter: 'blur(8px)',
    color: 'hsl(var(--foreground))'
  },
  itemStyle: {
    color: 'hsl(var(--foreground))',
    fontSize: '12px',
    fontWeight: 500,
    padding: '4px 0'
  },
  labelStyle: {
    color: 'hsl(var(--muted-foreground))',
    fontSize: '11px',
    fontWeight: 400,
    marginBottom: '4px'
  },
  cursor: {
    stroke: CHART_CONFIG.colors.tooltip.cursor,
    strokeWidth: 1
  }
} as const

const AREA_CONFIG = {
  type: 'monotone' as const,
  strokeWidth: 2,
  connectNulls: true,
  baseValue: 0,
  dot: false,
  ...ANIMATION_CONFIG
} as const

const TRANSACTION_DOT_CONFIG = {
  r: 3,
  strokeWidth: 2,
  fill: '#fff'
} as const

export interface ChartType<T = string> {
  id: T
  label: string
  color: string
}

export interface AreaChartProps<T, C extends string = string> {
  title: string
  data: T[]
  isLoading?: boolean
  areas: {
    dataKey: keyof T
    name: string
    color: string
    yAxisId?: string
    formatter?: (value: number) => string
    transactionTime?: string
  }[]
  xAxisDataKey: keyof T
  yAxisFormatter?: (value: number) => string
  tooltipFormatter?: (value: number, name: string) => [string, string]
  chartTypes?: ChartType<C>[]
  selectedChartType?: C
  onChartTypeChange?: (type: C) => void
}

export function AreaChart<T, C extends string = string>({
  title,
  data,
  isLoading,
  areas,
  xAxisDataKey,
  yAxisFormatter,
  tooltipFormatter,
  chartTypes = [],
  selectedChartType,
  onChartTypeChange,
}: AreaChartProps<T, C>) {
  const currentChartType = chartTypes.find(type => type.id === selectedChartType)
  const defaultChartType = chartTypes[0]
  const chartLabel = currentChartType?.label || defaultChartType?.label || title

  // Detect if we're on mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  // Use appropriate height and margin based on device
  const chartHeight = isMobile ? CHART_CONFIG.mobileHeight : CHART_CONFIG.height
  const chartMargin = isMobile ? CHART_CONFIG.mobileMargin : CHART_CONFIG.margin

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            {chartTypes.length > 0 ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm font-medium flex items-center gap-2 hover:bg-transparent hover:text-primary"
                  >
                    {chartLabel}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {chartTypes.map((type) => (
                    <DropdownMenuItem
                      key={type.id}
                      onClick={() => onChartTypeChange?.(type.id)}
                      className="cursor-pointer"
                    >
                      {type.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <CardTitle>{title}</CardTitle>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center" style={{ height: `${chartHeight}px` }}>
          <Spinner />
        </CardContent>
      </Card>
    )
  }

  if (!data.length) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            {chartTypes.length > 0 ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm font-medium flex items-center gap-2 hover:bg-transparent hover:text-primary"
                  >
                    {chartLabel}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {chartTypes.map((type) => (
                    <DropdownMenuItem
                      key={type.id}
                      onClick={() => onChartTypeChange?.(type.id)}
                      className="cursor-pointer"
                    >
                      {type.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <CardTitle>{title}</CardTitle>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={chartHeight}>
            <RechartsAreaChart
              data={[{ [xAxisDataKey]: new Date(), ...Object.fromEntries(areas.map(area => [area.dataKey, 0])) }]}
              margin={chartMargin}
            >
              <defs>
                {areas.map((area) => (
                  <linearGradient
                    key={String(area.dataKey)}
                    id={`gradient-${String(area.dataKey)}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor={area.color} stopOpacity={CHART_CONFIG.gradientOpacity.start} />
                    <stop offset="95%" stopColor={area.color} stopOpacity={CHART_CONFIG.gradientOpacity.end} />
                  </linearGradient>
                ))}
              </defs>
              <XAxis
                {...X_AXIS_CONFIG}
                dataKey={xAxisDataKey as string}
              />
              <YAxis
                {...Y_AXIS_CONFIG}
                yAxisId="left"
                tickFormatter={yAxisFormatter}
                domain={[0, 1]}
              />
              <Tooltip
                formatter={tooltipFormatter}
                contentStyle={TOOLTIP_STYLES.contentStyle}
                itemStyle={TOOLTIP_STYLES.itemStyle}
                labelStyle={TOOLTIP_STYLES.labelStyle}
                cursor={TOOLTIP_STYLES.cursor}
              />
              {areas.map((area) => (
                <Fragment key={String(area.dataKey)}>
                  <Area
                    {...AREA_CONFIG}
                    dataKey={area.dataKey as string}
                    name={area.name}
                    stroke={area.color}
                    fill={`url(#gradient-${String(area.dataKey)})`}
                    yAxisId={area.yAxisId || "left"}
                  />
                </Fragment>
              ))}
            </RechartsAreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          {chartTypes.length > 0 ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm font-medium flex items-center gap-1 hover:bg-transparent hover:text-primary"
                >
                  {chartLabel}
                  <ChevronDown className="h-3 w-3 mt-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {chartTypes.map((type) => (
                  <DropdownMenuItem
                    key={type.id}
                    onClick={() => onChartTypeChange?.(type.id)}
                    className="cursor-pointer"
                  >
                    {type.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <RechartsAreaChart
            data={data}
            margin={chartMargin}
          >
            <defs>
              {areas.map((area) => (
                <linearGradient
                  key={String(area.dataKey)}
                  id={`gradient-${String(area.dataKey)}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={area.color} stopOpacity={CHART_CONFIG.gradientOpacity.start} />
                  <stop offset="95%" stopColor={area.color} stopOpacity={CHART_CONFIG.gradientOpacity.end} />
                </linearGradient>
              ))}
            </defs>
            <XAxis
              {...X_AXIS_CONFIG}
              dataKey={xAxisDataKey as string}
            />
            <YAxis
              {...Y_AXIS_CONFIG}
              yAxisId="left"
              tickFormatter={yAxisFormatter}
              domain={[
                (dataMin: number) => Math.min(0, dataMin),
                (dataMax: number) => Math.max(dataMax * 1.2, 1)
              ]}
            />
            <Tooltip
              formatter={tooltipFormatter}
              contentStyle={TOOLTIP_STYLES.contentStyle}
              itemStyle={TOOLTIP_STYLES.itemStyle}
              labelStyle={TOOLTIP_STYLES.labelStyle}
              cursor={TOOLTIP_STYLES.cursor}
            />
            {areas.map((area) => (
              <Fragment key={String(area.dataKey)}>
                <Area
                  {...AREA_CONFIG}
                  dataKey={area.dataKey as string}
                  name={area.name}
                  stroke={area.color}
                  fill={`url(#gradient-${String(area.dataKey)})`}
                  yAxisId={area.yAxisId || "left"}
                  activeDot={(props: {
                    cx: number;
                    cy: number;
                    payload: {
                      date: string | Date;
                      [key: string]: string | Date | number;
                    };
                  }) => {
                    const isTransactionPoint = area.transactionTime && props.payload.date &&
                      (typeof props.payload.date === 'string'
                        ? props.payload.date.includes(':')
                          ? props.payload.date
                          : format(new Date(props.payload.date), 'HH:mm')
                        : format(props.payload.date, 'HH:mm')) === area.transactionTime;

                    return (
                      <circle
                        cx={props.cx}
                        cy={props.cy}
                        r={isTransactionPoint ? TRANSACTION_DOT_CONFIG.r : 3}
                        stroke={area.color}
                        strokeWidth={isTransactionPoint ? TRANSACTION_DOT_CONFIG.strokeWidth : 1}
                        fill={TRANSACTION_DOT_CONFIG.fill}
                      />
                    );
                  }}
                />
              </Fragment>
            ))}
          </RechartsAreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
