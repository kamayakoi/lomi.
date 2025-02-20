import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchStats } from '@/lib/hooks/fetch-stats';

export function AdminApiUsageStats() {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['stats'],
        queryFn: () => fetchStats()
    });

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>API Usage Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    <Skeleton className="h-40" />
                </CardContent>
            </Card>
        );
    }

    const apiUsageStats = stats?.admin.apiUsage;

    if (!apiUsageStats) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>API Usage Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">No API usage data available</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>API Usage Statistics</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Total Active Users</p>
                        <p className="text-2xl font-bold">{apiUsageStats.totalActiveUsers.toLocaleString()}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Last 24 Hours</p>
                        <p className="text-2xl font-bold">{apiUsageStats.last24hUsers.toLocaleString()}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Last 7 Days</p>
                        <p className="text-2xl font-bold">{apiUsageStats.last7dUsers.toLocaleString()}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Last 30 Days</p>
                        <p className="text-2xl font-bold">{apiUsageStats.last30dUsers.toLocaleString()}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 