import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PaymentLinkFiltersProps {
    searchTerm: string
    setSearchTerm: (value: string) => void
    selectedLinkType: string | null
    setSelectedLinkType: (value: string | null) => void
    selectedCurrency: string | null
    setSelectedCurrency: (value: string | null) => void
    selectedStatus: string | null
    setSelectedStatus: (value: string | null) => void
}

export default function PaymentLinkFilters({
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
            <div className="relative w-full sm:w-64">
                <Input
                    type="text"
                    placeholder="Search payment links"
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <Select
                value={selectedLinkType || undefined}
                onValueChange={(value) => setSelectedLinkType(value)}
            >
                <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Link Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="plan">Plan</SelectItem>
                    <SelectItem value="instant">Instant</SelectItem>
                </SelectContent>
            </Select>
            <Select
                value={selectedCurrency || undefined}
                onValueChange={(value) => setSelectedCurrency(value)}
            >
                <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Currencies</SelectItem>
                    <SelectItem value="XOF">XOF</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
            </Select>
            <Select
                value={selectedStatus || undefined}
                onValueChange={(value) => setSelectedStatus(value)}
            >
                <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}
