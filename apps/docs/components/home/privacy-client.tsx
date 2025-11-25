/* @proprietary license */

'use client';

import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/contexts/translation-context';
import { t } from '@/lib/i18n/translations';

export default function PrivacyClient() {
  const { currentLanguage } = useTranslation();

  return (
    <>
      <div className="max-w-7xl mx-auto pl-2 pr-4 py-2">
        <div className="flex flex-col space-y-6 text-left mt-24">
          <div className="space-y-4">
            <motion.h1
              className="text-4xl font-normal tracking-tighter text-left text-zinc-800 dark:text-white md:text-5xl max-w-7xl whitespace-pre-line -mt-2 md:mt-0"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {t('privacy.title', currentLanguage) as string}
            </motion.h1>
            <motion.p
              className="text-foreground/90 text-base leading-relaxed tracking-tight [&_strong]:font-semibold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              dangerouslySetInnerHTML={{
                __html: t('privacy.introduction', currentLanguage) as string,
              }}
            />
          </div>
        </div>

        {/* Content Sections */}
        <motion.div
          className="space-y-12 mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">
              {t('privacy.sections.notice.title', currentLanguage) as string}
            </h2>
            <p
              className="text-foreground/90 text-base leading-relaxed tracking-tight [&_strong]:font-semibold"
              dangerouslySetInnerHTML={{
                __html: t(
                  'privacy.sections.notice.content',
                  currentLanguage,
                ) as string,
              }}
            />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">
              {t('privacy.sections.consent.title', currentLanguage) as string}
            </h2>
            <div className="text-foreground/90 text-base leading-relaxed tracking-tight [&_strong]:font-semibold">
              <p
                dangerouslySetInnerHTML={{
                  __html: t(
                    'privacy.sections.consent.content',
                    currentLanguage,
                  ) as string,
                }}
              />
              <p
                className="mt-2"
                dangerouslySetInnerHTML={{
                  __html: t(
                    'privacy.sections.consent.personal_data_content',
                    currentLanguage,
                  ) as string,
                }}
              />
              <p
                className="mt-4"
                dangerouslySetInnerHTML={{
                  __html: t(
                    'privacy.sections.consent.additional_content',
                    currentLanguage,
                  ) as string,
                }}
              />
              <p
                className="mt-2"
                dangerouslySetInnerHTML={{
                  __html: t(
                    'privacy.sections.consent.other_data_content',
                    currentLanguage,
                  ) as string,
                }}
              />
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">
              {
                t(
                  'privacy.sections.data_collection.title',
                  currentLanguage,
                ) as string
              }
            </h2>
            <h3 className="text-lg font-medium mb-3 text-zinc-900 dark:text-white">
              {
                t(
                  'privacy.sections.data_collection.subsections.data_we_collect.title',
                  currentLanguage,
                ) as string
              }
            </h3>
            <div className="text-foreground/90 text-base leading-relaxed tracking-tight [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:ml-6 [&_li]:mb-2">
              <p
                dangerouslySetInnerHTML={{
                  __html: t(
                    'privacy.sections.data_collection.subsections.data_we_collect.content',
                    currentLanguage,
                  ) as string,
                }}
              />
              <div
                className="mt-2"
                dangerouslySetInnerHTML={{
                  __html: t(
                    'privacy.sections.data_collection.subsections.data_we_collect.purposes_content',
                    currentLanguage,
                  ) as string,
                }}
              />
            </div>

            <h3 className="text-lg font-medium mb-3 mt-6 text-zinc-900 dark:text-white">
              {
                t(
                  'privacy.sections.data_collection.subsections.data_disclosure.title',
                  currentLanguage,
                ) as string
              }
            </h3>
            <div className="text-foreground/90 text-base leading-relaxed tracking-tight [&_strong]:font-semibold">
              <p
                dangerouslySetInnerHTML={{
                  __html: t(
                    'privacy.sections.data_collection.subsections.data_disclosure.content',
                    currentLanguage,
                  ) as string,
                }}
              />
              <p
                className="mt-4"
                dangerouslySetInnerHTML={{
                  __html: t(
                    'privacy.sections.data_collection.subsections.data_disclosure.additional_content',
                    currentLanguage,
                  ) as string,
                }}
              />
            </div>

            <h3 className="text-lg font-medium mb-3 mt-6 text-zinc-900 dark:text-white">
              {
                t(
                  'privacy.sections.data_collection.subsections.data_subject_rights.title',
                  currentLanguage,
                ) as string
              }
            </h3>
            <div
              className="text-foreground/90 text-base leading-relaxed tracking-tight [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:ml-6 [&_li]:mb-2"
              dangerouslySetInnerHTML={{
                __html: t(
                  'privacy.sections.data_collection.subsections.data_subject_rights.content',
                  currentLanguage,
                ) as string,
              }}
            />

            <h3 className="text-lg font-medium mb-3 mt-6 text-zinc-900 dark:text-white">
              {
                t(
                  'privacy.sections.data_collection.subsections.data_storage.title',
                  currentLanguage,
                ) as string
              }
            </h3>
            <p
              className="text-foreground/90 text-base leading-relaxed tracking-tight [&_strong]:font-semibold"
              dangerouslySetInnerHTML={{
                __html: t(
                  'privacy.sections.data_collection.subsections.data_storage.content',
                  currentLanguage,
                ) as string,
              }}
            />

            <h3 className="text-lg font-medium mb-3 mt-6 text-zinc-900 dark:text-white">
              {
                t(
                  'privacy.sections.data_collection.subsections.data_transfers.title',
                  currentLanguage,
                ) as string
              }
            </h3>
            <p
              className="text-foreground/90 text-base leading-relaxed tracking-tight [&_strong]:font-semibold"
              dangerouslySetInnerHTML={{
                __html: t(
                  'privacy.sections.data_collection.subsections.data_transfers.content',
                  currentLanguage,
                ) as string,
              }}
            />

            <h3 className="text-lg font-medium mb-3 mt-6 text-zinc-900 dark:text-white">
              {
                t(
                  'privacy.sections.data_collection.subsections.privacy_changes.title',
                  currentLanguage,
                ) as string
              }
            </h3>
            <p
              className="text-foreground/90 text-base leading-relaxed tracking-tight [&_strong]:font-semibold"
              dangerouslySetInnerHTML={{
                __html: t(
                  'privacy.sections.data_collection.subsections.privacy_changes.introduction',
                  currentLanguage,
                ) as string,
              }}
            />
            <p
              className="text-foreground/90 text-base leading-relaxed tracking-tight mt-2 [&_strong]:font-semibold"
              dangerouslySetInnerHTML={{
                __html: t(
                  'privacy.sections.data_collection.subsections.privacy_changes.purposes_content',
                  currentLanguage,
                ) as string,
              }}
            />
            <p
              className="text-foreground/90 text-base leading-relaxed tracking-tight mt-4 [&_strong]:font-semibold"
              dangerouslySetInnerHTML={{
                __html: t(
                  'privacy.sections.data_collection.subsections.privacy_changes.additional_info',
                  currentLanguage,
                ) as string,
              }}
            />
          </motion.section>
        </motion.div>

        {/* Footer info */}
        <div className="mt-20 pt-8 border-t border-border flex justify-end">
          <p className="text-foreground/80 text-sm">
            {t('privacy.footer_date', currentLanguage) as string}
          </p>
        </div>
      </div>
    </>
  );
}
