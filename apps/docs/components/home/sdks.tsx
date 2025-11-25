/* @proprietary license */

import { Section, SectionHeader } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/contexts/translation-context';
import { t } from '@/lib/i18n/translations';
import {
  AgnosticBackground,
  ContentAdoptionBackground,
} from './agnostic-background';
import ContributorCounter from './contributor-counter';

export function Features() {
  const { currentLanguage } = useTranslation();
  return (
    <Section className="mb-8 lg:mb-28">
      <div className="max-w-7xl mx-auto pl-2 pr-4 py-2">
        <SectionHeader
          title={String(t('sdks.title', currentLanguage))}
          className="mb-6 md:mb-8"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="size-full"
          >
            <Card className="relative flex flex-col overflow-hidden z-2 rounded-sm h-[400px]">
              <CardContent className="p-6 relative h-full">
                <h3 className="text-xl font-semibold mb-6">
                  Framework agnostic
                </h3>
                <p className="text-muted-foreground">
                  Official support and SDKs for Next.js, Sanity, Medusa,
                  Typescript, Javascript, Go, Python and PHP — portable for all
                  your needs.
                </p>
                <div className="absolute bottom-6 left-6 flex flex-row gap-2 bg-primary text-primary-foreground rounded-xl p-2 w-fit">
                  <svg
                    fill="currentColor"
                    role="img"
                    viewBox="0 0 24 24"
                    className="size-6"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>Next.js</title>
                    <path d="M18.665 21.978C16.758 23.255 14.465 24 12 24 5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251l9.85 12.727Zm-3.332-8.533 1.6 2.061V7.2h-1.6v6.245Z" />
                  </svg>
                </div>
              </CardContent>
              <AgnosticBackground variant="masked" />
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="size-full"
          >
            <Card className="relative flex flex-col overflow-hidden z-2 rounded-sm h-[400px]">
              <CardContent className="p-6 flex flex-col h-full">
                <h3 className="text-xl font-semibold mb-6">Community driven</h3>
                <div className="flex-1 flex items-center justify-center">
                  <ContributorCounter
                    repoOwner="lomiafrica"
                    repoName="lomi."
                    displayCount={12}
                    className="w-full"
                  />
                </div>
              </CardContent>
              <div className="absolute inset-0 -z-1">
                <ContentAdoptionBackground
                  className="size-full"
                  softness={1}
                  intensity={0.8}
                  noise={0.3}
                  minPixelRatio={1}
                />
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
