import { TopPerformingProduct, TopPerformingSubscription } from './reporting-types'
import { CubeIcon } from '@heroicons/react/24/outline'

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
        return <div>Loading...</div>
    }

    if (topPerformingProducts.length === 0 && topPerformingSubscriptions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full pt-12"> {/* Added pt-12 for top padding */}
                <div className="text-center">
                    <div className="flex justify-center mb-6"> {/* Increased margin-bottom */}
                        <div className="rounded-full bg-gray-100 p-4"> {/* Increased padding */}
                            <CubeIcon className="h-12 w-12 text-gray-400" />
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No items yet</h3>
                    <p className="text-gray-500 max-w-xs mx-auto">
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