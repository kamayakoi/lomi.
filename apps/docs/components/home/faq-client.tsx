/* @proprietary license */

'use client';

import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/contexts/translation-context';
import { t } from '@/lib/i18n/translations';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

export default function FaqClient() {
  const { currentLanguage } = useTranslation();

  const faqItems = [
    {
      key: 'pricing',
      question: t('faq.items.pricing.question', currentLanguage),
      answer: t('faq.items.pricing.answer', currentLanguage),
    },
    {
      key: 'funds',
      question: t('faq.items.funds.question', currentLanguage),
      answer: t('faq.items.funds.answer', currentLanguage),
    },
    {
      key: 'payment_methods',
      question: t('faq.items.payment_methods.question', currentLanguage),
      answer: t('faq.items.payment_methods.answer', currentLanguage),
    },
    {
      key: 'minimum_amount',
      question: t('faq.items.minimum_amount.question', currentLanguage),
      answer: t('faq.items.minimum_amount.answer', currentLanguage),
    },
    {
      key: 'security',
      question: t('faq.items.security.question', currentLanguage),
      answer: t('faq.items.security.answer', currentLanguage),
    },
    {
      key: 'international',
      question: t('faq.items.international.question', currentLanguage),
      answer: t('faq.items.international.answer', currentLanguage),
    },
  ];

  return (
    <>
      <div className="max-w-7xl mx-auto pl-2 pr-4 py-2">
        <div className="flex flex-col space-y-6 text-left mt-28">
          <div className="space-y-4">
            <motion.h1
              className="text-4xl font-normal tracking-tighter text-left text-zinc-800 dark:text-white md:text-5xl max-w-7xl whitespace-pre-line"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {t('faq.title', currentLanguage) as string}
            </motion.h1>
            <motion.p
              className="text-foreground/90 text-base leading-relaxed tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              dangerouslySetInnerHTML={{
                __html: t('faq.introduction', currentLanguage) as string,
              }}
            />
          </div>

          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Accordion type="single" collapsible className="rounded-sm">
              {faqItems.map((item) => (
                <AccordionItem key={item.key} value={item.key}>
                  <AccordionTrigger className="text-left">
                    {item.question as string}
                  </AccordionTrigger>
                  <AccordionContent className="px-4.5">
                    <p
                      className="text-foreground/90 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: item.answer as string,
                      }}
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}

              {/* Additional static question row without response */}
              <AccordionItem value="static-footer">
                <div className="flex flex-1 items-start gap-2 py-2 -mb-1.5 text-left text-sm font-medium px-4">
                  <div className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-2 transition-transform duration-200 opacity-0">
                    {/* Invisible placeholder to match spacing */}
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <h3 className="text-sm font-medium text-left leading-relaxed text-gray-500 dark:text-gray-300">
                      Still have questions?
                    </h3>
                    <a
                      href="/docs"
                      className="text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white transition-colors shrink-0 -translate-x-2 "
                    >
                      Visit our developer documentation
                    </a>
                  </div>
                </div>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </div>
      </div>
    </>
  );
}
