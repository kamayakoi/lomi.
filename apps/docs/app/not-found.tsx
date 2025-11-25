/* @proprietary license */

import { FuzzyText } from '@/components/preview/fuzzy-text';

export default function NotFound() {
  return (
    <div className="h-svh overflow-hidden flex items-center justify-center translate-x-13">
      <FuzzyText
        fontSize="clamp(4rem, 20vw, 12rem)"
        fontWeight={900}
        fontFamily="Fira Mono, monospace"
        baseIntensity={0.2}
        hoverIntensity={0.4}
        enableHover={true}
      >
        NOT FOUND
      </FuzzyText>
    </div>
  );
}
