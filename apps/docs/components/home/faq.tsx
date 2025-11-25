/* @proprietary license */

'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/contexts/translation-context';
import { t, getTranslations } from '@/lib/i18n/translations';
import { playClickSound } from '@/lib/utils/sound';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

interface FaqSectionProps extends React.HTMLAttributes<HTMLElement> {
  contactInfo?: {
    title: string;
    description: string;
    buttonText: string;
    onContact?: () => void;
  };
}

const FaqSection = React.forwardRef<HTMLElement, FaqSectionProps>(
  ({ className, contactInfo, ...props }, ref) => {
    const { currentLanguage } = useTranslation();
    const translations = getTranslations(currentLanguage);
    const faqData = (
      translations.faq as unknown as {
        questions: { question: string; answer: string }[];
      }
    ).questions;

    return (
      <section
        ref={ref}
        id="faq"
        className={cn('pt-10 pb-32', className)}
        {...props}
      >
        <div className="mx-auto max-w-5xl pl-4 pr-6 md:pl-2 sm:pr-4">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="text-center mb-12">
              <div className="inline-flex items-center rounded-sm border border-zinc-200 dark:border-zinc-800 px-3 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-4">
                {t('faq.badge', currentLanguage) as string}
              </div>
              <h2 className="text-2xl font-regular tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl text-zinc-800 dark:text-white mb-3">
                {t('faq.title', currentLanguage) as string}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed tracking-tight max-w-2xl mx-auto">
                {t('faq.subtitle', currentLanguage) as string}
              </p>
            </div>

            {/* FAQ Items */}
            <div className="max-w-2xl mx-auto w-full">
              <Accordion type="single" collapsible>
                {faqData.map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={index.toString()}
                    className={cn(
                      'group',
                      'transition-all duration-200 ease-in-out',
                      'hover:bg-muted/50',
                    )}
                  >
                    <AccordionTrigger
                      onClick={playClickSound}
                      className="w-full px-0 py-2 h-auto justify-between hover:bg-transparent items-start flex-wrap sm:flex-nowrap [&[data-state=open]>svg]:rotate-180"
                    >
                      <h3
                        className={cn(
                          'text-base sm:text-lg font-medium transition-colors duration-200 text-left leading-relaxed',
                          'text-gray-600 dark:text-white',
                          'wrap-break-word whitespace-normal word-break hyphens-auto flex-1',
                          'data-[state=open]:text-gray-900! data-[state=open]:dark:text-white!',
                        )}
                      >
                        {item.question}
                      </h3>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-2">
                      <motion.p
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-foreground/80 text-sm leading-relaxed text-left"
                      >
                        {item.answer}
                      </motion.p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Contact Section */}
            {contactInfo && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="max-w-md mx-auto mt-12 p-6 rounded-sm text-center"
              >
                <div className="inline-flex items-center justify-center p-1.5 rounded-sm mb-4">
                  <Mail className="h-3 w-3" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">
                  {contactInfo.title}
                </p>
                <p className="text-xs text-foreground/80 mb-4">
                  {contactInfo.description}
                </p>
                <Button
                  size="header"
                  onClick={() => {
                    contactInfo.onContact?.();
                    playClickSound();
                  }}
                >
                  {contactInfo.buttonText}
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    );
  },
);
FaqSection.displayName = 'FaqSection';

export { FaqSection };
