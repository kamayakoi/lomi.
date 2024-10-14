import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TopNav } from '@/components/dashboard/top-nav'
import { UserNav } from '@/components/dashboard/user-nav'
import Notifications from '@/components/dashboard/notifications'
import { Layout } from '@/components/custom/layout'
import { Separator } from '@/components/ui/separator'
import { useUser } from '@/lib/hooks/useUser'
import AnimatedLogoLoader from '@/components/dashboard/loader'
import { useBalance } from './dev_balance/support_payouts'
import PayoutFilters from './dev_balance/filters_payouts'
import PayoutActions from './dev_balance/actions_payouts.tsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DateRange } from 'react-day-picker'
import { payout_status, Payout } from './dev_balance/types'
import { fetchPayouts, applySearch, applyDateFilter } from './dev_balance/support_payouts'
import { Skeleton } from '@/components/ui/skeleton'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useInfiniteQuery } from 'react-query'
import { FcfaIcon } from '@/components/custom/cfa'
import { ArrowUpDown } from 'lucide-react'

export default function BalancePage() {
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
        'Payout Method',
        'Status',
        'Date',
    ])

    const topNav = [
        { title: 'Balance', href: '/portal/balance', isActive: true },
        { title: 'Settings', href: '/portal/settings/profile', isActive: false },
    ]

    const { data: balance = 0, isLoading: isBalanceLoading } = useBalance(user?.id || '')

    const { data: payoutsData, isLoading: isPayoutsLoading, fetchNextPage } = useInfiniteQuery(
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
                        <h1 className="text-2xl font-bold tracking-tight mb-4">Balance</h1>

                        <div className="grid gap-4 md:grid-cols-2 mb-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {isBalanceLoading ? (
                                            <Skeleton className="w-32 h-8" />
                                        ) : (
                                            `XOF ${balance.toLocaleString()}`
                                        )}
                                    </div>
                                    <div className="flex space-x-2 mt-4">
                                        <Button>Withdraw</Button>
                                    </div>
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
                        />

                        <Card>
                            <CardContent className="p-6">
                                <div className="rounded-md border">
                                    <InfiniteScroll
                                        dataLength={payouts.length}
                                        next={() => fetchNextPage()}
                                        hasMore={payoutsData?.pages?.[payoutsData.pages.length - 1]?.length === pageSize}
                                        loader={<Skeleton className="w-full h-8" />}
                                    >
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    {columns.includes('Payout ID') && (
                                                        <TableHead className="text-center">
                                                            <Button variant="ghost" onClick={() => handleSort('payout_id')}>
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
                                                            <Button variant="ghost" onClick={() => handleSort('currency')}>
                                                                Currency
                                                                {sortColumn === 'currency' && (
                                                                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                                )}
                                                            </Button>
                                                        </TableHead>
                                                    )}
                                                    {columns.includes('Payout Method') && (
                                                        <TableHead className="text-center">
                                                            <Button variant="ghost" onClick={() => handleSort('payout_method')}>
                                                                Payout Method
                                                                {sortColumn === 'payout_method' && (
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
                                                            <Button variant="ghost" onClick={() => handleSort('date')}>
                                                                Date
                                                                {sortColumn === 'date' && (
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
                                                                <Skeleton className="w-full h-8" />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : payouts.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={6} className="text-center py-8">
                                                            <div className="flex flex-col items-center justify-center space-y-4">
                                                                <div className="rounded-full bg-transparent dark:bg-transparent p-4">
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
                                                            {columns.includes('Currency') && <TableCell className="text-center">{payout.currency}</TableCell>}
                                                            {columns.includes('Payout Method') && (
                                                                <TableCell className="text-center">{payout.payout_method}</TableCell>
                                                            )}
                                                            {columns.includes('Status') && (
                                                                <TableCell className="text-center">
                                                                    <span className={`
                                                                        inline-block px-2 py-1 rounded-full text-xs font-normal
                                                                        ${payout.status === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : ''}
                                                                        ${payout.status === 'pending' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : ''}
                                                                                                                                    ${payout.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : ''}
                                                                    `}
                                                                    >
                                                                        {formatPayoutStatus(payout.status)}
                                                                    </span>
                                                                </TableCell>
                                                            )}
                                                            {columns.includes('Date') && <TableCell className="text-center">{formatDate(payout.date)}</TableCell>}
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
