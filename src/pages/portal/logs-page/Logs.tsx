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
import FeedbackForm from '@/components/dashboard/feedback-form'

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
                    <FeedbackForm />
                    <Notifications />
                    <UserNav />
                </div>
            </Layout.Header>

            <Separator className='my-0' />

            <Layout.Body className='flex flex-col'>
                <div className="space-y-4 pb-8">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Activity Logs</h1>
                    </div>
                    <div className='my-4 flex items-center justify-between sm:my-0'>
                        <div className='flex items-center space-x-4'>
                            <div className='relative w-64'>
                                <Input
                                    placeholder='Search logs...'
                                    className='w-full pl-10 pr-4 py-2 rounded-none'
                                    type="search"
                                />
                                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                            </div>
                            <Select value={selectedEvent || undefined} onValueChange={setSelectedEvent}>
                                <SelectTrigger className="w-[140px] rounded-none">
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
                                <SelectTrigger className="w-[140px] rounded-none">
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
                            <Button variant="outline" size="icon" onClick={() => refetch()}>
                                <RefreshCw className="h-4 w-4" />
                                <span className="sr-only">Refresh</span>
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-md border">
                        <div className="max-h-[calc(100vh-210px)] overflow-y-scroll pr-2 scrollbar-hide">
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
            return 'User Phone edited'
        case 'set_callback_url':
            return 'Callback URL set'
        case 'update_ip_whitelist':
            return 'IP Whitelist updated'
        case 'add_bank_account':
            return 'Bank account added'
        case 'remove_bank_account':
            return 'Bank Account removed'
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
