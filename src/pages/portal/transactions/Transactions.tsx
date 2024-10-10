import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Download, Search, ArrowDownIcon, Filter, ArrowUpDown } from 'lucide-react'
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

type Transaction = {
    transaction_id: string
    customer: string
    gross_amount: number
    net_amount: number
    currency: 'XOF' | 'USD'
    payment_method: 'Cards' | 'Mobile Money' | 'Bank Transfer' | 'Apple Pay' | 'Google Pay' | 'USSD' | 'QR Code'
    status: 'pending' | 'completed' | 'failed'
    type: 'payment' | 'refund' | 'subscription'
    date: string
}

type FetchedTransaction = {
    transaction_id: string
    customer_name: string
    gross_amount: number
    net_amount: number
    currency_code: string
    payment_method_code: string
    status: string
    transaction_type: string
    created_at: string
}

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [date, setDate] = useState<DateRange | undefined>()
    const [showFilters, setShowFilters] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [sortColumn, setSortColumn] = useState<keyof Transaction | null>(null)
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
    const [totalIncomingAmount, setTotalIncomingAmount] = useState(0)

    const topNav = [
        { title: 'Transactions', href: '/portal/transactions', isActive: true },
        { title: 'Settings', href: '/portal/settings/profile', isActive: false },
    ]

    useEffect(() => {
        fetchTransactions()
        fetchTotalIncomingAmount()
    }, [])

    const fetchTransactions = async () => {
        const { data: { user } } = await supabase.auth.getUser()

        const { data, error } = await supabase.rpc('fetch_transactions', {
            p_merchant_id: user?.id,
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
        }))

        setTransactions(formattedTransactions)
    }

    const handleSort = (column: keyof Transaction) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortColumn(column)
            setSortDirection('asc')
        }
    }

    const filteredAndSortedTransactions = transactions
        .filter(transaction =>
            Object.values(transaction).some(value =>
                value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
        .sort((a, b) => {
            if (!sortColumn) return 0
            if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1
            if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1
            return 0
        })

    const fetchTotalIncomingAmount = async () => {
        const { data: { user } } = await supabase.auth.getUser()

        const { data, error } = await supabase.rpc('fetch_total_incoming_amount', {
            p_merchant_id: user?.id,
        })

        if (error) {
            console.error('Error fetching total incoming amount:', error)
            return
        }

        setTotalIncomingAmount(data)
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
                                    <p className="text-xs text-muted-foreground">{transactions.length} transactions</p>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="mb-6">
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                        <Label>Date Range</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    id="date"
                                                    variant="outline"
                                                    className="w-full justify-start text-left font-normal"
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {date?.from ? (
                                                        date.to ? (
                                                            <>
                                                                {format(date.from, "LLL dd, y")} -{" "}
                                                                {format(date.to, "LLL dd, y")}
                                                            </>
                                                        ) : (
                                                            format(date.from, "LLL dd, y")
                                                        )
                                                    ) : (
                                                        <span>Pick a date range</span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    initialFocus
                                                    mode="range"
                                                    defaultMonth={date?.from}
                                                    selected={date}
                                                    onSelect={setDate}
                                                    numberOfMonths={2}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Provider</Label>
                                        <Select>
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
                                                        <Checkbox id={`status-${status}`} />
                                                        <label htmlFor={`status-${status}`} className="ml-2 text-sm capitalize">{status}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-2">Type</h3>
                                            <div className="space-y-2">
                                                {['payment', 'refund', 'subscription'].map((type) => (
                                                    <div key={type} className="flex items-center">
                                                        <Checkbox id={`type-${type}`} />
                                                        <label htmlFor={`type-${type}`} className="ml-2 text-sm capitalize">{type}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-2">Currency</h3>
                                            <div className="space-y-2">
                                                {['XOF', 'USD'].map((currency) => (
                                                    <div key={currency} className="flex items-center">
                                                        <Checkbox id={`currency-${currency}`} />
                                                        <label htmlFor={`currency-${currency}`} className="ml-2 text-sm">{currency}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-2">Payment Method</h3>
                                            <div className="space-y-2">
                                                {['Cards', 'Mobile Money', 'Bank Transfer', 'Apple Pay', 'Google Pay', 'USSD', 'QR Code'].map((method) => (
                                                    <div key={method} className="flex items-center">
                                                        <Checkbox id={`method-${method}`} />
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
                                                <TableHead className="font-bold">
                                                    <Button variant="ghost" onClick={() => handleSort('transaction_id')}>
                                                        Transaction ID
                                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </TableHead>
                                                <TableHead className="font-bold">
                                                    <Button variant="ghost" onClick={() => handleSort('customer')}>
                                                        Customer
                                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </TableHead>
                                                <TableHead className="font-bold text-right">
                                                    <Button variant="ghost" onClick={() => handleSort('gross_amount')}>
                                                        Gross Amount
                                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </TableHead>
                                                <TableHead className="font-bold text-right">
                                                    <Button variant="ghost" onClick={() => handleSort('net_amount')}>
                                                        Net Amount
                                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </TableHead>
                                                <TableHead className="font-bold">
                                                    <Button variant="ghost" onClick={() => handleSort('currency')}>
                                                        Currency
                                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </TableHead>
                                                <TableHead className="font-bold">
                                                    <Button variant="ghost" onClick={() => handleSort('payment_method')}>
                                                        Payment Method
                                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </TableHead>
                                                <TableHead className="font-bold">
                                                    <Button variant="ghost" onClick={() => handleSort('status')}>
                                                        Status
                                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </TableHead>
                                                <TableHead className="font-bold">
                                                    <Button variant="ghost" onClick={() => handleSort('type')}>
                                                        Type
                                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </TableHead>
                                                <TableHead className="font-bold">
                                                    <Button variant="ghost" onClick={() => handleSort('date')}>
                                                        Date
                                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredAndSortedTransactions.map((transaction) => (
                                                <TableRow key={transaction.transaction_id}>
                                                    <TableCell>{transaction.transaction_id}</TableCell>
                                                    <TableCell>{transaction.customer}</TableCell>
                                                    <TableCell className="text-right">{transaction.gross_amount}</TableCell>
                                                    <TableCell className="text-right">{transaction.net_amount}</TableCell>
                                                    <TableCell>{transaction.currency}</TableCell>
                                                    <TableCell>{transaction.payment_method}</TableCell>
                                                    <TableCell>{transaction.status}</TableCell>
                                                    <TableCell>{transaction.type}</TableCell>
                                                    <TableCell>{transaction.date}</TableCell>
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