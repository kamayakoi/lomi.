/* @proprietary license */

'use client';

import { useCallback, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LanguageSwitcher } from '@/components/preview/language-switcher';
import { BackgroundText } from '@/components/preview/background-text';
import { LottieIcon } from '@/components/preview/lottie-icon';
import { animations } from '@/lib/utils/lottie-animations';
import { useTheme } from '@/lib/hooks/use-theme';
import { useThemeAnimation } from '@/lib/hooks/use-theme-animation';
import {
  DiscordIcon,
  GitHubIcon,
  LinkedInIcon,
  XIcon,
  SlackIcon,
} from '@/components/preview/icons';
import { Check } from 'lucide-react';
import { ProductHuntBadge } from '@/components/preview/product-hunt-badge';
import { playClickSound as playSound } from '@/lib/utils/sound';
import { useTranslation } from '@/lib/contexts/translation-context';
import { t as translate } from '@/lib/i18n/translations';

const GITHUB_REPO_URL = 'https://github.com/lomiafrica/lomi./';

export function Footer() {
  const { resolvedTheme, mounted } = useTheme();
  const { toggleTheme, themeButtonRef } = useThemeAnimation();
  const { currentLanguage } = useTranslation();

  // Create t function that uses currentLanguage (same pattern as tracking-cookie.tsx)
  const t = (key: string) => String(translate(key, currentLanguage));
  const [hoveredTheme, setHoveredTheme] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isAtBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 2;

      document.documentElement.style.overscrollBehaviorY = isAtBottom
        ? 'none'
        : 'auto';
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const playClickSound = useCallback(() => {
    playSound();
  }, []);

  const handleToggleTheme = useCallback(async () => {
    playClickSound();
    await toggleTheme();
  }, [toggleTheme, playClickSound]);

  // Wait for theme to be mounted to prevent hydration mismatches

  return (
    <div>
      <div className="relative w-full bg-background pt-28 sm:pt-6">
        {/* Header with Logo and Tagline */}
        <div className="max-w-[1255px] mx-auto -translate-x-1 border-b border-zinc-200 dark:border-zinc-800"></div>

        {/* Footer content */}
        <div className="w-full text-zinc-600 dark:text-zinc-400 pt-4 pb-4 select-none relative z-10">
          <div className="max-w-7xl mx-auto pl-2 pr-4 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Subscribe and Social */}
              <div className="space-y-4 lg:space-y-1 order-4 md:order-1 lg:w-[calc(25%+230px)]">
                <div className="flex flex-row items-center text-left justify-center md:justify-center xl:justify-start gap-1 w-full">
                  <div className="flex items-center gap-4.25 flex-wrap justify-center md:justify-center xl:justify-start w-full sm:w-auto">
                    <Link
                      href="/"
                      onClick={playClickSound}
                      className="inline-flex items-center ml-2 lg:ml-2"
                    >
                      {mounted && (
                        <>
                          <Image
                            src="/company/transparent_d.webp"
                            alt="lomi. logo"
                            width={38}
                            height={38}
                            className="block dark:hidden cursor-pointer hover:opacity-80 transition-opacity"
                          />
                          <Image
                            src="/company/transparent_l.webp"
                            alt="lomi. logo"
                            width={38}
                            height={38}
                            className="hidden dark:block cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </>
                      )}
                    </Link>
                    <span className="text-muted-foreground text-lg leading-none font-thin">
                      |
                    </span>
                    <Link
                      href={GITHUB_REPO_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={playClickSound}
                      className="text-black dark:text-white hover:text-[#5FED83] dark:hover:text-[#5FED83] inline-flex items-center transition-colors"
                      aria-label="View our GitHub"
                    >
                      <GitHubIcon className="h-[20px] w-[20px]" />
                    </Link>
                    <Link
                      href="https://twitter.com/lomiafrica"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={playClickSound}
                      className="text-black dark:text-white hover:text-[#000000] dark:hover:text-[#FFFFFF] inline-flex items-center transition-colors"
                      aria-label="Follow us on Twitter"
                    >
                      <XIcon className="h-[22px] w-[22px] translate-y-[-0.5px] -translate-x-px" />
                    </Link>
                    <Link
                      href="https://discord.gg/rvUFkHM2kv"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={playClickSound}
                      className="text-black dark:text-white hover:text-[#5865F2] dark:hover:text-[#5865F2] inline-flex items-center transition-colors"
                      aria-label="Join our Discord server"
                    >
                      <DiscordIcon className="h-[23px] w-[23px]" />
                    </Link>
                    <Link
                      href="https://www.linkedin.com/company/lomiafri"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={playClickSound}
                      className="text-black dark:text-white hover:text-[#0077B5] dark:hover:text-[#0077B5] inline-flex items-center transition-colors"
                      aria-label="Follow us on LinkedIn"
                    >
                      <LinkedInIcon className="h-[20px] w-[20px]" />
                    </Link>
                    <Link
                      href="https://join.slack.com/t/lomi-a/shared_invite/zt-3hezykfvo-eW1jX6IkXAqht875Y1wUOw"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={playClickSound}
                      className="text-black dark:text-white hover:text-[#E01E5A] dark:hover:text-[#E01E5A] inline-flex items-center transition-colors"
                      aria-label="Join our Slack community"
                    >
                      <SlackIcon className="h-[20px] w-[20px]" />
                    </Link>
                    <div
                      ref={themeButtonRef}
                      onClick={handleToggleTheme}
                      onMouseEnter={() => setHoveredTheme(true)}
                      onMouseLeave={() => setHoveredTheme(false)}
                      className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white inline-flex items-center transition-colors cursor-pointer"
                      aria-label={
                        mounted
                          ? `Toggle ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`
                          : 'Toggle theme'
                      }
                      title={
                        mounted
                          ? `Toggle ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`
                          : 'Toggle theme'
                      }
                    >
                      {mounted && (
                        <LottieIcon
                          animationData={
                            resolvedTheme === 'dark'
                              ? animations.sun
                              : animations.point
                          }
                          size={20}
                          loop={false}
                          autoplay={false}
                          initialFrame={0}
                          isHovered={hoveredTheme}
                          ariaLabel={
                            mounted
                              ? `Toggle ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`
                              : 'Toggle theme'
                          }
                          customColor={
                            hoveredTheme
                              ? resolvedTheme === 'dark'
                                ? [0.922, 0.922, 0.941] // Very light in dark mode (zinc-200)
                                : [0.145, 0.145, 0.169] // Very dark in light mode (zinc-800)
                              : resolvedTheme === 'dark'
                                ? [1, 1, 1] // white in dark mode
                                : [0, 0, 0] // black in light mode
                          }
                        />
                      )}
                    </div>
                  </div>
                </div>

                <a
                  href="https://www.producthunt.com/posts/lomi?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-lomi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                  onClick={playClickSound}
                >
                  <ProductHuntBadge />
                </a>

                <p className="hidden lg:block text-[10px] text-zinc-600 dark:text-zinc-400 max-w-xs leading-relaxed text-justify align-left mt-2">
                  {t('footer.description')}
                </p>

                {/* Copyright and Language - Better mobile alignment */}
                <div className="flex flex-row items-center justify-between md:justify-center lg:justify-between gap-4 text-xs text-zinc-600 dark:text-zinc-400 mt-6 -translate-y-3 w-full">
                  <span className="px-2 py-1.5 h-8 ml-2 md:ml-4 lg:ml-0 bg-transparent hover:bg-[#2a2f3d]/5 rounded-sm transition-colors duration-200 dark:hover:bg-[#2a2f3d]/20 inline-flex items-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
                    {t('footer.copyright')}
                  </span>
                  <LanguageSwitcher />
                </div>

                {/* System Status and Certifications Container */}
                <div className="flex -mt-4 justify-center items-center gap-4 w-full">
                  {/* Certification Icons Container */}
                  <div className="flex items-center gap-2">
                    {/* PCI Icon Wrapper */}
                    <div
                      className="group"
                      title="lomi. is PCI DSS level 4 certified"
                    >
                      <Image
                        src="/regulatory/PCI_DSS.webp"
                        alt="PCI DSS Certified"
                        width={120}
                        height={70}
                        className="w-[120px] h-[70px] shrink-0 object-contain filter grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 dark:filter dark:grayscale dark:brightness-100 dark:opacity-25 dark:group-hover:opacity-100 transition-all"
                      />
                    </div>
                    {/* SSL Icon */}
                    <div className="group" title="lomi. is SSL secure">
                      <Image
                        src="/regulatory/SSL.webp"
                        alt="SSL Secured"
                        width={69}
                        height={27}
                        className="w-[69px] h-[27px] shrink-0 object-contain filter grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 dark:invert dark:opacity-25 dark:group-hover:opacity-100 transition-all"
                      />
                    </div>
                  </div>

                  {/* Status Link */}
                  <a
                    href="https://status.lomi.africa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-2 py-1.5 text-xs h-8 bg-transparent hover:bg-[#2a2f3d]/5 rounded-sm transition-colors duration-200 justify-center dark:hover:bg-[#2a2f3d]/20 group text-[#56A5F9] hover:text-[#52A1F8] dark:text-green-300 dark:hover:text-zinc-100"
                    onClick={playClickSound}
                  >
                    <div className="relative flex items-center justify-center w-3 h-3 shrink-0">
                      <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-sky-400 dark:bg-green-500/50 opacity-50"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500 dark:bg-green-900 items-center justify-center">
                        <Check
                          className="h-2 w-2 text-white dark:text-green-300"
                          strokeWidth={3}
                        />
                      </span>
                    </div>
                    <span className="text-[#56A5F9] hover:text-[#52A1F8] dark:text-green-300 dark:hover:text-zinc-100 font-normal whitespace-nowrap text-center">
                      {t('footer.status')}
                    </span>
                  </a>
                </div>
              </div>

              {/* Features Column */}
              <div className="space-y-4 pl-4 order-1 md:order-2 lg:translate-x-[105px] mt-2">
                <h2 className="text-zinc-900 dark:text-white font-normal text-base">
                  {t('footer.features.title')}
                </h2>
                <ul className="space-y-3 relative z-20">
                  {[
                    {
                      name: t('footer.features.overview'),
                      link: '/',
                    },
                    {
                      name: t('footer.features.pricing'),
                      link: '/pricing',
                    },
                    {
                      name: t('footer.features.faq'),
                      link: '/faq',
                    },
                  ].map((item) => (
                    <li key={item.name} className="relative z-20">
                      <Link
                        href={item.link}
                        className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors inline-flex items-center gap-2"
                        onClick={playClickSound}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources Column */}
              <div className="space-y-4 pl-4 order-2 md:order-3 lg:translate-x-[65px] mt-2">
                <h2 className="text-zinc-900 dark:text-white font-normal text-base">
                  {t('footer.resources.title')}
                </h2>
                <ul className="space-y-3">
                  {[
                    {
                      name: t('footer.resources.github'),
                      link: 'https://github.com/lomiafrica/lomi.',
                    },
                    {
                      name: t('footer.resources.changelog'),
                      link: '/changelog',
                    },
                    {
                      name: t('footer.resources.support'),
                      link: '/docs/core/support/contact',
                      target: '_blank',
                      rel: 'noopener noreferrer',
                    },
                    {
                      name: t('footer.resources.featureRequest'),
                      link: 'https://github.com/lomiafrica/lomi./issues/new?labels=enhancement',
                    },
                    {
                      name: t('footer.resources.review'),
                      link: 'https://www.producthunt.com/products/lomi/reviews/new',
                    },
                    { name: t('footer.resources.privacy'), link: '/privacy' },
                    { name: t('footer.resources.terms'), link: '/terms' },
                  ].map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.link}
                        target={item.target}
                        rel={item.rel}
                        className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors whitespace-nowrap"
                        onClick={playClickSound}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <a
                      href="/assets/lomi.brand.zip"
                      download="lomi.brand.zip"
                      className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
                    >
                      {t('footer.resources.branding')}
                    </a>
                  </li>
                </ul>
              </div>

              {/* Company Column */}
              <div className="space-y-4 pl-4 order-3 md:order-4 lg:translate-x-[55px] mt-2">
                <h2 className="text-zinc-900 dark:text-white font-normal text-base">
                  {t('footer.company.title')}
                </h2>
                <ul className="space-y-3">
                  {[
                    {
                      name: t('footer.company.story'),
                      link: '/docs/core/introduction/manifesto',
                      target: '_blank',
                      rel: 'noopener noreferrer',
                      color: '',
                      icon: (
                        <LottieIcon
                          animationData={animations.bolt}
                          size={14}
                          loop={false}
                          autoplay={false}
                          initialFrame={0}
                          lightColor={[0.322, 0.322, 0.357]}
                          darkColor={[0.631, 0.631, 0.667]}
                          className="ml-1 transition-transform duration-300 transform group-hover:translate-x-1 opacity-0 group-hover:opacity-100"
                          ariaLabel="Story icon"
                        />
                      ),
                    },
                    {
                      name: t('footer.company.blog'),
                      link: '/blog',
                      color: '',
                      icon: (
                        <LottieIcon
                          animationData={animations.blog}
                          size={14}
                          loop={false}
                          autoplay={false}
                          initialFrame={0}
                          lightColor={[0.322, 0.322, 0.357]}
                          darkColor={[0.631, 0.631, 0.667]}
                          className="ml-1 transition-transform duration-300 transform group-hover:translate-x-1 opacity-0 group-hover:opacity-100"
                          ariaLabel="Blog icon"
                        />
                      ),
                    },
                    {
                      name: t('footer.company.careers'),
                      link: '/careers',
                      color: '',
                      icon: (
                        <LottieIcon
                          animationData={animations.luggage}
                          size={14}
                          loop={false}
                          autoplay={false}
                          initialFrame={0}
                          lightColor={[0.322, 0.322, 0.357]}
                          darkColor={[0.631, 0.631, 0.667]}
                          className="ml-1 transition-transform duration-300 transform group-hover:translate-x-1 opacity-0 group-hover:opacity-100"
                          ariaLabel="Careers icon"
                        />
                      ),
                    },
                    {
                      name: t('footer.company.openSource'),
                      link: '/docs/core/freedom/open-source',
                      target: '_blank',
                      rel: 'noopener noreferrer',
                      color:
                        'text-[#56A5F9] hover:text-[#52A1F8] dark:text-sky-300 dark:hover:text-sky-200',
                      icon: (
                        <LottieIcon
                          animationData={animations.code}
                          size={14}
                          loop={false}
                          autoplay={false}
                          initialFrame={0}
                          lightColor={[0.337, 0.647, 0.976]}
                          darkColor={[0.49, 0.827, 0.988]}
                          className="ml-1 transition-transform duration-300 transform group-hover:translate-x-1 opacity-0 group-hover:opacity-100"
                          ariaLabel="Open source icon"
                        />
                      ),
                    },
                  ].map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.link}
                        target={item.target}
                        rel={item.rel}
                        className={`text-sm ${item.color} transition-colors group flex items-center`}
                        onClick={playClickSound}
                      >
                        <span>{item.name}</span>
                        {item.icon}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {mounted && (
          <BackgroundText>
            <div className="container max-w-5xl mx-auto px-4 h-full flex items-end justify-end pb-6 md:pb-16 pointer-events-none" />
          </BackgroundText>
        )}
      </div>
    </div>
  );
}
