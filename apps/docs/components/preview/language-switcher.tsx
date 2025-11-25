/* @proprietary license */

'use client';

import React, { memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { languages } from '@/lib/i18n/config';
import { useTranslation } from '@/lib/contexts/translation-context';
import { playClickSound } from '@/lib/utils/sound';

interface LanguageSwitcherProps {
  onLanguageChange?: (language: string) => void;
  className?: string;
}

export const LanguageSwitcher = memo(
  ({ onLanguageChange, className = '' }: LanguageSwitcherProps) => {
    const { currentLanguage, setLanguage } = useTranslation();

    const currentLangObj = languages.find((l) => l.code === currentLanguage);

    const toggleLanguage = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        playClickSound();

        const currentIndex = languages.findIndex(
          (l) => l.code === currentLanguage,
        );
        const nextIndex = (currentIndex + 1) % languages.length;
        const nextLang = languages[nextIndex]?.code || 'en';
        const nextLangName = languages[nextIndex]?.name || 'English';

        // Update language via context
        setLanguage(nextLang);

        // Call the callback if provided (for onboarding step)
        if (onLanguageChange) {
          onLanguageChange(nextLangName);
        }
      },
      [currentLanguage, onLanguageChange, setLanguage],
    );

    return (
      <button
        onClick={toggleLanguage}
        type="button" // Explicitly set type to prevent form submission
        className={`relative overflow-visible text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors rounded-sm px-2 py-1.5 hover:bg-[#2a2f3d]/5 dark:hover:bg-[#2a2f3d]/20 ${className}`}
        aria-label="Switch language"
      >
        <div className="relative w-[70px] h-[16px] overflow-visible">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={currentLanguage}
              className="absolute inset-0 flex items-center justify-center whitespace-nowrap select-none"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 10, opacity: 0 }}
              transition={{
                duration: 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {currentLangObj?.name}
            </motion.span>
          </AnimatePresence>
        </div>
      </button>
    );
  },
);

LanguageSwitcher.displayName = 'LanguageSwitcher';
