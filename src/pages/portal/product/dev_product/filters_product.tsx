import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, RefreshCw } from 'lucide-react'

interface ProductFiltersProps {
    selectedStatus: 'active' | 'inactive' | 'all' | null
    setSelectedStatus: (status: 'active' | 'inactive' | 'all' | null) => void
    refetch: () => void
    isRefreshing: boolean
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
    selectedStatus,
    setSelectedStatus,
    refetch,
    isRefreshing,
}) => {
    return (
        <div className='my-4 flex items-center justify-between sm:my-0'>
            <div className='flex items-center space-x-4'>
                <div className='relative w-60'>
                    <Input
                        placeholder='Search products...'
                        className='w-full pl-10 pr-4 py-2 rounded-none'
                        type="search"
                    />
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                </div>
                <Select value={selectedStatus || undefined} onValueChange={(value) => setSelectedStatus(value as 'active' | 'inactive' | 'all' | null)}>
                    <SelectTrigger className="w-[120px] rounded-none">
                        <SelectValue placeholder="Status" />
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
