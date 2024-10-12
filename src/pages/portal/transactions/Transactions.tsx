import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Download, Search, ArrowDownIcon, Filter, ArrowUpDown } from 'lucide-react'
import { TopNav } from '@/components/dashboard/top-nav'
import { UserNav } from '@/components/dashboard/user-nav'
import Notifications from '@/components/dashboard/notifications'
import { Layout } from '@/components/custom/layout'
import { Separator } from '@/components/ui/separator'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DateRange } from 'react-day-picker'
import { currency_code, payment_method_code, provider_code, transaction_status, transaction_type } from './types'
import { fetchTransactions, useTotalIncomingAmount, useTransactionCount, applySearch, applyDateFilter } from './support_transactions'
import { useUser } from '@/lib/hooks/useUser'
import { Skeleton } from '@/components/ui/skeleton'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useInfiniteQuery } from 'react-query'
import AnimatedLogoLoader from '@/components/dashboard/loader'
import TransactionActions from './actions_transactions'

type Transaction = {
    transaction_id: string
    customer: string
    gross_amount: number
    net_amount: number
    currency: currency_code
    payment_method: payment_method_code
    status: transaction_status
    type: transaction_type
    date: string
    provider_code: provider_code
}

export default function TransactionsPage() {
    const { user, isLoading: isUserLoading } = useUser()
    const [showFilters, setShowFilters] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [sortColumn, setSortColumn] = useState<keyof Transaction | null>(null)
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
    const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
    const [selectedTypes, setSelectedTypes] = useState<string[]>([])
    const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([])
    const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([])
    const [selectedDateRange, setSelectedDateRange] = useState<string | null>('24H')
    const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>()
    const pageSize = 50
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

    const topNav = [
        { title: 'Transactions', href: '/portal/transactions', isActive: true },
        { title: 'Settings', href: '/portal/settings/profile', isActive: false },
    ]

    const { data: transactionsData, isLoading: isTransactionsLoading, fetchNextPage } = useInfiniteQuery(
        ['transactions', user?.id || '', selectedProvider, selectedStatuses, selectedTypes, selectedCurrencies, selectedPaymentMethods],
        ({ pageParam = 1 }) =>
            fetchTransactions(
                user?.id || '',
                selectedProvider,
                selectedStatuses,
                selectedTypes,
                selectedCurrencies,
                selectedPaymentMethods,
                pageParam,
                pageSize
            ),
        {
            getNextPageParam: (lastPage, allPages) => {
                const nextPage = allPages.length + 1
                return lastPage.length !== 0 ? nextPage : undefined
            },
            enabled: !!user?.id,
        }
    )

    const transactions = transactionsData?.pages?.flatMap((page) => page) || []

    const { data: totalIncomingAmount = 0, isLoading: isTotalIncomingAmountLoading } = useTotalIncomingAmount(
        user?.id || '',
        selectedDateRange,
        customDateRange,
        { enabled: !!user?.id }
    )

    const { data: transactionCount = 0, isLoading: isTransactionCountLoading } = useTransactionCount(
        user?.id || '',
        selectedDateRange,
        customDateRange,
        { enabled: !!user?.id }
    )

    const handleSort = (column: keyof Transaction) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortColumn(column)
            setSortDirection('asc')
        }
    }

    const sortTransactions = (transactions: Transaction[]) => {
        if (!sortColumn) return transactions

        return transactions.sort((a, b) => {
            if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1
            if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1
            return 0
        })
    }

    const handleDateRangeChange = (range: string) => {
        setSelectedDateRange(range)
    }

    const handleCustomDateRangeApply = () => {
        if (customDateRange && customDateRange.from && customDateRange.to) {
            setSelectedDateRange('custom')
        }
    }

    if (isUserLoading) {
        return <AnimatedLogoLoader />
    }

    if (!user || !user.id) {
        return <div><AnimatedLogoLoader /> User data not available.</div>
    }

    return (
        <Layout fixed>
            <Layout.Header>
                <TopNav links={topNav} />
                <div className='ml-auto flex items-center space-x-4'>
                    <Notifications />
                    <UserNav />
                </div>
            </Layout.Header>

            <Separator className='my-0' />

            <Layout.Body>
                <div className="h-full overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <div className="space-y-4 pb-8">
                        <h1 className="text-2xl font-bold tracking-tight mb-4">Transactions</h1>

                        <div className="grid gap-4 md:grid-cols-2 mb-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Incoming Amount</CardTitle>
                                    <ArrowDownIcon className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {isTotalIncomingAmountLoading ? (
                                            <Skeleton className="w-32 h-8" />
                                        ) : (
                                            `XOF ${totalIncomingAmount}`
                                        )}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {isTransactionCountLoading ? (
                                            <Skeleton className="w-20 h-4" />
                                        ) : (
                                            `${transactionCount} transactions`
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="mb-6">
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                        <Label>Date Range</Label>
                                        <div className="space-x-2">
                                            {['24H', '7D', '1M', '3M', 'YTD'].map(range => (
                                                <Button
                                                    key={range}
                                                    variant={selectedDateRange === range ? 'default' : 'ghost'}
                                                    onClick={() => handleDateRangeChange(range)}
                                                >
                                                    {range}
                                                </Button>
                                            ))}
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant={selectedDateRange === 'custom' ? 'default' : 'ghost'}>
                                                        Custom
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        initialFocus
                                                        mode="range"
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

                                    <div className="space-y-2">
                                        <Label>Provider</Label>
                                        <Select
                                            value={selectedProvider || undefined}
                                            onValueChange={(value) => setSelectedProvider(value)}
                                        >
                                            <SelectTrigger>
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

                                    <div className="space-y-2">
                                        <Label htmlFor="search">Search</Label>
                                        <div className="relative">
                                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="search"
                                                placeholder="Search transactions"
                                                className="pl-8"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-end space-x-2">
                                        <Button onClick={() => setShowFilters(!showFilters)}>
                                            <Filter className="mr-2 h-4 w-4" />
                                            Filters
                                        </Button>
                                        <Button>
                                            <Download className="mr-2 h-4 w-4" />
                                            Export
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {showFilters && (
                            <Card className="mb-6">
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <h3 className="font-semibold mb-2">Status</h3>
                                            <div className="space-y-2">
                                                {['pending', 'completed', 'failed'].map((status) => (
                                                    <div key={status} className="flex items-center">
                                                        <Checkbox
                                                            id={`status-${status}`}
                                                            checked={selectedStatuses.includes(status)}
                                                            onChange={(e) => {
                                                                if ((e.target as HTMLInputElement).checked) {
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
                                            <h3 className="font-semibold mb-2">Type</h3>
                                            <div className="space-y-2">
                                                {['payment', 'instalment'].map((type) => (
                                                    <div key={type} className="flex items-center">
                                                        <Checkbox
                                                            id={`type-${type}`}
                                                            checked={selectedTypes.includes(type)}
                                                            onChange={(e) => {
                                                                if ((e.target as HTMLInputElement).checked) {
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
                                            <h3 className="font-semibold mb-2">Currency</h3>
                                            <div className="space-y-2">
                                                {['XOF', 'USD', 'EUR'].map((currency) => (
                                                    <div key={currency} className="flex items-center">
                                                        <Checkbox
                                                            id={`currency-${currency}`}
                                                            checked={selectedCurrencies.includes(currency)}
                                                            onChange={(e) => {
                                                                if ((e.target as HTMLInputElement).checked) {
                                                                    setSelectedCurrencies([...selectedCurrencies, currency])
                                                                } else {
                                                                    setSelectedCurrencies(selectedCurrencies.filter(c => c !== currency))
                                                                }
                                                            }}
                                                        />
                                                        <label htmlFor={`currency-${currency}`} className="ml-2 text-sm">{currency}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-2">Payment Method</h3>
                                            <div className="space-y-2">
                                                {['CARDS', 'MOBILE_MONEY', 'E_WALLET', 'BANK_TRANSFER', 'APPLE_PAY', 'GOOGLE_PAY', 'USSD', 'QR_CODE'].map((method) => (
                                                    <div key={method} className="flex items-center">
                                                        <Checkbox
                                                            id={`method-${method}`}
                                                            checked={selectedPaymentMethods.includes(method)}
                                                            onChange={(e) => {
                                                                if ((e.target as HTMLInputElement).checked) {
                                                                    setSelectedPaymentMethods([...selectedPaymentMethods, method])
                                                                } else {
                                                                    setSelectedPaymentMethods(selectedPaymentMethods.filter(m => m !== method))
                                                                }
                                                            }}
                                                        />
                                                        <label htmlFor={`method-${method}`} className="ml-2 text-sm">{method}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <Card>
                            <CardContent className="p-6">
                                <div className="rounded-md border">
                                    <InfiniteScroll
                                        dataLength={transactions.length}
                                        next={() => fetchNextPage()}
                                        hasMore={transactionsData?.pages[transactionsData.pages.length - 1].length === pageSize}
                                        loader={<Skeleton className="w-full h-8" />}
                                    >
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="text-center">
                                                        <Button
                                                            variant="ghost"
                                                            onClick={() => handleSort('transaction_id')}
                                                        >
                                                            Transaction ID
                                                            {sortColumn === 'transaction_id' && (
                                                                <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                            )}
                                                        </Button>
                                                    </TableHead>
                                                    <TableHead className="text-center">Customer</TableHead>
                                                    <TableHead className="text-center">Gross Amount</TableHead>
                                                    <TableHead className="text-center">Net Amount</TableHead>
                                                    <TableHead className="text-center">Currency</TableHead>
                                                    <TableHead className="text-center">Payment Method</TableHead>
                                                    <TableHead className="text-center">Status</TableHead>
                                                    <TableHead className="text-center">Type</TableHead>
                                                    <TableHead className="text-center">Date</TableHead>
                                                    <TableHead className="text-center">Provider</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {isTransactionsLoading ? (
                                                    Array.from({ length: 5 }).map((_, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell colSpan={10}>
                                                                <Skeleton className="w-full h-8" />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    applySearch(applyDateFilter(sortTransactions(transactions), selectedDateRange, customDateRange), searchTerm).map((transaction: Transaction) => (
                                                        <TableRow
                                                            key={transaction.transaction_id}
                                                            className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                                                            onClick={() => setSelectedTransaction(transaction)}
                                                        >
                                                            <TableCell className="text-center">{shortenTransactionId(transaction.transaction_id)}</TableCell>
                                                            <TableCell className="text-center font-medium">{transaction.customer}</TableCell>
                                                            <TableCell className="text-center">{transaction.gross_amount}</TableCell>
                                                            <TableCell className="text-center">{transaction.net_amount}</TableCell>
                                                            <TableCell className="text-center">{transaction.currency}</TableCell>
                                                            <TableCell className="text-center">{formatPaymentMethod(transaction.payment_method)}</TableCell>
                                                            <TableCell className="text-center">
                                                                <span className={`
                                                                    inline-block px-2 py-1 rounded-full text-xs font-semibold
                                                                    ${transaction.status === 'refunded' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : ''}
                                                                    ${transaction.status === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : ''}
                                                                    ${transaction.status === 'pending' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : ''}
                                                                    ${transaction.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : ''}
                                                                `}>
                                                                    {formatTransactionStatus(transaction.status)}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell className="text-center">{formatTransactionType(transaction.type)}</TableCell>
                                                            <TableCell className="text-center">{formatDate(transaction.date)}</TableCell>
                                                            <TableCell className="text-center">
                                                                <span className={`
                                                                    inline-block px-2 py-1 text-xs font-semibold
                                                                    ${transaction.provider_code === 'ORANGE' ? 'bg-orange-200 text-orange-800 dark:bg-orange-800 dark:text-orange-200' : ''}
                                                                    ${transaction.provider_code === 'WAVE' ? 'bg-indigo-200 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-200' : ''}
                                                                    ${transaction.provider_code === 'ECOBANK' ? 'bg-teal-200 text-teal-800 dark:bg-teal-800 dark:text-teal-200' : ''}
                                                                    ${transaction.provider_code === 'MTN' ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200' : ''}
                                                                    ${transaction.provider_code === 'STRIPE' ? 'bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200' : ''}
                                                                    ${transaction.provider_code === 'OTHER' ? 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200' : ''}
                                                                `}>
                                                                    {formatProviderCode(transaction.provider_code)}
                                                                </span>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </InfiniteScroll>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </Layout.Body>
            <TransactionActions
                transaction={selectedTransaction}
                isOpen={!!selectedTransaction}
                onClose={() => setSelectedTransaction(null)}
            />
        </Layout>
    )
}

function formatPaymentMethod(paymentMethod: payment_method_code): string {
    switch (paymentMethod) {
        case 'CARDS':
            return 'Cards'
        case 'MOBILE_MONEY':
            return 'Mobile Money'
        case 'E_WALLET':
            return 'E-Wallet'
        case 'BANK_TRANSFER':
            return 'Bank Transfer'
        case 'APPLE_PAY':
            return 'Apple Pay'
        case 'GOOGLE_PAY':
            return 'Google Pay'
        case 'USSD':
            return 'USSD'
        case 'QR_CODE':
            return 'QR Code'
        default:
            return paymentMethod
    }
}

function formatTransactionStatus(status: transaction_status): string {
    return status.charAt(0).toUpperCase() + status.slice(1)
}

function formatTransactionType(type: transaction_type): string {
    return type.charAt(0).toUpperCase() + type.slice(1)
}

function formatProviderCode(providerCode: provider_code): string {
    switch (providerCode) {
        case 'ORANGE':
            return 'Orange'
        case 'WAVE':
            return 'Wave'
        case 'ECOBANK':
            return 'Ecobank'
        case 'MTN':
            return 'MTN'
        case 'STRIPE':
            return 'Stripe'
        case 'OTHER':
            return 'Other'
        default:
            return providerCode
    }
}

function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

// Update the shortenTransactionId function
function shortenTransactionId(transactionId: string): string {
    return `${transactionId.slice(0, 8)}${transactionId.slice(8, 12)}-...`
}