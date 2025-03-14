import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
    isRefreshing: boolean
    onRefresh: () => Promise<void>
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
}: PaymentLinkFiltersProps) {
    return (
        <div className='w-[calc(100%+2rem)] -ml-4 sm:ml-0 sm:w-full'>
            <div className='flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 p-4 sm:p-0'>
                <div className='relative w-full sm:w-60'>
                    <Input
                        placeholder='Search payment links...'
                        className='w-full pl-10 pr-4 py-2 rounded-none'
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                </div>
                <div className='flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto'>
                    <Select value={selectedLinkType || undefined} onValueChange={(value) => setSelectedLinkType(value as link_type | 'all' | null)}>
                        <SelectTrigger className="w-full sm:w-[120px] rounded-none">
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="product">Product</SelectItem>
                            <SelectItem value="plan">Plan</SelectItem>
                            <SelectItem value="instant">Instant</SelectItem>
                        </SelectContent>
                    </Select>
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
                    <Select value={selectedCurrency || 'XOF'} onValueChange={(value) => setSelectedCurrency(value as currency_code | null)}>
                        <SelectTrigger className="w-full sm:w-[90px] rounded-none">
                            <SelectValue placeholder="XOF" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="XOF">XOF</SelectItem>
                            <SelectItem value="USD" disabled>USD</SelectItem>
                            <SelectItem value="EUR" disabled>EUR</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}
