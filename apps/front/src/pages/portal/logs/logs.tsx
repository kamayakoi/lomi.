import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
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
import Notifications from '@/components/portal/notifications'
import { UserNav } from '@/components/portal/user-nav'
import { TopNav } from '@/components/portal/top-nav'
import { Separator } from '@/components/ui/separator'
import { useUser } from '@/lib/hooks/use-user'
import { fetchLogs } from './components/support'
import { Log } from './components/types'
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline'
import FeedbackForm from '@/components/portal/feedback-form'
import SupportForm from '@/components/portal/support-form'
import { Card, CardContent } from "@/components/ui/card"
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import Spinner from '@/components/ui/spinner'

function LogsPage() {
    const { user } = useUser()
    const [selectedEvent, setSelectedEvent] = useState<string | null>(null)
    const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [sortColumn, setSortColumn] = useState<keyof Log | null>(null)
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
    const [offset, setOffset] = useState(0)
    const [searchTerm, setSearchTerm] = useState("")

    const topNav = [
        { title: 'Logs', href: '/portal/logs', isActive: true },
        { title: 'Settings', href: '/portal/settings/profile', isActive: false },
    ]

    const { data: logsData, isLoading: isLogsLoading, refetch } = useQuery({
        queryKey: ['logs', user?.id || '', selectedEvent, selectedSeverity, offset, searchTerm] as const,
        queryFn: () => fetchLogs({
            userId: user?.id || '',
            event: selectedEvent,
            severity: selectedSeverity,
            offset,
            limit: 50,
            searchTerm
        }),
        enabled: !!user?.id,
        placeholderData: (previousData) => previousData
    })

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

    // Filter logs by search term
    const filteredLogs = React.useMemo(() => {
        if (!logsData?.data || logsData.data.length === 0) return [];

        // Define sortLogs function inside the useMemo callback
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

        // First apply sorting
        const sortedLogs = sortLogs([...logsData.data] as Log[]);

        // Then apply search filtering
        if (!searchTerm) return sortedLogs;

        const search = searchTerm.toLowerCase();
        return sortedLogs.filter(log =>
            Object.entries(log).some(([, value]) =>
                value &&
                typeof value === 'string' &&
                value.toLowerCase().includes(search)
            )
        );
    }, [logsData?.data, searchTerm, sortColumn, sortDirection]);

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
            <SupportForm />

            <Layout.Body className='flex flex-col'>
                <div className="space-y-4 pb-8">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Activity Logs</h1>
                    </div>
                    <div className='my-4 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0'>
                        <div className='flex flex-wrap items-center gap-4'>
                            <div className='relative w-full sm:w-60'>
                                <Input
                                    placeholder='Search logs...'
                                    className='w-full pl-10 pr-4 py-2 rounded-none'
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                            </div>
                            <Select value={selectedEvent || undefined} onValueChange={setSelectedEvent}>
                                <SelectTrigger className="w-full sm:w-[200px] rounded-none">
                                    <SelectValue placeholder="All Events" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All events</SelectItem>

                                    <SelectGroup>
                                        <SelectLabel className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                                            Authentication & Security
                                        </SelectLabel>
                                        <SelectItem value="create_api_key">API key created</SelectItem>
                                        <SelectItem value="edit_api_key">API key edited</SelectItem>
                                        <SelectItem value="remove_api_key">API key deleted</SelectItem>
                                        <SelectItem value="user_login">User logged in</SelectItem>
                                        <SelectItem value="edit_user_password">Password updated</SelectItem>
                                        <SelectItem value="create_pin">PIN created</SelectItem>
                                        <SelectItem value="edit_pin">PIN updated</SelectItem>
                                        <SelectItem value="edit_user_details">User details updated</SelectItem>
                                        <SelectItem value="authorize_user_2fa">2FA authorization successful</SelectItem>
                                        <SelectItem value="create_user_2fa">2FA enabled</SelectItem>
                                        <SelectItem value="remove_user_2fa">2FA disabled</SelectItem>
                                        <SelectItem value="edit_user_phone">Phone number updated</SelectItem>
                                    </SelectGroup>

                                    <SelectGroup>
                                        <SelectLabel className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                                            Settings & Configuration
                                        </SelectLabel>
                                        <SelectItem value="set_callback_url">Callback URL updated</SelectItem>
                                        <SelectItem value="update_webhook">Webhook endpoint updated</SelectItem>
                                    </SelectGroup>

                                    <SelectGroup>
                                        <SelectLabel className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                                            Banking & Payouts
                                        </SelectLabel>
                                        <SelectItem value="add_bank_account">Bank account added</SelectItem>
                                        <SelectItem value="remove_bank_account">Bank account removed</SelectItem>
                                        <SelectItem value="create_payout">New payout initiated</SelectItem>
                                        <SelectItem value="payout_status_change">Payout status updated</SelectItem>
                                    </SelectGroup>

                                    <SelectGroup>
                                        <SelectLabel className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                                            Payments & Transactions
                                        </SelectLabel>
                                        <SelectItem value="process_payment">New payment processed</SelectItem>
                                        <SelectItem value="payment_status_change">Payment status updated</SelectItem>
                                        <SelectItem value="create_refund">New refund initiated</SelectItem>
                                        <SelectItem value="refund_status_change">Refund status updated</SelectItem>
                                        <SelectItem value="create_dispute">New dispute opened</SelectItem>
                                        <SelectItem value="dispute_status_change">Dispute status updated</SelectItem>
                                    </SelectGroup>

                                    <SelectGroup>
                                        <SelectLabel className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                                            Subscriptions
                                        </SelectLabel>
                                        <SelectItem value="create_subscription">New subscription created</SelectItem>
                                        <SelectItem value="cancel_subscription">Subscription cancelled</SelectItem>
                                        <SelectItem value="subscription_status_change">Subscription status updated</SelectItem>
                                        <SelectItem value="subscription_payment_failed">Subscription payment failed</SelectItem>
                                    </SelectGroup>

                                    <SelectGroup>
                                        <SelectLabel className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                                            Products & Services
                                        </SelectLabel>
                                        <SelectItem value="create_product">New product created</SelectItem>
                                        <SelectItem value="update_product">Product details updated</SelectItem>
                                        <SelectItem value="delete_product">Product deleted</SelectItem>
                                    </SelectGroup>

                                    <SelectGroup>
                                        <SelectLabel className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                                            Provider Integration
                                        </SelectLabel>
                                        <SelectItem value="provider_status_change">Provider status updated</SelectItem>
                                        <SelectItem value="provider_connection_error">Provider connection failed</SelectItem>
                                        <SelectItem value="provider_integration_success">Provider integration successful</SelectItem>
                                    </SelectGroup>

                                    <SelectGroup>
                                        <SelectLabel className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                                            System & Maintenance
                                        </SelectLabel>
                                        <SelectItem value="system_maintenance">System maintenance scheduled</SelectItem>
                                        <SelectItem value="system_update">System update available</SelectItem>
                                        <SelectItem value="compliance_update">Compliance update required</SelectItem>
                                        <SelectItem value="api_status_change">API status changed</SelectItem>
                                    </SelectGroup>

                                    <SelectGroup>
                                        <SelectLabel className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                                            Customer Management
                                        </SelectLabel>
                                        <SelectItem value="customer_verification_required">Customer verification needed</SelectItem>
                                        <SelectItem value="customer_verification_success">Customer verification successful</SelectItem>
                                        <SelectItem value="customer_verification_failed">Customer verification failed</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <Select value={selectedSeverity || undefined} onValueChange={setSelectedSeverity}>
                                <SelectTrigger className="w-full sm:w-[120px] rounded-none">
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
                            <div className="hidden sm:flex items-center space-x-2">
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
                        <CardContent className="p-0">
                            <div id="logs-table-container" className="h-[65vh] overflow-auto">
                                {/* Desktop Table View */}
                                <div className="hidden md:block">
                                    <Table className="w-full">
                                        <TableHeader>
                                            <TableRow className="border-b border-border hover:bg-transparent bg-muted/50">
                                                <TableHead className="text-center">
                                                    <Button variant="ghost" onClick={() => handleSort('created_at')}>
                                                        Date
                                                        {sortColumn === 'created_at' && (
                                                            <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                        )}
                                                    </Button>
                                                </TableHead>
                                                <TableHead className="text-center">
                                                    <Button variant="ghost" onClick={() => handleSort('event')}>
                                                        Event
                                                        {sortColumn === 'event' && (
                                                            <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                        )}
                                                    </Button>
                                                </TableHead>
                                                <TableHead className="text-center">
                                                    <Button variant="ghost" onClick={() => handleSort('severity')}>
                                                        Severity
                                                        {sortColumn === 'severity' && (
                                                            <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                        )}
                                                    </Button>
                                                </TableHead>
                                                <TableHead className="text-center">
                                                    <Button variant="ghost" onClick={() => handleSort('ip_address')}>
                                                        IP Address
                                                        {sortColumn === 'ip_address' && (
                                                            <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                        )}
                                                    </Button>
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {isLogsLoading ? (
                                                <TableRow>
                                                    <TableCell colSpan={4}>
                                                        <div className="flex items-center justify-center h-[65vh]">
                                                            <Spinner />
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ) : logsData && logsData.data ? (
                                                filteredLogs.map((log) => (
                                                    <TableRow key={log.log_id} className="border-b border-border hover:bg-muted/20">
                                                        <TableCell className="font-medium text-center">
                                                            {formatDate(log.created_at)}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            {formatEventName(log.event)}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <span className={
                                                                `inline-block px-2 py-1 text-xs font-medium rounded-none ` +
                                                                (log.severity === 'NOTICE' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                                                                    log.severity === 'WARNING' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                                                                        log.severity === 'ERROR' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                                                                            'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300')
                                                            }>
                                                                {log.severity}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-center">{log.ip_address}</TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="h-[65vh]">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
                                                                <ClipboardDocumentListIcon className="h-16 w-16 text-gray-400 dark:text-gray-500" />
                                                            </div>
                                                            <h3 className="text-2xl font-semibold text-gray-500 dark:text-gray-400 mt-4">
                                                                No logs found
                                                            </h3>
                                                            <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto text-center mt-2">
                                                                Try changing your filter or try again later.
                                                            </p>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Mobile Card View */}
                                <div className="md:hidden">
                                    {isLogsLoading ? (
                                        <div className="flex items-center justify-center h-[65vh]">
                                            <Spinner />
                                        </div>
                                    ) : logsData && logsData.data ? (
                                        filteredLogs.map((log: Log) => (
                                            <LogCard key={log.log_id} log={log} />
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full py-10">
                                            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
                                                <ClipboardDocumentListIcon className="h-16 w-16 text-gray-400 dark:text-gray-500" />
                                            </div>
                                            <h3 className="text-2xl font-semibold text-gray-500 dark:text-gray-400 mt-4">
                                                No logs found
                                            </h3>
                                            <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto text-center mt-2">
                                                Try changing your filter or try again later.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {logsData && logsData.totalCount > 0 && (
                                <div className="flex items-center justify-between border-t border-border px-4 py-4 mr-12">
                                    <div className="flex-1 text-sm text-muted-foreground">
                                        <span className="hidden md:inline">
                                            Showing {offset + 1} to {Math.min(offset + 50, logsData.totalCount)} of {logsData.totalCount} entries
                                        </span>
                                        <span className="md:hidden">
                                            Page {Math.floor(offset / 50) + 1} of {Math.ceil(logsData.totalCount / 50)}
                                        </span>
                                    </div>
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
                            )}
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
        // Authentication & Security
        case 'create_api_key':
            return 'API key created'
        case 'edit_api_key':
            return 'API key edited'
        case 'remove_api_key':
            return 'API key deleted'
        case 'user_login':
            return 'User logged in'
        case 'edit_user_password':
            return 'Password updated'
        case 'create_pin':
            return 'PIN created'
        case 'edit_pin':
            return 'PIN updated'
        case 'edit_user_details':
            return 'User details updated'
        case 'authorize_user_2fa':
            return '2FA authorization successful'
        case 'create_user_2fa':
            return '2FA enabled'
        case 'remove_user_2fa':
            return '2FA disabled'
        case 'edit_user_phone':
            return 'Phone number updated'

        // Settings & Configuration
        case 'set_callback_url':
            return 'Callback URL updated'
        case 'update_webhook':
            return 'Webhook endpoint updated'

        // Banking & Payouts
        case 'add_bank_account':
            return 'Bank account added'
        case 'remove_bank_account':
            return 'Bank account removed'
        case 'create_payout':
            return 'New payout initiated'
        case 'payout_status_change':
            return 'Payout status updated'

        // Payments & Transactions
        case 'process_payment':
            return 'New payment processed'
        case 'payment_status_change':
            return 'Payment status updated'
        case 'create_refund':
            return 'New refund initiated'
        case 'refund_status_change':
            return 'Refund status updated'
        case 'create_dispute':
            return 'New dispute opened'
        case 'dispute_status_change':
            return 'Dispute status updated'

        // Subscriptions
        case 'create_subscription':
            return 'New subscription created'
        case 'cancel_subscription':
            return 'Subscription cancelled'
        case 'subscription_status_change':
            return 'Subscription status updated'
        case 'subscription_payment_failed':
            return 'Subscription payment failed'

        // Products & Services
        case 'create_product':
            return 'New product created'
        case 'update_product':
            return 'Product details updated'
        case 'delete_product':
            return 'Product deleted'

        // Provider Integration
        case 'provider_status_change':
            return 'Provider status updated'
        case 'provider_connection_error':
            return 'Provider connection failed'
        case 'provider_integration_success':
            return 'Provider integration successful'

        // System & Maintenance
        case 'system_maintenance':
            return 'System maintenance scheduled'
        case 'system_update':
            return 'System update available'
        case 'compliance_update':
            return 'Compliance update required'
        case 'api_status_change':
            return 'API status changed'

        // Customer Management
        case 'customer_verification_required':
            return 'Customer verification needed'
        case 'customer_verification_success':
            return 'Customer verification successful'
        case 'customer_verification_failed':
            return 'Customer verification failed'

        default:
            // Convert snake_case to Title Case with spaces
            return event
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ')
    }
}

function formatUserAgent(userAgent: string | null): string {
    if (!userAgent) return 'Unknown';

    try {
        // Extract OS name from user agent
        const osMatch = (userAgent as string).match(/\((.*?)\)/);
        return osMatch?.[1]?.split(';')[0]?.trim() ?? 'Unknown';
    } catch (error) {
        console.error('Error formatting user agent string:', error);
        return 'Unknown';
    }
}

function formatBrowser(browser: string | null): string {
    if (!browser) return 'Unknown';

    // Extract browser name and version
    try {
        const browserInfo = browser.split('"').filter(part => part.includes('/'))[0];
        return browserInfo || 'Unknown';
    } catch (error) {
        console.error('Error formatting browser string:', error);
        return 'Unknown';
    }
}

function LogCard({ log }: { log: Log }) {
    return (
        <div className="p-4 border-b hover:bg-gray-50 dark:hover:bg-gray-800">
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="font-medium">{formatEventName(log.event)}</div>
                    <span className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-none text-xs font-medium
                        ${log.severity === 'NOTICE' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : ''}
                        ${log.severity === 'WARNING' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : ''}
                        ${log.severity === 'ERROR' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : ''}
                        ${log.severity === 'CRITICAL' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : ''}
                    `}>
                        {log.severity.charAt(0).toUpperCase() + log.severity.slice(1).toLowerCase()}
                    </span>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between items-center">
                        <span>{formatDate(log.created_at)}</span>
                        <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1">{log.ip_address}</code>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <span>{formatUserAgent(log.operating_system)}</span>
                        <span>{formatBrowser(log.browser)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LogsPage;