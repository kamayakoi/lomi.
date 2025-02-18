import { useTranslation } from "react-i18next"

export function SellProductsPage() {
    const { t } = useTranslation()

    return (
        <div className="min-h-screen bg-background">
            <div className="container max-w-7xl mx-auto px-4 py-16">
                <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-8">
                    {t('features.sellProducts.title', 'Sell Products with lomi.')}
                </h1>
                <div className="prose dark:prose-invert max-w-none">
                    <p className="text-lg text-zinc-700 dark:text-zinc-300">
                        {t('features.sellProducts.description', 'Accept payments for your products with our simple and secure payment solution.')}
                    </p>
                    {/* Add more content here */}
                </div>
            </div>
        </div>
    )
}

export default SellProductsPage 