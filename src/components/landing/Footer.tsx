import { Link } from 'react-router-dom'
import { XIcon } from '@/components/icons/XIcon'
import { PHIcon } from '@/components/icons/PHIcon'
import { GitHubIcon } from '@/components/icons/GitHubIcon'
import { SlackIcon } from '@/components/icons/SlackIcon'
import { LinkedInIcon } from '@/components/icons/LinkedInIcon'
import { Star } from 'lucide-react'
import { useTheme } from '@/lib/hooks/use-theme'
import { useEffect, useState } from 'react'
import { LanguageSwitcher } from '@/components/design/language-switcher'
import { useTranslation } from 'react-i18next'
import { ProductHuntBadge } from '@/components/design/product-hunt-badge'
import { cn } from "@/lib/actions/utils"
import { BackgroundText } from './background-text'

// GitHub repository URL constant
const GITHUB_REPO_URL = 'https://github.com/lomiafrica/lomi%2E'
const GITHUB_API_URL = 'https://api.github.com/repos/lomiafrica/lomi%2E'
const BRAND_ASSETS_URL = '/assets/lomi.brand.zip'

export function Footer() {
    const { t } = useTranslation()
    const { setTheme, theme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [starCount, setStarCount] = useState<number>(0)
    const [isLoading, setIsLoading] = useState(true)
    const [isVisible, setIsVisible] = useState(false)
    const [scrollProgress, setScrollProgress] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const maxScroll = documentHeight - windowHeight;

            // Calculate scroll progress (0 to 1)
            const progress = Math.min(scrolled / 100, 1);
            setScrollProgress(progress);

            // Show footer when scrolled to bottom or near bottom
            if (scrolled > maxScroll - windowHeight) {
                setIsVisible(true);
            } else if (scrolled < 20) {
                setIsVisible(true); // Also show at top
            } else {
                setIsVisible(false);
            }
        };

        // Initial check
        handleScroll();

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        const fetchStarCount = async () => {
            // Check cache first
            try {
                const cached = localStorage.getItem('github_stars_cache');
                if (cached) {
                    const { stars, timestamp } = JSON.parse(cached);
                    // Cache for 12 hours
                    if (Date.now() - timestamp < 12 * 60 * 60 * 1000) {
                        setStarCount(stars);
                        setIsLoading(false);
                        return;
                    }
                }

                const response = await fetch(GITHUB_API_URL.replace(/\.$/, ''), {
                    headers: {
                        'Accept': 'application/vnd.github.v3+json',
                        'User-Agent': 'lomi-website',
                    },
                    cache: 'force-cache'
                });

                if (!response.ok) {
                    throw new Error(`GitHub API error: ${response.status}`);
                }

                const data = await response.json();
                const stars = data.stargazers_count || 0;

                // Cache the result
                localStorage.setItem('github_stars_cache', JSON.stringify({
                    stars,
                    timestamp: Date.now()
                }));

                setStarCount(stars);
            } catch (err) {
                console.error('Error fetching star count:', err);
                // Try to use cached value even if expired
                try {
                    const cached = localStorage.getItem('github_stars_cache');
                    if (cached) {
                        const { stars } = JSON.parse(cached);
                        setStarCount(stars);
                    } else {
                        setStarCount(0);
                    }
                } catch {
                    setStarCount(0);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchStarCount();
    }, []);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    const logoSrc = theme === 'light' ? "/company/transparent_dark.webp" : "/company/transparent.webp"

    const handleBrandingDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        const link = document.createElement('a')
        link.href = BRAND_ASSETS_URL
        link.download = 'lomi.brand.zip'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    // Return a simpler version during SSR
    if (!mounted) {
        return (
            <div className="relative w-full bg-background">
                <div className="container max-w-7xl mx-auto px-4 py-10 flex justify-between items-center border-b border-zinc-800">
                    <div className="flex items-center gap-3 mt-[5px]">
                        <img
                            src="/company/transparent.webp"
                            alt="lomi. logo"
                            width={60}
                            height={60}
                            className="text-white"
                        />
                        <span className="text-white text-2xl select-none">lomi.</span>
                    </div>
                    <div className="text-white text-lg select-none mt-[5px]">
                        {t('footer.tagline')}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div
            className={cn(
                "transition-all duration-500 ease-in-out",
                isVisible ? "opacity-100" : "opacity-0"
            )}
            style={{
                opacity: isVisible ? 1 : Math.min(scrollProgress * 2, 1)
            }}
        >
            <div className="relative w-full bg-background">
                {/* Header with Logo and Tagline */}
                <div className="container max-w-7xl mx-auto px-4 pt-8 py-8 flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-3 mt-[5px]">
                        <img
                            src={logoSrc}
                            alt="lomi. logo"
                            width={60}
                            height={60}
                            className="text-zinc-900 dark:text-white cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={toggleTheme}
                        />
                        <span className="text-zinc-900 dark:text-white text-2xl select-none flex items-baseline">
                            <span>lomi</span>
                            <div className="w-[3px] h-[3px] bg-current ml-[2px] mb-[2px]"></div>
                        </span>
                    </div>
                    <div className="hidden sm:block text-zinc-800 dark:text-zinc-200 text-lg select-none mt-[5px]">
                        {t('footer.tagline')}
                    </div>
                </div>

                {/* Footer content */}
                <div className="w-full text-zinc-700 dark:text-zinc-300 pt-10 pb-16 select-none relative z-10">
                    <div className="container max-w-7xl mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {/* Features Column */}
                            <div className="space-y-4 pl-4">
                                <h2 className="text-zinc-900 dark:text-white font-medium text-lg">{t('footer.features.title')}</h2>
                                <ul className="space-y-3 relative z-20">
                                    {[
                                        { name: t('footer.features.overview'), link: '#', showBadge: false },
                                        { name: t('footer.features.sellProducts'), link: '#', showBadge: false },
                                        { name: t('footer.features.sellSubscriptions'), link: '#', showBadge: false },
                                        { name: t('footer.features.sellWhatsApp'), link: '#', showBadge: false },
                                        { name: t('footer.features.sellWebsite'), link: '#', showBadge: false },
                                        { name: t('footer.features.sendInvoices'), link: '#', showBadge: false },
                                        { name: t('footer.features.pricing'), link: '/pricing', showBadge: false },
                                        { name: t('footer.features.faq'), link: '/faq', showBadge: false }
                                    ].map((item) => (
                                        <li key={item.name} className="relative z-20">
                                            <Link
                                                to={item.link}
                                                className="text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors inline-flex items-center gap-2"
                                            >
                                                {item.name}
                                                {item.showBadge && (
                                                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-blue-100/50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50">
                                                        Soon
                                                    </span>
                                                )}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Resources Column */}
                            <div className="space-y-4 pl-4">
                                <h2 className="text-zinc-900 dark:text-white font-medium text-lg">{t('footer.resources.title')}</h2>
                                <ul className="space-y-3">
                                    {[
                                        { name: t('footer.resources.github'), link: GITHUB_REPO_URL },
                                        { name: t('footer.resources.support'), link: 'https://developers.lomi.africa/docs/support/contact', target: '_blank', rel: 'noopener noreferrer' },
                                        { name: t('footer.resources.privacy'), link: '/privacy' },
                                        { name: t('footer.resources.terms'), link: '/terms' },
                                        { name: t('footer.resources.branding'), link: BRAND_ASSETS_URL, onClick: handleBrandingDownload },
                                        { name: t('footer.resources.featureRequest'), link: 'https://github.com/lomiafrica/lomi./issues/new?labels=enhancement' },
                                        { name: t('footer.resources.review'), link: 'https://www.producthunt.com/products/lomi/reviews/new' }
                                    ].map((item) => (
                                        <li key={item.name}>
                                            <Link
                                                to={item.link}
                                                onClick={item.onClick}
                                                className="text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-colors"
                                            >
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Company Column */}
                            <div className="space-y-4 pl-4">
                                <h2 className="text-zinc-900 dark:text-white font-medium text-lg">{t('footer.company.title')}</h2>
                                <ul className="space-y-3">
                                    {[
                                        { name: t('footer.company.story'), link: '/story', color: 'text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-400' },
                                        { name: t('footer.company.blog'), link: '#', color: 'text-orange-700 dark:text-orange-300 hover:text-orange-800 dark:hover:text-orange-400' },
                                        { name: t('footer.company.openSource'), link: 'https://developers.lomi.africa/docs/freedom/open-source', color: 'text-green-700 dark:text-green-300 hover:text-green-800 dark:hover:text-green-400' }
                                    ].map((item) => (
                                        <li key={item.name}>
                                            <Link to={item.link} className={`${item.color} transition-colors`}>
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Subscribe and Social */}
                            <div className="space-y-4 lg:-ml-20 pl-4 sm:pl-8">
                                <div className="flex flex-row items-center gap-2 w-full max-w-[600px]">
                                    <Link
                                        to={GITHUB_REPO_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center h-10 shrink-0"
                                    >
                                        <div className="inline-flex items-center gap-2 bg-transparent px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-800 h-full">
                                            <GitHubIcon className="h-[20px] w-[20px] text-zinc-700 dark:text-zinc-300 hover:text-[#6e5494] dark:hover:text-[#6e5494] inline-flex items-center transition-colors" />
                                        </div>
                                        <div className="bg-transparent min-w-[54px] px-2 py-2 text-amber-500 hover:text-amber-600 border border-l-0 border-zinc-200 dark:border-zinc-800 h-full flex items-center justify-end">
                                            <span className="text-right mr-1 font-bold text-amber-500 dark:text-amber-400">{t('footer.star')}</span>
                                            <Star className="h-4 w-4 fill-current flex-shrink-0" />
                                        </div>
                                    </Link>
                                    <div className="flex items-center gap-4 flex-wrap ml-8 sm:ml-4">
                                        <Link
                                            to="https://twitter.com/lomiafrica"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-zinc-700 dark:text-zinc-300 hover:text-[#000000] dark:hover:text-[#FFFFFF] inline-flex items-center transition-colors"
                                            aria-label="Suivez-nous sur Twitter"
                                        >
                                            <XIcon className="h-[20px] w-[20px]" />
                                            <span className="sr-only">Suivez-nous sur Twitter</span>
                                        </Link>
                                        <Link
                                            to="https://www.producthunt.com/products/lomi/reviews"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-zinc-700 dark:text-zinc-300 hover:text-[#DA552F] dark:hover:text-[#DA552F] inline-flex items-center transition-colors"
                                            aria-label="Découvrez-nous sur Product Hunt"
                                        >
                                            <PHIcon className="h-[22px] w-[22px]" />
                                            <span className="sr-only">Découvrez-nous sur Product Hunt</span>
                                        </Link>
                                        <Link
                                            to={GITHUB_REPO_URL}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-zinc-700 dark:text-zinc-300 hover:text-[#6e5494] dark:hover:text-[#6e5494] inline-flex items-center transition-colors"
                                            aria-label="Consultez notre code sur GitHub"
                                        >
                                            <GitHubIcon className="h-[20px] w-[20px]" />
                                            <span className="sr-only">Consultez notre code sur GitHub</span>
                                        </Link>
                                        <Link
                                            to="#"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hidden sm:inline-flex text-zinc-700 dark:text-zinc-300 hover:text-[#E01E5A] dark:hover:text-[#E01E5A] items-center transition-colors"
                                            aria-label="Rejoignez notre communauté Slack"
                                        >
                                            <SlackIcon className="h-[20px] w-[20px]" />
                                            <span className="sr-only">Rejoignez notre communauté Slack</span>
                                        </Link>
                                        <Link
                                            to="https://www.linkedin.com/company/lomiafri"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-zinc-700 dark:text-zinc-300 hover:text-[#0A66C2] dark:hover:text-[#0A66C2] inline-flex items-center transition-colors"
                                            aria-label="Suivez-nous sur LinkedIn"
                                        >
                                            <LinkedInIcon className="h-[20px] w-[20px]" />
                                            <span className="sr-only">Suivez-nous sur LinkedIn</span>
                                        </Link>
                                    </div>
                                </div>

                                {/* Email subscribe - Hidden on mobile
                                <div className="hidden sm:flex flex-col sm:flex-row gap-2 sm:gap-0">
                                    <Input
                                        type="email"
                                        placeholder={t('footer.subscribe.placeholder')}
                                        className="flex-1 px-4 py-2 rounded-none sm:border-r-0"
                                    />
                                    <Button variant="default" className="text-sm font-medium rounded-none h-10">
                                        {t('footer.subscribe.button')}
                                    </Button>
                                </div> */}

                                {/* Product Hunt Badge */}
                                <div className="hidden sm:block">
                                    <ProductHuntBadge />
                                </div>

                                {/* Copyright and Language - Better mobile alignment */}
                                <div className="flex flex-row items-center justify-between text-xs text-zinc-700 dark:text-zinc-300 mt-4 w-full">
                                    <span>{t('footer.copyright')}</span>
                                    <div>
                                        <LanguageSwitcher />
                                    </div>
                                </div>

                                {/* System Status - Hidden on mobile */}
                                <div className="hidden sm:flex items-center justify-between px-3 py-2 text-sm w-[196px] h-10 mt-[150px] ml-auto transform translate-y-4 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                    </span>
                                    <Link to="https://status.lomi.africa" className="text-blue-700 dark:text-blue-300 font-medium">
                                        {t('footer.status')}
                                    </Link>

                                </div>

                                {/* Certifications and System Status Container */}
                                {/* <div className="hidden sm:flex items-center justify-end gap-8 mt-[150px] px-3">
                                    {/* Certifications */}
                                {/* <div className="flex items-center gap-4">
                                    <img
                                        src="/PCIDSS.webp"
                                        alt="PCI DSS Certified"
                                        className="h-20 w-auto object-contain"
                                    />
                                </div> */}

                            </div>
                        </div>
                    </div>
                </div>

                {mounted && (
                    <BackgroundText
                        text="lomi"
                        onClick={() => {
                            const newTheme = theme === 'dark' ? 'light' : 'dark';
                            setTheme(newTheme);
                        }}
                    />
                )}
            </div>
        </div >
    )
} 