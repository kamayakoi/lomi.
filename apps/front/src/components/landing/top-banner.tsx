import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function TopBanner() {
    const location = useLocation()
    const { t } = useTranslation()

    // Only show on landing page
    if (location.pathname !== '/') return null

    return (
        <div className={`absolute top-0 left-0 right-0 z-[100] w-full transition-all duration-300 bg-gradient-to-r from-iconBg-home/30 to-iconBg-browser/30 dark:from-darkIconBg-home/30 dark:to-darkIconBg-browser/30`}>
            <Link
                to="https://www.producthunt.com/products/lomi"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-transparent hover:bg-zinc-100  transition-all duration-300 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5"
            >
                <div className="max-w-7xl mx-auto px-4 h-6 flex items-center justify-end">
                    <span className="text-xs text-black/80 dark:text-white/80 font-medium tracking-wide pointer-events-none transition-all duration-300">
                        {t('topBanner.text')} | <span className="font-bold">{t('topBanner.cta')}</span>
                    </span>
                </div>
            </Link>
        </div>
    )
} 