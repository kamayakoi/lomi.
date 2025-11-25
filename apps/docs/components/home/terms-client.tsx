/* @proprietary license */

'use client';

import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/contexts/translation-context';
import { t } from '@/lib/i18n/translations';

export default function TermsClient() {
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
              {t('terms.title', currentLanguage) as string}
            </motion.h1>
            <motion.p
              className="text-foreground/90 text-base leading-relaxed tracking-tight [&_strong]:font-semibold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              dangerouslySetInnerHTML={{
                __html: t('terms.introduction', currentLanguage) as string,
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
              {
                t(
                  'terms.sections.interpretation.title',
                  currentLanguage,
                ) as string
              }
            </h2>
            <h3 className="text-lg font-medium mb-3 text-zinc-900 dark:text-white">
              {
                t(
                  'terms.sections.interpretation.subtitle',
                  currentLanguage,
                ) as string
              }
            </h3>
            <p className="text-foreground/90 text-base leading-relaxed tracking-tight [&_strong]:font-semibold mb-4">
              {
                t(
                  'terms.sections.interpretation.definitions_title',
                  currentLanguage,
                ) as string
              }
            </p>
            <p className="text-foreground/90 text-base leading-relaxed tracking-tight [&_strong]:font-semibold mb-4">
              {
                t(
                  'terms.sections.interpretation.definitions_content',
                  currentLanguage,
                ) as string
              }
            </p>

            <dl className="space-y-8 mt-8">
              <div className="flex flex-col sm:flex-row sm:gap-4">
                <dt className="text-sm font-semibold text-primary min-w-0 sm:w-1/3 uppercase tracking-wide mb-2 sm:mb-0">
                  {
                    t(
                      'terms.sections.interpretation.affiliates.title',
                      currentLanguage,
                    ) as string
                  }
                </dt>
                <dd
                  className="text-foreground/80 text-sm leading-relaxed flex-1"
                  dangerouslySetInnerHTML={{
                    __html: t(
                      'terms.sections.interpretation.affiliates.content',
                      currentLanguage,
                    ) as string,
                  }}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:gap-4">
                <dt className="text-sm font-semibold text-primary min-w-0 sm:w-1/3 uppercase tracking-wide mb-2 sm:mb-0">
                  {
                    t(
                      'terms.sections.interpretation.api.title',
                      currentLanguage,
                    ) as string
                  }
                </dt>
                <dd
                  className="text-foreground/80 text-sm leading-relaxed flex-1"
                  dangerouslySetInnerHTML={{
                    __html: t(
                      'terms.sections.interpretation.api.content',
                      currentLanguage,
                    ) as string,
                  }}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:gap-4">
                <dt className="text-sm font-semibold text-primary min-w-0 sm:w-1/3 uppercase tracking-wide mb-2 sm:mb-0">
                  {
                    t(
                      'terms.sections.interpretation.card_processing_services.title',
                      currentLanguage,
                    ) as string
                  }
                </dt>
                <dd
                  className="text-foreground/80 text-sm leading-relaxed flex-1 [&_ul]:list-disc [&_ul]:ml-4 [&_li]:mb-1"
                  dangerouslySetInnerHTML={{
                    __html: t(
                      'terms.sections.interpretation.card_processing_services.content',
                      currentLanguage,
                    ) as string,
                  }}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:gap-4">
                <dt className="text-sm font-semibold text-primary min-w-0 sm:w-1/3 uppercase tracking-wide mb-2 sm:mb-0">
                  {
                    t(
                      'terms.sections.interpretation.cardholder.title',
                      currentLanguage,
                    ) as string
                  }
                </dt>
                <dd
                  className="text-foreground/80 text-sm leading-relaxed flex-1"
                  dangerouslySetInnerHTML={{
                    __html: t(
                      'terms.sections.interpretation.cardholder.content',
                      currentLanguage,
                    ) as string,
                  }}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:gap-4">
                <dt className="text-sm font-semibold text-primary min-w-0 sm:w-1/3 uppercase tracking-wide mb-2 sm:mb-0">
                  {
                    t(
                      'terms.sections.interpretation.charge.title',
                      currentLanguage,
                    ) as string
                  }
                </dt>
                <dd
                  className="text-foreground/80 text-sm leading-relaxed flex-1"
                  dangerouslySetInnerHTML={{
                    __html: t(
                      'terms.sections.interpretation.charge.content',
                      currentLanguage,
                    ) as string,
                  }}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:gap-4">
                <dt className="text-sm font-semibold text-primary min-w-0 sm:w-1/3 uppercase tracking-wide mb-2 sm:mb-0">
                  {
                    t(
                      'terms.sections.interpretation.chargeback.title',
                      currentLanguage,
                    ) as string
                  }
                </dt>
                <dd
                  className="text-foreground/80 text-sm leading-relaxed flex-1"
                  dangerouslySetInnerHTML={{
                    __html: t(
                      'terms.sections.interpretation.chargeback.content',
                      currentLanguage,
                    ) as string,
                  }}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:gap-4">
                <dt className="text-sm font-semibold text-primary min-w-0 sm:w-1/3 uppercase tracking-wide mb-2 sm:mb-0">
                  {
                    t(
                      'terms.sections.interpretation.confidential_information.title',
                      currentLanguage,
                    ) as string
                  }
                </dt>
                <dd
                  className="text-foreground/80 text-sm leading-relaxed flex-1"
                  dangerouslySetInnerHTML={{
                    __html: t(
                      'terms.sections.interpretation.confidential_information.content',
                      currentLanguage,
                    ) as string,
                  }}
                />
              </div>
            </dl>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">
              {
                t(
                  'terms.sections.service_fees.title',
                  currentLanguage,
                ) as string
              }
            </h2>
            <h3 className="text-lg font-medium mb-3 text-zinc-900 dark:text-white">
              {
                t(
                  'terms.sections.service_fees.subtitle',
                  currentLanguage,
                ) as string
              }
            </h3>
            <p
              className="text-foreground/90 text-base leading-relaxed tracking-tight [&_strong]:font-semibold"
              dangerouslySetInnerHTML={{
                __html: t(
                  'terms.sections.service_fees.content',
                  currentLanguage,
                ) as string,
              }}
            />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">
              {
                t(
                  'terms.sections.disbursement_services.title',
                  currentLanguage,
                ) as string
              }
            </h2>
            <h3 className="text-lg font-medium mb-3 text-zinc-900 dark:text-white">
              {
                t(
                  'terms.sections.disbursement_services.subtitle',
                  currentLanguage,
                ) as string
              }
            </h3>
            <div
              className="text-foreground/90 text-base leading-relaxed tracking-tight [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:ml-6 [&_li]:mb-2"
              dangerouslySetInnerHTML={{
                __html: t(
                  'terms.sections.disbursement_services.content',
                  currentLanguage,
                ) as string,
              }}
            />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">
              {
                t(
                  'terms.sections.collection_services.title',
                  currentLanguage,
                ) as string
              }
            </h2>
            <h3 className="text-lg font-medium mb-3 text-zinc-900 dark:text-white">
              {
                t(
                  'terms.sections.collection_services.subtitle',
                  currentLanguage,
                ) as string
              }
            </h3>
            <p className="text-foreground/90 text-base leading-relaxed tracking-tight [&_strong]:font-semibold mb-4">
              {
                t(
                  'terms.sections.collection_services.content',
                  currentLanguage,
                ) as string
              }
            </p>

            <h4 className="text-base font-medium mb-3 mt-6 text-zinc-900 dark:text-white">
              {
                t(
                  'terms.sections.collection_services.configuration_title',
                  currentLanguage,
                ) as string
              }
            </h4>
            <p
              className="text-foreground/90 text-base leading-relaxed tracking-tight [&_strong]:font-semibold mb-4"
              dangerouslySetInnerHTML={{
                __html: t(
                  'terms.sections.collection_services.configuration_content',
                  currentLanguage,
                ) as string,
              }}
            />

            <h4 className="text-base font-medium mb-3 mt-6 text-zinc-900 dark:text-white">
              {
                t(
                  'terms.sections.collection_services.invoice_title',
                  currentLanguage,
                ) as string
              }
            </h4>
            <p
              className="text-foreground/90 text-base leading-relaxed tracking-tight [&_strong]:font-semibold"
              dangerouslySetInnerHTML={{
                __html: t(
                  'terms.sections.collection_services.invoice_content',
                  currentLanguage,
                ) as string,
              }}
            />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">
              {
                t(
                  'terms.sections.card_processing_services.title',
                  currentLanguage,
                ) as string
              }
            </h2>
            <h3 className="text-lg font-medium mb-3 text-zinc-900 dark:text-white">
              {
                t(
                  'terms.sections.card_processing_services.subtitle',
                  currentLanguage,
                ) as string
              }
            </h3>
            <p className="text-foreground/90 text-base leading-relaxed tracking-tight [&_strong]:font-semibold mb-4">
              {
                t(
                  'terms.sections.card_processing_services.content',
                  currentLanguage,
                ) as string
              }
            </p>

            <h4 className="text-base font-medium mb-3 mt-6 text-zinc-900 dark:text-white">
              {
                t(
                  'terms.sections.card_processing_services.methods_title',
                  currentLanguage,
                ) as string
              }
            </h4>
            <div
              className="text-foreground/90 text-base leading-relaxed tracking-tight [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:ml-6 [&_li]:mb-2"
              dangerouslySetInnerHTML={{
                __html: t(
                  'terms.sections.card_processing_services.methods_content',
                  currentLanguage,
                ) as string,
              }}
            />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.6 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">
              {
                t(
                  'terms.sections.invalid_payments.title',
                  currentLanguage,
                ) as string
              }
            </h2>
            <h3 className="text-lg font-medium mb-3 text-zinc-900 dark:text-white">
              {
                t(
                  'terms.sections.invalid_payments.subtitle',
                  currentLanguage,
                ) as string
              }
            </h3>
            <div
              className="text-foreground/90 text-base leading-relaxed tracking-tight [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:ml-6 [&_li]:mb-2"
              dangerouslySetInnerHTML={{
                __html: t(
                  'terms.sections.invalid_payments.content',
                  currentLanguage,
                ) as string,
              }}
            />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.8 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">
              {
                t(
                  'terms.sections.security_fraud.title',
                  currentLanguage,
                ) as string
              }
            </h2>
            <h3 className="text-lg font-medium mb-3 text-zinc-900 dark:text-white">
              {
                t(
                  'terms.sections.security_fraud.subtitle',
                  currentLanguage,
                ) as string
              }
            </h3>
            <p
              className="text-foreground/90 text-base leading-relaxed tracking-tight [&_strong]:font-semibold"
              dangerouslySetInnerHTML={{
                __html: t(
                  'terms.sections.security_fraud.content',
                  currentLanguage,
                ) as string,
              }}
            />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.0 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">
              {t('terms.sections.license_ip.title', currentLanguage) as string}
            </h2>
            <h3 className="text-lg font-medium mb-3 text-zinc-900 dark:text-white">
              {
                t(
                  'terms.sections.license_ip.subtitle',
                  currentLanguage,
                ) as string
              }
            </h3>
            <h4 className="text-base font-medium mb-3 mt-6 text-zinc-900 dark:text-white">
              {
                t(
                  'terms.sections.license_ip.license_title',
                  currentLanguage,
                ) as string
              }
            </h4>
            <div
              className="text-foreground/90 text-base leading-relaxed tracking-tight [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:ml-6 [&_li]:mb-2"
              dangerouslySetInnerHTML={{
                __html: t(
                  'terms.sections.license_ip.license_content',
                  currentLanguage,
                ) as string,
              }}
            />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.2 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">
              {
                t(
                  'terms.sections.representations_warranties.title',
                  currentLanguage,
                ) as string
              }
            </h2>
            <h3 className="text-lg font-medium mb-3 text-zinc-900 dark:text-white">
              {
                t(
                  'terms.sections.representations_warranties.subtitle',
                  currentLanguage,
                ) as string
              }
            </h3>
            <h4 className="text-base font-medium mb-3 mt-6 text-zinc-900 dark:text-white">
              {
                t(
                  'terms.sections.representations_warranties.first_party_title',
                  currentLanguage,
                ) as string
              }
            </h4>
            <p
              className="text-foreground/90 text-base leading-relaxed tracking-tight [&_strong]:font-semibold"
              dangerouslySetInnerHTML={{
                __html: t(
                  'terms.sections.representations_warranties.first_party_content',
                  currentLanguage,
                ) as string,
              }}
            />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.4 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">
              {
                t(
                  'terms.sections.restricted_activities.title',
                  currentLanguage,
                ) as string
              }
            </h2>
            <h3 className="text-lg font-medium mb-3 text-zinc-900 dark:text-white">
              {
                t(
                  'terms.sections.restricted_activities.subtitle',
                  currentLanguage,
                ) as string
              }
            </h3>
            <p
              className="text-foreground/90 text-base leading-relaxed tracking-tight [&_strong]:font-semibold"
              dangerouslySetInnerHTML={{
                __html: t(
                  'terms.sections.restricted_activities.content',
                  currentLanguage,
                ) as string,
              }}
            />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.6 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">
              {t('terms.sections.disclaimers.title', currentLanguage) as string}
            </h2>
            <h3 className="text-lg font-medium mb-3 text-zinc-900 dark:text-white">
              {
                t(
                  'terms.sections.disclaimers.subtitle',
                  currentLanguage,
                ) as string
              }
            </h3>
            <p
              className="text-foreground/90 text-base leading-relaxed tracking-tight [&_strong]:font-semibold"
              dangerouslySetInnerHTML={{
                __html: t(
                  'terms.sections.disclaimers.content',
                  currentLanguage,
                ) as string,
              }}
            />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.8 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">
              {
                t(
                  'terms.sections.indemnification_liability.title',
                  currentLanguage,
                ) as string
              }
            </h2>
            <h3 className="text-lg font-medium mb-3 text-zinc-900 dark:text-white">
              {
                t(
                  'terms.sections.indemnification_liability.subtitle',
                  currentLanguage,
                ) as string
              }
            </h3>
            <p
              className="text-foreground/90 text-base leading-relaxed tracking-tight [&_strong]:font-semibold"
              dangerouslySetInnerHTML={{
                __html: t(
                  'terms.sections.indemnification_liability.content',
                  currentLanguage,
                ) as string,
              }}
            />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 3.0 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">
              {
                t(
                  'terms.sections.confidential_information.title',
                  currentLanguage,
                ) as string
              }
            </h2>
            <h3 className="text-lg font-medium mb-3 text-zinc-900 dark:text-white">
              {
                t(
                  'terms.sections.confidential_information.subtitle',
                  currentLanguage,
                ) as string
              }
            </h3>
            <div
              className="text-foreground/90 text-base leading-relaxed tracking-tight [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:ml-6 [&_li]:mb-2"
              dangerouslySetInnerHTML={{
                __html: t(
                  'terms.sections.confidential_information.content',
                  currentLanguage,
                ) as string,
              }}
            />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 3.2 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">
              {
                t(
                  'terms.sections.miscellaneous.title',
                  currentLanguage,
                ) as string
              }
            </h2>
            <h3 className="text-lg font-medium mb-3 text-zinc-900 dark:text-white">
              {
                t(
                  'terms.sections.miscellaneous.subtitle',
                  currentLanguage,
                ) as string
              }
            </h3>
            <p
              className="text-foreground/90 text-base leading-relaxed tracking-tight [&_strong]:font-semibold"
              dangerouslySetInnerHTML={{
                __html: t(
                  'terms.sections.miscellaneous.content',
                  currentLanguage,
                ) as string,
              }}
            />
          </motion.section>
        </motion.div>

        {/* Footer info */}
        <div className="mt-20 pt-8 border-t border-border flex justify-end">
          <p className="text-foreground/80 text-sm">
            {t('terms.footer_date', currentLanguage) as string}
          </p>
        </div>
      </div>
    </>
  );
}
