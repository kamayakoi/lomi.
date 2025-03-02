import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { fetchStats } from '@/lib/hooks/fetch-stats';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/actions/utils';

export function MerchantGrowthChart() {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['stats'],
        queryFn: () => fetchStats()
    });

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Merchant Growth</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    <Skeleton className="h-40" />
                </CardContent>
            </Card>
        );
    }

    const { growth } = stats ?? { growth: { merchants: { total: 0, onboarded: 0, mrr: 0, arr: 0 } } };
    const { total, onboarded, mrr, arr } = growth.merchants;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Merchant Growth</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Total Merchants</p>
                        <p className="text-2xl font-bold">{total.toLocaleString()}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Onboarded</p>
                        <p className="text-2xl font-bold">{onboarded.toLocaleString()}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Monthly Recurring Revenue</p>
                        <p className="text-2xl font-bold">{formatCurrency(mrr)}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Annual Recurring Revenue</p>
                        <p className="text-2xl font-bold">{formatCurrency(arr)}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 