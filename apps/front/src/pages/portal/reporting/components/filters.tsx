import { Button } from "@/components/ui/button"
import { cn } from "@/lib/actions/utils"
import { DateRange } from 'react-day-picker'
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { ChevronDown } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"

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
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

    // Function to handle range selection from dropdown on mobile
    const handleMobileRangeSelect = (range: string) => {
        setSelectedDateRange(range)
        setDate(undefined)
        setIsDatePickerOpen(false)
    }

    return (
        <div className="flex flex-col md:flex-row w-full items-center md:justify-end gap-2 mb-4">
            {/* Mobile view - Combined dropdown with date picker trigger */}
            <div className="md:hidden w-full">
                <div className="flex w-full">
                    {/* Dropdown for date ranges on mobile */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full justify-between"
                            >
                                <span>{selectedDateRange ? dateRanges.find(r => r.value === selectedDateRange)?.label : 'Custom'}</span>
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-52">
                            {dateRanges.map((range) => (
                                <DropdownMenuItem
                                    key={range.value}
                                    onClick={() => handleMobileRangeSelect(range.value)}
                                    className={cn(
                                        "cursor-pointer",
                                        selectedDateRange === range.value && "bg-primary/10"
                                    )}
                                >
                                    {range.label}
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuItem
                                onClick={() => setIsDatePickerOpen(true)}
                                className="cursor-pointer"
                            >
                                Custom date range
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Custom date picker that expands more cleanly on mobile */}
                <div className={cn("mt-2", !isDatePickerOpen && "hidden")}>
                    <DateRangePicker
                        date={date}
                        setDate={(newDate) => {
                            setDate(newDate)
                            if (newDate) {
                                setSelectedDateRange(null)
                                setIsDatePickerOpen(false)
                            }
                        }}
                    />
                </div>
            </div>

            {/* Desktop view - Buttons and date picker side by side */}
            <div className="hidden md:flex items-center">
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
                                "h-10 px-3 text-sm font-medium rounded-none border-r-0",
                                "focus-visible:z-10 focus-visible:ring-1 focus-visible:ring-primary",
                                selectedDateRange === range.value
                                    ? "bg-[#10B981] text-white hover:bg-[#10B981]/90 border-[#10B981]"
                                    : "bg-card text-card-foreground hover:bg-muted/50"
                            )}
                        >
                            {range.label}
                        </Button>
                    ))}
                    <div className="flex items-center justify-center">
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
            </div>
        </div>
    )
}
