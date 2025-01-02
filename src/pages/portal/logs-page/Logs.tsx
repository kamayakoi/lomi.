import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Search, RefreshCw, ArrowUpDown, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { Layout } from '@/components/custom/layout'
import Notifications from '@/components/dashboard/notifications'
import { UserNav } from '@/components/dashboard/user-nav'
import { TopNav } from '@/components/dashboard/top-nav'
import { Separator } from '@/components/ui/separator'
import { useUser } from '@/lib/hooks/useUser'
import { fetchLogs } from './dev_logs/support_logs'
import { Log } from './dev_logs/types'
import { Skeleton } from '@/components/ui/skeleton'
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline'
import FeedbackForm from '@/components/dashboard/feedback-form'
import { withActivationCheck } from '@/components/custom/withActivationCheck'
import SupportForm from '@/components/dashboard/support-form'
import { Card, CardContent } from "@/components/ui/card"
import { useQuery } from 'react-query'

function LogsPage() {
    const { user } = useUser()
    const [selectedEvent, setSelectedEvent] = useState<string | null>(null)
    const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [sortColumn, setSortColumn] = useState<keyof Log | null>(null)
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
    const [offset, setOffset] = useState(0)

    const topNav = [
        { title: 'Logs', href: '/portal/logs', isActive: true },
        { title: 'Settings', href: '/portal/settings/profile', isActive: false },
    ]

    const { data: logsData, isLoading: isLogsLoading, refetch } = useQuery(
        ['logs', user?.id || '', selectedEvent, selectedSeverity, offset],
        () => fetchLogs({
            userId: user?.id || '',
            event: selectedEvent,
            severity: selectedSeverity,
            offset,
            limit: 50
        }),
        {
            enabled: !!user?.id,
            keepPreviousData: true
        }
    )

    const handleRefresh = async () => {
        setIsRefreshing(true)
        await refetch()
        setIsRefreshing(false)
    }

    const handleSort = (column: keyof Log) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortColumn(column)
            setSortDirection('asc')
        }
    }

    const sortLogs = (logs: Log[]) => {
        if (!sortColumn) return logs

        return logs.sort((a, b) => {
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

    return (
        <Layout fixed>
            <Layout.Header>
                <TopNav links={topNav} />
                <div className='ml-auto flex items-center space-x-4'>
                    <FeedbackForm />
                    <Notifications />
                    <UserNav />
                </div>
            </Layout.Header>

            <Separator className='my-0' />
            <SupportForm />

            <Layout.Body className='flex flex-col'>
                <div className="space-y-4 pb-8">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Activity Logs</h1>
                    </div>
                    <div className='my-4 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0'>
                        <div className='flex flex-wrap items-center gap-4'>
                            <div className='relative w-60'>
                                <Input
                                    placeholder='Search logs...'
                                    className='w-full pl-10 pr-4 py-2 rounded-none'
                                    type="search"
                                />
                                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                            </div>
                            <Select value={selectedEvent || undefined} onValueChange={setSelectedEvent}>
                                <SelectTrigger className="w-[200px] rounded-none">
                                    <SelectValue placeholder="All Events" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All events</SelectItem>
                                    <SelectItem value="user_login">User logged in</SelectItem>
                                    <SelectItem value="edit_user_password">User password edited</SelectItem>
                                    <SelectItem value="create_pin">PIN created</SelectItem>
                                    <SelectItem value="edit_pin">PIN edited</SelectItem>
                                    <SelectItem value="edit_user_details">User details edited</SelectItem>
                                    <SelectItem value="authorize_user_2fa">User 2FA authorized</SelectItem>
                                    <SelectItem value="create_user_2fa">User 2FA created</SelectItem>
                                    <SelectItem value="remove_user_2fa">User 2FA removed</SelectItem>
                                    <SelectItem value="edit_user_2fa">User 2FA edited</SelectItem>
                                    <SelectItem value="edit_user_phone">User phone edited</SelectItem>
                                    <SelectItem value="set_callback_url">Callback URL set</SelectItem>
                                    <SelectItem value="update_ip_whitelist">IP whitelist updated</SelectItem>
                                    <SelectItem value="add_bank_account">Bank account added</SelectItem>
                                    <SelectItem value="remove_bank_account">Bank account removed</SelectItem>
                                    <SelectItem value="create_payout">Payout created</SelectItem>
                                    <SelectItem value="create_invoice">Invoice created</SelectItem>
                                    <SelectItem value="process_payment">Payment processed</SelectItem>
                                    <SelectItem value="update_webhook">Webhook updated</SelectItem>
                                    <SelectItem value="create_refund">Refund created</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={selectedSeverity || undefined} onValueChange={setSelectedSeverity}>
                                <SelectTrigger className="w-[120px] rounded-none">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All severity</SelectItem>
                                    <SelectItem value="NOTICE">Notice</SelectItem>
                                    <SelectItem value="WARNING">Warning</SelectItem>
                                    <SelectItem value="ERROR">Error</SelectItem>
                                    <SelectItem value="CRITICAL">Critical</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    onClick={handleRefresh}
                                    className="border-border text-card-foreground px-2 h-10 rounded-none"
                                    disabled={isRefreshing}
                                >
                                    <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                                    <span className="sr-only">Refresh</span>
                                </Button>
                            </div>
                        </div>
                    </div>

                    <Card className="rounded-none">
                        <CardContent className="p-4">
                            <div className="rounded-none border">
                                <div className="max-h-[calc(100vh-320px)] overflow-y-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="text-center whitespace-nowrap">
                                                    <Button variant="ghost" className="hover:bg-transparent px-0 w-full justify-center" onClick={() => handleSort('created_at')}>
                                                        Date
                                                        {sortColumn === 'created_at' && (
                                                            <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                        )}
                                                    </Button>
                                                </TableHead>
                                                <TableHead className="text-center whitespace-nowrap">
                                                    <Button variant="ghost" className="hover:bg-transparent px-0 w-full justify-center" onClick={() => handleSort('event')}>
                                                        Event
                                                        {sortColumn === 'event' && (
                                                            <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                        )}
                                                    </Button>
                                                </TableHead>
                                                <TableHead className="text-center whitespace-nowrap">
                                                    <Button variant="ghost" className="hover:bg-transparent px-0 w-full justify-center" onClick={() => handleSort('severity')}>
                                                        Severity
                                                        {sortColumn === 'severity' && (
                                                            <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                        )}
                                                    </Button>
                                                </TableHead>
                                                <TableHead className="text-center whitespace-nowrap">
                                                    <Button variant="ghost" className="hover:bg-transparent px-0 w-full justify-center" onClick={() => handleSort('ip_address')}>
                                                        IP Address
                                                        {sortColumn === 'ip_address' && (
                                                            <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                        )}
                                                    </Button>
                                                </TableHead>
                                                <TableHead className="text-center whitespace-nowrap">
                                                    <Button variant="ghost" className="hover:bg-transparent px-0 w-full justify-center" onClick={() => handleSort('operating_system')}>
                                                        Operating System
                                                        {sortColumn === 'operating_system' && (
                                                            <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                        )}
                                                    </Button>
                                                </TableHead>
                                                <TableHead className="text-center whitespace-nowrap">
                                                    <Button variant="ghost" className="hover:bg-transparent px-0 w-full justify-center" onClick={() => handleSort('browser')}>
                                                        Browser
                                                        {sortColumn === 'browser' && (
                                                            <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                        )}
                                                    </Button>
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {isLogsLoading ? (
                                                Array.from({ length: 50 }).map((_, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell colSpan={6}>
                                                            <Skeleton className="w-full h-8" />
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : !logsData?.data?.length ? (
                                                <TableRow>
                                                    <TableCell colSpan={6}>
                                                        <div className="py-24 text-center">
                                                            <div className="flex justify-center mb-6">
                                                                <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4">
                                                                    <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                                                                </div>
                                                            </div>
                                                            <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400">
                                                                No logs found
                                                            </h3>
                                                            <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                                                                Start performing actions to see your activity logs here.
                                                            </p>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ) : logsData && logsData.data ? (
                                                sortLogs(logsData.data).map((log: Log) => (
                                                    <TableRow key={log.log_id} className="hover:bg-muted/50">
                                                        <TableCell className="font-medium">
                                                            <div className="flex flex-col">
                                                                <span>{formatDate(log.created_at)}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center space-x-2">
                                                                <span className="font-medium">{formatEventName(log.event)}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className={`
                                                                inline-flex items-center px-2.5 py-0.5 rounded-none text-xs font-medium
                                                                ${log.severity === 'NOTICE' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : ''}
                                                                ${log.severity === 'WARNING' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : ''}
                                                                ${log.severity === 'ERROR' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : ''}
                                                                ${log.severity === 'CRITICAL' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : ''}
                                                            `}>
                                                                {log.severity.charAt(0).toUpperCase() + log.severity.slice(1).toLowerCase()}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <code className="text-sm">{log.ip_address}</code>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="text-sm text-muted-foreground">
                                                                {formatUserAgent(log.operating_system)}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="text-sm text-muted-foreground">
                                                                {formatBrowser(log.browser)}
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : null}
                                        </TableBody>
                                    </Table>
                                </div>
                                {logsData && logsData.totalCount > 0 && (
                                    <div className="flex items-center justify-between border-t border-border px-4 py-4">
                                        <div className="flex-1 text-sm text-muted-foreground">
                                            Showing {offset + 1} to {Math.min(offset + 50, logsData.totalCount)} of {logsData.totalCount} entries
                                        </div>
                                        <div className="flex items-center space-x-6 lg:space-x-8">
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    variant="outline"
                                                    className="h-8 w-8 p-0 rounded-none"
                                                    onClick={() => setOffset(Math.max(0, offset - 50))}
                                                    disabled={offset === 0}
                                                >
                                                    <span className="sr-only">Previous page</span>
                                                    <ChevronLeftIcon className="h-4 w-4" />
                                                </Button>
                                                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                                                    Page {Math.floor(offset / 50) + 1} of {Math.ceil(logsData.totalCount / 50)}
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    className="h-8 w-8 p-0 rounded-none"
                                                    onClick={() => setOffset(offset + 50)}
                                                    disabled={offset + 50 >= logsData.totalCount}
                                                >
                                                    <span className="sr-only">Next page</span>
                                                    <ChevronRightIcon className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </Layout.Body>
        </Layout>
    )
}

function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    })
}

function formatEventName(event: string): string {
    switch (event) {
        case 'user_login':
            return 'User logged in'
        case 'edit_user_password':
            return 'User password edited'
        case 'create_pin':
            return 'PIN created'
        case 'edit_pin':
            return 'PIN edited'
        case 'edit_user_details':
            return 'User details edited'
        case 'authorize_user_2fa':
            return 'User 2FA authorized'
        case 'create_user_2fa':
            return 'User 2FA created'
        case 'remove_user_2fa':
            return 'User 2FA removed'
        case 'edit_user_2fa':
            return 'User 2FA edited'
        case 'edit_user_phone':
            return 'User phone edited'
        case 'set_callback_url':
            return 'Callback URL set'
        case 'update_ip_whitelist':
            return 'IP whitelist updated'
        case 'add_bank_account':
            return 'Bank account added'
        case 'remove_bank_account':
            return 'Bank account removed'
        case 'create_payout':
            return 'Payout created'
        case 'create_invoice':
            return 'Invoice created'
        case 'process_payment':
            return 'Payment processed'
        case 'update_webhook':
            return 'Webhook updated'
        case 'create_refund':
            return 'Refund created'
        default:
            return event
    }
}

function formatUserAgent(userAgent: string): string {
    // Extract OS name from user agent
    const osMatch = userAgent.match(/\((.*?)\)/)
    return osMatch?.[1]?.split(';')[0]?.trim() ?? userAgent
}

function formatBrowser(browser: string): string {
    // Extract browser name and version
    const browserInfo = browser.split('"').filter(part => part.includes('/'))[0]
    return browserInfo || browser
}

function LogsWithActivationCheck() {
    return withActivationCheck(LogsPage)({})
}

export default LogsWithActivationCheck