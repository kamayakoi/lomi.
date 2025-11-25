/* @proprietary license */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { JobApplicationForm } from './job-application-form';
import { Badge } from '@/components/ui/badge';
import Spinner from '@/components/ui/spinner';
import { useTranslation } from '@/lib/contexts/translation-context';
import { t } from '@/lib/i18n/translations';
import { getJobBySlug, Job } from '@/lib/supabase/queries';

// Department color mapping based on button variants
const getDepartmentBadgeStyle = (department: string) => {
  const styles = {
    Engineering:
      'bg-[#56A5F9] text-white hover:bg-[#52A1F8] shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] active:brightness-99 dark:bg-sky-100 dark:text-sky-600 dark:hover:bg-sky-100 dark:hover:text-sky-900 dark:bg-sky-900 dark:text-sky-300 dark:hover:bg-sky-900 dark:hover:text-sky-200',
    GTM: 'bg-[#10B981] text-white hover:bg-[#059669] shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] active:brightness-99 dark:bg-green-100 dark:text-green-600 dark:hover:bg-green-100 dark:hover:text-green-900 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-900 dark:hover:text-green-200',
    Operations:
      'bg-[#F59E0B] text-white hover:bg-[#D97706] shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] active:brightness-99 dark:bg-amber-100 dark:text-amber-600 dark:hover:bg-amber-100 dark:hover:text-amber-900 dark:bg-amber-900 dark:text-amber-300 dark:hover:bg-amber-900 dark:hover:text-amber-200',
    HR: 'bg-[#E91E63] text-white hover:bg-[#C2185B] shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:brightness-101 active:brightness-99 dark:bg-pink-100 dark:text-pink-600 dark:hover:bg-pink-100 dark:hover:text-pink-900 dark:bg-pink-900 dark:text-pink-300 dark:hover:bg-pink-900 dark:hover:text-pink-200',
    Product:
      'bg-[#14B8A6] text-white hover:bg-[#0F9A8A] shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:brightness-101 active:brightness-99 dark:bg-teal-100 dark:text-teal-600 dark:hover:bg-teal-100 dark:hover:text-teal-900 dark:bg-teal-900 dark:text-teal-300 dark:hover:bg-teal-900 dark:hover:text-teal-200',
    Finance:
      'bg-[#E94441] text-white hover:bg-[#D32F2F] shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:brightness-101 active:brightness-99 dark:bg-red-100 dark:text-red-600 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-900 dark:hover:text-red-200',
    Legal:
      'bg-[#6B7280] text-white hover:bg-[#5A6370] shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:brightness-101 active:brightness-99 dark:bg-gray-100 dark:text-gray-600 dark:hover:bg-gray-100 dark:hover:text-gray-900 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-900 dark:hover:text-gray-200',
  };
  return styles[department as keyof typeof styles] || 'bg-gray-500 text-white';
};

// Job type color mapping based on button variants
const getJobTypeBadgeStyle = (type: string) => {
  const styles = {
    'Full time':
      'bg-[#10B981] text-white hover:bg-[#059669] shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] active:brightness-99 dark:bg-green-100 dark:text-green-600 dark:hover:bg-green-100 dark:hover:text-green-900 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-900 dark:hover:text-green-200',
    'Part time':
      'bg-[#F59E0B] text-white hover:bg-[#D97706] shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] active:brightness-99 dark:bg-amber-100 dark:text-amber-600 dark:hover:bg-amber-100 dark:hover:text-amber-900 dark:bg-amber-900 dark:text-amber-300 dark:hover:bg-amber-900 dark:hover:text-amber-200',
    Contract:
      'bg-[#14B8A6] text-white hover:bg-[#0F9A8A] shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:brightness-101 active:brightness-99 dark:bg-teal-100 dark:text-teal-600 dark:hover:bg-teal-100 dark:hover:text-teal-900 dark:bg-teal-900 dark:text-teal-300 dark:hover:bg-teal-900 dark:hover:text-teal-200',
    Internship:
      'bg-[#E91E63] text-white hover:bg-[#C2185B] shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:brightness-101 active:brightness-99 dark:bg-pink-100 dark:text-pink-600 dark:hover:bg-pink-100 dark:hover:text-pink-900 dark:bg-pink-900 dark:text-pink-300 dark:hover:bg-pink-900 dark:hover:text-pink-200',
    Freelance:
      'bg-[#6B7280] text-white hover:bg-[#5A6370] shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:brightness-101 active:brightness-99 dark:bg-gray-100 dark:text-gray-600 dark:hover:bg-gray-100 dark:hover:text-gray-900 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-900 dark:hover:text-gray-200',
  };
  return styles[type as keyof typeof styles] || 'bg-gray-500 text-white';
};

