import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { fetchStats } from '@/lib/hooks/fetch-stats';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/actions/utils';

export function MerchantBalanceChart() {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['stats'],
        queryFn: () => fetchStats()
    });

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Merchant Balances</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    <Skeleton className="h-40" />
                </CardContent>
            </Card>
        );
    }

    const { financials } = stats ?? {
        financials: {
            merchantBalances: [],
        },
    };

    // Calculate totals across all currencies
    const totalBalance = financials.merchantBalances.reduce(
        (sum, b) => sum + b.totalBalance,
        0
    );
    const totalMerchants = financials.merchantBalances.reduce(
        (sum, b) => sum + b.merchantCount,
        0
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>Merchant Balances</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-6 grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Total Balance</p>
                        <p className="text-2xl font-bold">{formatCurrency(totalBalance)}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Total Merchants</p>
                        <p className="text-2xl font-bold">{totalMerchants.toLocaleString()}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <p className="font-medium">Balance by Currency</p>
                    {financials.merchantBalances.map((balance) => (
                        <div key={balance.currencyCode} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">{balance.currencyCode}</p>
                                <p className="text-sm font-medium">
                                    {formatCurrency(balance.totalBalance, balance.currencyCode)}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{balance.merchantCount.toLocaleString()} merchants</span>
                                <span>•</span>
                                <span>
                                    Avg. {formatCurrency(balance.averageBalance, balance.currencyCode)}
                                </span>
                            </div>
                            <div className="h-2 rounded-full bg-secondary">
                                <div
                                    className="h-full rounded-full bg-primary"
                                    style={{
                                        width: `${(balance.totalBalance / totalBalance) * 100}%`,
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