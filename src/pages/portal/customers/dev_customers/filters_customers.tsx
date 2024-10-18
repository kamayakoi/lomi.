import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, RefreshCw } from 'lucide-react'

interface CustomerFiltersProps {
    searchTerm: string
    setSearchTerm: (term: string) => void
    refetch: () => void
    isRefreshing: boolean
}

export const CustomerFilters: React.FC<CustomerFiltersProps> = ({
    searchTerm,
    setSearchTerm,
    refetch,
    isRefreshing,
}) => {
    return (
        <div className='my-4 flex items-center justify-between sm:my-0'>
            <div className='flex items-center space-x-4'>
                <div className='relative w-64'>
                    <Input
                        placeholder='Search customers...'
                        className='w-full pl-10 pr-4 py-2 rounded-none'
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => refetch()}
                    disabled={isRefreshing}
                >
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span className="sr-only">Refresh</span>
                </Button>
            </div>
        </div>
    )
}
