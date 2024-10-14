import { useState } from 'react'
import { Search, Download, Calendar, Settings } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { DateRange } from 'react-day-picker'
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ChevronDown } from "lucide-react"

type StatusOption = {
    id: string
    label: string
}

const statusOptions: StatusOption[] = [
    { id: "pending", label: "Pending" },
    { id: "processing", label: "Processing" },
    { id: "completed", label: "Completed" },
    { id: "failed", label: "Failed" },
]

interface PayoutFiltersProps {
    searchTerm: string
    setSearchTerm: (value: string) => void
    selectedDateRange: string | null
    setSelectedDateRange: (value: string | null) => void
    customDateRange: DateRange | undefined
    setCustomDateRange: (value: DateRange | undefined) => void
    handleCustomDateRangeApply: () => void
    selectedStatuses: string[]
    setSelectedStatuses: (value: string[]) => void
    columns: string[]
    setColumns: (value: string[]) => void
}

export default function PayoutFilters({
    searchTerm,
    setSearchTerm,
    selectedDateRange,
    setSelectedDateRange,
    customDateRange,
    setCustomDateRange,
    selectedStatuses,
    setSelectedStatuses,
    columns,
    setColumns,
}: PayoutFiltersProps) {
    const [isColumnsPopoverOpen, setIsColumnsPopoverOpen] = useState(false)

    const allColumns = [
        'Payout ID',
        'Amount',
        'Currency',
        'Payout Method',
        'Status',
        'Date',
    ]

    const toggleColumn = (column: string) => {
        if (columns.includes(column)) {
            setColumns(columns.filter((col) => col !== column))
        } else {
            setColumns([...columns, column])
        }
    }

    const handleStatusChange = (statusId: string) => {
        setSelectedStatuses(
            selectedStatuses.includes(statusId)
                ? selectedStatuses.filter((id) => id !== statusId)
                : [...selectedStatuses, statusId]
        )
    }

    return (
        <div className="w-full bg-card shadow-sm rounded-lg p-4 text-card-foreground">
            <div className="flex flex-wrap items-end gap-4">
                <div className="w-full sm:w-auto flex-grow">
                    <label htmlFor="date-range" className="block text-sm font-medium mb-1">Date Range</label>
                    <div className="flex rounded-md shadow-sm w-full max-w-2xl">
                        {['24H', '7D', '1M', '3M', '6M', 'YTD'].map((range) => (
                            <Button
                                key={range}
                                variant="outline"
                                onClick={() => setSelectedDateRange(range)}
                                className={`
                  px-2 py-2 text-sm font-medium transition-colors duration-150 h-10
                  ${selectedDateRange === range ? 'bg-muted text-muted-foreground' : 'bg-card text-card-foreground'}
                  rounded-none border border-border
                  focus:outline-none focus:ring-2 focus:ring-primary focus:z-10
                  flex-1
                `}
                            >
                                {range}
                            </Button>
                        ))}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={`
                    px-3 py-2 text-sm font-medium transition-colors duration-150 h-10
                    ${selectedDateRange === 'custom' ? 'bg-muted text-muted-foreground' : 'bg-card text-card-foreground'}
                    rounded-none border border-border
                    focus:outline-none focus:ring-2 focus:ring-primary focus:z-10
                    flex-1
                  `}
                                    onClick={() => setSelectedDateRange('custom')}
                                >
                                    {customDateRange?.from ? (
                                        customDateRange.to ? (
                                            <>
                                                {format(customDateRange.from, "LLL dd, y")} - {format(customDateRange.to, "LLL dd, y")}
                                            </>
                                        ) : (
                                            format(customDateRange.from, "LLL dd, y")
                                        )
                                    ) : (
                                        <span>Custom <Calendar className="ml-2 h-4 w-4 inline" /></span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-card text-card-foreground" align="start">
                                <CalendarComponent
                                    initialFocus
                                    mode="range"
                                    defaultMonth={customDateRange?.from}
                                    selected={customDateRange}
                                    onSelect={setCustomDateRange}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                <div className="w-full sm:w-64">
                    <label htmlFor="status" className="block text-sm font-medium mb-1">Status</label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={false}
                                className="w-full justify-between h-10 rounded-none bg-card border-border text-card-foreground"
                            >
                                <div className="flex items-center space-x-2 truncate">
                                    {selectedStatuses.length > 0 ? (
                                        selectedStatuses.map((id) => (
                                            <Badge key={id} variant="secondary" className="mr-1">
                                                {statusOptions.find((opt) => opt.id === id)?.label}
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-muted-foreground">Select status</span>
                                    )}
                                </div>
                                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-4 bg-card text-card-foreground">
                            <h4 className="mb-4 text-sm font-medium">Status</h4>
                            {statusOptions.map((status) => (
                                <div key={status.id} className="flex items-center space-x-2 mb-2">
                                    <Checkbox
                                        id={status.id}
                                        checked={selectedStatuses.includes(status.id)}
                                        onCheckedChange={() => handleStatusChange(status.id)}
                                    />
                                    <label
                                        htmlFor={status.id}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {status.label}
                                    </label>
                                </div>
                            ))}
                            <div className="flex justify-end mt-4">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedStatuses([])}
                                >
                                    Clear
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="w-full sm:w-64">
                    <label htmlFor="search" className="block text-sm font-medium mb-1">Search</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <Input
                            type="text"
                            id="search"
                            className="block w-full pl-10 sm:text-sm border-border h-10 rounded-none bg-card"
                            placeholder="Search payouts"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex space-x-2 ml-auto">
                    <Popover open={isColumnsPopoverOpen} onOpenChange={setIsColumnsPopoverOpen}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="border-border text-card-foreground px-2 h-10 rounded-none">
                                <Settings className="h-5 w-5" />
                                <span className="sr-only">Columns</span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-4 bg-card text-card-foreground">
                            <h4 className="mb-4 text-sm font-medium">Columns</h4>
                            {allColumns.map((column) => (
                                <div key={column} className="flex items-center space-x-2 mb-2">
                                    <Checkbox
                                        id={`column-${column}`}
                                        checked={columns.includes(column)}
                                        onCheckedChange={() => toggleColumn(column)}
                                    />
                                    <label htmlFor={`column-${column}`} className="text-sm">
                                        {column}
                                    </label>
                                </div>
                            ))}
                        </PopoverContent>
                    </Popover>
                    <Button variant="outline" className="border-border text-card-foreground px-2 h-10 rounded-none">
                        <Download className="h-5 w-5" />
                        <span className="sr-only">Export</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}
