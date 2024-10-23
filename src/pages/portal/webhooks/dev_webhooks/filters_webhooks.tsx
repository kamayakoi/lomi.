import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, RefreshCw } from 'lucide-react'
import { webhook_event } from './types'

interface WebhookFiltersProps {
    selectedEvent: webhook_event | 'all'
    setSelectedEvent: (event: webhook_event | 'all') => void
    selectedStatus: 'active' | 'inactive' | 'all'
    setSelectedStatus: (status: 'active' | 'inactive' | 'all') => void
    refetch: () => void
    isRefreshing: boolean
}

export const WebhookFilters: React.FC<WebhookFiltersProps> = ({
    selectedEvent,
    setSelectedEvent,
    selectedStatus,
    setSelectedStatus,
    refetch,
    isRefreshing,
}) => {
    return (
        <div className='my-4 flex items-center justify-between sm:my-0'>
            <div className='flex items-center space-x-4'>
                <div className='relative w-64'>
                    <Input
                        placeholder='Search webhooks...'
                        className='w-full pl-10 pr-4 py-2 rounded-none'
                        type="search"
                    />
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                </div>
                <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                    <SelectTrigger className="w-[140px] rounded-none">
                        <SelectValue placeholder="All Events" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Events</SelectItem>
                        <SelectItem value="new_payment">New Payment</SelectItem>
                        <SelectItem value="new_subscription">New Subscription</SelectItem>
                        <SelectItem value="payment_status_change">Payment Status Change</SelectItem>
                        <SelectItem value="subscription_status_change">Subscription Status Change</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-[140px] rounded-none">
                        <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>
                <Button
                    variant="outline"
                    onClick={() => refetch()}
                    className="border-border text-card-foreground px-2 h-10 rounded-none"
                    disabled={isRefreshing}
                >
                    <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span className="sr-only">Refresh</span>
                </Button>
            </div>
        </div>
    )
}
