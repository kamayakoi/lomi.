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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

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
    selectedStatuses: string[]
    setSelectedStatuses: (value: string[]) => void
    selectedTypes: string[]
    setSelectedTypes: (value: string[]) => void
    selectedCurrencies: string[]
    setSelectedCurrencies: (value: string[]) => void
    selectedPaymentMethods: string[]
    setSelectedPaymentMethods: (value: string[]) => void
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
    selectedStatuses,
    setSelectedStatuses,
    selectedTypes,
    setSelectedTypes,
    selectedCurrencies,
    setSelectedCurrencies,
    selectedPaymentMethods,
    setSelectedPaymentMethods,
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
                                <div className="flex justify-end p-2">
                                    <Button onClick={handleCustomDateRangeApply}>Apply</Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                <div className="w-full sm:w-64">
                    <label htmlFor="provider" className="block text-sm font-medium mb-1">Providers</label>
                    <Select
                        value={selectedProvider || undefined}
                        onValueChange={(value) => setSelectedProvider(value)}
                    >
                        <SelectTrigger id="provider" className="w-full bg-card border-border h-10 rounded-none">
                            <SelectValue placeholder="Select a specific provider" />
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
                            placeholder="Search transactions"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex space-x-2 ml-auto">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="border-border text-card-foreground h-10 rounded-none">
                                <Filter className="h-5 w-5" />
                                <span className="ml-2">Filters</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[400px] sm:w-[540px] bg-card text-card-foreground">
                            <div className="flex flex-col space-y-4 p-4">
                                <h3 className="text-lg font-semibold">Filters</h3>
                                <div>
                                    <h4 className="mb-2 font-medium">Status</h4>
                                    <div className="space-y-2">
                                        {['pending', 'completed', 'failed', 'refunded'].map((status) => (
                                            <div key={status} className="flex items-center">
                                                <Checkbox
                                                    id={`status-${status}`}
                                                    checked={selectedStatuses.includes(status)}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            setSelectedStatuses([...selectedStatuses, status])
                                                        } else {
                                                            setSelectedStatuses(selectedStatuses.filter(s => s !== status))
                                                        }
                                                    }}
                                                />
                                                <label htmlFor={`status-${status}`} className="ml-2 text-sm capitalize">{status}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="mb-2 font-medium">Type</h4>
                                    <div className="space-y-2">
                                        {['payment', 'instalment'].map((type) => (
                                            <div key={type} className="flex items-center">
                                                <Checkbox
                                                    id={`type-${type}`}
                                                    checked={selectedTypes.includes(type)}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            setSelectedTypes([...selectedTypes, type])
                                                        } else {
                                                            setSelectedTypes(selectedTypes.filter(t => t !== type))
                                                        }
                                                    }}
                                                />
                                                <label htmlFor={`type-${type}`} className="ml-2 text-sm capitalize">{type}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="mb-2 font-medium">Currency</h4>
                                    <div className="space-y-2">
                                        {['XOF', 'EUR', 'USD'].map((currency) => (
                                            <div key={currency} className="flex items-center">
                                                <Checkbox
                                                    id={`currency-${currency}`}
                                                    checked={selectedCurrencies.includes(currency)}
                                                    onCheckedChange={(checked) => {
                                                        if (currency === 'XOF') {
                                                            if (checked) {
                                                                setSelectedCurrencies([...selectedCurrencies, currency])
                                                            } else {
                                                                setSelectedCurrencies(selectedCurrencies.filter(c => c !== currency))
                                                            }
                                                        }
                                                    }}
                                                    disabled={currency !== 'XOF'}
                                                />
                                                <label
                                                    htmlFor={`currency-${currency}`}
                                                    className={`ml-2 text-sm ${currency !== 'XOF' ? 'text-gray-400' : ''}`}
                                                >
                                                    {currency}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="mb-2 font-medium">Payment Method</h4>
                                    <div className="space-y-2">
                                        {[
                                            { code: 'CARDS', label: 'Cards' },
                                            { code: 'MOBILE_MONEY', label: 'Mobile money' },
                                            { code: 'E_WALLET', label: 'E-wallet' },
                                            { code: 'BANK_TRANSFER', label: 'Bank transfer' },
                                            { code: 'APPLE_PAY', label: 'Apple Pay' },
                                            { code: 'GOOGLE_PAY', label: 'Google Pay' },
                                            { code: 'USSD', label: 'USSD' },
                                            { code: 'QR_CODE', label: 'QR Code' }
                                        ].map(({ code, label }) => (
                                            <div key={code} className="flex items-center">
                                                <Checkbox
                                                    id={`method-${code}`}
                                                    checked={selectedPaymentMethods.includes(code)}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            setSelectedPaymentMethods([...selectedPaymentMethods, code])
                                                        } else {
                                                            setSelectedPaymentMethods(selectedPaymentMethods.filter(m => m !== code))
                                                        }
                                                    }}
                                                />
                                                <label htmlFor={`method-${code}`} className="ml-2 text-sm">{label}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
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
