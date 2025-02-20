import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchStats } from '@/lib/hooks/fetch-stats';
import { formatCurrency } from '@/lib/actions/utils';

export function AdminTransactionStats() {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['stats'],
        queryFn: () => fetchStats()
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

    const transactionStats = stats?.admin.transactions.byCurrency;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Transaction Statistics</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {transactionStats?.map((stat) => (
                        <div key={stat.currencyCode} className="space-y-4">
                            <h3 className="text-lg font-semibold">{stat.currencyCode}</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                                    <p className="text-2xl font-bold">{stat.totalTransactions.toLocaleString()}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Gross Amount</p>
                                    <p className="text-2xl font-bold">{formatCurrency(stat.totalGrossAmount, stat.currencyCode)}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Fee Amount</p>
                                    <p className="text-2xl font-bold">{formatCurrency(stat.totalFeeAmount, stat.currencyCode)}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Net Amount</p>
                                    <p className="text-2xl font-bold">{formatCurrency(stat.totalNetAmount, stat.currencyCode)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
} 