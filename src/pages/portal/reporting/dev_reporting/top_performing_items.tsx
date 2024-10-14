import { TopPerformingProduct, TopPerformingSubscription } from './reporting-types'

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
        return <div>No top-performing products or subscriptions found.</div>
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