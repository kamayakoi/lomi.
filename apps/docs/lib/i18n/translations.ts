/* @proprietary license */

import type { Language } from './config';

const STRINGS: Record<string, string> = {
  'search.all': 'All',
  'search.core': 'Core',
  'search.fundamentalsDescription': 'Introduction and fundamentals',
  'search.apiReference': 'API reference',
  'search.apiReferenceDescription': 'REST guides and resources',
  'search.filter': 'Filter',
  'search.search': 'Search',
  'footer.company_disclaimer':
    '<p>This documentation describes the lomi. merchant API and related products.</p>\n\n<p>Integration behavior can change; use the generated OpenAPI reference and your dashboard for authoritative details.</p>',
  'components.business_outreach.message':
    'Building payments for West Africa? Book a short call with the team.',
  'components.business_outreach.reach_out': 'Schedule a call',
  'components.business_outreach.dismiss': 'Dismiss',
};

function interpolate(
  template: string,
  values?: Record<string, string | number | undefined>,
): string {
  if (!values) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) =>
    values[key] !== undefined && values[key] !== null
      ? String(values[key])
      : '',
  );
}

export function translate(
  key: string,
  _lang: Language,
  values?: Record<string, string | number | undefined>,
): string {
  const raw = STRINGS[key] ?? key;
  return interpolate(raw, values);
}

/** @deprecated Prefer `translate`; kept for call sites that pass `(key, lang)`. */
export function t(
  key: string,
  _lang: Language,
  values?: Record<string, string | number | undefined>,
): string {
  return translate(key, _lang, values);
}
