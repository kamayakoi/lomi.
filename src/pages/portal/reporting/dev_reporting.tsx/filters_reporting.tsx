import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { DateRange } from 'react-day-picker'

interface ReportingFiltersProps {
    selectedDateRange: string | null
    setSelectedDateRange: (value: string | null) => void
    customDateRange: DateRange | undefined
    setCustomDateRange: (value: DateRange | undefined) => void
}

export default function ReportingFilters({
    selectedDateRange,
    setSelectedDateRange,
    customDateRange,
    setCustomDateRange,
}: ReportingFiltersProps) {
    const handleCustomDateRangeApply = () => {
        setSelectedDateRange('custom')
    }

    return (
        <div className="flex justify-end space-x-2">
            {['24H', '7D', '1M', '3M', '6M', 'YTD'].map((range) => (
                <Button
                    key={range}
                    variant={selectedDateRange === range ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedDateRange(range)}
                >
                    {range}
                </Button>
            ))}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={selectedDateRange === 'custom' ? 'default' : 'outline'}
                        size="sm"
                    >
                        {customDateRange?.from && customDateRange?.to
                            ? `${format(customDateRange.from, 'MMM d')} - ${format(customDateRange.to, 'MMM d')}`
                            : 'Custom'}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                        initialFocus
                        mode="range"
                        selected={customDateRange}
                        onSelect={setCustomDateRange}
                        numberOfMonths={2}
                    />
                    <div className="flex items-center justify-end px-4 py-4 space-x-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedDateRange(null)}>
                            Cancel
                        </Button>
                        <Button size="sm" onClick={handleCustomDateRangeApply}>
                            Apply
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}
