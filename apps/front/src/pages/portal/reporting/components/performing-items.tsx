import { useState } from 'react'
import { TopPerformingProduct, TopPerformingSubscriptionPlan } from './types'
import { CubeIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline'
import { Skeleton } from '@/components/ui/skeleton'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/actions/utils'

interface TopPerformingItemsProps {
    topPerformingProducts: TopPerformingProduct[]
    topPerformingSubscriptionPlans: TopPerformingSubscriptionPlan[]
    isLoading: boolean
}

const MotionCard = motion.create(Card)

export default function TopPerformingItems({
    topPerformingProducts,
    topPerformingSubscriptionPlans,
    isLoading,
}: TopPerformingItemsProps) {
    const [showSubscriptions, setShowSubscriptions] = useState(false)

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center mb-6">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-8 w-24" />
                </div>
                {[...Array(4)].map((_, index) => (
                    <Skeleton
                        key={index}
                        className={cn(
                            "h-24 w-full rounded-lg",
                            "animate-pulse",
                            `delay-[${index * 150}ms]`
                        )}
                    />
                ))}
            </div>
        )
    }

    if (topPerformingProducts.length === 0 && topPerformingSubscriptionPlans.length === 0) {
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
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20
                        }}
                        className="flex justify-center mb-6"
                    >
                        <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4">
                            <CubeIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                        </div>
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2 dark:text-white">No items yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                        You haven&apos;t started selling any products or subscriptions yet. They&apos;ll appear here once you do.
                    </p>
                </div>
            </motion.div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {showSubscriptions ? 'Top Subscription Plans' : 'Top Products'}
                </h3>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSubscriptions(!showSubscriptions)}
                    className={cn(
                        "transition-all duration-200",
                        "hover:bg-gray-100 dark:hover:bg-gray-800",
                        "focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    )}
                >
                    {showSubscriptions ? 'View Products' : 'View Subscriptions'}
                </Button>
            </div>

            <AnimatePresence mode="wait">
                {!showSubscriptions ? (
                    <ProductList key="products" products={topPerformingProducts} />
                ) : (
                    <SubscriptionPlanList key="subscriptions" subscriptionPlans={topPerformingSubscriptionPlans} />
                )}
            </AnimatePresence>
        </div>
    )
}

function ProductList({ products }: { products: TopPerformingProduct[] }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
        >
            {products.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No products sold yet.
                </div>
            ) : (
                products.map((product, index) => (
                    <MotionCard
                        key={product.product_name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                            duration: 0.3,
                            delay: index * 0.1,
                            ease: "easeOut"
                        }}
                        className={cn(
                            "hover:bg-gray-50 dark:hover:bg-gray-800",
                            "transition-all duration-200",
                            "transform hover:scale-[1.02]",
                            "cursor-pointer"
                        )}
                    >
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h4 className="font-medium text-gray-900 dark:text-white">
                                        {product.product_name}
                                    </h4>
                                    <div className="flex items-center space-x-2">
                                        <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {product.sales_count} sales
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="text-right">
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            Revenue
                                        </div>
                                        <div className="font-semibold text-gray-900 dark:text-white">
                                            {formatAmount(product.total_revenue)} XOF
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </MotionCard>
                ))
            )}
        </motion.div>
    )
}

function SubscriptionPlanList({ subscriptionPlans }: { subscriptionPlans: TopPerformingSubscriptionPlan[] }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
        >
            {subscriptionPlans.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No subscription plans sold yet.
                </div>
            ) : (
                subscriptionPlans.map((plan, index) => (
                    <MotionCard
                        key={plan.plan_name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                            duration: 0.3,
                            delay: index * 0.1,
                            ease: "easeOut"
                        }}
                        className={cn(
                            "hover:bg-gray-50 dark:hover:bg-gray-800",
                            "transition-all duration-200",
                            "transform hover:scale-[1.02]",
                            "cursor-pointer"
                        )}
                    >
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h4 className="font-medium text-gray-900 dark:text-white">
                                        {plan.plan_name}
                                    </h4>
                                    <div className="flex items-center space-x-2">
                                        <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {plan.sales_count} subscriptions
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="text-right">
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            Revenue
                                        </div>
                                        <div className="font-semibold text-gray-900 dark:text-white">
                                            {formatAmount(plan.total_revenue)} XOF
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </MotionCard>
                ))
            )}
        </motion.div>
    )
}

function formatAmount(amount: number): string {
    return amount.toLocaleString('en-US', { minimumFractionDigits: 0 })
}
