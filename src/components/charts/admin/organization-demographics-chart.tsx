import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { fetchStats } from '@/lib/hooks/fetch-stats';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function OrganizationDemographicsChart() {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['stats'],
        queryFn: () => fetchStats()
    });

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Organization Demographics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    <Skeleton className="h-40" />
                </CardContent>
            </Card>
        );
    }

    const { demographics } = stats ?? {
        demographics: {
            organizationsByIndustry: [],
            organizationsByCountry: [],
            organizationsByKycStatus: [],
        },
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Organization Demographics</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="industry" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="industry">By Industry</TabsTrigger>
                        <TabsTrigger value="country">By Country</TabsTrigger>
                        <TabsTrigger value="kyc">KYC Status</TabsTrigger>
                    </TabsList>

                    <TabsContent value="industry" className="space-y-4">
                        {demographics.organizationsByIndustry.map((item) => (
                            <div key={item.industry} className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">{item.industry}</p>
                                    <p className="text-sm text-muted-foreground">{item.status}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="font-bold">{item.count.toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </TabsContent>

                    <TabsContent value="country" className="space-y-4">
                        {demographics.organizationsByCountry.map((item) => (
                            <div key={item.country} className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">{item.country}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="font-bold">{item.count.toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </TabsContent>

                    <TabsContent value="kyc" className="space-y-4">
                        {demographics.organizationsByKycStatus.map((item) => (
                            <div key={item.status} className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none capitalize">{item.status.toLowerCase()}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="font-bold">{item.count.toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
} 