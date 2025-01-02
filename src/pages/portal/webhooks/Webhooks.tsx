import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { TopNav } from '@/components/dashboard/top-nav'
import { UserNav } from '@/components/dashboard/user-nav'
import Notifications from '@/components/dashboard/notifications'
import { Separator } from "@/components/ui/separator"
import { Layout } from '@/components/custom/layout'
import FeedbackForm from '@/components/dashboard/feedback-form'
import { useUser } from '@/lib/hooks/useUser'
import { fetchWebhooks } from './dev_webhooks/support_webhooks'
import { Webhook, webhook_event } from './dev_webhooks/types'
import { Skeleton } from '@/components/ui/skeleton'
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline'
import { CreateWebhookForm } from './dev_webhooks/form_webhooks'
import { WebhookFilters } from './dev_webhooks/filters_webhooks'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { PlusCircle, ArrowUpDown } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useQuery } from 'react-query'
import WebhookActions from './dev_webhooks/actions_webhooks'
import { withActivationCheck } from '@/components/custom/withActivationCheck'
import SupportForm from '@/components/dashboard/support-form'
import { Card, CardContent } from '@/components/ui/card'

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

    const topNav = [
        { title: 'Webhooks', href: '/portal/webhooks', isActive: true },
        { title: 'Settings', href: '/portal/settings/profile', isActive: false },
    ]

    const { data: webhooksData, isLoading: isWebhooksLoading, refetch } = useQuery(
        ['webhooks', user?.id || '', selectedEvent, selectedStatus],
        () => fetchWebhooks(user?.id || '', selectedEvent, selectedStatus),
        {
            enabled: !!user?.id,
        }
    )

    const webhooks = webhooksData || []

    const handleCreateWebhookSuccess = () => {
        refetch()
    }

    const handleRefresh = async () => {
        setIsRefreshing(true)
        await refetch()
        setIsRefreshing(false)
    }

    const handleWebhookClick = (webhook: Webhook) => {
        setSelectedWebhook(webhook)
        setIsActionsOpen(true)
        console.log('Opening webhook details:', webhook)
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
            <Layout.Body>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold tracking-tight">Webhooks</h1>
                        <Dialog open={isCreateWebhookOpen} onOpenChange={setIsCreateWebhookOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-none">
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
                        <CardContent className="p-4">
                            <div className="border rounded-none">
                                <div className="max-h-[calc(100vh-210px)] overflow-y-auto pr-2 scrollbar-hide">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="text-left w-1/2 pl-4">
                                                    <Button variant="ghost" onClick={() => handleSort('url')}>
                                                        URL
                                                        {sortColumn === 'url' && (
                                                            <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                                                        )}
                                                    </Button>
                                                </TableHead>
                                                <TableHead className="text-left w-1/3 pl-2">
                                                    <Button variant="ghost" onClick={() => handleSort('event')}>
                                                        Event
                                                        {sortColumn === 'event' && (
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
                                                    <TableCell colSpan={4}>
                                                        <div className="py-24 text-center">
                                                            <div className="flex justify-center mb-6">
                                                                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-none">
                                                                    <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                                                                </div>
                                                            </div>
                                                            <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400">
                                                                No webhooks found
                                                            </h3>
                                                            <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                                                                Try changing your filter or create a new webhook.
                                                            </p>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                sortWebhooks(webhooks).map((webhook: Webhook) => (
                                                    <TableRow
                                                        key={webhook.webhook_id}
                                                        onClick={() => handleWebhookClick(webhook)}
                                                        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                                                        role="button"
                                                        tabIndex={0}
                                                    >
                                                        <TableCell className="text-left pl-4">{webhook.url}</TableCell>
                                                        <TableCell className="text-left pl-2">{webhook.event}</TableCell>
                                                        <TableCell className="text-center">
                                                            <span className={`
                                                                inline-block px-2 py-1 rounded-none text-xs font-normal
                                                                ${webhook.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}
                                                            `}>
                                                                {webhook.is_active ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
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
        </Layout>
    )
}

function WebhooksWithActivationCheck() {
    return withActivationCheck(WebhooksPage)({});
}

export default WebhooksWithActivationCheck;
