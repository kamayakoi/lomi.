import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useQueryState } from 'nuqs'
import { ChartBarSquareIcon, ChartBarIcon, ChartPieIcon } from "@heroicons/react/24/outline"

const chartTypes = [
  { label: 'Bar', value: 'bar', icon: ChartBarIcon },
  { label: 'Stack', value: 'stack', icon: ChartBarSquareIcon },
  { label: 'Pie', value: 'pie', icon: ChartPieIcon }
] as const

export type ChartType = typeof chartTypes[number]['value']

interface ChartTypeProps {
  className?: string
}

export function ChartType({ className }: ChartTypeProps) {
  const [type, setType] = useQueryState('type', {
    parse: (value: string): ChartType => {
      if (chartTypes.some(t => t.value === value)) {
        return value as ChartType
      }
      return 'bar'
    },
    defaultValue: 'bar'
  })

  return (
    <Card className={className}>
      <div className="flex items-center gap-2 p-2">
        {chartTypes.map((t) => {
          const Icon = t.icon
          return (
            <Button
              key={t.value}
              variant={type === t.value ? "default" : "outline"}
              size="sm"
              onClick={() => setType(t.value)}
            >
              <Icon className="h-4 w-4 mr-2" />
              {t.label}
            </Button>
          )
        })}
      </div>
    </Card>
  )
}
