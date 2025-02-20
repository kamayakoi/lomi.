import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchStats } from '@/lib/hooks/fetch-stats';

interface MerchantCustomerStatsProps {
    merchantId: string;
}

export function MerchantCustomerStats({ merchantId }: MerchantCustomerStatsProps) {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['stats', merchantId],
        queryFn: () => fetchStats(merchantId)
    });

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Customer Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    <Skeleton className="h-40" />
                </CardContent>
            </Card>
        );
    }

    const customerStats = stats?.merchant?.customers;

    if (!customerStats) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Customer Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">No customer data available</p>
                </CardContent>
            </Card>
        );
    }

    const businessPercentage = (customerStats.business / customerStats.total) * 100;
    const individualPercentage = (customerStats.individual / customerStats.total) * 100;
    const transactingPercentage = (customerStats.withTransactions / customerStats.total) * 100;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Customer Statistics</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                        <p className="text-2xl font-bold">{customerStats.total.toLocaleString()}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Business Customers</p>
                            <p className="text-2xl font-bold">{customerStats.business.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">{businessPercentage.toFixed(1)}% of total</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Individual Customers</p>
                            <p className="text-2xl font-bold">{customerStats.individual.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">{individualPercentage.toFixed(1)}% of total</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Customers with Transactions</p>
                        <p className="text-2xl font-bold">{customerStats.withTransactions.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{transactingPercentage.toFixed(1)}% of total</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 