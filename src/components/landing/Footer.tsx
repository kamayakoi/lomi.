import { Link } from 'react-router-dom'
import { XIcon } from '@/components/icons/XIcon'
import { PHIcon } from '@/components/icons/PHIcon'
import { GitHubIcon } from '@/components/icons/GitHubIcon'
import { SlackIcon } from '@/components/icons/SlackIcon'
import { LinkedInIcon } from '@/components/icons/LinkedInIcon'
import { Star } from 'lucide-react'
import { useTheme } from '@/lib/hooks/useTheme'
import { useEffect, useState } from 'react'
import { LanguageSwitcher } from '@/components/design/LanguageSwitcher'
import { useTranslation } from 'react-i18next'
import { ProductHuntBadge } from '@/components/design/product-hunt-badge'
import { cn } from "@/lib/actions/utils"

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

                const response = await fetch('https://api.github.com/repos/lomiafrica/lomi-docs', {
                    headers: {
                        'Accept': 'application/vnd.github.v3+json',
                        'User-Agent': 'Lomi-Website',
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

    const logoSrc = theme === 'light' ? "/transparent2.webp" : "/transparent.webp"

    // Return a simpler version during SSR
    if (!mounted) {
        return (
            <div className="relative w-full bg-background">
                <div className="container max-w-7xl mx-auto px-4 py-10 flex justify-between items-center border-b border-zinc-800">
                    <div className="flex items-center gap-3 mt-[5px]">
                        <img
                            src="/transparent.webp"
                            alt="lomi. logo"
                            width={60}
                            height={60}
                            className="text-white"
                        />
                        <span className="text-white text-2xl select-none">lomi.</span>
                    </div>
                    <div className="text-white text-lg select-none mt-[5px]">
                        Connecting Africa to the World, one transaction at a time.
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
                    <div className="hidden sm:block text-zinc-900 dark:text-white text-lg select-none mt-[5px]">
                        {t('footer.tagline')}
                    </div>
                </div>

                {/* Footer content */}
                <div className="w-full text-zinc-600 dark:text-zinc-400 pt-10 pb-16 select-none relative z-10">
                    <div className="container max-w-7xl mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {/* Features Column */}
                            <div className="space-y-4 pl-4">
                                <h3 className="text-zinc-900 dark:text-white font-medium">{t('footer.features.title')}</h3>
                                <ul className="space-y-3 relative z-20">
                                    {[
                                        { name: t('footer.features.overview'), link: '/overview' },
                                        { name: t('footer.features.sellProducts'), link: '/products' },
                                        { name: t('footer.features.sellSubscriptions'), link: '/subscriptions' },
                                        { name: t('footer.features.sellWhatsApp'), link: '/whatsapp' },
                                        { name: t('footer.features.sellWebsite'), link: '/website' },
                                        { name: t('footer.features.sendInvoices'), link: '/invoices' },
                                        { name: t('footer.features.pricing'), link: '/pricing' },
                                        { name: t('footer.features.faq'), link: '/faq', isExternal: true }
                                    ].map((item) => (
                                        <li key={item.name} className="relative z-20">
                                            <Link
                                                to={item.link}
                                                target={item.isExternal ? "_blank" : undefined}
                                                rel={item.isExternal ? "noopener noreferrer" : undefined}
                                                className="hover:text-zinc-900 dark:hover:text-white transition-colors"
                                            >
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Resources Column */}
                            <div className="space-y-4 pl-4">
                                <h3 className="text-zinc-900 dark:text-white font-medium">{t('footer.resources.title')}</h3>
                                <ul className="space-y-3">
                                    {[
                                        { name: t('footer.resources.github'), link: 'https://github.com/lomiafrica/lomi.' },
                                        { name: t('footer.resources.support'), link: '/support' },
                                        { name: t('footer.resources.privacy'), link: '/privacy' },
                                        { name: t('footer.resources.terms'), link: '/terms' },
                                        { name: t('footer.resources.branding'), link: '/branding' },
                                        { name: t('footer.resources.featureRequest'), link: '/feedback' },
                                        { name: t('footer.resources.review'), link: 'https://www.producthunt.com/products/lomi/reviews/new' }
                                    ].map((item) => (
                                        <li key={item.name}>
                                            <Link to={item.link} className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Company Column */}
                            <div className="space-y-4 pl-4">
                                <h3 className="text-zinc-900 dark:text-white font-medium">{t('footer.company.title')}</h3>
                                <ul className="space-y-3">
                                    {[
                                        { name: t('footer.company.story'), link: '/story', color: 'text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-400' },
                                        { name: t('footer.company.blog'), link: '/blog', color: 'text-orange-700 dark:text-orange-300 hover:text-orange-800 dark:hover:text-orange-400' },
                                        { name: t('footer.company.openSource'), link: 'https://www.developers.lomi.africa/open-source', color: 'text-green-700 dark:text-green-300 hover:text-green-800 dark:hover:text-green-400' }
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
                                        to="https://github.com/lomiafrica/lomi-docs"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center h-10 shrink-0"
                                    >
                                        <div className="inline-flex items-center gap-2 bg-transparent px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-800 h-full">
                                            <GitHubIcon className="h-[18px] w-[18px]" />
                                            <span>{t('footer.star')}</span>
                                        </div>
                                        <div className="bg-transparent w-[54px] px-2 py-2 text-amber-500 hover:text-amber-600 border border-l-0 border-zinc-200 dark:border-zinc-800 h-full flex items-center justify-end">
                                            <span className="text-right mr-1">
                                                {isLoading ? '...' :
                                                    starCount >= 1000
                                                        ? `${Math.floor(starCount / 1000)}k`
                                                        : starCount
                                                }
                                            </span>
                                            <Star className="h-4 w-4 fill-current flex-shrink-0" />
                                        </div>
                                    </Link>
                                    <div className="flex items-center gap-4 flex-wrap ml-8 sm:ml-4">
                                        <Link to="https://twitter.com/lomiafrica" target="_blank" rel="noopener noreferrer" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                                            <XIcon className="h-[20px] w-[20px]" />
                                        </Link>
                                        <Link to="https://www.producthunt.com/products/lomi" target="_blank" rel="noopener noreferrer" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                                            <PHIcon className="h-[22px] w-[22px]" />
                                        </Link>
                                        <Link to="https://github.com/lomiafrica/lomi." target="_blank" rel="noopener noreferrer" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                                            <GitHubIcon className="h-[20px] w-[20px]" />
                                        </Link>

                                        <Link to="https://lomi.slack.com" target="_blank" rel="noopener noreferrer" className="hidden sm:block text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                                            <SlackIcon className="h-[20px] w-[20px]" />
                                        </Link>
                                        <Link to="https://www.linkedin.com/company/lomiafri" target="_blank" rel="noopener noreferrer" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                                            <LinkedInIcon className="h-[20px] w-[20px]" />
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
                                <div className="flex flex-row items-center justify-between text-xs text-zinc-500 dark:text-zinc-500 mt-4 w-full">
                                    <span>{t('footer.copyright')}</span>
                                    <div>
                                        <LanguageSwitcher />
                                    </div>
                                </div>



                                {/* System Status - Hidden on mobile */}
                                <div className="hidden sm:flex items-center justify-between px-3 py-2 text-sm w-[196px] h-10 mt-[150px] ml-auto transform translate-y-4 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                                    <Link to="/#" className="text-blue-700 dark:text-blue-300 font-medium">
                                        {t('footer.status')}
                                    </Link>
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {mounted && (
                    <div className="w-full overflow-hidden mt-[-100px] py-[-100px] h-[380px] relative z-0">
                        <div
                            className="text-[#161616] dark:text-blue-100 text-[500px] leading-none text-center font-bold select-none opacity-10 flex items-baseline justify-center"
                            onClick={() => {
                                const newTheme = theme === 'dark' ? 'light' : 'dark';
                                setTheme(newTheme);
                            }}
                        >
                            <span>lomi</span>
                            <div className="w-[100px] h-[100px] bg-current ml-4"></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
} 