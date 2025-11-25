/* @proprietary license */

'use client';

import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/contexts/translation-context';
import { t, getTranslations } from '@/lib/i18n/translations';

export default function ChangelogClient() {
  const { currentLanguage } = useTranslation();
  const translations = getTranslations(currentLanguage);
  const changelogData = translations.changelog as unknown as {
    entries?: {
      date: string;
      version: string;
      title: string;
      changes: string[];
    }[];
  };
  const changelogEntries = changelogData?.entries || [];

  return (
    <section className="w-full py-8 md:py-20 lg:py-24 xl:py-32">
      <div className="max-w-7xl mx-auto pl-2 pr-4 py-2">
        <div className="flex flex-col space-y-6 text-left -mt-4">
          <div className="space-y-4">
            <motion.h1
              className="text-4xl font-normal tracking-tighter text-left text-zinc-800 dark:text-white md:text-5xl max-w-7xl whitespace-pre-line mt-18 md:mt-0"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {t('changelog.title', currentLanguage) as string}
            </motion.h1>
            <motion.p
              className="text-gray-500 dark:text-gray-400 text-base leading-relaxed tracking-tight max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t('changelog.subtitle', currentLanguage) as string}
            </motion.p>
          </div>

          {/* Content Sections */}
          <motion.div
            className="space-y-12 mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Timeline */}
            <div className="relative">
              {/* Vertical line - centered between date/version and content */}
              <div className="absolute left-[80px] md:left-[120px] top-0 bottom-0 w-px bg-border" />

              {/* Changelog entries */}
              <div className="space-y-12">
                {changelogEntries.map((entry, index) => (
                  <motion.div
                    key={index}
                    className="relative flex gap-4 md:gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.2 }}
                  >
                    {/* Left side - Date info */}
                    <div className="w-[80px] md:w-[108px] text-right shrink-0 pt-1">
                      <div className="text-muted-foreground/70 text-xs">
                        {entry.date}
                      </div>
                      <div className="text-muted-foreground/70 text-xs">
                        {entry.version}
                      </div>
                    </div>

                    {/* Right side - Content */}
                    <div className="flex-1 pb-4">
                      <h2 className="text-lg font-semibold text-foreground mb-2">
                        {entry.title}
                      </h2>
                      <ul className="space-y-2">
                        {entry.changes.map((change, changeIndex) => (
                          <li
                            key={changeIndex}
                            className="text-sm text-foreground leading-relaxed flex items-start gap-2"
                          >
                            <span className="text-muted-foreground mt-1.5 text-xs">
                              •
                            </span>
                            <span className="flex-1">{change}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
