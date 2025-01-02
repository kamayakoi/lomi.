import { Button } from "@/components/ui/button"

interface ReportingFiltersProps {
    selectedDateRange: string | null
    setSelectedDateRange: (value: string | null) => void
}

export default function ReportingFilters({
    selectedDateRange,
    setSelectedDateRange,
}: ReportingFiltersProps) {
    return (
        <div className="flex justify-end space-x-2 mb-6">
            {['24H', '7D', '1M', '3M', '6M', 'YTD'].map((range) => (
                <Button
                    key={range}
                    variant={selectedDateRange === range ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedDateRange(range)}
                    className="rounded-none"
                >
                    {range}
                </Button>
            ))}
        </div>
    )
}
