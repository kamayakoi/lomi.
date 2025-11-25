/* @proprietary license */

import Link from 'next/link';
import { useTranslation } from '@/lib/contexts/translation-context';
import { t } from '@/lib/i18n/translations';
import { playClickSound } from '@/lib/utils/sound';

interface Job {
  id: string;
  slug: string;
  title: string;
  department: string;
  type: string;
  location: string;
}

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const { currentLanguage } = useTranslation();

  return (
    <Link href={`/careers/${job.slug}`} onClick={playClickSound}>
      <div className="flex items-center justify-between rounded-sm border border-zinc-200 dark:border-zinc-800 bg-background hover:bg-muted/50 px-6 py-4 transition-colors cursor-pointer">
        <div>
          <h3 className="mb-1 text-lg font-medium text-zinc-800 dark:text-white">
            {job.title}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {job.department} · {job.type} · {job.location}
          </p>
        </div>
        <span className="whitespace-nowrap text-sm font-medium text-[#56A5F9] dark:text-sky-300 transition-colors">
          {String(t('careers.apply', currentLanguage))}
        </span>
      </div>
    </Link>
  );
}
