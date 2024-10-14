import { TopPerformingProduct, TopPerformingSubscription } from './reporting-types'
import { CubeIcon } from '@heroicons/react/24/outline'
import { Skeleton } from '@/components/ui/skeleton'

interface TopPerformingItemsProps {
    topPerformingProducts: TopPerformingProduct[]
    topPerformingSubscriptions: TopPerformingSubscription[]
    isLoading: boolean
}

export default function TopPerformingItems({
    topPerformingProducts,
    topPerformingSubscriptions,
    isLoading,
}: TopPerformingItemsProps) {
    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(5)].map((_, index) => (
                    <div key={index} className="flex justify-between items-center p-3">
                        <div className="w-1/2">
                            <Skeleton className="h-4 mb-2" />
                            <Skeleton className="h-3" />
                        </div>
                        <div className="w-1/4">
                            <Skeleton className="h-4" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (topPerformingProducts.length === 0 && topPerformingSubscriptions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full pt-12">
                <div className="text-center">
                    <div className="flex justify-center mb-6">
                        <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4">
                            <CubeIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 dark:text-white">No items yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                        You haven&apos;t started selling any products or subscriptions yet. They&apos;ll appear here once you do.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {topPerformingProducts.map((product, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <div>
                        <p className="font-semibold">{product.product_name}</p>
                        <p className="text-sm text-gray-600">Product • {product.sales_count} sales</p>
                    </div>
                    <p className="font-bold text-green-600">{product.total_revenue} XOF</p>
                </div>
            ))}
            {topPerformingSubscriptions.map((subscription, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <div>
                        <p className="font-semibold">{subscription.subscription_name}</p>
                        <p className="text-sm text-gray-600">Subscription • {subscription.sales_count} sales</p>
                    </div>
                    <p className="font-bold text-green-600">{subscription.total_revenue} XOF</p>
                </div>
            ))}
        </div>
    )
}