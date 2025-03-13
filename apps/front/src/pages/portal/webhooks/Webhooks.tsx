import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { TopNav } from '@/components/portal/top-nav'
import { UserNav } from '@/components/portal/user-nav'
import Notifications from '@/components/portal/notifications'
import { Separator } from "@/components/ui/separator"
import { Layout } from '@/components/custom/layout'
import FeedbackForm from '@/components/portal/feedback-form'
import { useUser } from '@/lib/hooks/use-user'
import { fetchWebhooks } from './components/support'
import { Webhook, webhook_event, webhookCategories } from './components/types'
import { Skeleton } from '@/components/ui/skeleton'
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline'
import { CreateWebhookForm } from './components/form'
import { WebhookFilters } from './components/filters'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { PlusCircle, ArrowUpDown, Edit } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useQuery } from '@tanstack/react-query'
import WebhookActions from './components/edit'
import SupportForm from '@/components/portal/support-form'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import WebhookView from './components/actions'

function getEventCategoryColor(categoryName: string): string {
    switch (categoryName) {
        case 'PAYMENTS':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        case 'SUBSCRIPTIONS':
            return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
        case 'PAYMENT SESSIONS':
            return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300';
        case 'PAYOUTS':
            return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
        case 'INVOICES':
            return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
}

function EventBadges({ events }: { events: webhook_event[] }) {
    const groupedEvents = webhookCategories.map(category => ({
        ...category,
        activeEvents: category.events.filter(event => events.includes(event.id))
    })).filter(category => category.activeEvents.length > 0);

    return (
        <div className="flex flex-wrap gap-1.5">
            {groupedEvents.map((category, idx) => (
                <TooltipProvider key={idx}>
                    <Tooltip>
                        <TooltipTrigger>
                            <Badge
                                variant="secondary"
                                className={`rounded-none px-2 py-1 text-xs font-normal ${getEventCategoryColor(category.name)}`}
                            >
                                {category.name} ({category.activeEvents.length})
                            </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                            <div className="text-sm">
                                {category.activeEvents.map(event => event.label).join(', ')}
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ))}
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center h-full py-10">
            <div className="flex justify-center mb-8">
                <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full">
                    <ClipboardDocumentListIcon className="h-16 w-16 text-gray-400 dark:text-gray-500" />
                </div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-500 dark:text-gray-400 mb-3">
                No webhooks found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto text-center">
                Try changing your filter or create a new webhook.
            </p>
        </div>
    );
}

function WebhookCard({ webhook, onEditClick, onClick }: {
    webhook: Webhook,
    onEditClick: (e: React.MouseEvent) => void,
    onClick: () => void
}) {
    return (
        <div
            className="p-4 border-b cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
            onClick={onClick}
        >
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="font-medium">Endpoint</div>
                    <button
                        onClick={onEditClick}
                        className="text-blue-500 hover:text-blue-600 p-1.5"
                    >
                        <Edit className="h-4.5 w-4.5" />
                    </button>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center justify-between">
                        <span className={`
                            inline-block px-2 py-1 rounded-none text-xs font-normal
                            ${webhook.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}
                        `}>
                            {webhook.is_active ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                    <div>
                        <div className="text-xs font-medium mb-1">Authorized Events</div>
                        <EventBadges events={webhook.authorized_events} />
                    </div>
                    <div className="pt-1">
                        <code className="text-xs break-all bg-gray-100 dark:bg-gray-800 p-2 block">
                            {webhook.url}
                        </code>
                    </div>
                </div>
            </div>
        </div>
    );
}

function WebhooksPage() {
    const { user } = useUser()
    const [isCreateWebhookOpen, setIsCreateWebhookOpen] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState<webhook_event | 'all'>('all')
    const [selectedStatus, setSelectedStatus] = useState<'active' | 'inactive' | 'all'>('all')
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null)
    const [isActionsOpen, setIsActionsOpen] = useState(false)
    const [sortColumn, setSortColumn] = useState<keyof Webhook | null>(null)
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
    const [selectedWebhookForView, setSelectedWebhookForView] = useState<Webhook | null>(null)
    const [isViewOpen, setIsViewOpen] = useState(false)

    const topNav = [
        { title: 'Webhooks', href: '/portal/webhooks', isActive: true },
        { title: 'Settings', href: '/portal/settings/profile', isActive: false },
    ]

    const { data: webhooksData, isLoading: isWebhooksLoading, refetch } = useQuery<Webhook[]>({
        queryKey: ['webhooks', user?.id || '', selectedEvent, selectedStatus] as const,
        queryFn: () => fetchWebhooks(user?.id || '', selectedEvent, selectedStatus),
        enabled: !!user?.id
    })

    const webhooks = webhooksData || []

    const handleCreateWebhookSuccess = () => {
        refetch()
    }

    const handleRefresh = async () => {
        setIsRefreshing(true)
        await refetch()
        setIsRefreshing(false)
    }

    const handleSort = (column: keyof Webhook) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortColumn(column)
            setSortDirection('asc')
        }
    }

    const sortWebhooks = (webhooks: Webhook[]) => {
        if (!sortColumn) return webhooks

        return webhooks.sort((a, b) => {
            const aValue = a[sortColumn]
            const bValue = b[sortColumn]

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
            } else if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
                return sortDirection === 'asc' ? Number(aValue) - Number(bValue) : Number(bValue) - Number(aValue)
            } else if (Array.isArray(aValue) && Array.isArray(bValue)) {
                // For authorized_events array, compare the first event
                const aEvent = String(aValue[0] || '')
                const bEvent = String(bValue[0] || '')
                return sortDirection === 'asc' ? aEvent.localeCompare(bEvent) : bEvent.localeCompare(aEvent)
            }
            return 0
        })
    }

    const handleRowClick = (webhook: Webhook) => {
        setSelectedWebhookForView(webhook)
        setIsViewOpen(true)
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
            <SupportForm />
            <Layout.Body>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold tracking-tight">Webhooks</h1>
                        <Dialog open={isCreateWebhookOpen} onOpenChange={setIsCreateWebhookOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-1 focus:ring-offset-2 focus:ring-blue-500 rounded-none">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Create
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="rounded-none">
                                <DialogHeader>
                                    <DialogTitle>Create a webhook</DialogTitle>
                                    <DialogDescription>
                                        Fill in the details to create a new webhook.
                                    </DialogDescription>
                                </DialogHeader>
                                <CreateWebhookForm onClose={() => setIsCreateWebhookOpen(false)} onSuccess={handleCreateWebhookSuccess} />
                            </DialogContent>
                        </Dialog>
                    </div>

                    <WebhookFilters
                        selectedEvent={selectedEvent}
                        setSelectedEvent={setSelectedEvent}
                        selectedStatus={selectedStatus}
                        setSelectedStatus={setSelectedStatus}
                        refetch={handleRefresh}
                        isRefreshing={isRefreshing}
                    />

                    <Card className="mt-4 rounded-none">
                        <CardContent className="p-0">
                            <div id="webhooks-table-container" className="h-[72vh] overflow-auto">
                                {/* Desktop Table View */}
                                <div className="hidden md:block">
                                    <Table className="w-full">
                                        <TableHeader>
                                            <TableRow className="hover:bg-transparent border-b bg-muted/50">
                                                <TableHead className="text-left w-1/2 pl-4">
                                                    <Button variant="ghost" onClick={() => handleSort('url')}>
                                                        URL
                                                        {sortColumn === 'url' && (
                                                            <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                        )}
                                                    </Button>
                                                </TableHead>
                                                <TableHead className="text-left w-1/3 pl-2">
                                                    <Button variant="ghost" onClick={() => handleSort('authorized_events')}>
                                                        Events
                                                        {sortColumn === 'authorized_events' && (
                                                            <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                        )}
                                                    </Button>
                                                </TableHead>
                                                <TableHead className="text-center w-1/6">
                                                    <Button variant="ghost" onClick={() => handleSort('is_active')}>
                                                        Status
                                                        {sortColumn === 'is_active' && (
                                                            <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                        )}
                                                    </Button>
                                                </TableHead>
                                                <TableHead className="w-[100px]"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {isWebhooksLoading ? (
                                                Array.from({ length: 5 }).map((_, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell colSpan={4}>
                                                            <Skeleton className="w-full h-8" />
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : webhooks.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="h-[65vh]">
                                                        <EmptyState />
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                sortWebhooks(webhooks).map((webhook: Webhook) => (
                                                    <TableRow
                                                        key={webhook.webhook_id}
                                                        className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                                                        onClick={() => handleRowClick(webhook)}
                                                    >
                                                        <TableCell className="text-left pl-4">{webhook.url}</TableCell>
                                                        <TableCell className="text-left pl-2">
                                                            <EventBadges events={webhook.authorized_events} />
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <span className={`
                                                                inline-block px-2 py-1 rounded-none text-xs font-normal
                                                                ${webhook.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}
                                                            `}>
                                                                {webhook.is_active ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedWebhook(webhook);
                                                                    setIsActionsOpen(true);
                                                                }}
                                                                className="text-blue-500 hover:text-blue-600 p-1.5"
                                                            >
                                                                <Edit className="h-4.5 w-4.5" />
                                                            </button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Mobile Card View */}
                                <div className="md:hidden">
                                    {isWebhooksLoading ? (
                                        Array.from({ length: 3 }).map((_, index) => (
                                            <div key={index} className="p-4 border-b">
                                                <Skeleton className="w-full h-24" />
                                            </div>
                                        ))
                                    ) : webhooks.length === 0 ? (
                                        <div className="h-[65vh] flex items-center justify-center">
                                            <EmptyState />
                                        </div>
                                    ) : (
                                        sortWebhooks(webhooks).map((webhook: Webhook) => (
                                            <WebhookCard
                                                key={webhook.webhook_id}
                                                webhook={webhook}
                                                onEditClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedWebhook(webhook);
                                                    setIsActionsOpen(true);
                                                }}
                                                onClick={() => handleRowClick(webhook)}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </Layout.Body>
            <WebhookActions
                webhook={selectedWebhook}
                isOpen={isActionsOpen}
                onClose={() => setIsActionsOpen(false)}
                onSuccess={() => refetch()}
            />
            <WebhookView
                webhook={selectedWebhookForView}
                isOpen={isViewOpen}
                onClose={() => setIsViewOpen(false)}
            />
        </Layout>
    )
}

export default WebhooksPage;