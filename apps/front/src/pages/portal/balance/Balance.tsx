import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TopNav } from '@/components/portal/top-nav'
import { UserNav } from '@/components/portal/user-nav'
import Notifications from '@/components/portal/notifications'
import { Layout } from '@/components/custom/layout'
import { Separator } from '@/components/ui/separator'
import { useUser } from '@/lib/hooks/use-user'
import AnimatedLogoLoader from '@/components/portal/loader'
import { useBalanceBreakdown, useConversionRates, convertCurrencyDB } from './components/support'
import PayoutFilters from './components/filters'
import PayoutActions from './components/actions'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DateRange } from 'react-day-picker'
import { payout_status, Payout, BankAccount, BalanceBreakdown, currency_code } from './components/types'
import { fetchPayouts, applySearch, applyDateFilter, fetchBankAccounts, initiateWithdrawal } from './components/support'
import { Skeleton } from '@/components/ui/skeleton'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useInfiniteQuery } from '@tanstack/react-query'
import { FcfaIcon } from '@/components/custom/cfa'
import { ArrowUpDown, ArrowDownIcon, DollarSign } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast"
import { AnimatePresence, motion } from "framer-motion"
import FeedbackForm from '@/components/portal/feedback-form'
import SupportForm from '@/components/portal/support-form'
import { formatCurrency } from './components/currency-converter-utils'
import CurrencyConverter from './components/CurrencyConverter'

type PayoutsResponse = Payout[]

// Define the order of currencies to display
const CURRENCY_DISPLAY_ORDER: currency_code[] = ['XOF', 'USD'];

