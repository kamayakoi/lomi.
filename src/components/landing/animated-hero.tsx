import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import { ButtonExpand } from "@/components/design/button-expand";

function Hero() {
  const { t } = useTranslation();
  const titles = useMemo(
    () => [
      t('hero.title.rotatingWords.0'),
      t('hero.title.rotatingWords.1'),
      t('hero.title.rotatingWords.2'),
      t('hero.title.rotatingWords.3')
    ],
    [t]
  );
  const [titleNumber, setTitleNumber] = useState(0);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2500);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full select-none mt-[200px] sm:mt-0">
      <div className="container mx-auto px-4 sm:px-0">
        <div className="flex flex-col gap-8">
          {/* Launch and Developer buttons */}
          <div className="flex flex-col sm:flex-row items-start gap-4 w-full max-w-2xl pl-0 sm:pl-2">
            <Button
              variant="ghost"
              className="gap-2 font-medium transition-all duration-300 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/40 dark:hover:text-blue-200 whitespace-nowrap text-sm sm:text-base border border-zinc-200 dark:border-zinc-800"
            >
              {t('hero.buttons.launch')} <MoveRight className="w-4 h-4" />
            </Button>
            <div className="[&>button]:shadow-none [&>button]:text-sm [&>button]:sm:text-base [&>button]:whitespace-nowrap">
              <ButtonExpand
                text={t('hero.buttons.developers')}
                icon={Code}
                bgColor="bg-orange-50 dark:bg-orange-900/30"
                textColor="text-orange-700 dark:text-orange-300"
                hoverBgColor="hover:bg-orange-100 dark:hover:bg-orange-900/40"
                hoverTextColor="hover:text-orange-800 dark:hover:text-orange-200"
                onClick={() => window.open('https://developers.lomi.africa', '_blank')}
              />
            </div>
          </div>

          {/* Hero content */}
          <div className="flex gap-4 sm:gap-4 flex-col pl-0 sm:pl-2">
            <h1 className="flex flex-col text-4xl sm:text-5xl md:text-7xl max-w-4xl tracking-tighter text-left font-regular text-zinc-800 dark:text-white">
              <div className="flex items-center h-14 sm:h-20">
                <span>{t('hero.title.prefix')}</span>
                <div className="relative flex items-center min-w-[280px] ml-4">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={titleNumber}
                      className="absolute text-zinc-800 dark:text-white font-semibold"
                      initial={{ opacity: 0, y: titleNumber === 0 ? -50 : 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: titleNumber === 0 ? 50 : -50 }}
                      transition={{
                        type: "spring",
                        stiffness: 50,
                        duration: 1,
                        exit: { duration: 0.8 }
                      }}
                    >
                      {titles[titleNumber]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
              <span>{t('hero.title.suffix')}</span>
            </h1>

            <p className="text-zinc-600 dark:text-zinc-200 text-base sm:text-lg md:text-xl leading-relaxed tracking-tight max-w-2xl text-left">
              {t('hero.description')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
