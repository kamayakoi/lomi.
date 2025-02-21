import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { fetchStats } from '@/lib/hooks/fetch-stats';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/actions/utils';

export function TransactionStatsChart() {
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
                    <Skeleton className="h-40" />
                </CardContent>
            </Card>
        );
    }

    const { financials } = stats ?? {
        financials: {
            transactionsByProvider: [],
        },
    };

    // Calculate totals
    const totalTransactions = financials.transactionsByProvider.reduce(
        (sum, p) => sum + p.totalTransactions,
        0
    );
    const totalAmount = financials.transactionsByProvider.reduce(
        (sum, p) => sum + p.totalAmount,
        0
    );
    const totalSuccessful = financials.transactionsByProvider.reduce(
        (sum, p) => sum + p.successfulTransactions,
        0
    );
    const overallSuccessRate =
        (totalSuccessful / totalTransactions) * 100;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Transaction Statistics</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-6 grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                        <p className="text-2xl font-bold">{totalTransactions.toLocaleString()}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Total Volume</p>
                        <p className="text-2xl font-bold">{formatCurrency(totalAmount)}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Successful Transactions</p>
                        <p className="text-2xl font-bold">{totalSuccessful.toLocaleString()}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                        <p className="text-2xl font-bold">{overallSuccessRate.toFixed(1)}%</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <p className="font-medium">Provider Breakdown</p>
                    {financials.transactionsByProvider.map((provider) => (
                        <div key={provider.providerCode} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">{provider.providerCode}</p>
                                <p className="text-sm font-medium">{formatCurrency(provider.totalAmount)}</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{provider.totalTransactions.toLocaleString()} transactions</span>
                                <span>•</span>
                                <span>{provider.successRate}% success rate</span>
                            </div>
                            <div className="h-2 rounded-full bg-secondary">
                                <div
                                    className="h-full rounded-full bg-primary"
                                    style={{
                                        width: `${(provider.totalAmount / totalAmount) * 100}%`,
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
} 