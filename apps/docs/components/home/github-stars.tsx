/* @proprietary license */

'use client';

import React from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { playClickSound } from '@/lib/utils/sound';
import { useGithubStars } from '@/lib/hooks/use-github-stars-hooks';

export function GithubStars() {
  const starCount = useGithubStars();

  return (
    <Link
      href="https://github.com/lomiafrica/lomi."
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center"
      onMouseDown={() => playClickSound()}
    >
      <div className="flex items-center gap-0.5 text-amber-500 hover:text-amber-400 dark:text-amber-400 dark:hover:text-amber-300 transition-colors">
        <Star className="h-2.5 w-2.5 text-amber-500 hover:text-amber-400 dark:text-amber-400 dark:hover:text-amber-300 fill-current" />
        <span className="text-[10px] font-medium text-amber-500 hover:text-amber-400 dark:text-amber-400 dark:hover:text-amber-300">
          {starCount !== null ? starCount.toLocaleString() : '10'}
        </span>
      </div>
    </Link>
  );
}
