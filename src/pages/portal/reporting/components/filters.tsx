import { Button } from "@/components/ui/button"
import { cn } from "@/lib/actions/utils"
import { DateRange } from 'react-day-picker'
import { DateRangePicker } from "@/components/ui/date-range-picker"

interface ReportingFiltersProps {
    selectedDateRange: string | null
    setSelectedDateRange: (value: string | null) => void
    date: DateRange | undefined
    setDate: (value: DateRange | undefined) => void
}

const dateRanges = [
    { value: '24H', label: '24h' },
    { value: '7D', label: '7d' },
    { value: '1M', label: '30d' },
    { value: '3M', label: '3m' },
    { value: '6M', label: '6m' },
    { value: 'YTD', label: 'YTD' },
] as const

export default function ReportingFilters({
    selectedDateRange,
    setSelectedDateRange,
    date,
    setDate,
}: ReportingFiltersProps) {
    return (
        <div className="flex items-center justify-end">
            <div className="flex">
                {dateRanges.map((range) => (
                    <Button
                        key={range.value}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setSelectedDateRange(range.value)
                            setDate(undefined)
                        }}
                        className={cn(
                            "h-10 px-3 text-sm font-medium border-r-0",
                            "focus-visible:z-10 focus-visible:ring-1 focus-visible:ring-primary",
                            selectedDateRange === range.value
                                ? "bg-[#10B981] text-white hover:bg-[#10B981]/90 border-[#10B981]"
                                : "bg-card text-card-foreground hover:bg-muted/50"
                        )}
                    >
                        {range.label}
                    </Button>
                ))}
                <DateRangePicker
                    date={date}
                    setDate={(newDate) => {
                        setDate(newDate)
                        if (newDate) {
                            setSelectedDateRange(null)
                        }
                    }}
                />
            </div>
        </div>
    )
}