interface JobDetailClientProps {
  jobSlug: string;
}

export default function JobDetailClient({ jobSlug }: JobDetailClientProps) {
  const { currentLanguage } = useTranslation();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const jobData = await getJobBySlug(jobSlug);
        if (!jobData) {
          setError(String(t('careers.job_not_found', currentLanguage)));
          return;
        }
        setJob(jobData);
      } catch (err) {
        setError(String(t('careers.failed_to_load_job', currentLanguage)));
        console.error('Error fetching job:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobSlug, currentLanguage]);

  if (loading) {
    return (
      <section className="w-full py-8 md:py-20 lg:py-24 xl:py-32">
        <div className="max-w-7xl mx-auto pl-2 pr-4 py-2">
          <div className="flex justify-center items-center py-60">
            <Spinner className="w-8 h-8" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !job) {
    return (
      <section className="w-full py-8 md:py-20 lg:py-24 xl:py-32">
        <div className="max-w-7xl mx-auto pl-2 pr-4 py-2">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-foreground mb-4">
              {error || String(t('careers.job_not_found', currentLanguage))}
            </h1>
            <p className="text-muted-foreground mb-8">
              {error
                ? error
                : String(t('careers.job_does_not_exist', currentLanguage))}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-8 md:py-20 lg:py-24 xl:py-32">
      <div className="max-w-7xl mx-auto pl-2 pr-4 py-2">
        <motion.div
          className="flex flex-col space-y-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Job Header */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                className={`rounded-sm ${getDepartmentBadgeStyle(job.department)}`}
              >
                {job.department}
              </Badge>
              <Badge className={`rounded-sm ${getJobTypeBadgeStyle(job.type)}`}>
                {job.type}
              </Badge>
              <Badge className="rounded-sm bg-slate-50 text-gray-900 dark:text-white text-sm font-normal hover:bg-slate-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-gray-200 dark:border-[0.15px] dark:border-gray-700/20">
                {job.location}
              </Badge>
            </div>
            <h1 className="text-4xl font-normal tracking-tighter text-left text-zinc-800 dark:text-white md:text-5xl max-w-7xl whitespace-pre-line">
              {job.title}
            </h1>
            <p className="text-foreground/90 text-base leading-relaxed tracking-tight [&_strong]:font-semibold">
              {job.role_description}
            </p>
          </div>

          {/* Responsibilities */}
          {job.responsibilities && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">
                Responsibilities
              </h2>
              <ul className="space-y-3">
                {job.responsibilities.map((responsibility, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-foreground/90 text-base leading-relaxed tracking-tight [&_strong]:font-semibold"
                  >
                    <span className="text-primary mt-1 text-lg">•</span>
                    <span>{responsibility}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* About */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">
              About
            </h2>
            <p className="text-foreground/90 text-base leading-relaxed tracking-tight [&_strong]:font-semibold">
              {job.about_description}
            </p>
          </div>

          {/* Applying */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">
              Applying
            </h2>
            <p className="text-foreground/90 text-base leading-relaxed tracking-tight [&_strong]:font-semibold">
              {job.applying_description}
            </p>
          </div>

          {/* Application Form */}
          {!applicationSubmitted && (
            <div className="mt-6 pt-12 border-t -mb-4">
              <JobApplicationForm
                jobTitle={job.title}
                jobId={job.id}
                onSubmit={() => setApplicationSubmitted(true)}
              />
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
