'use client'

import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function TopBanner() {
    const location = useLocation()
    const { t } = useTranslation()

    // Only show on landing page
    if (location.pathname !== '/') return null

    return (
        <div className="absolute top-0 left-0 right-0 z-[100] w-full">
            <Link
                to="https://www.producthunt.com/products/lomi"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-all duration-300 cursor-pointer"
            >
                <div className="max-w-7xl mx-auto px-4 h-8 flex items-center justify-end">
                    <span className="text-sm font-medium tracking-wide text-zinc-900 dark:text-white pointer-events-none">
                        {t('topBanner.text')} | <span className="font-bold">{t('topBanner.cta')}</span>
                    </span>
                </div>
            </Link>
        </div>
    )
} 