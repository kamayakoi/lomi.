import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useQueryState } from 'nuqs'
import { BanknotesIcon, ChartBarIcon, CurrencyDollarIcon, FireIcon } from "@heroicons/react/24/outline"

const metrics = [
    { label: 'Revenue', value: 'revenue', icon: BanknotesIcon },
    { label: 'Profit', value: 'profit', icon: CurrencyDollarIcon },
    { label: 'Expense', value: 'expense', icon: ChartBarIcon },
    { label: 'Burn Rate', value: 'burn_rate', icon: FireIcon }
] as const

export type ChartMetric = typeof metrics[number]['value']

interface ChartMetricProps {
    className?: string
}

export function ChartMetric({ className }: ChartMetricProps) {
    const [metric, setMetric] = useQueryState('metric', {
        parse: (value: string): ChartMetric => {
            if (metrics.some(m => m.value === value)) {
                return value as ChartMetric
            }
            return 'revenue'
        },
        defaultValue: 'revenue'
    })

    return (
        <Card className={className}>
            <div className="flex items-center gap-2 p-2">
                {metrics.map((m) => {
                    const Icon = m.icon
                    return (
                        <Button
                            key={m.value}
                            variant={metric === m.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => setMetric(m.value)}
                        >
                            <Icon className="h-4 w-4 mr-2" />
                            {m.label}
                        </Button>
                    )
                })}
            </div>
        </Card>
    )
} 