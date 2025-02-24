import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchStats } from '@/lib/hooks/fetch-stats';
import { formatCompactNumber } from '@/lib/actions/utils';

export function SubscriptionsChart() {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['stats'],
        queryFn: () => fetchStats()
    });

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Subscriptions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        <Skeleton className="h-8 w-24" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                        <Skeleton className="h-4 w-48" />
                    </p>
                </CardContent>
            </Card>
        );
    }

    const activeSubscriptions = stats?.subscriptions.active ?? 0;
    const totalSubscriptions = stats?.subscriptions.total ?? 0;
    const recurringRevenue = stats?.subscriptions.recurringRevenue ?? 0;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {formatCompactNumber(activeSubscriptions)}
                </div>
                <p className="text-xs text-muted-foreground">
                    Active subscriptions out of {formatCompactNumber(totalSubscriptions)} total with {formatCompactNumber(recurringRevenue)} recurring revenue
                </p>
            </CardContent>
        </Card>
    );
} 