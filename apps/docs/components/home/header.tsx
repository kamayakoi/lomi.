/* @proprietary license */

'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { Dock } from '@/components/ui/dock';
import { DockDropdown } from '@/components/preview/dock-dropdown';
import { Button } from '@/components/ui/button';
import { IntegrationsDropdown } from '@/components/home/dropdowns/products-dropdown';
import { DocumentationDropdown } from '@/components/home/dropdowns/documentation-dropdown';
import { playClickSound } from '@/lib/utils/sound';
import { useAuth } from '@/lib/hooks/use-auth';
import { useTranslation } from '@/lib/contexts/translation-context';
import { t as translate } from '@/lib/i18n/translations';
import { Logo } from '@/lib/utils/logo';
import { LargeSearchToggle } from '@/components/preview/search-toggle';
import { GithubStars } from '@/components/home/github-stars';

const AuthButtons = ({
  isMobile = false,
  playClickSound,
  user,
  t,
  navigate,
}: {
  isMobile?: boolean;
  playClickSound: () => void;
  user: User | null;
  t: (key: string) => string;
  navigate: (path: string) => void;
}) => {
  // Don't show auth buttons on mobile - this isn't a mobile app
  if (isMobile) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 pr-2">
      {/* Talk to us button */}
      <Button
        variant="outline"
        size="header"
        onClick={() => {
          playClickSound();
          window.open('https://cal.com/babacar-diop', '_blank');
        }}
      >
        {t('header.talk')}
      </Button>

      {/* Connect/Dashboard button */}
      <Button
        variant={user ? 'workspace' : 'blue'}
        size="header"
        onClick={() => {
          playClickSound();
          navigate(
            user
              ? 'https://dashboard.lomi.africa/'
              : 'https://dashboard.lomi.africa/sign-in',
          );
        }}
      >
        {user ? t('header.dashboard') : t('header.connect')}
      </Button>
    </div>
  );
};

