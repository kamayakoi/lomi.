import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCw, Search } from 'lucide-react'
import { webhook_event, webhookCategories } from './types'
import { Input } from "@/components/ui/input"

interface WebhookFiltersProps {
    selectedEvent: webhook_event | 'all'
    setSelectedEvent: (event: webhook_event | 'all') => void
    selectedStatus: 'active' | 'inactive' | 'all'
    setSelectedStatus: (status: 'active' | 'inactive' | 'all') => void
    refetch: () => void
    isRefreshing: boolean
    searchTerm: string
    setSearchTerm: (term: string) => void
}

export function WebhookFilters({
    selectedEvent,
    setSelectedEvent,
    selectedStatus,
    setSelectedStatus,
    refetch,
    isRefreshing,
    searchTerm,
    setSearchTerm
}: WebhookFiltersProps) {
    // Flatten all events for the dropdown
    const allEvents = webhookCategories.reduce<Array<{ id: webhook_event; label: string }>>((acc, category) => {
        return [...acc, ...category.events]
    }, []);

    return (
        <div className='my-4 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0'>
            <div className='flex flex-wrap items-center gap-4'>
                <div className='relative w-full sm:w-60'>
                    <Input
                        placeholder='Search webhooks...'
                        className='w-full pl-10 pr-4 py-2 rounded-none'
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                </div>

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
            </div>

            <div className="flex flex-row">
                <Button
                    variant="outline"
                    onClick={refetch}
                    className="border-border bg-background text-card-foreground flex-1 md:flex-none px-3.5 h-10 rounded-none"
                    disabled={isRefreshing}
                >
                    <RefreshCw className={`h-5 w-5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>
        </div>
    )
}
