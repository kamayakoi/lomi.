import React, { forwardRef } from 'react';

interface DockProps {
  children: React.ReactNode;
}

export const Dock = forwardRef<HTMLDivElement, DockProps>(
  ({ children }, ref) => {
    return (
      <div ref={ref} className="fixed top-2 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto pl-2 pr-4 py-2">{children}</div>
      </div>
    );
  },
);

Dock.displayName = 'Dock';
