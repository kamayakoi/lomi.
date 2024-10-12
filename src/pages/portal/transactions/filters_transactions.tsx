import { useState } from 'react'
import { Search, Filter, Download, Calendar, Settings } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { DateRange } from 'react-day-picker'
import { Checkbox } from "@/components/ui/checkbox"

interface TransactionFiltersProps {
    searchTerm: string
    setSearchTerm: (value: string) => void
    selectedProvider: string | null
    setSelectedProvider: (value: string | null) => void
    selectedDateRange: string | null
    setSelectedDateRange: (value: string | null) => void
    customDateRange: DateRange | undefined
    setCustomDateRange: (value: DateRange | undefined) => void
    handleCustomDateRangeApply: () => void
    setShowFilters: (value: boolean) => void
    columns: string[]
    setColumns: (value: string[]) => void
}

export default function TransactionFilters({
    searchTerm,
    setSearchTerm,
    selectedProvider,
    setSelectedProvider,
    selectedDateRange,
    setSelectedDateRange,
    customDateRange,
    setCustomDateRange,
    handleCustomDateRangeApply,
    setShowFilters,
    columns,
    setColumns,
}: TransactionFiltersProps) {
    const [isColumnsPopoverOpen, setIsColumnsPopoverOpen] = useState(false)

    const allColumns = [
        'Transaction ID',
        'Customer',
        'Gross Amount',
        'Net Amount',
        'Currency',
        'Payment Method',
        'Status',
        'Type',
        'Date',
        'Provider',
    ]

    const toggleColumn = (column: string) => {
        if (columns.includes(column)) {
            setColumns(columns.filter((col) => col !== column))
        } else {
            setColumns([...columns, column])
        }
    }

    return (
        <div className="w-full bg-white shadow-sm rounded-lg p-4">
            <div className="flex flex-wrap items-end gap-4">
                <div className="w-full sm:w-auto flex-grow">
                    <label htmlFor="date-range" className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                    <div className="flex rounded-md shadow-sm w-full max-w-3xl">
                        {['24H', '7D', '1M', '3M', 'YTD'].map((range) => (
                            <Button
                                key={range}
                                variant="outline"
                                onClick={() => setSelectedDateRange(range)}
                                className={`
                  px-3 py-2 text-sm font-medium transition-colors duration-150 h-10
                  ${selectedDateRange === range ? 'bg-gray-100 text-gray-900' : 'bg-white text-gray-600'}
                  rounded-none border border-gray-300
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
                    ${selectedDateRange === 'custom' ? 'bg-gray-100 text-gray-900' : 'bg-white text-gray-600'}
                    rounded-none border border-gray-300
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
                            <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent
                                    initialFocus
                                    mode="range"
                                    defaultMonth={customDateRange?.from}
                                    selected={customDateRange}
                                    onSelect={setCustomDateRange}
                                    numberOfMonths={2}
                                />
                                <div className="flex justify-end p-2">
                                    <Button onClick={handleCustomDateRangeApply}>Apply</Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                <div className="w-full sm:w-64">
                    <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                    <Select
                        value={selectedProvider || undefined}
                        onValueChange={(value) => setSelectedProvider(value)}
                    >
                        <SelectTrigger id="provider" className="w-full bg-white border-gray-300 h-10">
                            <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Providers</SelectItem>
                            <SelectItem value="ORANGE">Orange</SelectItem>
                            <SelectItem value="WAVE">Wave</SelectItem>
                            <SelectItem value="ECOBANK">Ecobank</SelectItem>
                            <SelectItem value="MTN">MTN</SelectItem>
                            <SelectItem value="STRIPE">Stripe</SelectItem>
                            <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-full sm:w-64 lg:w-80">
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                            type="text"
                            id="search"
                            className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md h-10"
                            placeholder="Search transactions"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex space-x-2 ml-auto">
                    <Button variant="outline" className="border-gray-300 text-gray-700 h-10" onClick={() => setShowFilters(true)}>
                        <Filter className="h-5 w-5" />
                        <span className="ml-2">Filters</span>
                    </Button>
                    <Popover open={isColumnsPopoverOpen} onOpenChange={setIsColumnsPopoverOpen}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="border-gray-300 text-gray-700 px-2 h-10">
                                <Settings className="h-5 w-5" />
                                <span className="sr-only">Columns</span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-4">
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
                    <Button variant="outline" className="border-gray-300 text-gray-700 px-2 h-10">
                        <Download className="h-5 w-5" />
                        <span className="sr-only">Export</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}
