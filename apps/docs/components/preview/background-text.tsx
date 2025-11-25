/* @proprietary license */

'use client';

import { Logo } from '@/lib/utils/logo';
// import { useTranslation } from "@/lib/contexts/translation-context";
// import { t } from "@/lib/i18n/translations";
import { ReactNode } from 'react';

interface BackgroundTextProps {
  children?: ReactNode;
}

export function BackgroundText({ children }: BackgroundTextProps) {
  return (
    <div className="max-w-7xl mx-auto overflow-hidden mt-[-80px] h-[240px] translate-y-4 md:mt-[-100px] md:h-[388px] relative z-0 pointer-events-none">
      <div className="absolute right-0 w-[500px] h-[333px] object-cover md:w-[1000px] md:h-[330px] origin-bottom  translate-y-[25px] md:translate-y-0 opacity-[0.06] select-none pointer-events-none">
        <Logo
          width={1000}
          height={445}
          className="w-full h-full object-cover"
          priority={false}
        />
      </div>

      {/* Horizontal line */}
      {/* <div className="hidden md:block absolute top-3/4 md:top-[82%] w-full h-px bg-zinc-200 dark:bg-zinc-800" /> */}

      {/* Overlay for the bottom half to make it less visible */}
      {/* <div className="hidden md:block absolute top-3/4 md:top-[82%] bottom-0 left-0 right-0 bg-background/60 dark:bg-background/80 pointer-events-none" /> */}

      {/* BCEAO Accreditation */}
      {/* <div className="hidden md:block absolute top-[calc(75%+8px)] md:top-[calc(82%+8px)] right-16 md:right-44 z-20 pointer-events-auto">
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 max-w-lg text-right leading-relaxed">
          {t("footer.bceao_accreditation", currentLanguage) as string}
        </p>
      </div> */}

      <div className="relative z-10 h-full md:h-[calc(100%+1rem)] md:-mb-8">
        {children}
      </div>
    </div>
  );
}
