import { Search, RefreshCw } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { link_type, currency_code } from './types'

interface PaymentLinkFiltersProps {
    searchTerm: string
    setSearchTerm: (value: string) => void
    selectedLinkType: link_type | 'all' | null
    setSelectedLinkType: (value: link_type | 'all' | null) => void
    selectedCurrency: currency_code | null
    setSelectedCurrency: (value: currency_code | null) => void
    selectedStatus: 'active' | 'inactive' | 'all' | null
    setSelectedStatus: (value: 'active' | 'inactive' | 'all' | null) => void
    refetch: () => void
    isRefreshing: boolean
}

export function PaymentLinkFilters({
    searchTerm,
    setSearchTerm,
    selectedLinkType,
    setSelectedLinkType,
    selectedCurrency,
    setSelectedCurrency,
    selectedStatus,
    setSelectedStatus,
    refetch,
    isRefreshing,
}: PaymentLinkFiltersProps) {
    return (
        <div className='my-4 flex items-center justify-between sm:my-0'>
            <div className='flex items-center space-x-4'>
                <div className='relative w-64'>
                    <Input
                        placeholder='Search payment links...'
                        className='w-full pl-10 pr-4 py-2 rounded-none'
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                </div>
                <Select value={selectedLinkType || undefined} onValueChange={(value) => setSelectedLinkType(value as link_type | 'all' | null)}>
                    <SelectTrigger className="w-[140px] rounded-none">
                        <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="product">Product</SelectItem>
                        <SelectItem value="plan">Plan</SelectItem>
                        <SelectItem value="instant">Instant</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={selectedCurrency || 'XOF'} onValueChange={(value) => setSelectedCurrency(value as currency_code | null)}>
                    <SelectTrigger className="w-[140px] rounded-none">
                        <SelectValue placeholder="XOF" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="XOF">XOF</SelectItem>
                        <SelectItem value="USD" disabled>USD</SelectItem>
                        <SelectItem value="EUR" disabled>EUR</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={selectedStatus || undefined} onValueChange={(value) => setSelectedStatus(value as 'active' | 'inactive' | 'all' | null)}>
                    <SelectTrigger className="w-[140px] rounded-none">
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