export function Header() {
  const router = useRouter();
  const { currentLanguage } = useTranslation();
  const { user } = useAuth();
  const [isIntegrationsOpen, setIsIntegrationsOpen] = useState(false);
  const [isDocumentationOpen, setIsDocumentationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const leaveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Create t function that uses currentLanguage (same pattern as tracking-cookie.tsx)
  const t = (key: string) => String(translate(key, currentLanguage));

  const handleIntegrationsMouseEnter = () => {
    if (leaveTimeout.current) {
      clearTimeout(leaveTimeout.current);
    }
    setIsIntegrationsOpen(true);
    setIsDocumentationOpen(false);
  };

  const handleIntegrationsMouseLeave = () => {
    leaveTimeout.current = setTimeout(() => {
      setIsIntegrationsOpen(false);
      setIsDocumentationOpen(false);
    }, 200);
  };

  const handleDocumentationMouseEnter = () => {
    if (leaveTimeout.current) {
      clearTimeout(leaveTimeout.current);
    }
    setIsDocumentationOpen(true);
    setIsIntegrationsOpen(false);
  };

  const handleDocumentationMouseLeave = () => {
    leaveTimeout.current = setTimeout(() => {
      setIsDocumentationOpen(false);
      setIsIntegrationsOpen(false);
    }, 200);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navigate = (path: string) => {
    router.push(path);
  };

  return (
    <Dock>
      <header className="bg-background/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-sm shadow-sm select-none">
        <div className="flex items-center justify-between h-12">
          <div className="flex items-center pl-3 md:pl-4 pt-2">
            <Link href="/" onClick={playClickSound}>
              <div className="cursor-pointer hover:opacity-80 transition-opacity">
                <Logo width={80} height={24} />
              </div>
            </Link>
          </div>

          {/* GitHub Stars - positioned above navigation */}
          <div className="absolute left-[87px] top-[7.5px] hidden lg:block">
            <GithubStars />
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center gap-3 pr-4 pt-2">
            <Button
              variant="ghost"
              size="header"
              className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
              onMouseEnter={handleDocumentationMouseEnter}
              onMouseLeave={handleDocumentationMouseLeave}
              onClick={playClickSound}
            >
              {t('header.documentation')}
            </Button>
            <Button
              variant="ghost"
              size="header"
              className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
              onMouseEnter={handleIntegrationsMouseEnter}
              onMouseLeave={handleIntegrationsMouseLeave}
              onClick={playClickSound}
            >
              {t('header.products')}
            </Button>
            <Button
              variant="ghost"
              size="header"
              className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
              onMouseEnter={() => {
                if (leaveTimeout.current) {
                  clearTimeout(leaveTimeout.current);
                }
                setIsDocumentationOpen(false);
                setIsIntegrationsOpen(false);
              }}
              onMouseLeave={() => {
                leaveTimeout.current = setTimeout(() => {
                  setIsDocumentationOpen(false);
                  setIsIntegrationsOpen(false);
                }, 200);
              }}
              onClick={() => {
                playClickSound();
                navigate('/pricing');
              }}
            >
              {t('header.pricing')}
            </Button>
            <Button
              variant="ghost"
              size="header"
              className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
              onMouseEnter={() => {
                if (leaveTimeout.current) {
                  clearTimeout(leaveTimeout.current);
                }
                setIsDocumentationOpen(false);
                setIsIntegrationsOpen(false);
              }}
              onMouseLeave={() => {
                leaveTimeout.current = setTimeout(() => {
                  setIsDocumentationOpen(false);
                  setIsIntegrationsOpen(false);
                }, 200);
              }}
              onClick={() => {
                playClickSound();
                navigate('/blog');
              }}
            >
              {t('header.blog')}
            </Button>

            {/* Search Toggle */}
            <div className="h-8 pl-2 pr-0.5 flex items-center">
              <LargeSearchToggle className="h-8 w-41 rounded-sm bg-slate-50 text-sm font-normal hover:bg-slate-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-gray-200 dark:border-[0.15px] dark:border-gray-700/20" />
            </div>

            <AuthButtons
              isMobile={false}
              playClickSound={playClickSound}
              user={user}
              t={t}
              navigate={navigate}
            />
          </nav>

          {/* Mobile Menu Button - Hidden on desktop */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden pr-4 pt-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
            onClick={() => {
              playClickSound();
              toggleMobileMenu();
            }}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        {/* Mobile Menu - Hidden on desktop */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <nav className="flex flex-col space-y-4 py-4 px-4">
              <Button
                variant="ghost"
                size="header"
                className="text-left text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors w-full justify-start"
                onClick={() => {
                  playClickSound();
                  navigate('/pricing');
                }}
              >
                {t('header.pricing')}
              </Button>
              <Button
                variant="ghost"
                size="header"
                className="text-left text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors w-full justify-start"
                onClick={() => {
                  playClickSound();
                  navigate('/docs/introduction/what-is-lomi');
                }}
              >
                {t('header.documentation')}
              </Button>
              <Button
                variant="ghost"
                size="header"
                className="text-left text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors w-full justify-start"
                onClick={() => {
                  playClickSound();
                  navigate('/blog');
                }}
              >
                {t('header.blog')}
              </Button>

              {/* Mobile Search Toggle */}
              <div className="px-2 py-1.5 flex items-center">
                <LargeSearchToggle className="h-8 w-full rounded-sm bg-slate-50 text-sm font-normal hover:bg-slate-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-gray-200 dark:border-[0.15px] dark:border-gray-700/20" />
              </div>

              <AuthButtons
                isMobile={true}
                playClickSound={playClickSound}
                user={user}
                t={t}
                navigate={navigate}
              />
            </nav>
          </div>
        )}

        {/* Desktop Products Dropdown */}
        <DockDropdown
          isOpen={isIntegrationsOpen}
          onMouseEnter={handleIntegrationsMouseEnter}
          onMouseLeave={handleIntegrationsMouseLeave}
        >
          <IntegrationsDropdown />
        </DockDropdown>

        {/* Desktop Documentation Dropdown */}
        <DockDropdown
          isOpen={isDocumentationOpen}
          onMouseEnter={handleDocumentationMouseEnter}
          onMouseLeave={handleDocumentationMouseLeave}
        >
          <DocumentationDropdown />
        </DockDropdown>
      </header>
    </Dock>
  );
}
