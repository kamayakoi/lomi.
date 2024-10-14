import type { ProviderDistribution, provider_code } from './reporting-types'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { COLORS } from './reporting-types'

interface ProviderDistributionProps {
    providerDistribution: ProviderDistribution[]
    isLoading: boolean
}

export default function ProviderDistribution({
    providerDistribution,
    isLoading,
}: ProviderDistributionProps) {
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