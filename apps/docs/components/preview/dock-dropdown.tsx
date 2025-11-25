/* @proprietary license */

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface DockDropdownProps {
  isOpen: boolean;
  children: ReactNode;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function DockDropdown({
  isOpen,
  children,
  onMouseEnter,
  onMouseLeave,
}: DockDropdownProps) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={
        isOpen ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }
      }
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className={`mt-1 ${isOpen ? '' : 'pointer-events-none'}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="py-6 px-2 md:px-4">{children}</div>
    </motion.div>
  );
}
