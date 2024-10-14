import type { ProviderDistribution, provider_code } from './reporting-types'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { COLORS } from './reporting-types'
import { WalletIcon } from '@heroicons/react/24/outline'
import { Skeleton } from '@/components/ui/skeleton'


interface ProviderDistributionProps {
    providerDistribution: ProviderDistribution[]
    isLoading: boolean
}

export default function ProviderDistribution({
    providerDistribution,
    isLoading,
}: ProviderDistributionProps) {
    if (isLoading) {
        return (
            <div className="h-64">
                <Skeleton className="h-full" />
            </div>
        )
    }

    const formatProvider = (provider: provider_code) => {
        switch (provider) {
            case 'ORANGE':
                return 'Orange'
            case 'WAVE':
                return 'Wave'
            case 'ECOBANK':
                return 'Ecobank'
            case 'MTN':
                return 'MTN'
            case 'STRIPE':
                return 'Stripe'
            default:
                return provider
        }
    }

    const getProviderDistributionPercentage = () => {
        const totalTransactions = providerDistribution.reduce(
            (sum, provider) => sum + provider.transaction_count,
            0
        )
        return providerDistribution.map((provider) => ({
            ...provider,
            percentage: ((provider.transaction_count / totalTransactions) * 100).toFixed(2),
        }))
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (providerDistribution.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full pt-12">
                <div className="text-center">
                    <div className="flex justify-center mb-6">
                        <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4">                            <WalletIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 dark:text-white">No provider data yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                        Start processing transactions to see the distribution.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <ResponsiveContainer width="100%" height={400}>
            <PieChart>
                <Pie
                    data={getProviderDistributionPercentage()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="percentage"
                    label={({ provider_code, percentage }) => `${formatProvider(provider_code)} ${percentage}%`}
                >
                    {getProviderDistributionPercentage().map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        background: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                    labelStyle={{ fontWeight: 'bold', color: '#374151' }}
                    formatter={(value) => `${value}%`}
                />
                <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    iconType="circle"
                    iconSize={10}
                    formatter={(value) => formatProvider(value as provider_code)}
                    wrapperStyle={{
                        paddingLeft: '24px',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        color: '#374151',
                    }}
                />
            </PieChart>
        </ResponsiveContainer>
    )
}