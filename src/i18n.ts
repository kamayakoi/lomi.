import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '@/lib/locales/en.json';
import fr from '@/lib/locales/fr.json';
import es from '@/lib/locales/es.json';
import pt from '@/lib/locales/pt.json';
import zh from '@/lib/locales/zh.json';

const defaultLanguage = 'en';
const savedLanguage = localStorage.getItem('language');
const browserLanguage = navigator.language.split('-')[0];

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      es: { translation: es },
      pt: { translation: pt },
      zh: { translation: zh }
    },
    lng: savedLanguage || browserLanguage || defaultLanguage,
    fallbackLng: defaultLanguage,
    interpolation: {
      escapeValue: false,
    },
    // Add performance optimizations
    load: 'languageOnly',
    preload: [defaultLanguage],
    keySeparator: '.',
    nsSeparator: ':',
  });

export default i18n;
