/* @proprietary license */

import type { Metadata } from 'next';
import JobDetailClient from '@/components/home/job-detail-client';
import { getJobBySlugServer } from '@/lib/supabase/queries.server';
import { detectLanguage } from '@/lib/i18n/server-utils';
import { t } from '@/lib/i18n/translations';

interface PageProps {
  params: Promise<{
    jobslug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { jobslug: jobSlug } = await params;
  const language = await detectLanguage();

  const job = await getJobBySlugServer(jobSlug);
  const title =
    job?.title || (t('careers.job_opportunity', language) as string);

  return {
    title: `${title}`,
    description: (t('careers.apply_for_role', language) as string).replace(
      '{{title}}',
      title,
    ),
  };
}

export default async function JobDetailPage({ params }: PageProps) {
  const { jobslug: jobSlug } = await params;

  return (
    <main className="flex-1 pt-0">
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_10%,transparent_0%,var(--background)_75%)]"></div>

        <JobDetailClient jobSlug={jobSlug} />
      </div>
    </main>
  );
}
