/* @proprietary license */

'use client';

import React, { type HTMLAttributes, useEffect, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils/cn';
import { fetchContributors, type Contributor } from '@/lib/get-contributors';
import { t } from '@/lib/i18n/translations';

export interface ContributorCounterProps
    extends HTMLAttributes<HTMLDivElement> {
    repoOwner: string;
    repoName: string;
    displayCount?: number;
}

export default function ContributorCounter({
    repoOwner,
    repoName,
    displayCount = 20,
    ...props
}: ContributorCounterProps) {
    const [contributors, setContributors] = useState<Contributor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchContributors(repoOwner, repoName);
                setContributors(data);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : 'Failed to fetch contributors',
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [repoOwner, repoName]);

    const topContributors = contributors
        .filter((contributor) => contributor.login !== repoOwner)
        .slice(0, displayCount);

    if (loading) {
        return (
            <div
                {...props}
                className={cn('flex flex-col items-center gap-4', props.className)}
            >
                <div className="flex flex-row flex-wrap items-center justify-center md:pe-4">
                    {Array.from({ length: displayCount }).map((_, i) => (
                        <div
                            key={i}
                            className="size-10 md:size-12 rounded-full bg-muted animate-pulse"
                        />
                    ))}
                </div>
                <div className="text-center text-sm text-muted-foreground">
                    {String(t('contributors.loading', 'en'))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div
                {...props}
                className={cn('flex flex-col items-center gap-4', props.className)}
            >
                <div className="text-center text-sm text-muted-foreground">
                    {String(t('contributors.error', 'en'))}
                </div>
            </div>
        );
    }

    return (
        <div
            {...props}
            className={cn('flex flex-col items-center gap-4', props.className)}
        >
            <div className="flex flex-row flex-wrap items-center justify-center md:pe-4">
                {topContributors.map((contributor, i) => (
                    <a
                        key={contributor.login}
                        href={`https://github.com/${contributor.login}`}
                        rel="noreferrer noopener"
                        target="_blank"
                        className="relative size-12 overflow-hidden rounded-full border-4 border-gray-800 bg-background md:-mr-4 md:size-16"
                        style={{
                            zIndex: topContributors.length - i,
                        }}
                    >
                        <Image
                            src={contributor.avatar_url}
                            alt={`${contributor.login}'s avatar`}
                            unoptimized
                            fill
                            className="object-cover"
                        />
                    </a>
                ))}

                {displayCount < contributors.length ? (
                    <div className="size-16 content-center rounded-full bg-secondary text-center">
                        +{contributors.length - displayCount}
                    </div>
                ) : null}
            </div>

            <div className="flex justify-center">
                <div className="bg-slate-50 border border-gray-200 dark:bg-zinc-800 dark:border-[0.15px] dark:border-gray-700/20 rounded-sm px-3 py-1 text-center text-sm text-muted-foreground">
                    {String(t('contributors.subtitle', 'en'))}
                </div>
            </div>
        </div>
    );
}
