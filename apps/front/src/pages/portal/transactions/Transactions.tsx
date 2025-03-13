import { useState, useEffect } from 'react'
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
import InfiniteScroll from 'react-infinite-scroll-component'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import AnimatedLogoLoader from '@/components/portal/loader'
import TransactionActions from './components/actions'
import TransactionFilters from './components/filters'
import { motion, AnimatePresence } from "framer-motion"
import { FcfaIcon } from '@/components/custom/cfa'
import FeedbackForm from '@/components/portal/feedback-form'
import SupportForm from '@/components/portal/support-form'
import React from 'react'


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
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
    const [columns, setColumns] = useState<string[]>([
        'Transaction ID',
        'Customer',
        'Net Amount',
        'Currency',
        'Status',
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

    interface QueryResult<T> {
        data: T;
        isLoading: boolean;
    }

    interface CompletionRate {
        completed: number;
        refunded: number;
        failed: number;
    }

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['transactions', user?.id || '', selectedProvider, selectedStatuses, selectedTypes, selectedCurrencies, selectedPaymentMethods, selectedDateRange, customDateRange] as const,
        queryFn: ({ pageParam = 1 }) => fetchTransactions(
            user?.id || '',
            selectedProvider,
            selectedStatuses,
            selectedTypes,
            selectedCurrencies,
            selectedPaymentMethods,
            pageParam,
            50,
            selectedDateRange,
            customDateRange
        ),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === 50 ? allPages.length + 1 : undefined
        },
        enabled: !!user?.id,
    })

    // Memoize the transactions to prevent recreating on every render
    const transactions = React.useMemo(() => data?.pages.flat() || [], [data?.pages])

    // Memoize the sortTransactions function with useCallback
    const sortTransactions = React.useCallback((items: Transaction[]) => {
        if (!sortColumn) return items

        return items.sort((a, b) => {
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
    }, [sortColumn, sortDirection])

    // Create a memoized filtered and sorted transactions array for better performance
    const filteredAndSortedTransactions = React.useMemo(() => {
        if (!transactions.length) return []

        // First apply date filtering
        const dateFiltered = applyDateFilter(transactions, selectedDateRange, customDateRange)

        // Then apply search
        const searched = applySearch(dateFiltered, searchTerm)

        // Finally sort the results
        return sortTransactions(searched)
    }, [transactions, selectedDateRange, customDateRange, searchTerm, sortTransactions])

    const { data: totalIncomingAmount = 0, isLoading: isTotalIncomingAmountLoading } = useTotalIncomingAmount(
        user?.id || '',
        selectedDateRange,
        customDateRange,
        {
            queryKey: ['totalIncomingAmount', user?.id || '', selectedDateRange, customDateRange] as const,
            enabled: !!user?.id
        }
    ) as QueryResult<number>

    const { data: transactionCount = 0, isLoading: isTransactionCountLoading } = useTransactionCount(
        user?.id || '',
        selectedDateRange,
        customDateRange,
        {
            queryKey: ['transactionCount', user?.id || '', selectedDateRange, customDateRange] as const,
            enabled: !!user?.id
        }
    ) as QueryResult<number>

    const { data: completionRate = { completed: 0, refunded: 0, failed: 0 }, isLoading: isCompletionRateLoading } = useCompletionRate(
        user?.id || '',
        selectedDateRange,
        customDateRange,
        {
            queryKey: ['completionRate', user?.id || '', selectedDateRange, customDateRange] as const,
            enabled: !!user?.id
        }
    ) as QueryResult<CompletionRate>

    const { data: grossAmount = 0, isLoading: isGrossAmountLoading } = useGrossAmount(
        user?.id || '',
        selectedDateRange,
        customDateRange,
        {
            queryKey: ['grossAmount', user?.id || '', selectedDateRange, customDateRange] as const,
            enabled: !!user?.id
        }
    ) as QueryResult<number>

    const { data: feeAmount = 0, isLoading: isFeeAmountLoading } = useFeeAmount(
        user?.id || '',
        selectedDateRange,
        customDateRange,
        {
            queryKey: ['feeAmount', user?.id || '', selectedDateRange, customDateRange] as const,
            enabled: !!user?.id
        }
    ) as QueryResult<number>

    const { data: averageTransactionValue = 0, isLoading: isAverageTransactionValueLoading } = useAverageTransactionValue(
        user?.id || '',
        selectedDateRange,
        customDateRange,
        {
            queryKey: ['averageTransactionValue', user?.id || '', selectedDateRange, customDateRange] as const,
            enabled: !!user?.id
        }
    ) as QueryResult<number>

    const { data: averageCustomerLifetimeValue = 0, isLoading: isAverageCustomerLifetimeValueLoading } = useAverageCustomerLifetimeValue(
        user?.id || '',
        selectedDateRange,
        customDateRange,
        {
            queryKey: ['averageCustomerLifetimeValue', user?.id || '', selectedDateRange, customDateRange] as const,
            enabled: !!user?.id
        }
    ) as QueryResult<number>

    const { data: averageRetentionRate = 0, isLoading: isAverageRetentionRateLoading } = useAverageRetentionRate(
        user?.id || '',
        selectedDateRange,
        customDateRange,
        {
            queryKey: ['averageRetentionRate', user?.id || '', selectedDateRange, customDateRange] as const,
            enabled: !!user?.id
        }
    ) as QueryResult<number>

    const handleSort = (column: keyof Transaction) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortColumn(column)
            setSortDirection('asc')
        }
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
        await queryClient.refetchQueries({
            queryKey: ['transactions', user?.id || '', selectedProvider, selectedStatuses, selectedTypes, selectedCurrencies, selectedPaymentMethods, undefined, undefined, selectedDateRange, customDateRange]
        })
        setIsRefreshing(false)
    }

    // Global scroll lock implementation
    useEffect(() => {
        // Store original styles to restore them later
        const originalStyle = window.getComputedStyle(document.body).overflow;
        const originalHTMLStyle = window.getComputedStyle(document.documentElement).overflow;

        // Lock scrolling on body and html
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

        // Prevent wheel events on the document
        const preventWheel = (e: WheelEvent) => {
            // Only allow wheel events in the table container
            const tableContainer = document.getElementById('table-container');
            if (tableContainer && !tableContainer.contains(e.target as Node)) {
                e.preventDefault();
                e.stopPropagation();
            }
        };

        // Prevent touchmove events that might cause scrolling
        const preventTouch = (e: TouchEvent) => {
            const tableContainer = document.getElementById('table-container');
            if (tableContainer && !tableContainer.contains(e.target as Node)) {
                e.preventDefault();
            }
        };

        // Prevent scrolling with keyboard
        const preventKeyScroll = (e: KeyboardEvent) => {
            // Prevent the default action for keys that can scroll the page
            if (['Space', 'PageUp', 'PageDown', 'Home', 'End', 'ArrowUp', 'ArrowDown'].includes(e.code)) {
                // Allow keyboard navigation within the table container
                const tableContainer = document.getElementById('table-container');
                const activeElement = document.activeElement;

                // Check if we're in an input, textarea, or other form element where space is needed
                const isFormElement = activeElement && (
                    activeElement.tagName === 'INPUT' ||
                    activeElement.tagName === 'TEXTAREA' ||
                    activeElement.tagName === 'SELECT' ||
                    activeElement.getAttribute('contenteditable') === 'true'
                );

                // Only prevent if we're not inside the table container or a form element
                if (!(tableContainer && tableContainer.contains(activeElement as Node)) && !isFormElement) {
                    e.preventDefault();
                }
            }
        };

        // Add event listeners with passive: false to ensure preventDefault works
        document.addEventListener('wheel', preventWheel, { passive: false });
        document.addEventListener('touchmove', preventTouch, { passive: false });
        document.addEventListener('keydown', preventKeyScroll, { passive: false });

        // Cleanup function
        return () => {
            // Restore original styles
            document.body.style.overflow = originalStyle;
            document.documentElement.style.overflow = originalHTMLStyle;

            // Remove event listeners
            document.removeEventListener('wheel', preventWheel);
            document.removeEventListener('touchmove', preventTouch);
            document.removeEventListener('keydown', preventKeyScroll);
        };
    }, []);

    // Add a style tag for global CSS
    useEffect(() => {
        // Create a style element
        const style = document.createElement('style');
        style.id = 'no-scroll-style';

        // Define CSS to prevent scrolling
        style.innerHTML = `
            html, body {
                overflow: hidden !important;
                height: 100% !important;
                position: fixed !important;
                width: 100% !important;
            }
            #__next {
                height: 100% !important;
                overflow: hidden !important;
            }
        `;

        // Append style to head
        document.head.appendChild(style);

        // Cleanup function
        return () => {
            const styleElement = document.getElementById('no-scroll-style');
            if (styleElement) {
                styleElement.remove();
            }
        };
    }, []);

    if (isUserLoading) {
        return <AnimatedLogoLoader />
    }

    if (!user || !user.id) {
        return <div><AnimatedLogoLoader /> User data not available.</div>
    }

    return (
        <Layout fixed className="h-screen overflow-hidden">
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
                                                        ""
                                                    ) : (
                                                        `XOF ${formatAmount(totalIncomingAmount)}`
                                                    )}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {isTransactionCountLoading ? (
                                                        ""
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
                                                                ""
                                                            ) : (
                                                                `XOF ${formatAmount(grossAmount)}`
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm">Fees</span>
                                                        <span className="text-sm font-medium">
                                                            {isFeeAmountLoading ? (
                                                                ""
                                                            ) : (
                                                                `XOF ${formatAmount(feeAmount)}`
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm">Net</span>
                                                        <span className="text-sm font-medium">
                                                            {isTotalIncomingAmountLoading ? (
                                                                ""
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
                                                        ""
                                                    ) : (
                                                        `${calculateCompletionRate(completionRate.completed, completionRate.refunded, completionRate.failed)}%`
                                                    )}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {isCompletionRateLoading ? (
                                                        ""
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
                                                        ""
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
                                                        ""
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
                                                        ""
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

                        <Card className="rounded-none border shadow-sm">
                            <CardContent className="p-0">
                                <div
                                    id="table-container"
                                    className="h-[47vh] overflow-hidden"
                                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                >
                                    <InfiniteScroll
                                        dataLength={transactions.length}
                                        next={() => fetchNextPage()}
                                        hasMore={hasNextPage}
                                        loader={<div className="p-4"></div>}
                                        scrollableTarget="table-container"
                                        className="overflow-visible"
                                    >
                                        <Table className="w-full">
                                            <TableHeader>
                                                <TableRow className="hover:bg-transparent border-b bg-muted/50">
                                                    {columns.includes('Transaction ID') && (
                                                        <TableHead className="text-center w-[25%] md:w-auto h-12 text-xs uppercase font-semibold text-muted-foreground">
                                                            <Button variant="ghost" onClick={() => handleSort('transaction_id')} className="rounded-none whitespace-nowrap px-2 md:px-4 h-full">
                                                                Transaction ID
                                                                {sortColumn === 'transaction_id' && (
                                                                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                                )}
                                                            </Button>
                                                        </TableHead>
                                                    )}
                                                    {columns.includes('Customer') && (
                                                        <TableHead className="text-left w-[20%] md:w-auto h-12 text-xs uppercase font-semibold text-muted-foreground">
                                                            <Button variant="ghost" onClick={() => handleSort('customer_name')} className="whitespace-nowrap px-2 md:px-4 h-full">
                                                                Customer
                                                                {sortColumn === 'customer_name' && (
                                                                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                                )}
                                                            </Button>
                                                        </TableHead>
                                                    )}
                                                    {columns.includes('Gross Amount') && (
                                                        <TableHead className="text-center w-[15%] md:w-auto h-12 text-xs uppercase font-semibold text-muted-foreground">
                                                            <Button variant="ghost" onClick={() => handleSort('gross_amount')} className="whitespace-nowrap px-2 md:px-4 h-full">
                                                                Gross Amount
                                                                {sortColumn === 'gross_amount' && (
                                                                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                                )}
                                                            </Button>
                                                        </TableHead>
                                                    )}
                                                    {columns.includes('Net Amount') && (
                                                        <TableHead className="text-center w-[15%] md:w-auto h-12 text-xs uppercase font-semibold text-muted-foreground">
                                                            <Button variant="ghost" onClick={() => handleSort('net_amount')} className="whitespace-nowrap px-2 md:px-4 h-full">
                                                                Net Amount
                                                                {sortColumn === 'net_amount' && (
                                                                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                                )}
                                                            </Button>
                                                        </TableHead>
                                                    )}
                                                    {columns.includes('Currency') && (
                                                        <TableHead className="text-center w-[15%] md:w-auto h-12 text-xs uppercase font-semibold text-muted-foreground">
                                                            <Button variant="ghost" onClick={() => handleSort('currency')} className="whitespace-nowrap px-2 md:px-4 h-full">
                                                                Currency
                                                                {sortColumn === 'currency' && (
                                                                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                                )}
                                                            </Button>
                                                        </TableHead>
                                                    )}
                                                    {columns.includes('Payment Method') && (
                                                        <TableHead className="text-center w-[20%] md:w-auto h-12 text-xs uppercase font-semibold text-muted-foreground">
                                                            <Button variant="ghost" onClick={() => handleSort('payment_method')} className="whitespace-nowrap px-2 md:px-4 h-full">
                                                                Payment Method
                                                                {sortColumn === 'payment_method' && (
                                                                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                                )}
                                                            </Button>
                                                        </TableHead>
                                                    )}
                                                    {columns.includes('Status') && (
                                                        <TableHead className="text-center w-[15%] md:w-auto h-12 text-xs uppercase font-semibold text-muted-foreground">
                                                            <Button variant="ghost" onClick={() => handleSort('status')} className="whitespace-nowrap px-2 md:px-4 h-full">
                                                                Status
                                                                {sortColumn === 'status' && (
                                                                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                                )}
                                                            </Button>
                                                        </TableHead>
                                                    )}
                                                    {columns.includes('Type') && (
                                                        <TableHead className="text-center w-[15%] md:w-auto h-12 text-xs uppercase font-semibold text-muted-foreground">
                                                            <Button variant="ghost" onClick={() => handleSort('type')} className="whitespace-nowrap px-2 md:px-4 h-full">
                                                                Type
                                                                {sortColumn === 'type' && (
                                                                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                                )}
                                                            </Button>
                                                        </TableHead>
                                                    )}
                                                    {columns.includes('Date') && (
                                                        <TableHead className="text-center w-[15%] md:w-auto h-12 text-xs uppercase font-semibold text-muted-foreground">
                                                            <Button variant="ghost" onClick={() => handleSort('date')} className="whitespace-nowrap px-2 md:px-4 h-full">
                                                                Date
                                                                {sortColumn === 'date' && (
                                                                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                                )}
                                                            </Button>
                                                        </TableHead>
                                                    )}
                                                    {columns.includes('Provider') && (
                                                        <TableHead className="text-center w-[15%] md:w-auto h-12 text-xs uppercase font-semibold text-muted-foreground">
                                                            <Button variant="ghost" onClick={() => handleSort('provider_code')} className="whitespace-nowrap px-2 md:px-4 h-full">
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
                                                {isFetchingNextPage ? (
                                                    <TableRow>
                                                        <TableCell colSpan={columns.length} className="text-center p-4">
                                                        </TableCell>
                                                    </TableRow>
                                                ) : transactions.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={columns.length} className="text-center py-8">
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
                                                    filteredAndSortedTransactions.map((transaction: Transaction) => (
                                                        <TableRow
                                                            key={transaction.transaction_id}
                                                            className="cursor-pointer border-b hover:bg-muted/30"
                                                            onClick={() => setSelectedTransaction(transaction)}
                                                        >
                                                            {columns.includes('Transaction ID') && (
                                                                <TableCell className="text-center py-4">
                                                                    <span className="font-mono text-xs">{shortenTransactionId(transaction.transaction_id)}</span>
                                                                </TableCell>
                                                            )}
                                                            {columns.includes('Customer') && (
                                                                <TableCell className="text-left py-4 font-medium">
                                                                    {transaction.customer_name}
                                                                </TableCell>
                                                            )}
                                                            {columns.includes('Gross Amount') && (
                                                                <TableCell className="text-center py-4">
                                                                    <span className="font-medium">{formatAmount(transaction.gross_amount)}</span>
                                                                </TableCell>
                                                            )}
                                                            {columns.includes('Net Amount') && (
                                                                <TableCell className="text-center py-4">
                                                                    <span className="font-medium">{formatAmount(transaction.net_amount)}</span>
                                                                </TableCell>
                                                            )}
                                                            {columns.includes('Currency') && (
                                                                <TableCell className="text-center py-4">
                                                                    {transaction.currency}
                                                                </TableCell>
                                                            )}
                                                            {columns.includes('Payment Method') && (
                                                                <TableCell className="text-center py-4">
                                                                    {formatPaymentMethod(transaction.payment_method)}
                                                                </TableCell>
                                                            )}
                                                            {columns.includes('Status') && (
                                                                <TableCell className="text-center py-4">
                                                                    <div className="flex justify-center">
                                                                        <span
                                                                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${transaction.status === 'completed'
                                                                                ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400'
                                                                                : transaction.status === 'failed'
                                                                                    ? 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400'
                                                                                    : transaction.status === 'refunded'
                                                                                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-800/20 dark:text-amber-400'
                                                                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400'
                                                                                }`}
                                                                        >
                                                                            {formatTransactionStatus(transaction.status)}
                                                                        </span>
                                                                    </div>
                                                                </TableCell>
                                                            )}
                                                            {columns.includes('Type') && (
                                                                <TableCell className="text-center py-4">
                                                                    {formatTransactionType(transaction.type)}
                                                                </TableCell>
                                                            )}
                                                            {columns.includes('Date') && (
                                                                <TableCell className="text-center py-4">
                                                                    <span className="text-sm text-muted-foreground">{formatDate(transaction.date)}</span>
                                                                </TableCell>
                                                            )}
                                                            {columns.includes('Provider') && (
                                                                <TableCell className="text-center py-4">
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
                                                                        ${transaction.provider_code === 'OPAY' ? 'bg-[#14B55A] text-white dark:bg-[#14B55A] dark:text-white' : ''}
                                                                        ${transaction.provider_code === 'PAYPAL' ? 'bg-[#003087] text-white dark:bg-[#003087] dark:text-white' : ''}
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

export default TransactionsPage;

// Formats the payment method code into a more readable format
// This function is used conditionally when Payment Method column is enabled
/* eslint-disable @typescript-eslint/no-unused-vars */
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

// Formats the transaction status into a more readable format
function formatTransactionStatus(status: transaction_status): string {
    return status.charAt(0).toUpperCase() + status.slice(1)
}

// Formats the transaction type into a more readable format
function formatTransactionType(type: transaction_type): string {
    return type.charAt(0).toUpperCase() + type.slice(1)
}

// Formats the provider code into a more readable format
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
        case 'OPAY':
            return 'OPay'
        case 'OTHER':
            return 'Other'
        default:
            return providerCode
    }
}

// Formats a date string to a more readable format
function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

// Shortens a transaction ID for display purposes
function shortenTransactionId(transactionId: string): string {
    return `${transactionId.slice(0, 8)}${transactionId.slice(8, 12)}-...`
}

// Calculates the completion rate as a percentage
function calculateCompletionRate(completed: number, refunded: number, failed: number): number {
    const total = completed + refunded + failed
    return total > 0 ? Math.round((completed / total) * 100) : 0
}

// Formats a number as a currency amount with appropriate decimal places
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
