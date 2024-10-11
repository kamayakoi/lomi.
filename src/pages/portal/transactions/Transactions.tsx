import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Download, Search, ArrowDownIcon, Filter, ArrowUpDown } from 'lucide-react'
import { format } from 'date-fns'
import { TopNav } from '@/components/dashboard/top-nav'
import { UserNav } from '@/components/dashboard/user-nav'
import Notifications from '@/components/dashboard/notifications'
import { Layout } from '@/components/custom/layout'
import { Separator } from '@/components/ui/separator'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DateRange } from 'react-day-picker'
import { supabase } from '@/utils/supabase/client'
import { currency_code, payment_method_code, provider_code, transaction_status, transaction_type } from './types'

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

type FetchedTransaction = {
    transaction_id: string
    customer_name: string
    gross_amount: number
    net_amount: number
    currency_code: currency_code
    payment_method_code: payment_method_code
    status: transaction_status
    transaction_type: transaction_type
    created_at: string
    provider_code: provider_code
}

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [showFilters, setShowFilters] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [sortColumn, setSortColumn] = useState<keyof Transaction | null>(null)
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
    const [totalIncomingAmount, setTotalIncomingAmount] = useState(0)
    const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
    const [selectedTypes, setSelectedTypes] = useState<string[]>([])
    const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([])
    const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([])
    const [transactionCount, setTransactionCount] = useState(0)
    const [selectedDateRange, setSelectedDateRange] = useState<string | null>(null)
    const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>()

    const topNav = [
        { title: 'Transactions', href: '/portal/transactions', isActive: true },
        { title: 'Settings', href: '/portal/settings/profile', isActive: false },
    ]

    const fetchTransactions = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser()

        const { data, error } = await supabase.rpc('fetch_transactions', {
            p_merchant_id: user?.id,
            p_provider_code: selectedProvider === 'all' ? null : selectedProvider,
            p_status: selectedStatuses.length > 0 ? selectedStatuses : null,
            p_type: selectedTypes.length > 0 ? selectedTypes : null,
            p_currency: selectedCurrencies.length > 0 ? selectedCurrencies : null,
            p_payment_method: selectedPaymentMethods.length > 0 ? selectedPaymentMethods : null,
        })

        if (error) {
            console.error('Error fetching transactions:', error)
            return
        }

        const formattedTransactions = data.map((transaction: FetchedTransaction) => ({
            transaction_id: transaction.transaction_id,
            customer: transaction.customer_name,
            gross_amount: transaction.gross_amount,
            net_amount: transaction.net_amount,
            currency: transaction.currency_code,
            payment_method: transaction.payment_method_code,
            status: transaction.status,
            type: transaction.transaction_type,
            date: format(new Date(transaction.created_at), 'yyyy-MM-dd'),
            provider_code: transaction.provider_code,
        }))

        setTransactions(formattedTransactions)
    }, [selectedProvider, selectedStatuses, selectedTypes, selectedCurrencies, selectedPaymentMethods])

    useEffect(() => {
        fetchTransactions()
        fetchTotalIncomingAmount()
        fetchTransactionCount()
    }, [fetchTransactions])

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

    const applySearch = (transactions: Transaction[]) => {
        if (!searchTerm) return transactions

        return transactions.filter(transaction =>
            Object.values(transaction).some(value =>
                value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
    }

    const fetchTotalIncomingAmount = async (startDate?: Date, endDate?: Date) => {
        const { data: { user } } = await supabase.auth.getUser()

        console.log('Fetching total incoming amount for merchant:', user?.id)

        const { data, error } = await supabase.rpc('fetch_total_incoming_amount', {
            p_merchant_id: user?.id,
            p_start_date: startDate ? format(startDate, 'yyyy-MM-dd') : null,
            p_end_date: endDate ? format(endDate, 'yyyy-MM-dd') : null,
        })

        if (error) {
            console.error('Error fetching total incoming amount:', error)
            return
        }

        setTotalIncomingAmount(data)
    }

    const fetchTransactionCount = async (startDate?: Date, endDate?: Date) => {
        const { data: { user } } = await supabase.auth.getUser()

        const { data, error } = await supabase.rpc('fetch_transaction_count', {
            p_merchant_id: user?.id,
            p_start_date: startDate ? format(startDate, 'yyyy-MM-dd') : null,
            p_end_date: endDate ? format(endDate, 'yyyy-MM-dd') : null,
        })

        if (error) {
            console.error('Error fetching transaction count:', error)
            return
        }

        setTransactionCount(data)
    }

    const handleDateRangeChange = (range: string) => {
        setSelectedDateRange(range)

        const now = new Date()
        let startDate: Date | undefined
        let endDate: Date | undefined

        switch (range) {
            case '24H':
                startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
                endDate = now
                break
            case '7D':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                endDate = now
                break
            case '1M':
                startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
                endDate = now
                break
            case '3M':
                startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
                endDate = now
                break
            case 'YTD':
                startDate = new Date(now.getFullYear(), 0, 1)
                endDate = now
                break
            default:
                startDate = undefined
                endDate = undefined
        }

        fetchTotalIncomingAmount(startDate, endDate)
        fetchTransactionCount(startDate, endDate)
    }

    const applyDateFilter = (transactions: Transaction[]) => {
        if (selectedDateRange === 'custom' && customDateRange) {
            return transactions.filter(transaction => {
                const transactionDate = new Date(transaction.date)
                return customDateRange.from && customDateRange.to &&
                    transactionDate >= customDateRange.from &&
                    transactionDate <= customDateRange.to
            })
        }

        if (!selectedDateRange) return transactions

        const now = new Date()
        let startDate: Date

        switch (selectedDateRange) {
            case '24H':
                startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
                break
            case '7D':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                break
            case '1M':
                startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
                break
            case '3M':
                startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
                break
            case 'YTD':
                startDate = new Date(now.getFullYear(), 0, 1)
                break
            default:
                return transactions
        }

        return transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date)
            return transactionDate >= startDate && transactionDate <= now
        })
    }

    const handleCustomDateRangeApply = () => {
        if (customDateRange && customDateRange.from && customDateRange.to) {
            setSelectedDateRange('custom')
            fetchTotalIncomingAmount(customDateRange.from, customDateRange.to)
            fetchTransactionCount(customDateRange.from, customDateRange.to)
        }
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
                                    <div className="text-2xl font-bold">XOF {totalIncomingAmount}</div>
                                    <p className="text-xs text-muted-foreground">{transactionCount} transactions</p>
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
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>
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
                                                <TableHead>Customer</TableHead>
                                                <TableHead>Gross Amount</TableHead>
                                                <TableHead>Net Amount</TableHead>
                                                <TableHead>Currency</TableHead>
                                                <TableHead>Payment Method</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Provider</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {applySearch(sortTransactions(applyDateFilter(transactions))).map((transaction) => (
                                                <TableRow key={transaction.transaction_id}>
                                                    <TableCell>{transaction.transaction_id}</TableCell>
                                                    <TableCell>{transaction.customer}</TableCell>
                                                    <TableCell>{transaction.gross_amount}</TableCell>
                                                    <TableCell>{transaction.net_amount}</TableCell>
                                                    <TableCell>{transaction.currency}</TableCell>
                                                    <TableCell>{transaction.payment_method}</TableCell>
                                                    <TableCell>{transaction.status}</TableCell>
                                                    <TableCell>{transaction.type}</TableCell>
                                                    <TableCell>{transaction.date}</TableCell>
                                                    <TableCell>{transaction.provider_code}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </Layout.Body>
        </Layout>
    )
}