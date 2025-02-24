import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchStats } from '@/lib/hooks/fetch-stats';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCompactNumber } from '@/lib/actions/utils';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/actions/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { UsersIcon } from '@heroicons/react/24/outline';

interface CustomerDemographicsChartProps {
    merchantId?: string;
}

export function CustomerDemographicsChart({ merchantId }: CustomerDemographicsChartProps) {
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
                    <CardTitle>Customer Demographics</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Skeleton className="h-[300px] w-full" />
                        <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-20" />
                            <Skeleton className="h-20" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const customersByType = stats?.demographics.customersByType ?? [];

    if (customersByType.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Customer Demographics</CardTitle>
                </CardHeader>
                <CardContent>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-12"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20
                            }}
                            className="rounded-full bg-gray-100 dark:bg-gray-800 p-4 mb-4"
                        >
                            <UsersIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                        </motion.div>
                        <h3 className="text-xl font-semibold mb-2 dark:text-white">No customer data yet</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-center max-w-xs">
                            Start processing transactions to see customer demographics.
                        </p>
                    </motion.div>
                </CardContent>
            </Card>
        );
    }

    const chartData = customersByType.map(type => ({
        name: `${type.is_business ? 'Business' : 'Individual'} - ${type.country}`,
        value: type.count
    }));

    const totalCustomers = customersByType.reduce((sum, type) => sum + type.count, 0);
    const businessCustomers = customersByType.filter(type => type.is_business).reduce((sum, type) => sum + type.count, 0);
    const individualCustomers = totalCustomers - businessCustomers;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Customer Demographics</CardTitle>
            </CardHeader>
            <CardContent>
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className={cn(
                                "bg-gradient-to-br from-blue-50 to-blue-100",
                                "dark:from-blue-900/20 dark:to-blue-800/20"
                            )}>
                                <CardContent className="p-6">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                            Business Customers
                                        </span>
                                        <span className="text-2xl font-bold text-blue-900 dark:text-blue-50">
                                            {formatCompactNumber(businessCustomers)}
                                        </span>
                                        <span className="text-sm text-blue-600 dark:text-blue-400">
                                            {((businessCustomers / totalCustomers) * 100).toFixed(1)}% of total
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className={cn(
                                "bg-gradient-to-br from-green-50 to-green-100",
                                "dark:from-green-900/20 dark:to-green-800/20"
                            )}>
                                <CardContent className="p-6">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                            Individual Customers
                                        </span>
                                        <span className="text-2xl font-bold text-green-900 dark:text-green-50">
                                            {formatCompactNumber(individualCustomers)}
                                        </span>
                                        <span className="text-sm text-green-600 dark:text-green-400">
                                            {((individualCustomers / totalCustomers) * 100).toFixed(1)}% of total
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis
                                        type="category"
                                        dataKey="name"
                                        width={150}
                                        tick={{ fontSize: 12 }}
                                    />
                                    <Tooltip
                                        content={({ active, payload }) => {
                                            if (active && payload?.[0]?.payload) {
                                                const data = payload[0].payload;
                                                return (
                                                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                                                        <p className="font-medium text-gray-900 dark:text-white">
                                                            {data.name}
                                                        </p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                                            {formatCompactNumber(Number(data.value))} customers
                                                        </p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Bar
                                        dataKey="value"
                                        fill="#3b82f6"
                                        radius={[4, 4, 4, 4]}
                                        animationBegin={0}
                                        animationDuration={800}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </CardContent>
        </Card>
    );
} 