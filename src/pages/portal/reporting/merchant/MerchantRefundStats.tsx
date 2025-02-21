import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchStats, type StatsResponse } from '@/lib/hooks/fetch-stats';
import { formatCurrency } from '@/lib/actions/utils';

interface MerchantRefundStatsProps {
    merchantId: string;
}

type RefundStats = NonNullable<NonNullable<StatsResponse['merchant']>['refunds']['byCurrency']>;

function isRefundStats(stats: unknown): stats is RefundStats {
    return Array.isArray(stats) && stats.length > 0 && 'currencyCode' in stats[0] && 'status' in stats[0] && 'totalRefunds' in stats[0] && 'refundedAmount' in stats[0];
}

export function MerchantRefundStats({ merchantId }: MerchantRefundStatsProps) {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['stats', merchantId],
        queryFn: () => fetchStats(merchantId)
    });

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Refund Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    <Skeleton className="h-40" />
                </CardContent>
            </Card>
        );
    }

    const refundStats = stats?.merchant?.refunds.byCurrency;

    if (!refundStats?.length || !isRefundStats(refundStats)) {
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
    const groupedRefunds = refundStats.reduce<Record<string, Record<string, { totalRefunds: number; refundedAmount: number }>>>((acc, stat) => {
        const currencyData = acc[stat.currencyCode] || {};
        acc[stat.currencyCode] = currencyData;

        currencyData[stat.status] = {
            totalRefunds: stat.totalRefunds,
            refundedAmount: stat.refundedAmount
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
                                                <p className="text-sm font-medium text-muted-foreground">Refunded Amount</p>
                                                <p className="text-2xl font-bold">{formatCurrency(data.refundedAmount, currency)}</p>
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