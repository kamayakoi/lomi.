import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQueryState } from 'nuqs';

const periods = [
  { label: '24H', value: '24H' },
  { label: '7D', value: '7D' },
  { label: '1M', value: '1M' },
  { label: '3M', value: '3M' },
  { label: '6M', value: '6M' },
  { label: 'YTD', value: 'YTD' }
] as const

export type ChartPeriod = typeof periods[number]['value']

interface ChartPeriodProps {
  className?: string
}

export function ChartPeriod({ className }: ChartPeriodProps) {
  const [period, setPeriod] = useQueryState('period', {
    parse: (value: string): ChartPeriod => {
      if (periods.some(p => p.value === value)) {
        return value as ChartPeriod
      }
      return '24H'
    },
    defaultValue: '24H'
  })

  return (
    <Card className={className}>
      <div className="flex items-center gap-2 p-2">
        {periods.map((p) => (
          <Button
            key={p.value}
            variant={period === p.value ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod(p.value)}
          >
            {p.label}
          </Button>
        ))}
      </div>
    </Card>
  )
}
