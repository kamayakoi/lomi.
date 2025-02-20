import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpDown, BarChart3Icon, TrendingUpIcon } from 'lucide-react'
import { TopNav } from '@/components/portal/top-nav'
import { UserNav } from '@/components/portal/user-nav'
import Notifications from '@/components/portal/notifications'
import { Layout } from '@/components/custom/layout'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DateRange } from 'react-day-picker'
import { payment_method_code, provider_code, transaction_status, transaction_type, Transaction as TransactionType } from './components/types'
import { fetchTransactions, useTotalIncomingAmount, useTransactionCount, applySearch, applyDateFilter, useCompletionRate, useGrossAmount, useFeeAmount, useAverageTransactionValue, useAverageCustomerLifetimeValue, useAverageRetentionRate } from './components/support'
import { useUser } from '@/lib/hooks/use-user'
import { Skeleton } from '@/components/ui/skeleton'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useInfiniteQuery, useQueryClient } from 'react-query'
import AnimatedLogoLoader from '@/components/portal/loader'
import TransactionActions from './components/actions'
import TransactionFilters from './components/filters'
import { motion, AnimatePresence } from "framer-motion"
import { FcfaIcon } from '@/components/custom/cfa'
import FeedbackForm from '@/components/portal/feedback-form'
import SupportForm from '@/components/portal/support-form'
import { withActivationCheck } from '@/components/custom/with-activation-check'


type Transaction = TransactionType

