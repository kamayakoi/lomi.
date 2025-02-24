import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchStats, type StatsResponse } from '@/lib/hooks/fetch-stats';
import { formatCurrency } from '@/lib/actions/utils';

type BankingStats = NonNullable<StatsResponse['admin']['banking']>;
type PayoutsByStatus = BankingStats['byStatus'][number];

export function AdminBankingStats() {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['stats'],
        queryFn: () => fetchStats()
    });

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Banking Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    <Skeleton className="h-64" />
                </CardContent>
            </Card>
        );
    }

    const bankingStats = stats?.admin.banking;

    if (!bankingStats?.byStatus.length) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Banking Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">No banking data available</p>
                </CardContent>
            </Card>
        );
    }

    const stats_: BankingStats = bankingStats;

    // Group payouts by currency
    const payoutsByCurrency = stats_.byStatus.reduce<Record<string, { totalPayouts: number; totalAmount: number; byStatus: Record<string, { totalPayouts: number; totalAmount: number }> }>>((acc, stat: PayoutsByStatus) => {
        const currencyData = acc[stat.currencyCode] || {
            totalPayouts: 0,
            totalAmount: 0,
            byStatus: {}
        };
        acc[stat.currencyCode] = currencyData;

        currencyData.totalPayouts += stat.totalPayouts;
        currencyData.totalAmount += stat.totalAmount;

        currencyData.byStatus[stat.status] = {
            totalPayouts: stat.totalPayouts,
            totalAmount: stat.totalAmount
        };

        return acc;
    }, {});

    return (
        <Card>
            <CardHeader>
                <CardTitle>Banking Statistics</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-6">
                    <p className="text-sm font-medium text-muted-foreground">Total Bank Accounts</p>
                    <p className="text-2xl font-bold">{stats_.totalBankAccounts.toLocaleString()}</p>
                </div>
                <div className="space-y-6">
                    {Object.entries(payoutsByCurrency).map(([currency, data]) => (
                        <div key={currency} className="space-y-4">
                            <h3 className="text-lg font-semibold">{currency}</h3>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Total Payouts</p>
                                    <p className="text-2xl font-bold">{data.totalPayouts.toLocaleString()}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                                    <p className="text-2xl font-bold">{formatCurrency(data.totalAmount, currency)}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {Object.entries(data.byStatus).map(([status, statusData]) => (
                                    <div key={status} className="rounded-lg border p-4">
                                        <h4 className="mb-4 font-medium capitalize">{status}</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium text-muted-foreground">Payouts</p>
                                                <p className="text-xl font-bold">{statusData.totalPayouts.toLocaleString()}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium text-muted-foreground">Amount</p>
                                                <p className="text-xl font-bold">{formatCurrency(statusData.totalAmount, currency)}</p>
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