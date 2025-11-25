/* @proprietary license */

'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Job } from '@/lib/supabase/queries';
import JobCard from './job-card';
import { useTranslation } from '@/lib/contexts/translation-context';
import { t } from '@/lib/i18n/translations';

interface CareersClientProps {
  jobs: Job[];
  departments: string[];
  locations: string[];
}

export default function CareersClient({
  jobs,
  departments,
  locations,
}: CareersClientProps) {
  const { currentLanguage } = useTranslation();
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesDepartment =
        !selectedDepartment || job.department === selectedDepartment;
      const matchesLocation =
        !selectedLocation || job.location === selectedLocation;
      return matchesDepartment && matchesLocation;
    });
  }, [jobs, selectedDepartment, selectedLocation]);

  return (
    <>
      <div className="max-w-7xl mx-auto pl-2 pr-4 py-2">
        <div className="flex flex-col space-y-6 text-left mt-28">
          {/* Header with filters */}
          <motion.div
            className="mt-6 flex items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.h1
              className="text-2xl font-normal tracking-tighter text-left text-zinc-800 dark:text-white md:text-3xl max-w-7xl whitespace-pre-line mt-18 md:mt-0"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {String(t('careers.open_roles', currentLanguage))}
            </motion.h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <select
                  className="appearance-none px-3 py-2 pr-8 text-sm border border-zinc-200 dark:border-zinc-800 rounded-sm bg-background text-foreground hover:border-zinc-300 dark:hover:border-zinc-700 focus:border-primary focus:ring-0 transition-colors cursor-pointer min-w-[120px]"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  <option value="">
                    {String(t('careers.all_teams', currentLanguage))}
                  </option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-zinc-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              <div className="relative">
                <select
                  className="appearance-none px-3 py-2 pr-8 text-sm border border-zinc-200 dark:border-zinc-800 rounded-sm bg-background text-foreground hover:border-zinc-300 dark:hover:border-zinc-700 focus:border-primary focus:ring-0 transition-colors cursor-pointer min-w-[120px]"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  <option value="">
                    {String(t('careers.all_locations', currentLanguage))}
                  </option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-zinc-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              >
                <JobCard job={job} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
}
