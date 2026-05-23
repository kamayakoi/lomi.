/* @proprietary license */

import { getDocsLocale } from '@/lib/utils/docs-locale';
import { translate } from '@/lib/i18n/translations';

export default async function NotFound() {
  const locale = await getDocsLocale();
  const label = translate('ui.notFound', locale);

  return (
    <div className="flex h-svh items-center justify-center bg-background px-4">
      <h1 className="font-mono text-[clamp(1.25rem,6vw,2.5rem)] font-black tracking-tight text-foreground">
        {label}
      </h1>
    </div>
  );
}
