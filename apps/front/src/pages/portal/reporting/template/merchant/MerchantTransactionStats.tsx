import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchStats, type StatsResponse } from '@/lib/hooks/fetch-stats';
import { formatCurrency } from '@/lib/actions/utils';

interface MerchantTransactionStatsProps {
    merchantId: string;
}

type TransactionStats = NonNullable<NonNullable<StatsResponse['merchant']>['transactions']['byCurrency']>;

function isTransactionStats(stats: unknown): stats is TransactionStats {
    return Array.isArray(stats) && stats.length > 0 && 'currencyCode' in stats[0] && 'status' in stats[0] && 'totalTransactions' in stats[0];
}

export function MerchantTransactionStats({ merchantId }: MerchantTransactionStatsProps) {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['stats', merchantId],
        queryFn: async ({ queryKey }) => {
            const [merchantId] = queryKey;
            return fetchStats(merchantId);
        }
    });

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Transaction Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    <Skeleton className="h-64" />
                </CardContent>
            </Card>
        );
    }

    const maybeTransactionStats = stats?.merchant?.transactions.byCurrency;

    if (!maybeTransactionStats?.length || !isTransactionStats(maybeTransactionStats)) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Transaction Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">No transaction data available</p>
                </CardContent>
            </Card>
        );
    }

    const transactionStats = maybeTransactionStats;

    // Group transactions by currency and status
    const groupedTransactions = transactionStats.reduce<Record<string, Record<string, { totalTransactions: number; totalAmount: number; totalFees: number; netAmount: number }>>>((acc, stat) => {
        // Initialize the currency object if it doesn't exist
        const currencyCode = stat.currencyCode;
        const status = stat.status;

        if (!currencyCode || !status) {
            return acc;
        }

        if (!acc[currencyCode]) {
            acc[currencyCode] = {};
        }

        // Now we know both currencyCode and status exist and acc[currencyCode] exists
        acc[currencyCode][status] = {
            totalTransactions: stat.totalTransactions,
            totalAmount: stat.totalAmount,
            totalFees: stat.totalFees,
            netAmount: stat.netAmount
        };

        return acc;
    }, {});

    return (
        <Card>
            <CardHeader>
                <CardTitle>Transaction Statistics</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {Object.entries(groupedTransactions).map(([currency, statusData]) => (
                        <div key={currency} className="space-y-4">
                            <h3 className="text-lg font-semibold">{currency}</h3>
                            <div className="grid grid-cols-1 gap-4">
                                {Object.entries(statusData).map(([status, data]) => (
                                    <div key={status} className="rounded-lg border p-4">
                                        <h4 className="mb-4 font-medium capitalize">{status}</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                                                <p className="text-2xl font-bold">{data.totalTransactions.toLocaleString()}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                                                <p className="text-2xl font-bold">{formatCurrency(data.totalAmount, currency)}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium text-muted-foreground">Total Fees</p>
                                                <p className="text-2xl font-bold">{formatCurrency(data.totalFees, currency)}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium text-muted-foreground">Net Amount</p>
                                                <p className="text-2xl font-bold">{formatCurrency(data.netAmount, currency)}</p>
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