import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchStats } from '@/lib/hooks/fetch-stats';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCompactNumber } from '@/lib/actions/utils';
import { useQuery } from '@tanstack/react-query';

interface CustomerDemographicsChartProps {
    merchantId?: string;
}

export function CustomerDemographicsChart({ merchantId }: CustomerDemographicsChartProps) {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['stats', merchantId],
        queryFn: async ({ queryKey }) => {
            const [merchantId] = queryKey;
            return fetchStats(merchantId);
        }
    });

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Customer Demographics</CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-64" />
                </CardContent>
            </Card>
        );
    }

    const customersByType = stats?.demographics.customersByType ?? [];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Customer Demographics</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {customersByType.map((type, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">
                                    {type.is_business ? 'Business' : 'Individual'} - {type.country}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium">{formatCompactNumber(type.count)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
} 