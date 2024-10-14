import { useState } from 'react'
import { TopPerformingProduct, TopPerformingSubscription } from './reporting-types'
import { CubeIcon } from '@heroicons/react/24/outline'
import { Skeleton } from '@/components/ui/skeleton'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

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
    const [showSubscriptions, setShowSubscriptions] = useState(false)

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
        <div>
            <Button
                variant="ghost"
                className="text-lg font-semibold mb-4 hover:bg-transparent"
                onClick={() => setShowSubscriptions(!showSubscriptions)}
            >
                {showSubscriptions ? 'Subscriptions' : 'Products'}
            </Button>
            <AnimatePresence mode="wait">
                {!showSubscriptions ? (
                    <ProductList products={topPerformingProducts} />
                ) : (
                    <SubscriptionList subscriptions={topPerformingSubscriptions} />
                )}
            </AnimatePresence>
        </div>
    )
}

function ProductList({ products }: { products: TopPerformingProduct[] }) {
    return (
        <motion.div
            key="products"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
        >
            {products.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400">
                    No products sold yet.
                </div>
            ) : (
                <div className="space-y-4">
                    {products.map((product, index) => (
                        <Card key={index} className="hover:bg-gray-50 dark:hover:bg-[#0c0d10] transition-colors">
                            <CardContent className="flex justify-between items-center p-3">
                                <div>
                                    <p className="font-semibold dark:text-white">{product.product_name}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{product.sales_count} sales</p>
                                </div>
                                <div className="ml-2 flex min-w-[100px] max-w-[120px] items-center justify-center rounded-lg bg-green-100 px-2 py-1 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                                    {formatAmount(product.total_revenue)} XOF
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </motion.div>
    )
}

function SubscriptionList({ subscriptions }: { subscriptions: TopPerformingSubscription[] }) {
    return (
        <motion.div
            key="subscriptions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
        >
            {subscriptions.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400">
                    No subscriptions sold yet.
                </div>
            ) : (
                <div className="space-y-4">
                    {subscriptions.map((subscription, index) => (
                        <Card key={index} className="hover:bg-gray-50 dark:hover:bg-[#0c0d10] transition-colors">
                            <CardContent className="flex justify-between items-center p-3">
                                <div>
                                    <p className="font-semibold dark:text-white">{subscription.subscription_name}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{subscription.sales_count} sales</p>
                                </div>
                                <div className="ml-2 flex min-w-[100px] max-w-[120px] items-center justify-center rounded-lg bg-green-100 px-2 py-1 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                                    {formatAmount(subscription.total_revenue)} XOF
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </motion.div>
    )
}

function formatAmount(amount: number): string {
    return amount.toLocaleString('en-US', { minimumFractionDigits: 0 })
}
