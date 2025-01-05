import { useState } from 'react'
import { Search, Download, Calendar, Settings, RefreshCw } from 'lucide-react'
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
    refetch: () => void
    isRefreshing: boolean
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
    refetch,
    isRefreshing,
}: PayoutFiltersProps) {
    const [isColumnsPopoverOpen, setIsColumnsPopoverOpen] = useState(false)
    const [isStatusPopoverOpen, setIsStatusPopoverOpen] = useState(false)

    const allColumns = [
        'Payout ID',
        'Amount',
        'Currency',
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
                  focus:outline-none focus:ring-1 focus:ring-primary focus:z-10
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
                    focus:outline-none focus:ring-1 focus:ring-primary focus:z-10
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
                    <Popover open={isStatusPopoverOpen} onOpenChange={setIsStatusPopoverOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={isStatusPopoverOpen}
                                className="w-full justify-between h-10 rounded-none bg-card border-border text-card-foreground"
                            >
                                <div className="flex items-center space-x-2 truncate">
                                    {selectedStatuses.length === statusOptions.length ? (
                                        <span className="text-muted-foreground">Select status</span>
                                    ) : selectedStatuses.length > 0 ? (
                                        selectedStatuses.map((id) => {
                                            const status = statusOptions.find((opt) => opt.id === id)
                                            let badgeColor = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                            if (status?.id === 'pending') {
                                                badgeColor = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                            } else if (status?.id === 'processing') {
                                                badgeColor = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                            } else if (status?.id === 'completed') {
                                                badgeColor = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                            } else if (status?.id === 'failed') {
                                                badgeColor = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                            }
                                            return (
                                                <Badge
                                                    key={id}
                                                    className={`mr-1 ${badgeColor} rounded-md transition-none hover:bg-opacity-100 hover:opacity-100`}
                                                    style={{ pointerEvents: 'none' }}
                                                >
                                                    {status?.label}
                                                </Badge>
                                            )
                                        })
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
                    <Button
                        variant="outline"
                        onClick={() => refetch()}
                        className="border-border text-card-foreground px-2 h-10 rounded-none"
                        disabled={isRefreshing}
                    >
                        <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                        <span className="sr-only">Refresh</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}
