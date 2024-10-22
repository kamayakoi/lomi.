import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '@/lib/locales/en.json';
import fr from '@/lib/locales/fr.json';

const defaultLanguage = 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
    },
    lng: localStorage.getItem('language') || navigator.language.split('-')[0] || defaultLanguage,
    fallbackLng: defaultLanguage,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
