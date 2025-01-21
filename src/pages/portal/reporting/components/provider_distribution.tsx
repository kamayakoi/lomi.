import type { ProviderDistribution, provider_code } from './types'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { WalletIcon } from '@heroicons/react/24/outline'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

const COLORS = {
    ORANGE: '#FC6307',
    WAVE: '#71CDF4',
    ECOBANK: '#074367',
    MTN: '#F7CE46',
    NOWPAYMENTS: '#037BFE',
    PAYPAL: '#000000',
    APPLE: '#000000',
    GOOGLE: '#4285F4',
    MOOV: '#0093DD',
    AIRTEL: '#FF0000',
    MPESA: '#4CAF50',
    WIZALL: '#FF6B00',
    OPAY: '#14B55A',
    OTHER: '#E5E7EB',
}

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
            <div className="space-y-4">
                {[...Array(5)].map((_, index) => (
                    <Card key={index}>
                        <CardContent className="flex justify-between items-center p-3">
                            <div className="w-1/2">
                                <Skeleton className="h-4 w-3/4 mb-2" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                            <Skeleton className="h-4 w-1/4" />
                        </CardContent>
                    </Card>
                ))}
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
            case 'NOWPAYMENTS':
                return 'Nowpayments'
            case 'PAYPAL':
                return 'Paypal'
            case 'APPLE':
                return 'Apple'
            case 'GOOGLE':
                return 'Google'
            case 'MOOV':
                return 'Moov'
            case 'AIRTEL':
                return 'Airtel'
            case 'MPESA':
                return 'M-Pesa'
            case 'WIZALL':
                return 'Wizall'
            case 'OPAY':
                return 'OPay'
            default:
                return 'Other'
        }
    }

    const getProviderDistributionPercentage = () => {
        const totalTransactions = providerDistribution.reduce(
            (sum, provider) => sum + provider.transaction_count,
            0
        )
        return providerDistribution.map((provider) => ({
            ...provider,
            name: formatProvider(provider.provider_code),
            percentage: ((provider.transaction_count / totalTransactions) * 100).toFixed(2),
        }))
    }

    if (providerDistribution.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full pt-12">
                <div className="text-center">
                    <div className="flex justify-center mb-6">
                        <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4">
                            <WalletIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
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

    const data = getProviderDistributionPercentage()

    return (
        <div className="space-y-0">
            <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="transaction_count"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.provider_code] || COLORS.OTHER} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                        }}
                        labelStyle={{ color: 'black' }}
                        formatter={(_, __, { payload }) => [
                            `${payload.transaction_count} transactions`,
                            formatProvider(payload.provider_code as provider_code)
                        ]}
                    />
                </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-2">
                {data.map((provider, index) => (
                    <Card key={index} className="hover:bg-gray-50 dark:hover:bg-[#0c0d10] transition-colors">
                        <CardContent className="flex items-center justify-between p-3">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[provider.provider_code] || COLORS.OTHER }}></div>
                                <p className="text-sm font-semibold dark:text-white">{formatProvider(provider.provider_code)}</p>
                            </div>
                            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {provider.percentage}%
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