function TransactionsPage() {
    const { user, isLoading: isUserLoading } = useUser()
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
    const [columns, setColumns] = useState<string[]>([
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
    ])
    const [showTotalBreakdown, setShowTotalBreakdown] = useState(false)
    const [showAverageValue, setShowAverageValue] = useState(false)
    const [showAverageRetentionRate, setShowAverageRetentionRate] = useState(false)
    const [isDownloadOpen, setIsDownloadOpen] = useState(false)
    const [isGenerating] = useState(false);
    const queryClient = useQueryClient()
    const [isRefreshing, setIsRefreshing] = useState(false)

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

    const { data: completionRate = { completed: 0, refunded: 0, failed: 0 }, isLoading: isCompletionRateLoading } = useCompletionRate(
        user?.id || '',
        selectedDateRange,
        customDateRange,
        { enabled: !!user?.id }
    )

    const { data: grossAmount = 0, isLoading: isGrossAmountLoading } = useGrossAmount(
        user?.id || '',
        selectedDateRange,
        customDateRange,
        { enabled: !!user?.id }
    )

    const { data: feeAmount = 0, isLoading: isFeeAmountLoading } = useFeeAmount(
        user?.id || '',
        selectedDateRange,
        customDateRange,
        { enabled: !!user?.id }
    )

    const { data: averageTransactionValue = 0, isLoading: isAverageTransactionValueLoading } = useAverageTransactionValue(
        user?.id || '',
        selectedDateRange,
        customDateRange,
        { enabled: !!user?.id }
    )

    const { data: averageCustomerLifetimeValue = 0, isLoading: isAverageCustomerLifetimeValueLoading } = useAverageCustomerLifetimeValue(
        user?.id || '',
        selectedDateRange,
        customDateRange,
        { enabled: !!user?.id }
    )

    const { data: averageRetentionRate = 0, isLoading: isAverageRetentionRateLoading } = useAverageRetentionRate(
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
            const aValue = a[sortColumn]
            const bValue = b[sortColumn]

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
            } else if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
            } else {
                return 0
            }
        })
    }

    const handleCustomDateRangeApply = () => {
        if (customDateRange && customDateRange.from && customDateRange.to) {
            setSelectedDateRange('custom')
        }
    }

    const handleDownload = () => {
        const filteredTransactions = applySearch(applyDateFilter(sortTransactions(transactions), selectedDateRange, customDateRange), searchTerm)
        const csvData = convertToCSV(filteredTransactions)
        downloadCSV(csvData)
        setIsDownloadOpen(false)
    }

    function convertToCSV(data: (Transaction | undefined)[]): string {
        const filteredData = data.filter((item): item is Transaction => item !== undefined);

        if (filteredData.length === 0) {
            return '';
        }

        const headers = Object.keys(filteredData[0] || {}).join(',');
        const rows = filteredData.map(transaction => {
            if (!transaction) return '';
            return Object.values(transaction)
                .map(value => {
                    if (typeof value === 'string') {
                        return `"${value.replace(/"/g, '""')}"`;
                    }
                    return value;
                })
                .join(',');
        }).join('\n');

        return `${headers}\n${rows}`;
    }

    function downloadCSV(csvData: string) {
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', 'transactions.csv')
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    function copyAsJSON() {
        const filteredTransactions = applySearch(applyDateFilter(sortTransactions(transactions), selectedDateRange, customDateRange), searchTerm)
        const jsonData = JSON.stringify(filteredTransactions, null, 2)
        navigator.clipboard.writeText(jsonData)
            .then(() => {
                console.log('JSON data copied to clipboard')
                setIsDownloadOpen(false)
            })
            .catch((error) => {
                console.error('Error copying JSON data:', error)
            })
    }

    const refetch = async () => {
        setIsRefreshing(true)
        await queryClient.refetchQueries(['transactions'])
        setIsRefreshing(false)
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
                <div className='hidden md:block'>
                    <TopNav links={topNav} />
                </div>

                <div className='block md:hidden'>
                    <FeedbackForm />
                </div>

                <div className='ml-auto flex items-center space-x-4'>
                    <div className='hidden md:block'>
                        <FeedbackForm />
                    </div>
                    <Notifications />
                    <UserNav />
                </div>
            </Layout.Header>

            <Separator className='my-0' />

            <Layout.Body>
                <div className="h-full overflow-y-auto overflow-x-hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <div className="space-y-4 pb-8 max-w-full">
                        <h1 className="text-2xl font-bold tracking-tight mb-4">Transactions</h1>

                        <div className="grid gap-4 md:grid-cols-3 mb-6">
                            <Card className="cursor-pointer rounded-none" onClick={() => setShowTotalBreakdown(!showTotalBreakdown)}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                                    <ArrowDownIcon className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <AnimatePresence mode="wait">
                                        {!showTotalBreakdown ? (
                                            <motion.div
                                                key="total"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <div className="text-2xl font-bold">
                                                    {isTotalIncomingAmountLoading ? (
                                                        <Skeleton className="w-32 h-8 rounded-none" />
                                                    ) : (
                                                        `XOF ${formatAmount(totalIncomingAmount)}`
                                                    )}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {isTransactionCountLoading ? (
                                                        <Skeleton className="w-20 h-4 rounded-none" />
                                                    ) : (
                                                        `${transactionCount} transactions`
                                                    )}
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="breakdown"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <div className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <span className="text-sm">Gross</span>
                                                        <span className="text-sm font-medium">
                                                            {isGrossAmountLoading ? (
                                                                <Skeleton className="w-20 h-4 rounded-none" />
                                                            ) : (
                                                                `XOF ${formatAmount(grossAmount)}`
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm">Fees</span>
                                                        <span className="text-sm font-medium">
                                                            {isFeeAmountLoading ? (
                                                                <Skeleton className="w-20 h-4 rounded-none" />
                                                            ) : (
                                                                `XOF ${formatAmount(feeAmount)}`
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm">Net</span>
                                                        <span className="text-sm font-medium">
                                                            {isTotalIncomingAmountLoading ? (
                                                                <Skeleton className="w-20 h-4 rounded-none" />
                                                            ) : (
                                                                `XOF ${formatAmount(totalIncomingAmount)}`
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </CardContent>
                            </Card>

                            <Card className="cursor-pointer rounded-none" onClick={() => setShowAverageValue(!showAverageValue)}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {showAverageValue ? "Avg. Order Value" : "Completion Rate"}
                                    </CardTitle>
                                    {showAverageValue ? (
                                        <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </CardHeader>
                                <CardContent>
                                    <AnimatePresence mode="wait">
                                        {!showAverageValue ? (
                                            <motion.div
                                                key="completion"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <div className="text-2xl font-bold">
                                                    {isCompletionRateLoading ? (
                                                        <Skeleton className="w-32 h-8 rounded-none" />
                                                    ) : (
                                                        `${calculateCompletionRate(completionRate.completed, completionRate.refunded, completionRate.failed)}%`
                                                    )}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {isCompletionRateLoading ? (
                                                        <Skeleton className="w-20 h-4 rounded-none" />
                                                    ) : (
                                                        <>
                                                            {completionRate.completed > 0 && (
                                                                <>
                                                                    {completionRate.completed} completed
                                                                    {(completionRate.refunded > 0 || completionRate.failed > 0) && ', '}
                                                                </>
                                                            )}
                                                            {completionRate.refunded > 0 && (
                                                                <>
                                                                    {completionRate.refunded} refunded
                                                                    {completionRate.failed > 0 && ', '}
                                                                </>
                                                            )}
                                                            {completionRate.failed > 0 && `${completionRate.failed} failed`}
                                                        </>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="average"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <div className="text-2xl font-bold">
                                                    {isAverageTransactionValueLoading ? (
                                                        <Skeleton className="w-32 h-8 rounded-none" />
                                                    ) : (
                                                        `XOF ${averageTransactionValue ? averageTransactionValue.toFixed(2) : '0.00'}`
                                                    )}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    Per transaction
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </CardContent>
                            </Card>

                            <Card className="cursor-pointer rounded-none" onClick={() => setShowAverageRetentionRate(!showAverageRetentionRate)}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {showAverageRetentionRate ? "Retention Rate" : "Avg. Customer Lifetime Value"}
                                    </CardTitle>
                                    {showAverageRetentionRate ? (
                                        <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </CardHeader>
                                <CardContent>
                                    <AnimatePresence mode="wait">
                                        {!showAverageRetentionRate ? (
                                            <motion.div
                                                key="lifetime"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <div className="text-2xl font-bold">
                                                    {isAverageCustomerLifetimeValueLoading ? (
                                                        <Skeleton className="w-32 h-8 rounded-none" />
                                                    ) : (
                                                        `XOF ${formatAmount(averageCustomerLifetimeValue)}`
                                                    )}
                                                </div>
                                                <div className="text-xs text-muted-foreground">Per customer</div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="retention"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <div className="text-2xl font-bold">
                                                    {isAverageRetentionRateLoading ? (
                                                        <Skeleton className="w-32 h-8 rounded-none" />
                                                    ) : (
                                                        `${averageRetentionRate ? averageRetentionRate.toFixed(2) : '0.00'}%`
                                                    )}
                                                </div>
                                                <div className="text-xs text-muted-foreground">of returning customers</div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </CardContent>
                            </Card>
                        </div>

                        <TransactionFilters
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            selectedProvider={selectedProvider}
                            setSelectedProvider={setSelectedProvider}
                            selectedDateRange={selectedDateRange}
                            setSelectedDateRange={setSelectedDateRange}
                            customDateRange={customDateRange}
                            setCustomDateRange={setCustomDateRange}
                            handleCustomDateRangeApply={handleCustomDateRangeApply}
                            selectedStatuses={selectedStatuses}
                            setSelectedStatuses={setSelectedStatuses}
                            selectedTypes={selectedTypes}
                            setSelectedTypes={setSelectedTypes}
                            selectedCurrencies={selectedCurrencies}
                            setSelectedCurrencies={setSelectedCurrencies}
                            selectedPaymentMethods={selectedPaymentMethods}
                            setSelectedPaymentMethods={setSelectedPaymentMethods}
                            columns={columns}
                            setColumns={setColumns}
                            isDownloadOpen={isDownloadOpen}
                            setIsDownloadOpen={setIsDownloadOpen}
                            handleDownload={handleDownload}
                            copyAsJSON={copyAsJSON}
                            refetch={refetch}
                            isRefreshing={isRefreshing}
                        />

                        <Card className="rounded-none">
                            <CardContent className="p-4">
                                <div className="border">
                                    <InfiniteScroll
                                        dataLength={transactions.length}
                                        next={() => fetchNextPage()}
                                        hasMore={transactionsData?.pages?.[transactionsData.pages.length - 1]?.length === pageSize}
                                        loader={<Skeleton className="w-full h-8 rounded-none" />}
                                    >
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    {columns.includes('Transaction ID') && (
                                                        <TableHead className="text-center w-[25%] md:w-auto">
                                                            <Button variant="ghost" onClick={() => handleSort('transaction_id')} className="rounded-none whitespace-nowrap px-2 md:px-4">
                                                                Transaction ID
                                                                {sortColumn === 'transaction_id' && (
                                                                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                                )}
                                                            </Button>
                                                        </TableHead>
                                                    )}
                                                    {columns.includes('Customer') && (
                                                        <TableHead className="text-left w-[20%] md:w-auto">
                                                            <Button variant="ghost" onClick={() => handleSort('customer_name')} className="whitespace-nowrap px-2 md:px-4">
                                                                Customer
                                                                {sortColumn === 'customer_name' && (
                                                                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                                )}
                                                            </Button>
                                                        </TableHead>
                                                    )}
                                                    {columns.includes('Gross Amount') && (
                                                        <TableHead className="text-center w-[15%] md:w-auto">
                                                            <Button variant="ghost" onClick={() => handleSort('gross_amount')} className="whitespace-nowrap px-2 md:px-4">
                                                                Gross Amount
                                                                {sortColumn === 'gross_amount' && (
                                                                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                                )}
                                                            </Button>
                                                        </TableHead>
                                                    )}
                                                    {columns.includes('Net Amount') && (
                                                        <TableHead className="text-center w-[15%] md:w-auto">
                                                            <Button variant="ghost" onClick={() => handleSort('net_amount')} className="whitespace-nowrap px-2 md:px-4">
                                                                Net Amount
                                                                {sortColumn === 'net_amount' && (
                                                                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                                )}
                                                            </Button>
                                                        </TableHead>
                                                    )}
                                                    {columns.includes('Currency') && (
                                                        <TableHead className="text-center w-[15%] md:w-auto">
                                                            <Button variant="ghost" onClick={() => handleSort('currency')} className="whitespace-nowrap px-2 md:px-4">
                                                                Currency
                                                                {sortColumn === 'currency' && (
                                                                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                                )}
                                                            </Button>
                                                        </TableHead>
                                                    )}
                                                    {columns.includes('Payment Method') && (
                                                        <TableHead className="text-center w-[20%] md:w-auto">
                                                            <Button variant="ghost" onClick={() => handleSort('payment_method')} className="whitespace-nowrap px-2 md:px-4">
                                                                Payment Method
                                                                {sortColumn === 'payment_method' && (
                                                                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                                )}
                                                            </Button>
                                                        </TableHead>
                                                    )}
                                                    {columns.includes('Status') && (
                                                        <TableHead className="text-center w-[15%] md:w-auto">
                                                            <Button variant="ghost" onClick={() => handleSort('status')} className="whitespace-nowrap px-2 md:px-4">
                                                                Status
                                                                {sortColumn === 'status' && (
                                                                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                                )}
                                                            </Button>
                                                        </TableHead>
                                                    )}
                                                    {columns.includes('Type') && (
                                                        <TableHead className="text-center w-[15%] md:w-auto">
                                                            <Button variant="ghost" onClick={() => handleSort('type')} className="whitespace-nowrap px-2 md:px-4">
                                                                Type
                                                                {sortColumn === 'type' && (
                                                                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                                )}
                                                            </Button>
                                                        </TableHead>
                                                    )}
                                                    {columns.includes('Date') && (
                                                        <TableHead className="text-center w-[15%] md:w-auto">
                                                            <Button variant="ghost" onClick={() => handleSort('date')} className="whitespace-nowrap px-2 md:px-4">
                                                                Date
                                                                {sortColumn === 'date' && (
                                                                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                                )}
                                                            </Button>
                                                        </TableHead>
                                                    )}
                                                    {columns.includes('Provider') && (
                                                        <TableHead className="text-center w-[15%] md:w-auto">
                                                            <Button variant="ghost" onClick={() => handleSort('provider_code')} className="whitespace-nowrap px-2 md:px-4">
                                                                Provider
                                                                {sortColumn === 'provider_code' && (
                                                                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                                )}
                                                            </Button>
                                                        </TableHead>
                                                    )}
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {isTransactionsLoading ? (
                                                    Array.from({ length: 5 }).map((_, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell colSpan={10}>
                                                                <Skeleton className="w-full h-8 rounded-none" />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : transactions.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={10} className="text-center py-8">
                                                            <div className="flex flex-col items-center justify-center space-y-4">
                                                                <div className="bg-transparent dark:bg-transparent p-4">
                                                                    <FcfaIcon className="h-40 w-40 text-gray-400 dark:text-gray-500" />
                                                                </div>
                                                                <p className="text-xl font-semibold text-gray-500 dark:text-gray-400">
                                                                    No transaction history found
                                                                </p>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs text-center">
                                                                    Start processing transactions to see your transaction history here.
                                                                </p>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    applySearch(applyDateFilter(sortTransactions(transactions), selectedDateRange, customDateRange), searchTerm).map((transaction: Transaction) => (
                                                        <TableRow
                                                            key={transaction.transaction_id}
                                                            className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                                                            onClick={() => setSelectedTransaction(transaction)}
                                                        >
                                                            {columns.includes('Transaction ID') && (
                                                                <TableCell className="text-center">{shortenTransactionId(transaction.transaction_id)}</TableCell>
                                                            )}
                                                            {columns.includes('Customer') && (
                                                                <TableCell className="text-left font-medium">{transaction.customer_name}</TableCell>
                                                            )}
                                                            {columns.includes('Gross Amount') && (
                                                                <TableCell className="text-center">
                                                                    {formatAmount(transaction.gross_amount)}
                                                                </TableCell>
                                                            )}
                                                            {columns.includes('Net Amount') && (
                                                                <TableCell className="text-center">
                                                                    {formatAmount(transaction.net_amount)}
                                                                </TableCell>
                                                            )}
                                                            {columns.includes('Currency') && <TableCell className="text-center">{transaction.currency}</TableCell>}
                                                            {columns.includes('Payment Method') && (
                                                                <TableCell className="text-center">{formatPaymentMethod(transaction.payment_method)}</TableCell>
                                                            )}
                                                            {columns.includes('Status') && (
                                                                <TableCell className="text-center">
                                                                    <span className={`
                                                                        inline-block px-2 py-1 text-xs font-normal rounded-none
                                                                        ${transaction.status === 'refunded' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : ''}
                                                                        ${transaction.status === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : ''}
                                                                        ${transaction.status === 'pending' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : ''}
                                                                        ${transaction.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : ''}
                                                                    `}>
                                                                        {formatTransactionStatus(transaction.status)}
                                                                    </span>
                                                                </TableCell>
                                                            )}
                                                            {columns.includes('Type') && <TableCell className="text-center">{formatTransactionType(transaction.type)}</TableCell>}
                                                            {columns.includes('Date') && <TableCell className="text-center">{formatDate(transaction.date)}</TableCell>}
                                                            {columns.includes('Provider') && (
                                                                <TableCell className="text-center">
                                                                    <span className={`
                                                                        inline-block px-2 py-1 text-xs font-semibold rounded-none
                                                                        ${transaction.provider_code === 'ORANGE' ? 'bg-[#FC6307] text-white dark:bg-[#FC6307] dark:text-white' : ''}
                                                                        ${transaction.provider_code === 'WAVE' ? 'bg-[#71CDF4] text-blue-700 dark:bg-[#71CDF4] dark:text-white' : ''}  
                                                                        ${transaction.provider_code === 'ECOBANK' ? 'bg-[#074367] text-white dark:bg-[#074367] dark:text-white' : ''}
                                                                        ${transaction.provider_code === 'MTN' ? 'bg-[#F7CE46] text-black dark:bg-[#F7CE46] dark:text-black' : ''}
                                                                        ${transaction.provider_code === 'NOWPAYMENTS' ? 'bg-[#037BFE] text-white dark:bg-[#037BFE] dark:text-white' : ''}
                                                                        ${transaction.provider_code === 'MOOV' ? 'bg-[#0093DD] text-white dark:bg-[#0093DD] dark:text-white' : ''}
                                                                        ${transaction.provider_code === 'AIRTEL' ? 'bg-[#FF0000] text-white dark:bg-[#FF0000] dark:text-white' : ''}
                                                                        ${transaction.provider_code === 'MPESA' ? 'bg-[#4CAF50] text-white dark:bg-[#4CAF50] dark:text-white' : ''}
                                                                        ${transaction.provider_code === 'WIZALL' ? 'bg-[#FF6B00] text-white dark:bg-[#FF6B00] dark:text-white' : ''}
                                                                        ${transaction.provider_code === 'OPAY' ? 'bg-[#14B55A] text-white dark:bg-[#14B55A] dark:text-white' : ''}
                                                                        ${transaction.provider_code === 'OTHER' ? 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200' : ''}
                                                                    `}>
                                                                        {formatProviderCode(transaction.provider_code)}
                                                                    </span>
                                                                </TableCell>
                                                            )}
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
                <SupportForm />
            </Layout.Body>
            <TransactionActions
                transaction={selectedTransaction}
                isOpen={!!selectedTransaction}
                onClose={() => setSelectedTransaction(null)}
                isGenerating={isGenerating}
            />
        </Layout>
    )
}

function TransactionsWithActivationCheck() {
    return withActivationCheck(TransactionsPage)({});
}

export default TransactionsWithActivationCheck;

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
        case 'NOWPAYMENTS':
            return 'Nowpayments'
        case 'PAYPAL':
            return 'Paypal'
        case 'APPLE':
            return 'Apple'
        case 'GOOGLE':
            return 'Google'
        case 'MOOV':
            return 'Moov'
        case 'AIRTEL':
            return 'Airtel'
        case 'MPESA':
            return 'M-Pesa'
        case 'WIZALL':
            return 'Wizall'
        case 'OPAY':
            return 'OPay'
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

function shortenTransactionId(transactionId: string): string {
    return `${transactionId.slice(0, 8)}${transactionId.slice(8, 12)}-...`
}

function calculateCompletionRate(completed: number, refunded: number, failed: number): number {
    const total = completed + refunded + failed
    return total > 0 ? Math.round((completed / total) * 100) : 0
}

function formatAmount(amount: number): string {
    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })

    const formattedAmount = formatter.format(amount)
    const decimalIndex = formattedAmount.indexOf('.')

    if (decimalIndex !== -1) {
        const decimalPart = formattedAmount.slice(decimalIndex + 1)
        if (decimalPart.length === 2 && decimalPart[1] === '0') {
            return formattedAmount.slice(0, decimalIndex + 2)
        }
    }

    return formattedAmount
}
