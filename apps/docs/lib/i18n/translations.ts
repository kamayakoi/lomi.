/* @proprietary license */

import type { Language } from './config';

const STRINGS: Record<Language, Record<string, string>> = {
  en: {
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
  },
  fr: {
    'search.all': 'Tout',
    'search.core': 'Cœur',
    'search.fundamentalsDescription': "Introduction et fondamentaux",
    'search.apiReference': "Référence API",
    'search.apiReferenceDescription': "Guides et ressources REST",
    'search.filter': 'Filtrer',
    'search.search': 'Rechercher',
    'footer.company_disclaimer':
      "<p>Cette documentation décrit l'API marchande lomi. et les produits associés.</p>\n\n<p>Le comportement d'intégration peut évoluer ; consultez l'OpenAPI générée et votre tableau de bord pour les détails de référence.</p>",
    'components.business_outreach.message':
      'Vous construisez des paiements en Afrique de l’Ouest ? Prenez un court rendez-vous avec l’équipe.',
    'components.business_outreach.reach_out': 'Planifier un appel',
    'components.business_outreach.dismiss': 'Fermer',
  },
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
  lang: Language,
  values?: Record<string, string | number | undefined>,
): string {
  const primary = STRINGS[lang]?.[key];
  const fallback = STRINGS.en[key];
  const raw = primary ?? fallback ?? key;
  return interpolate(raw, values);
}

/** @deprecated Prefer `translate`; kept for call sites that pass `(key, lang)`. */
export function t(
  key: string,
  lang: Language,
  values?: Record<string, string | number | undefined>,
): string {
  return translate(key, lang, values);
}
