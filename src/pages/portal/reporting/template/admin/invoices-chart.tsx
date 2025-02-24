import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchStats } from '@/lib/hooks/fetch-stats';
import { formatCompactNumber } from '@/lib/actions/utils';

export function InvoicesChart() {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['stats'],
        queryFn: () => fetchStats()
    });

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Invoices</CardTitle>
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

    const totalInvoices = stats?.invoices.total ?? 0;
    const pendingInvoices = stats?.invoices.pending ?? 0;
    const pendingAmount = stats?.invoices.byStatus
        .filter(s => ['sent', 'overdue'].includes(s.status))
        .reduce((sum, s) => sum + s.amount, 0) ?? 0;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Invoices</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {formatCompactNumber(pendingInvoices)}
                </div>
                <p className="text-xs text-muted-foreground">
                    Pending invoices worth {formatCompactNumber(pendingAmount)} out of {formatCompactNumber(totalInvoices)} total invoices
                </p>
            </CardContent>
        </Card>
    );
} 