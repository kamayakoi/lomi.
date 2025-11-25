/* @proprietary license */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SingleSwirl } from '@/components/preview/swirls';
import { useTranslation } from '@/lib/contexts/translation-context';
import { t } from '@/lib/i18n/translations';
import { playClickSound } from '@/lib/utils/sound';

export function EarlyMemberPricing() {
  const { currentLanguage } = useTranslation();
  const [titleNumber, setTitleNumber] = useState(0);
  const prices = useMemo(() => ['200 F CFA', '0.30 USD', '0.30 EUR'], []);

  // Handle price animation
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleNumber((prev) => (prev + 1) % prices.length);
    }, 15000);
    return () => clearTimeout(timeoutId);
  }, [prices.length]);
  return (
    <div className="lg:mb-38 md:mt-20 hidden md:block">
      <div className="max-w-7xl mx-auto pl-2 pr-4 py-2">
        {/* Tag as title above the card */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-4xl font-normal tracking-tighter text-left text-zinc-800 dark:text-white md:text-5xl max-w-7xl whitespace-pre-line">
            {String(t('pricing.transparency', currentLanguage))}
          </h2>
        </div>

        <section className="overflow-hidden relative bg-transparent dark:bg-background text-foreground dark:text-foreground rounded-sm border p-0 pb-16 pt-16 md:pb-32 md:pt-32 before:absolute before:inset-0 before:bg-linear-to-r before:from-foreground/5 before:via-transparent before:to-foreground/5 before:pointer-events-none dark:before:from-background/20 dark:before:to-background/20 select-none">
          <SingleSwirl className="pointer-events-none absolute top-0 bottom-0 left-0" />
          <SingleSwirl className="pointer-events-none rotate-180 absolute top-0 bottom-0 right-0 opacity-50" />
          <div className="container flex flex-col items-center justify-center">
            <div className="text-center mb-6 md:mb-8 px-4">
              <div className="mb-6 md:mb-8">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 flex flex-col items-center">
                  <div className="flex flex-wrap items-baseline justify-center translate-x-[4px]">
                    <span className="inline-flex whitespace-nowrap mr-2 text-3xl md:text-4xl lg:text-6xl">
                      2% +
                    </span>
                    <div className="relative inline-flex items-center h-16 sm:h-20 md:h-24 min-w-[200px] sm:min-w-[250px] w-auto">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={titleNumber}
                          className="absolute text-foreground dark:text-foreground whitespace-nowrap mt-2"
                          initial={{
                            opacity: 0,
                            y: titleNumber === 0 ? -50 : 50,
                          }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: titleNumber === 0 ? 50 : -50 }}
                          transition={{
                            type: 'spring',
                            stiffness: 30,
                            duration: 2,
                          }}
                          style={{ top: '26px' }}
                        >
                          <span className="block sm:inline relative top-[4px] sm:top-0 text-2xl md:text-4xl lg:text-6xl">
                            {prices[titleNumber]}
                          </span>
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  </div>
                </h1>
              </div>
            </div>
            <div className="flex justify-center gap-4 -mt-2 md:-mt-4 px-4">
              <Button
                type="button"
                variant="outline"
                size="header"
                asChild
                onClick={playClickSound}
              >
                <a
                  href="docs/core/merchant-of-record/pricing"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Learn more about our pricing structure and fees (opens in new tab)"
                >
                  {t('earlyMemberPricing.learnMore') as string}
                </a>
              </Button>
              <Button
                type="button"
                variant="blue"
                size="header"
                asChild
                onClick={playClickSound}
              >
                <Link href="https://dashboard.lomi.africa/sign-in">
                  {t('earlyMemberPricing.getStarted') as string}
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
