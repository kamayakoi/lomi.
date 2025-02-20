import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchStats } from '@/lib/hooks/fetch-stats';
import { formatCompactNumber } from '@/lib/actions/utils';

export function TransactionsChart() {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['stats'],
        queryFn: () => fetchStats()
    });

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Transactions</CardTitle>
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

    const totalTransactions = stats?.transactions.total ?? 0;
    const totalGrossAmount = stats?.transactions.totalGrossAmount ?? 0;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Transactions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {formatCompactNumber(totalTransactions)}
                </div>
                <p className="text-xs text-muted-foreground">
                    Total transactions worth {formatCompactNumber(totalGrossAmount)} across all merchants
                </p>
            </CardContent>
        </Card>
    );
} 