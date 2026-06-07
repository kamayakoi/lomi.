'use client';

import * as React from 'react';
import { Sun, Moon } from 'lucide-react';

export interface ComponentPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function ComponentPreview({
  children,
  className,
  ...props
}: ComponentPreviewProps) {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  return (
    <div
      className={`not-prose relative flex flex-col rounded-sm border overflow-hidden transition-colors ${
        isDarkMode ? 'dark border-border bg-background' : 'border-border bg-background'
      } ${className || ''}`}
      {...props}
    >
      <div className="flex items-center justify-end border-b border-border bg-muted/20 p-2">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-sm text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          title="Toggle dark mode"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
      <div className="flex min-h-[350px] w-full items-center justify-center p-10">
        <div className="w-full flex justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}
