/* @proprietary license */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/contexts/translation-context';
import { t } from '@/lib/i18n/translations';
import { useTheme } from '@/lib/hooks/use-theme';
import { playClickSound } from '@/lib/utils/sound';

export default function BusinessOutreach() {
  const { currentLanguage } = useTranslation();
  const { resolvedTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // This runs only on the client, after initial render
    setMounted(true);
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    // Show the modal after 5 seconds
    const showTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    // Hide it after 1 minute of being shown
    const hideTimeout = setTimeout(() => {
      setIsVisible(false);
    }, 60000);

    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
    };
  }, []);

  const handleReachOut = () => {
    playClickSound();
    window.open('https://cal.com/babacar-diop/30min', '_blank');
    setIsVisible(false);
  };

  const handleDismiss = () => {
    playClickSound();
    setIsVisible(false);
  };

  if (!mounted || isMobile) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="business-outreach-banner"
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 z-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className="w-[calc(100vw-60px)] max-w-[370px] rounded-[4px] px-4 py-3 sm:px-5 sm:py-4"
            style={{
              backgroundColor:
                resolvedTheme === 'dark'
                  ? 'rgba(0, 0, 0, 0.9)'
                  : 'rgba(255, 255, 255, 0.95)',
              border:
                resolvedTheme === 'dark'
                  ? '1px solid rgba(255, 255, 255, 0.1)'
                  : '1px solid rgba(0, 0, 0, 0.1)',
            }}
          >
            <p
              className={`mb-2 sm:mb-3 text-xs sm:text-sm text-left select-none ${
                resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              {String(
                t('components.business_outreach.message', currentLanguage),
              )}
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <button
                onMouseDown={handleReachOut}
                className={`text-xs sm:text-sm hover:opacity-75 transition-colors font-medium ${
                  resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
              >
                {String(
                  t('components.business_outreach.reach_out', currentLanguage),
                )}
              </button>
              <button
                onMouseDown={handleDismiss}
                className={`text-xs sm:text-sm hover:opacity-75 transition-colors ${
                  resolvedTheme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                }`}
              >
                {String(
                  t('components.business_outreach.dismiss', currentLanguage),
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
