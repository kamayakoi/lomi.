/* @proprietary license */

import type { Metadata } from 'next';
import BlogClient from '@/components/blog/blog-client';
import { detectLanguage } from '@/lib/i18n/server-utils';
import { t } from '@/lib/i18n/translations';

export async function generateMetadata(): Promise<Metadata> {
  const language = await detectLanguage();

  return {
    title: `Blog`,
    description: t('blog.description', language) as string,
    openGraph: {
      title: `Blog`,
      description: t('blog.description', language) as string,
      images: [
        {
          url: '/banner.webp',
          width: 1200,
          height: 630,
          alt: 'lomi. Blog',
        },
      ],
    },
  };
}

export default function Blog() {
  return (
    <main className="flex-1 pt-0">
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_10%,transparent_0%,var(--background)_75%)]"></div>

        <BlogClient />
      </div>
    </main>
  );
}