function BalancePage() {
    const { user, isLoading: isUserLoading } = useUser()
    const [searchTerm, setSearchTerm] = useState("")
    const [sortColumn, setSortColumn] = useState<keyof Payout | null>(null)
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['pending', 'processing', 'completed', 'failed'])
    const [selectedDateRange, setSelectedDateRange] = useState<string | null>('24H')
    const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>()
    const pageSize = 50
    const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null)
    const [columns, setColumns] = useState<string[]>([
        'Payout ID',
        'Amount',
        'Currency',
        'Status',
        'Date',
    ])
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isWithdrawing, setIsWithdrawing] = useState(false)
    const [withdrawalAmount, setWithdrawalAmount] = useState("")
    const [selectedBankAccount, setSelectedBankAccount] = useState("")
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
    const { toast } = useToast()
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [showBalanceBreakdown, setShowBalanceBreakdown] = useState<Record<string, boolean>>({})
    const [selectedWithdrawalCurrency, setSelectedWithdrawalCurrency] = useState<currency_code>('XOF')
    const [showCurrencyConverter, setShowCurrencyConverter] = useState(false)
    const [preferredCurrency, setPreferredCurrency] = useState<currency_code>('XOF')
    const { data: conversionRates } = useConversionRates()

    const topNav = [
        { title: 'Balance', href: '/portal/balance', isActive: true },
        { title: 'Settings', href: '/portal/settings/profile', isActive: false },
    ]

    const { data: balanceBreakdown, isLoading: isBalanceBreakdownLoading, refetch: refetchBalanceBreakdown } = useBalanceBreakdown(user?.id || null)

    const { data: payoutsData, isLoading: isPayoutsLoading, fetchNextPage, refetch: refetchPayouts } = useInfiniteQuery<PayoutsResponse, Error>({
        queryKey: ['payouts', user?.id || '', selectedStatuses],
        queryFn: ({ pageParam }) =>
            fetchPayouts(
                user?.id || '',
                selectedStatuses as payout_status[],
                pageParam as number,
                pageSize
            ),
        initialPageParam: 1,
        getNextPageParam: (lastPage: PayoutsResponse, allPages: PayoutsResponse[]) => {
            return lastPage.length !== 0 ? allPages.length + 1 : undefined
        },
        enabled: !!user?.id,
    })

    const payouts = (payoutsData?.pages?.flatMap((page) => page) || []) as Payout[]

    useEffect(() => {
        if (user?.id) {
            fetchBankAccounts(user.id).then(setBankAccounts)
        }
    }, [user?.id])

    const handleSort = (column: keyof Payout) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortColumn(column)
            setSortDirection('asc')
        }
    }

    const sortPayouts = (payouts: Payout[]) => {
        if (!sortColumn) return payouts

        return payouts.sort((a, b) => {
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

    const handleWithdraw = async () => {
        if (!withdrawalAmount || !selectedBankAccount) {
            toast({
                title: "Error",
                description: "Please enter an amount and select a bank account.",
                variant: "destructive",
            })
            return
        }

        const amount = parseFloat(withdrawalAmount)
        if (isNaN(amount) || amount <= 0) {
            toast({
                title: "Invalid amount",
                description: "Please enter a valid amount.",
                variant: "destructive",
            })
            return
        }

        setIsWithdrawing(true)
        try {
            let finalAmount = amount
            if (selectedWithdrawalCurrency !== preferredCurrency) {
                finalAmount = await convertCurrencyDB(amount, selectedWithdrawalCurrency, preferredCurrency)
            }

            const result = await initiateWithdrawal(
                user?.id || '',
                finalAmount,
                selectedBankAccount,
                selectedWithdrawalCurrency
            )
            if (result.success) {
                toast({
                    title: "Withdrawal Successful",
                    description: `${formatCurrency(finalAmount, selectedWithdrawalCurrency)} has been withdrawn from your account.`,
                })
                setIsDialogOpen(false)
                setWithdrawalAmount("")
                setSelectedBankAccount("")
                setSelectedWithdrawalCurrency('XOF')
                refetchBalanceBreakdown()
            } else {
                throw new Error(result.message)
            }
        } catch (error) {
            toast({
                title: "Withdrawal Failed",
                description: error instanceof Error ? error.message : "An unexpected error occurred",
                variant: "destructive",
            })
        } finally {
            setIsWithdrawing(false)
        }
    }

    const handleRefresh = async () => {
        setIsRefreshing(true)
        await Promise.all([refetchBalanceBreakdown(), refetchPayouts()])
        setIsRefreshing(false)
    }

    const getSortedBalances = (): BalanceBreakdown[] => {
        if (!balanceBreakdown || balanceBreakdown.length === 0) return [];

        return [...balanceBreakdown].sort((a, b) => {
            const indexA = CURRENCY_DISPLAY_ORDER.indexOf(a.currency_code);
            const indexB = CURRENCY_DISPLAY_ORDER.indexOf(b.currency_code);

            if (indexA !== -1 && indexB !== -1) {
                return indexA - indexB;
            }

            if (indexA !== -1) {
                return -1;
            }

            if (indexB !== -1) {
                return 1;
            }

            return a.currency_code.localeCompare(b.currency_code);
        });
    };

    const toggleBalanceBreakdown = (currency: string) => {
        setShowBalanceBreakdown(prev => ({
            ...prev,
            [currency]: !prev[currency]
        }));
    };

    const getBalanceValue = (value: number | undefined) => {
        return value?.toLocaleString() || '0';
    };

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
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-2xl font-bold tracking-tight">Balance</h1>
                            <Button
                                variant="outline"
                                className="rounded-none"
                                onClick={() => setShowCurrencyConverter(!showCurrencyConverter)}
                            >
                                <DollarSign className="h-4 w-4 mr-2" />
                                Currency Converter
                            </Button>
                        </div>

                        {showCurrencyConverter && (
                            <CurrencyConverter conversionRates={conversionRates} />
                        )}

                        <div className="grid gap-4 md:grid-cols-2 mb-6">
                            {isBalanceBreakdownLoading || isRefreshing ? (
                                <Card className="rounded-none">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Balance</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Skeleton className="w-32 h-8 rounded-none" />
                                    </CardContent>
                                </Card>
                            ) : getSortedBalances().length === 0 ? (
                                <Card className="rounded-none">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Balance</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">No balance information available</div>
                                    </CardContent>
                                </Card>
                            ) : (
                                getSortedBalances().map((balance) => (
                                    <Card key={balance.currency_code} className="rounded-none">
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium cursor-pointer" onClick={() => toggleBalanceBreakdown(balance.currency_code)}>
                                                {balance.currency_code} Balance
                                                {balance.currency_code === preferredCurrency ? (
                                                    <span className="ml-2 inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                        Default
                                                    </span>
                                                ) : (
                                                    <span
                                                        className="ml-2 inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 cursor-pointer hover:bg-blue-50 hover:text-blue-700"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setPreferredCurrency(balance.currency_code);
                                                        }}
                                                    >
                                                        Set Default
                                                    </span>
                                                )}
                                            </CardTitle>
                                            <ArrowDownIcon className="h-4 w-4 text-muted-foreground cursor-pointer" onClick={() => toggleBalanceBreakdown(balance.currency_code)} />
                                        </CardHeader>
                                        <CardContent>
                                            <AnimatePresence mode="wait">
                                                {!showBalanceBreakdown[balance.currency_code] ? (
                                                    <motion.div
                                                        key={`available-${balance.currency_code}`}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -20 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="flex items-center justify-between"
                                                    >
                                                        <div className="flex flex-col">
                                                            <div className="text-2xl font-bold cursor-pointer" onClick={() => toggleBalanceBreakdown(balance.currency_code)}>
                                                                {formatCurrency(balance.available_balance, balance.currency_code)}
                                                            </div>
                                                            {balance.currency_code !== preferredCurrency && (
                                                                <div className="text-sm text-muted-foreground">
                                                                    ≈ {formatCurrency(
                                                                        balance.currency_code === 'USD'
                                                                            ? balance.available_balance * (
                                                                                conversionRates?.find(rate =>
                                                                                    rate.from_currency === 'USD' && rate.to_currency === 'XOF'
                                                                                )?.rate || 605
                                                                            )
                                                                            : balance.available_balance * (
                                                                                conversionRates?.find(rate =>
                                                                                    rate.from_currency === 'XOF' && rate.to_currency === 'USD'
                                                                                )?.rate || 0.00165
                                                                            ),
                                                                        preferredCurrency
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                                            <DialogTrigger asChild>
                                                                <Button
                                                                    variant="default"
                                                                    className="bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700 dark:text-white rounded-none"
                                                                    onClick={() => setSelectedWithdrawalCurrency(balance.currency_code)}
                                                                >
                                                                    Withdraw
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="sm:max-w-[425px] rounded-none">
                                                                <DialogHeader>
                                                                    <DialogTitle>Withdraw {selectedWithdrawalCurrency}</DialogTitle>
                                                                    <DialogDescription>
                                                                        Enter the amount you wish to withdraw and select your bank account.
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <div className="grid gap-4 py-4">
                                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                                        <Label htmlFor="currency" className="text-right">Currency</Label>
                                                                        <Select
                                                                            value={selectedWithdrawalCurrency}
                                                                            onValueChange={(value) => setSelectedWithdrawalCurrency(value as currency_code)}
                                                                        >
                                                                            <SelectTrigger className="col-span-3 rounded-none">
                                                                                <SelectValue placeholder="Select currency" />
                                                                            </SelectTrigger>
                                                                            <SelectContent className="rounded-none">
                                                                                {getSortedBalances().map((balance) => (
                                                                                    <SelectItem
                                                                                        key={balance.currency_code}
                                                                                        value={balance.currency_code}
                                                                                        className="rounded-none"
                                                                                    >
                                                                                        {balance.currency_code} - Available: {getBalanceValue(balance.available_balance)}
                                                                                    </SelectItem>
                                                                                ))}
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>
                                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                                        <Label htmlFor="amount" className="text-right">Amount</Label>
                                                                        <Input
                                                                            id="amount"
                                                                            type="text"
                                                                            value={withdrawalAmount}
                                                                            onChange={(e) => {
                                                                                const value = e.target.value
                                                                                if (/^\d*\.?\d*$/.test(value)) {
                                                                                    setWithdrawalAmount(value)
                                                                                }
                                                                            }}
                                                                            className="col-span-3 rounded-none"
                                                                            placeholder={`Enter amount in ${selectedWithdrawalCurrency}`}
                                                                        />
                                                                    </div>
                                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                                        <Label htmlFor="bank-account" className="text-right">Bank Account</Label>
                                                                        <Select onValueChange={setSelectedBankAccount} value={selectedBankAccount}>
                                                                            <SelectTrigger className="col-span-3 rounded-none">
                                                                                <SelectValue placeholder="Select a bank account" />
                                                                            </SelectTrigger>
                                                                            <SelectContent className="rounded-none">
                                                                                {bankAccounts.map((account) => (
                                                                                    <SelectItem key={account.bank_account_id} value={account.bank_account_id} className="rounded-none">
                                                                                        {account.bank_name} - {account.account_number}
                                                                                    </SelectItem>
                                                                                ))}
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>
                                                                </div>
                                                                <DialogFooter>
                                                                    <Button
                                                                        onClick={handleWithdraw}
                                                                        disabled={isWithdrawing}
                                                                        className="bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700 dark:text-white rounded-none"
                                                                    >
                                                                        {isWithdrawing ? (
                                                                            <>
                                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                                Processing...
                                                                            </>
                                                                        ) : (
                                                                            "Confirm"
                                                                        )}
                                                                    </Button>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </motion.div>
                                                ) : (
                                                    <motion.div
                                                        key={`breakdown-${balance.currency_code}`}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -20 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <div className="space-y-2">
                                                            <div className="flex justify-between">
                                                                <span className="text-sm cursor-pointer" onClick={() => toggleBalanceBreakdown(balance.currency_code)}>
                                                                    Total
                                                                </span>
                                                                <span className="text-sm font-medium">
                                                                    {formatCurrency(balance.total_balance, balance.currency_code)}
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-sm text-blue-500 dark:text-yellow-500 cursor-pointer" onClick={() => toggleBalanceBreakdown(balance.currency_code)}>
                                                                    Pending
                                                                </span>
                                                                <span className="text-sm font-medium text-blue-500 dark:text-yellow-500">
                                                                    {formatCurrency(balance.pending_balance, balance.currency_code)}
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-sm text-green-500 cursor-pointer" onClick={() => toggleBalanceBreakdown(balance.currency_code)}>
                                                                    Available
                                                                </span>
                                                                <span className="text-sm font-medium text-green-500">
                                                                    {formatCurrency(balance.available_balance, balance.currency_code)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>

                        <PayoutFilters
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            selectedDateRange={selectedDateRange}
                            setSelectedDateRange={setSelectedDateRange}
                            customDateRange={customDateRange}
                            setCustomDateRange={setCustomDateRange}
                            handleCustomDateRangeApply={handleCustomDateRangeApply}
                            selectedStatuses={selectedStatuses}
                            setSelectedStatuses={setSelectedStatuses}
                            columns={columns}
                            setColumns={setColumns}
                            refetch={handleRefresh}
                            isRefreshing={isRefreshing}
                        />

                        <Card className="rounded-none">
                            <CardContent className="p-4">
                                <div className="border">
                                    <InfiniteScroll
                                        dataLength={payouts.length}
                                        next={() => fetchNextPage()}
                                        hasMore={payoutsData?.pages?.[payoutsData.pages.length - 1]?.length === pageSize}
                                        loader={<Skeleton className="w-full h-8 rounded-none" />}
                                    >
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    {columns.includes('Payout ID') && (
                                                        <TableHead className="text-center">
                                                            <Button variant="ghost" onClick={() => handleSort('payout_id')} className="rounded-none">
                                                                Payout ID
                                                                {sortColumn === 'payout_id' && (
                                                                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                                )}
                                                            </Button>
                                                        </TableHead>
                                                    )}
                                                    {columns.includes('Amount') && (
                                                        <TableHead className="text-center">
                                                            <Button variant="ghost" onClick={() => handleSort('amount')}>
                                                                Amount
                                                                {sortColumn === 'amount' && (
                                                                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                                )}
                                                            </Button>
                                                        </TableHead>
                                                    )}
                                                    {columns.includes('Currency') && (
                                                        <TableHead className="text-center">
                                                            <Button variant="ghost" onClick={() => handleSort('currency_code')}>
                                                                Currency
                                                                {sortColumn === 'currency_code' && (
                                                                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                                )}
                                                            </Button>
                                                        </TableHead>
                                                    )}
                                                    {columns.includes('Status') && (
                                                        <TableHead className="text-center">
                                                            <Button variant="ghost" onClick={() => handleSort('status')}>
                                                                Status
                                                                {sortColumn === 'status' && (
                                                                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                                )}
                                                            </Button>
                                                        </TableHead>
                                                    )}
                                                    {columns.includes('Date') && (
                                                        <TableHead className="text-center">
                                                            <Button variant="ghost" onClick={() => handleSort('created_at')}>
                                                                Date
                                                                {sortColumn === 'created_at' && (
                                                                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                                )}
                                                            </Button>
                                                        </TableHead>
                                                    )}
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {isPayoutsLoading ? (
                                                    Array.from({ length: 5 }).map((_, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell colSpan={6}>
                                                                <Skeleton className="w-full h-8 rounded-none" />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : payouts.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={6} className="text-center py-8">
                                                            <div className="flex flex-col items-center justify-center space-y-4">
                                                                <div className="bg-transparent dark:bg-transparent p-4">
                                                                    <FcfaIcon className="h-40 w-40 text-gray-400 dark:text-gray-500" />
                                                                </div>
                                                                <p className="text-xl font-semibold text-gray-500 dark:text-gray-400">
                                                                    No payout history found
                                                                </p>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs text-center">
                                                                    Start processing payouts to see your payout history here.
                                                                </p>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    applySearch(applyDateFilter(sortPayouts(payouts), selectedDateRange, customDateRange), searchTerm).map((payout: Payout) => (
                                                        <TableRow
                                                            key={payout.payout_id}
                                                            className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                                                            onClick={() => setSelectedPayout(payout)}
                                                        >
                                                            {columns.includes('Payout ID') && (
                                                                <TableCell className="text-center">{shortenPayoutId(payout.payout_id)}</TableCell>
                                                            )}
                                                            {columns.includes('Amount') && (
                                                                <TableCell className="text-center">
                                                                    {formatAmount(payout.amount)}
                                                                </TableCell>
                                                            )}
                                                            {columns.includes('Currency') && <TableCell className="text-center">{payout.currency_code}</TableCell>}
                                                            {columns.includes('Status') && (
                                                                <TableCell className="text-center">
                                                                    <span className={`
                                                                        inline-block px-2 py-1 text-xs font-normal rounded-none
                                                                        ${payout.status === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : ''}
                                                                        ${payout.status === 'pending' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : ''}
                                                                        ${payout.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : ''}
                                                                    `}
                                                                    >
                                                                        {formatPayoutStatus(payout.status)}
                                                                    </span>
                                                                </TableCell>
                                                            )}
                                                            {columns.includes('Date') && <TableCell className="text-center">{formatDate(payout.created_at)}</TableCell>}
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

            <PayoutActions payout={selectedPayout} isOpen={!!selectedPayout} onClose={() => setSelectedPayout(null)} />
        </Layout>
    )
}

function shortenPayoutId(payoutId: string): string {
    return `${payoutId.slice(0, 6)}...${payoutId.slice(-4)}`
}

function formatPayoutStatus(status: payout_status): string {
    switch (status) {
        case 'pending':
            return 'Pending'
        case 'processing':
            return 'Processing'
        case 'completed':
            return 'Completed'
        case 'failed':
            return 'Failed'
        default:
            return status
    }
}

function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function formatAmount(amount: number): string {
    return amount.toLocaleString('en-US', { minimumFractionDigits: 0 })
}

export default BalancePage;