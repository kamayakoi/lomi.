import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCw } from 'lucide-react'
import { webhook_event, webhookCategories } from './types'

interface WebhookFiltersProps {
    selectedEvent: webhook_event | 'all'
    setSelectedEvent: (event: webhook_event | 'all') => void
    selectedStatus: 'active' | 'inactive' | 'all'
    setSelectedStatus: (status: 'active' | 'inactive' | 'all') => void
    refetch: () => void
    isRefreshing: boolean
}

export function WebhookFilters({
    selectedEvent,
    setSelectedEvent,
    selectedStatus,
    setSelectedStatus,
    refetch,
    isRefreshing
}: WebhookFiltersProps) {
    // Flatten all events for the dropdown
    const allEvents = webhookCategories.reduce<Array<{ id: webhook_event; label: string }>>((acc, category) => {
        return [...acc, ...category.events]
    }, []);

    return (
        <div className='my-4 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0'>
            <div className='flex flex-wrap items-center gap-4'>
                <Select value={selectedEvent} onValueChange={(value) => setSelectedEvent(value as webhook_event | 'all')}>
                    <SelectTrigger className="w-full sm:w-[200px] rounded-none">
                        <SelectValue placeholder="Filter by event" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All events</SelectItem>
                        {allEvents.map((event) => (
                            <SelectItem key={event.id} value={event.id}>
                                {event.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as 'active' | 'inactive' | 'all')}>
                    <SelectTrigger className="w-full sm:w-[120px] rounded-none">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>

                <div className="hidden sm:flex items-center space-x-2">
                    <Button
                        variant="outline"
                        onClick={refetch}
                        className="border-border text-card-foreground px-2 h-10 rounded-none"
                        disabled={isRefreshing}
                    >
                        <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                        <span className="sr-only">Refresh</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}
