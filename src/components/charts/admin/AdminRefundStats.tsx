import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchStats } from '@/lib/hooks/fetch-stats';
import { formatCurrency } from '@/lib/actions/utils';

export function AdminRefundStats() {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['stats'],
        queryFn: () => fetchStats()
    });

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Refund Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    <Skeleton className="h-64" />
                </CardContent>
            </Card>
        );
    }

    const refundStats = stats?.admin.refunds.byCurrency;

    if (!refundStats?.length) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Refund Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">No refund data available</p>
                </CardContent>
            </Card>
        );
    }


    // Group refunds by currency and status
    const groupedRefunds = refundStats.reduce<Record<string, Record<string, { totalRefunds: number; totalRefundedAmount: number }>>>((acc, stat) => {
        const currencyData = acc[stat.currencyCode] || {};
        acc[stat.currencyCode] = currencyData;

        currencyData[stat.status] = {
            totalRefunds: stat.totalRefunds,
            totalRefundedAmount: stat.totalRefundedAmount
        };
        return acc;
    }, {});

    return (
        <Card>
            <CardHeader>
                <CardTitle>Refund Statistics</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {Object.entries(groupedRefunds).map(([currency, statusData]) => (
                        <div key={currency} className="space-y-4">
                            <h3 className="text-lg font-semibold">{currency}</h3>
                            <div className="grid grid-cols-1 gap-4">
                                {Object.entries(statusData).map(([status, data]) => (
                                    <div key={status} className="rounded-lg border p-4">
                                        <h4 className="mb-4 font-medium capitalize">{status}</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium text-muted-foreground">Total Refunds</p>
                                                <p className="text-2xl font-bold">{data.totalRefunds.toLocaleString()}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                                                <p className="text-2xl font-bold">{formatCurrency(data.totalRefundedAmount, currency)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
} 