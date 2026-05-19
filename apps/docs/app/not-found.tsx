/* @proprietary license */

import { FuzzyText } from '@/components/preview/fuzzy-text';
import { getDocsLocale } from '@/lib/utils/docs-locale';
import { translate } from '@/lib/i18n/translations';

export default async function NotFound() {
  const locale = await getDocsLocale();
  const label = translate('ui.notFound', locale);

  return (
    <div className="h-svh overflow-hidden flex items-center justify-center translate-x-13">
      <FuzzyText
        fontSize="clamp(1.25rem, 6vw, 2.5rem)"
        fontWeight={900}
        fontFamily="Fira Mono, monospace"
        baseIntensity={0.2}
        hoverIntensity={0.4}
        enableHover={true}
      >
        {label}
      </FuzzyText>
    </div>
  );
}
