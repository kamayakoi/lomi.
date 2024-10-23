import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, RefreshCw } from 'lucide-react'

interface SubscriptionFiltersProps {
    selectedStatus?: string | null
    setSelectedStatus?: (status: string | null) => void
    refetch: () => void
    isRefreshing: boolean
}

export const SubscriptionFilters: React.FC<SubscriptionFiltersProps> = ({
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
                        placeholder='Search subscriptions...'
                        className='w-full pl-10 pr-4 py-2 rounded-none'
                        type="search"
                    />
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                </div>
                {setSelectedStatus && (
                    <Select value={selectedStatus || undefined} onValueChange={setSelectedStatus}>
                        <SelectTrigger className="w-[140px] rounded-none">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                )}
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
