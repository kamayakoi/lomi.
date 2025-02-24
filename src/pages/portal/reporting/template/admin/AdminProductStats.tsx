import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchStats } from '@/lib/hooks/fetch-stats';

export function AdminProductStats() {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['stats'],
        queryFn: () => fetchStats()
    });

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Product Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    <Skeleton className="h-40" />
                </CardContent>
            </Card>
        );
    }

    const productStats = stats?.admin.products;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Product Statistics</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                        <p className="text-2xl font-bold">{productStats?.total.toLocaleString()}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Total Plans</p>
                        <p className="text-2xl font-bold">{productStats?.totalPlans.toLocaleString()}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Active Subscriptions</p>
                        <p className="text-2xl font-bold">{productStats?.activeSubscriptions.toLocaleString()}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Avg Products/Merchant</p>
                        <p className="text-2xl font-bold">{productStats?.avgProductsPerMerchant.toFixed(1)}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 