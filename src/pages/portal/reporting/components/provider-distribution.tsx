import type { ProviderDistribution, provider_code } from './types'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { WalletIcon } from '@heroicons/react/24/outline'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/actions/utils'

const COLORS = {
    ORANGE: '#FF6B00',
    WAVE: '#00A1E0',
    ECOBANK: '#002F6C',
    MTN: '#FFC107',
    NOWPAYMENTS: '#2196F3',
    PAYPAL: '#003087',
    APPLE: '#000000',
    GOOGLE: '#4285F4',
    MOOV: '#00BCD4',
    AIRTEL: '#FF1744',
    MPESA: '#4CAF50',
    WIZALL: '#FF9800',
    OPAY: '#00C853',
    OTHER: '#9E9E9E',
}

interface ProviderDistributionProps {
    providerDistribution: ProviderDistribution[]
    isLoading: boolean
}

interface CustomizedLabelProps {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
}

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
}: CustomizedLabelProps) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return percent > 0.05 ? (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
            className="text-xs font-medium"
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    ) : null
}

export default function ProviderDistribution({
    providerDistribution,
    isLoading,
}: ProviderDistributionProps) {
    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-[400px] w-full rounded-lg" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[...Array(6)].map((_, index) => (
                        <Skeleton key={index} className="h-16 rounded-lg" />
                    ))}
                </div>
            </div>
        )
    }

    const formatProvider = (provider: provider_code) => {
        const formattedNames: Record<provider_code, string> = {
            ORANGE: 'Orange Money',
            WAVE: 'Wave',
            ECOBANK: 'Ecobank',
            MTN: 'MTN Mobile Money',
            NOWPAYMENTS: 'NowPayments',
            PAYPAL: 'PayPal',
            APPLE: 'Apple Pay',
            GOOGLE: 'Google Pay',
            MOOV: 'Moov Money',
            AIRTEL: 'Airtel Money',
            MPESA: 'M-Pesa',
            WIZALL: 'Wizall Money',
            OPAY: 'OPay',
            OTHER: 'Other Methods'
        }
        return formattedNames[provider] || 'Other'
    }

    const getProviderDistributionPercentage = () => {
        const totalTransactions = providerDistribution.reduce(
            (sum, provider) => sum + provider.transaction_count,
            0
        )
        return providerDistribution
            .map((provider) => ({
                ...provider,
                name: formatProvider(provider.provider_code),
                percentage: ((provider.transaction_count / totalTransactions) * 100),
                value: provider.transaction_count
            }))
            .sort((a, b) => b.transaction_count - a.transaction_count)
    }

    if (providerDistribution.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-full pt-12"
            >
                <div className="text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="flex justify-center mb-6"
                    >
                        <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4">
                            <WalletIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                        </div>
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2 dark:text-white">No provider data yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                        Start processing transactions to see the distribution.
                    </p>
                </div>
            </motion.div>
        )
    }

    const data = getProviderDistributionPercentage()

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
            >
                <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                animationBegin={0}
                                animationDuration={1000}
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[entry.provider_code] || COLORS.OTHER}
                                        className="hover:opacity-80 transition-opacity cursor-pointer"
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0]?.payload
                                        return (
                                            <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                                                <p className="text-xs font-medium text-gray-900 dark:text-white">
                                                    {data.name}
                                                </p>
                                                <p className="text-xs text-gray-600 dark:text-gray-300">
                                                    {data.transaction_count.toLocaleString()} transactions
                                                </p>
                                                <p className="text-xs font-medium text-gray-900 dark:text-white">
                                                    {data.percentage.toFixed(1)}% of total
                                                </p>
                                            </div>
                                        )
                                    }
                                    return null
                                }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                content={({ payload }) => (
                                    <div className="grid grid-cols-2 gap-1 mt-2">
                                        {payload && payload.map((entry: any, index) => (
                                            <div
                                                key={`legend-${index}`}
                                                className="flex items-center space-x-1"
                                            >
                                                <div
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: entry.color }}
                                                />
                                                <span className="text-[10px] text-gray-600 dark:text-gray-300 truncate">
                                                    {entry.value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    {data.slice(0, 4).map((provider, index) => (
                        <motion.div
                            key={provider.provider_code}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                        >
                            <Card className={cn(
                                "hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group",
                                "border-l-4",
                            )}
                                style={{ borderLeftColor: COLORS[provider.provider_code] || COLORS.OTHER }}
                            >
                                <CardContent className="p-2">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-medium text-gray-900 dark:text-white truncate">
                                            {provider.name}
                                        </span>
                                        <span className="text-sm font-bold mt-0.5 text-gray-900 dark:text-white">
                                            {provider.percentage.toFixed(1)}%
                                        </span>
                                        <span className="text-[10px] text-gray-500 dark:text-gray-400">
                                            {provider.transaction_count.toLocaleString()} transactions
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
