import { useTranslation } from "react-i18next"

export function StoryPage() {
    const { t } = useTranslation()

    return (
        <div className="min-h-screen bg-background">
            <div className="container max-w-7xl mx-auto px-4 py-16">
                <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-8">
                    {t('company.story.title', 'Our Story')}
                </h1>
                <div className="prose dark:prose-invert max-w-none">
                    <p className="text-lg text-zinc-700 dark:text-zinc-300">
                        {t('company.story.description', 'Learn about our journey to revolutionize payments in Africa and our mission to empower businesses across the continent.')}
                    </p>
                    <div className="mt-8 space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
                                {t('company.story.beginning.title', 'The Beginning')}
                            </h2>
                            <p className="text-zinc-700 dark:text-zinc-300">
                                {t('company.story.beginning.content', 'lomi. was founded with a simple yet powerful vision: to make digital payments accessible to every business in Africa.')}
                            </p>
                        </section>
                        {/* Add more sections here */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StoryPage 