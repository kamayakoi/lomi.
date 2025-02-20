import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { fetchStats } from '@/lib/hooks/fetch-stats';
import { Skeleton } from '@/components/ui/skeleton';

export function OrganizationStatsChart() {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['stats'],
        queryFn: () => fetchStats()
    });

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Organization Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    <Skeleton className="h-40" />
                </CardContent>
            </Card>
        );
    }

    const { growth } = stats ?? {
        growth: {
            organizations: {
                total: 0,
                verified: 0,
                totalCustomers: 0,
                totalMerchants: 0,
            },
        },
    };
    const { total, verified, totalCustomers, totalMerchants } = growth.organizations;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Organization Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Total Organizations</p>
                        <p className="text-2xl font-bold">{total.toLocaleString()}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Verified Organizations</p>
                        <p className="text-2xl font-bold">{verified.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                            {((verified / total) * 100).toFixed(1)}% verification rate
                        </p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                        <p className="text-2xl font-bold">{totalCustomers.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                            {(totalCustomers / total).toFixed(1)} avg. per organization
                        </p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Total Merchants</p>
                        <p className="text-2xl font-bold">{totalMerchants.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                            {(totalMerchants / total).toFixed(1)} avg. per organization
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 