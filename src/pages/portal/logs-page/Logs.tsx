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
import { Search, RefreshCw } from 'lucide-react'
import { Layout } from '@/components/custom/layout'
import Notifications from '@/components/dashboard/notifications'
import { UserNav } from '@/components/dashboard/user-nav'
import { TopNav } from '@/components/dashboard/top-nav'
import { Separator } from '@/components/ui/separator'
import { useUser } from '@/lib/hooks/useUser'
import { fetchLogs } from './dev_logs/support_logs'
import { Log } from './dev_logs/types'
import { Skeleton } from '@/components/ui/skeleton'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useInfiniteQuery } from 'react-query'
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline'


export default function LogsPage() {
    const { user } = useUser()
    const [selectedEvent, setSelectedEvent] = useState<string | null>(null)
    const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null)
    const pageSize = 50

    const topNav = [
        { title: 'Logs', href: '/portal/logs', isActive: true },
        { title: 'Settings', href: '/portal/settings/profile', isActive: false },
    ]

    const { data: logsData, isLoading: isLogsLoading, fetchNextPage, refetch } = useInfiniteQuery(
        ['logs', user?.id || '', selectedEvent, selectedSeverity],
        ({ pageParam = 1 }) =>
            fetchLogs(
                user?.id || '',
                selectedEvent,
                selectedSeverity,
                pageParam,
                pageSize
            ),
        {
            getNextPageParam: (lastPage: Log[], allPages: Log[][]) => {
                const nextPage = allPages.length + 1
                return lastPage.length !== 0 ? nextPage : undefined
            },
            enabled: !!user?.id,
        }
    )

    const logs = logsData?.pages?.flatMap((page) => page) || []

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
                    <div className="space-y-4 pb-8 px-4">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold tracking-tight">Activity Logs</h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex-grow">
                                <div className="relative">
                                    <Input
                                        className="w-full pl-10 pr-4 py-2 rounded-none"
                                        placeholder="Search logs..."
                                        type="search"
                                    />
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                </div>
                            </div>
                            <Select value={selectedEvent || undefined} onValueChange={setSelectedEvent}>
                                <SelectTrigger className="w-[140px] rounded-none">
                                    <SelectValue placeholder="All Events" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Events</SelectItem>
                                    <SelectItem value="user_login">User Login</SelectItem>
                                    <SelectItem value="edit_user_password">Edit User Password</SelectItem>
                                    <SelectItem value="create_pin">Create PIN</SelectItem>
                                    <SelectItem value="edit_pin">Edit PIN</SelectItem>
                                    <SelectItem value="edit_user_details">Edit User Details</SelectItem>
                                    <SelectItem value="authorize_user_2fa">Authorize User 2FA</SelectItem>
                                    <SelectItem value="create_user_2fa">Create User 2FA</SelectItem>
                                    <SelectItem value="remove_user_2fa">Remove User 2FA</SelectItem>
                                    <SelectItem value="edit_user_2fa">Edit User 2FA</SelectItem>
                                    <SelectItem value="edit_user_phone">Edit User Phone</SelectItem>
                                    <SelectItem value="set_callback_url">Set Callback URL</SelectItem>
                                    <SelectItem value="update_ip_whitelist">Update IP Whitelist</SelectItem>
                                    <SelectItem value="add_bank_account">Add Bank Account</SelectItem>
                                    <SelectItem value="remove_bank_account">Remove Bank Account</SelectItem>
                                    <SelectItem value="create_payout">Create Payout</SelectItem>
                                    <SelectItem value="create_invoice">Create Invoice</SelectItem>
                                    <SelectItem value="process_payment">Process Payment</SelectItem>
                                    <SelectItem value="update_webhook">Update Webhook</SelectItem>
                                    <SelectItem value="create_refund">Create Refund</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={selectedSeverity || undefined} onValueChange={setSelectedSeverity}>
                                <SelectTrigger className="w-[140px] rounded-none">
                                    <SelectValue placeholder="All Severities" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Severities</SelectItem>
                                    <SelectItem value="NOTICE">Notice</SelectItem>
                                    <SelectItem value="WARNING">Warning</SelectItem>
                                    <SelectItem value="ERROR">Error</SelectItem>
                                    <SelectItem value="CRITICAL">Critical</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" size="icon" onClick={() => refetch()}>
                                <RefreshCw className="h-4 w-4" />
                                <span className="sr-only">Refresh</span>
                            </Button>
                        </div>

                        <div className="rounded-md border">
                            <InfiniteScroll
                                dataLength={logs.length}
                                next={() => fetchNextPage()}
                                hasMore={logsData?.pages[logsData.pages.length - 1]?.length === pageSize}
                                loader={<Skeleton className="w-full h-8" />}
                            >
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Event</TableHead>
                                            <TableHead>Severity</TableHead>
                                            <TableHead>IP Address</TableHead>
                                            <TableHead>Operating System</TableHead>
                                            <TableHead>Browser</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {isLogsLoading ? (
                                            Array.from({ length: 5 }).map((_, index) => (
                                                <TableRow key={index}>
                                                    <TableCell colSpan={6}>
                                                        <Skeleton className="w-full h-8" />
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : logs.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-8">
                                                    <div className="flex flex-col items-center justify-center space-y-4">
                                                        <div className="rounded-full bg-transparent dark:bg-transparent p-4">
                                                            <ClipboardDocumentListIcon className="h-40 w-40 text-gray-400 dark:text-gray-500" />
                                                        </div>
                                                        <p className="text-xl font-semibold text-gray-500 dark:text-gray-400">
                                                            No logs found
                                                        </p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs text-center">
                                                            Start performing actions to see your activity logs here.
                                                        </p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            logs.map((log: Log) => (
                                                <TableRow key={log.log_id}>
                                                    <TableCell>{formatDate(log.created_at)}</TableCell>
                                                    <TableCell>{formatEventName(log.event)}</TableCell>
                                                    <TableCell>
                                                        <span className={`
                                                            inline-block px-2 py-1 rounded-full text-xs font-normal
                                                            ${log.severity === 'NOTICE' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : ''}
                                                            ${log.severity === 'WARNING' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : ''}
                                                            ${log.severity === 'ERROR' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : ''}
                                                            ${log.severity === 'CRITICAL' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : ''}
                                                        `}>
                                                            {log.severity.charAt(0).toUpperCase() + log.severity.slice(1).toLowerCase()}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>{log.ip_address}</TableCell>
                                                    <TableCell>{log.operating_system}</TableCell>
                                                    <TableCell>{log.browser}</TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </InfiniteScroll>
                        </div>
                    </div>
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
        hour12: true
    })
}

function formatEventName(event: string): string {
    return event
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}