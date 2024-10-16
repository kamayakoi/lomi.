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
import InfiniteScroll from 'react-infinite-scroll-component'
import { useInfiniteQuery } from 'react-query'
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
import { PlusCircle } from 'lucide-react'

export default function WebhooksPage() {
    const { user } = useUser()
    const [isCreateWebhookOpen, setIsCreateWebhookOpen] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState<webhook_event | null>(null)
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
    const pageSize = 50

    const topNav = [
        { title: 'Webhooks', href: '/portal/webhooks', isActive: true },
        { title: 'Settings', href: '/portal/settings/profile', isActive: false },
    ]

    const { data: webhooksData, isLoading: isWebhooksLoading, fetchNextPage, refetch } = useInfiniteQuery(
        ['webhooks', user?.id || '', selectedEvent, selectedStatus],
        ({ pageParam = 1 }) =>
            fetchWebhooks(
                user?.id || '',
                selectedEvent,
                selectedStatus,
                pageParam,
                pageSize
            ),
        {
            getNextPageParam: (lastPage: Webhook[], allPages: Webhook[][]) => {
                const nextPage = allPages.length + 1
                return lastPage.length !== 0 ? nextPage : undefined
            },
            enabled: !!user?.id,
        }
    )

    const webhooks = webhooksData?.pages?.flatMap((page) => page) || []

    const handleCreateWebhookSuccess = () => {
        refetch()
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

            <Layout.Body>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold tracking-tight">Webhooks</h1>
                        <Dialog open={isCreateWebhookOpen} onOpenChange={setIsCreateWebhookOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Create Webhook
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create Webhook</DialogTitle>
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
                        refetch={refetch}
                    />

                    <div className="rounded-md border mt-4">
                        <div className="max-h-[calc(100vh-210px)] overflow-y-scroll pr-2 scrollbar-hide">
                            <InfiniteScroll
                                dataLength={webhooks.length}
                                next={() => fetchNextPage()}
                                hasMore={webhooksData?.pages[webhooksData.pages.length - 1]?.length === pageSize}
                                loader={<Skeleton className="w-full h-8" />}
                            >
                                {isWebhooksLoading ? (
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <div key={index} className="py-4 px-6 border-b">
                                            <Skeleton className="w-full h-8" />
                                        </div>
                                    ))
                                ) : webhooks.length === 0 ? (
                                    <div className="py-24 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <div className="rounded-full bg-transparent dark:bg-transparent p-4">
                                                <ClipboardDocumentListIcon className="h-40 w-40 text-gray-400 dark:text-gray-500" />
                                            </div>
                                            <p className="text-xl font-semibold text-gray-500 dark:text-gray-400">
                                                No webhooks found
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs text-center">
                                                Try changing your filter or create a new webhook.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    webhooks.map((webhook: Webhook) => (
                                        <div key={webhook.webhook_id} className="py-4 px-6 border-b">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-lg font-semibold">{webhook.url}</p>
                                                    <p className="text-sm text-muted-foreground">{webhook.event}</p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className={`
                                                        inline-block px-2 py-1 rounded-full text-xs font-normal
                                                        ${webhook.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}
                                                    `}>
                                                        {webhook.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                    <Button variant="ghost" size="sm">
                                                        View
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </InfiniteScroll>
                        </div>
                    </div>
                </div>
            </Layout.Body>
        </Layout>
    )
}
