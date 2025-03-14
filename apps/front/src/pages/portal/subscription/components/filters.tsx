import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'

export type SubscriptionStatus = 'all' | 'active' | 'pending' | 'cancelled';

interface SubscriptionFiltersProps {
    selectedStatus: SubscriptionStatus;
    setSelectedStatus: (status: SubscriptionStatus) => void;
    refetch: () => void;
    isRefreshing: boolean;
    tabsList: React.ReactNode;
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

export function SubscriptionFilters({
    selectedStatus,
    setSelectedStatus,
    tabsList,
    searchTerm,
    onSearchChange,
}: SubscriptionFiltersProps) {
    return (
        <div className='w-[calc(100%+2rem)] -ml-4 sm:ml-0 sm:w-full'>
            <div className='flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 p-4 sm:p-0'>
                <div className="w-full sm:w-auto">
                    {tabsList}
                </div>
                <div className='flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto'>
                    <div className='relative w-full sm:w-60'>
                        <Input
                            placeholder='Search subscriptions...'
                            className='w-full pl-10 pr-4 py-2 rounded-none'
                            type="text"
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                    </div>
                    <Select value={selectedStatus} onValueChange={(value: string) => setSelectedStatus(value as SubscriptionStatus)}>
                        <SelectTrigger className="w-full sm:w-[120px] rounded-none">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="rounded-none">
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
