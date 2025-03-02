import React from 'react';

interface DockProps {
  children: React.ReactNode;
}

export const Dock: React.FC<DockProps> = ({ children }) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {children}
    </div>
  );
};
