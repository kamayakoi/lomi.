import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchStats } from '@/lib/hooks/fetch-stats';

interface MerchantProductStatsProps {
    merchantId: string;
}

export function MerchantProductStats({ merchantId }: MerchantProductStatsProps) {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['stats', merchantId],
        queryFn: () => fetchStats(merchantId)
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

    const productStats = stats?.merchant?.products;

    if (!productStats) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Product Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">No product data available</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Product Statistics</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                        <p className="text-2xl font-bold">{productStats.total.toLocaleString()}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Active Products</p>
                        <p className="text-2xl font-bold">{productStats.active.toLocaleString()}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Total Plans</p>
                        <p className="text-2xl font-bold">{productStats.totalPlans.toLocaleString()}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Active Plans</p>
                        <p className="text-2xl font-bold">{productStats.activePlans.toLocaleString()}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 