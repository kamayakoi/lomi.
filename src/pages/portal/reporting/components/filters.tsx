import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { cn } from "@/lib/actions/utils"
import { DateRange } from 'react-day-picker'
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { useState } from "react"

interface ReportingFiltersProps {
    selectedDateRange: string | null
    setSelectedDateRange: (value: string | null) => void
}

const dateRanges = [
    { value: '24H', label: 'Last 24h' },
    { value: '7D', label: 'Last 7d' },
    { value: '1M', label: 'Last 30d' },
    { value: '3M', label: 'Last 3m' },
    { value: '6M', label: 'Last 6m' },
    { value: 'YTD', label: 'Year to date' },
] as const

export default function ReportingFilters({
    selectedDateRange,
    setSelectedDateRange,
}: ReportingFiltersProps) {
    const [date, setDate] = useState<DateRange | undefined>()

    return (
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 items-end sm:items-center justify-between">
            <div className="flex flex-wrap gap-2">
                {dateRanges.map((range, index) => (
                    <motion.div
                        key={range.value}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                        <Button
                            variant={selectedDateRange === range.value ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => {
                                setSelectedDateRange(range.value)
                                setDate(undefined)
                            }}
                            className={cn(
                                "relative h-9 px-4 text-sm transition-all duration-200",
                                selectedDateRange === range.value && "bg-primary text-primary-foreground shadow-sm",
                                "hover:bg-muted/50 dark:hover:bg-muted",
                                "data-[state=open]:bg-muted/50 dark:data-[state=open]:bg-muted",
                                "active:scale-95"
                            )}
                        >
                            {range.label}
                        </Button>
                    </motion.div>
                ))}
            </div>

            <div className="flex-shrink-0">
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
