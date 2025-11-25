import { cn } from '@/lib/utils/cn';
import React from 'react';

export function Section({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={cn('my-32 col', className)}>{children}</section>;
}

export function SectionHeader({
  tag,
  title,
  description,
  className,
}: {
  tag?: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn('col gap-4 mb-14', className)}>
      {tag}
      <h2 className="max-w-3xl text-4xl font-normal tracking-tighter text-left text-zinc-800 dark:text-white md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground max-w-screen-sm">{description}</p>
      )}
    </div>
  );
}
