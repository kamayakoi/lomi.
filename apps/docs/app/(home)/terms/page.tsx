/* @proprietary license */

import { detectLanguage } from '@/lib/i18n/server-utils';
import { t } from '@/lib/i18n/translations';
import type { Metadata } from 'next';
import TermsClient from '@/components/home/terms-client';

export async function generateMetadata(): Promise<Metadata> {
  const language = await detectLanguage();
  return {
    title: `Terms and conditions`,
    description: t('terms.description', language) as string,
  };
}

export default function TermsPage() {
  return (
    <main className="flex-1 pt-0">
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_10%,transparent_0%,var(--background)_75%)]"></div>

        <TermsClient />
      </div>
    </main>
  );
}
