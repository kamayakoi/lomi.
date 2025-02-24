import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchStats } from '@/lib/hooks/fetch-stats';
import { formatCompactNumber } from '@/lib/actions/utils'

export function ProductsChart() {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['stats'],
        queryFn: () => fetchStats()
    });

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Products</CardTitle>
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

    const activeProducts = stats?.products.active ?? 0;
    const totalProducts = stats?.products.total ?? 0;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Products</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {formatCompactNumber(activeProducts)}
                </div>
                <p className="text-xs text-muted-foreground">
                    Active products out of {formatCompactNumber(totalProducts)} total products
                </p>
            </CardContent>
        </Card>
    );
} 