import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TopNav } from '@/components/portal/top-nav'
import { UserNav } from '@/components/portal/user-nav'
import Notifications from '@/components/portal/notifications'
import { Layout } from '@/components/custom/layout'
import { Separator } from '@/components/ui/separator'
import { useUser } from '@/lib/hooks/useUser'
import AnimatedLogoLoader from '@/components/portal/loader'
import { useBalanceBreakdown } from './dev_balance/support_balance.ts'
import PayoutFilters from './dev_balance/filters_balance.tsx'
import PayoutActions from './dev_balance/actions_balance.tsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DateRange } from 'react-day-picker'
import { payout_status, Payout, BankAccount } from './dev_balance/types'
import { fetchPayouts, applySearch, applyDateFilter, fetchBankAccounts, initiateWithdrawal } from './dev_balance/support_balance.ts'
import { Skeleton } from '@/components/ui/skeleton'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useInfiniteQuery } from 'react-query'
import { FcfaIcon } from '@/components/custom/cfa'
import { ArrowUpDown, ArrowDownIcon } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { AnimatePresence, motion } from "framer-motion"
import FeedbackForm from '@/components/portal/feedback-form.tsx'
import SupportForm from '@/components/portal/support-form'
import { withActivationCheck } from '@/components/custom/withActivationCheck'

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
    const [showBalanceBreakdown, setShowBalanceBreakdown] = useState(false)

    const topNav = [
        { title: 'Balance', href: '/portal/balance', isActive: true },
        { title: 'Settings', href: '/portal/settings/profile', isActive: false },
    ]

    const { data: balanceBreakdown, isLoading: isBalanceBreakdownLoading, refetch: refetchBalanceBreakdown } = useBalanceBreakdown(user?.id || null)

    const { data: payoutsData, isLoading: isPayoutsLoading, fetchNextPage, refetch: refetchPayouts } = useInfiniteQuery(
        ['payouts', user?.id || '', selectedStatuses],
        ({ pageParam = 1 }) =>
            fetchPayouts(
                user?.id || '',
                selectedStatuses,
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

    const payouts = payoutsData?.pages?.flatMap((page) => page) || []

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
            const result = await initiateWithdrawal(user?.id || '', amount, selectedBankAccount)
            if (result.success) {
                toast({
                    title: "Withdrawal Successful",
                    description: `XOF ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} has been withdrawn from your account.`,
                })
                setIsDialogOpen(false)
                setWithdrawalAmount("")
                setSelectedBankAccount("")
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
                        <h1 className="text-2xl font-bold tracking-tight mb-4">Balance</h1>

                        <div className="grid gap-4 md:grid-cols-2 mb-6">
                            <Card className="rounded-none">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle
                                        className="text-sm font-medium cursor-pointer"
                                        onClick={() => setShowBalanceBreakdown(!showBalanceBreakdown)}
                                    >
                                        Balance
                                    </CardTitle>
                                    <ArrowDownIcon
                                        className="h-4 w-4 text-muted-foreground cursor-pointer"
                                        onClick={() => setShowBalanceBreakdown(!showBalanceBreakdown)}
                                    />
                                </CardHeader>
                                <CardContent>
                                    <AnimatePresence mode="wait">
                                        {!showBalanceBreakdown ? (
                                            <motion.div
                                                key="available"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.2 }}
                                                className="flex items-center justify-between"
                                            >
                                                <div
                                                    className="text-2xl font-bold cursor-pointer"
                                                    onClick={() => setShowBalanceBreakdown(!showBalanceBreakdown)}
                                                >
                                                    {isBalanceBreakdownLoading || isRefreshing ? (
                                                        <Skeleton className="w-32 h-8 rounded-none" />
                                                    ) : (
                                                        `XOF ${balanceBreakdown?.available_balance?.toLocaleString() || '0'}`
                                                    )}
                                                </div>
                                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                                    <DialogTrigger asChild>
                                                        <Button variant="default" className="bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700 dark:text-white rounded-none">
                                                            Withdraw
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-[425px] rounded-none">
                                                        <DialogHeader>
                                                            <DialogTitle>Withdraw</DialogTitle>
                                                            <DialogDescription>
                                                                Enter the amount you wish to withdraw and select your bank account.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="grid gap-4 py-4">
                                                            <div className="grid grid-cols-4 items-center gap-4">
                                                                <Label htmlFor="amount" className="text-right">Amount</Label>
                                                                <Input
                                                                    id="amount"
                                                                    type="text"
                                                                    value={withdrawalAmount}
                                                                    onChange={(e) => {
                                                                        const value = e.target.value
                                                                        // Allow only numbers and decimal point
                                                                        if (/^\d*\.?\d*$/.test(value)) {
                                                                            setWithdrawalAmount(value)
                                                                        }
                                                                    }}
                                                                    className="col-span-3 rounded-none"
                                                                    placeholder="Enter amount in XOF"
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
                                                key="breakdown"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <div className="space-y-2">
                                                    <div className="flex justify-between">
                                                        <span
                                                            className="text-sm cursor-pointer"
                                                            onClick={() => setShowBalanceBreakdown(false)}
                                                        >
                                                            Total
                                                        </span>
                                                        <span className="text-sm font-medium">
                                                            {isBalanceBreakdownLoading || isRefreshing ? (
                                                                <Skeleton className="w-20 h-4 rounded-none" />
                                                            ) : (
                                                                `XOF ${balanceBreakdown?.total_balance?.toLocaleString() || '0'}`
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span
                                                            className="text-sm text-blue-500 dark:text-yellow-500 cursor-pointer"
                                                            onClick={() => setShowBalanceBreakdown(false)}
                                                        >
                                                            Pending
                                                        </span>
                                                        <span className="text-sm font-medium text-blue-500 dark:text-yellow-500">
                                                            {isBalanceBreakdownLoading || isRefreshing ? (
                                                                <Skeleton className="w-20 h-4 rounded-none" />
                                                            ) : (
                                                                `XOF ${balanceBreakdown?.pending_balance?.toLocaleString() || '0'}`
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span
                                                            className="text-sm text-green-500 cursor-pointer"
                                                            onClick={() => setShowBalanceBreakdown(false)}
                                                        >
                                                            Available
                                                        </span>
                                                        <span className="text-sm font-medium text-green-500">
                                                            {isBalanceBreakdownLoading || isRefreshing ? (
                                                                <Skeleton className="w-20 h-4 rounded-none" />
                                                            ) : (
                                                                `XOF ${balanceBreakdown?.available_balance?.toLocaleString() || '0'}`
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </CardContent>
                            </Card>
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

function BalanceWithActivationCheck() {
    return withActivationCheck(BalancePage)({});
}

export default BalanceWithActivationCheck;
