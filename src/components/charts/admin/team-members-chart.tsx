import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchStats } from '@/lib/hooks/fetch-stats';
import { formatCompactNumber } from '@/lib/actions/utils';

export function InboxChart() {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['stats'],
        queryFn: () => fetchStats()
    });

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Active Team Members</CardTitle>
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

    const activeTeamMembers = stats?.core.activeTeamMembers ?? 0;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Active Team Members</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {formatCompactNumber(activeTeamMembers)}
                </div>
                <p className="text-xs text-muted-foreground">
                    Total active team members across all merchants
                </p>
            </CardContent>
        </Card>
    );
} 