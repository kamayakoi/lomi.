import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, RefreshCw } from 'lucide-react'

interface ProductFiltersProps {
    selectedStatus: 'active' | 'inactive' | 'all' | null
    setSelectedStatus: (status: 'active' | 'inactive' | 'all' | null) => void
    searchTerm: string
    setSearchTerm: (term: string) => void
    refetch: () => void
    isRefreshing: boolean
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
    selectedStatus,
    setSelectedStatus,
    searchTerm,
    setSearchTerm,
    refetch,
    isRefreshing,
}) => {
    return (
        <div className='w-[calc(100%+2rem)] -ml-4 sm:ml-0 sm:w-full'>
            <div className='flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 p-4 sm:p-0'>
                <div className='relative w-full sm:w-60'>
                    <Input
                        placeholder='Search products...'
                        className='w-full pl-10 pr-4 py-2 rounded-none'
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                </div>
                <div className='flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto'>
                    <Select value={selectedStatus || undefined} onValueChange={(value) => setSelectedStatus(value as 'active' | 'inactive' | 'all' | null)}>
                        <SelectTrigger className="w-full sm:w-[120px] rounded-none">
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
                        className="hidden sm:flex border-border text-card-foreground px-2 h-10 rounded-none"
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
