import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '@/lib/locales/en.json';
import fr from '@/lib/locales/fr.json';
import es from '@/lib/locales/es.json';
import pt from '@/lib/locales/pt.json';
import zh from '@/lib/locales/zh.json';
import { supabase } from '@/utils/supabase/client';

const defaultLanguage = 'en';
const savedLanguage = localStorage.getItem('language');
const browserLanguage = navigator.language.split('-')[0];

// Initialize i18n with all available languages
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
    load: 'languageOnly',
    preload: [defaultLanguage],
    keySeparator: '.',
    nsSeparator: ':',
  });

// Function to update language based on merchant preference
export async function updateLanguageFromMerchant() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .rpc('fetch_merchant_details', { p_user_id: user.id });

    if (error || !data || data.length === 0) return;

    const { preferred_language } = data[0];
    if (preferred_language && i18n.language !== preferred_language) {
      await i18n.changeLanguage(preferred_language);
    }
  } catch (error) {
    console.error('Error fetching merchant language:', error);
  }
}

// Initial language check for portal routes
if (window.location.pathname.startsWith('/portal')) {
  updateLanguageFromMerchant();
}

// Watch for route changes
let lastPathname = window.location.pathname;
const observer = new MutationObserver(() => {
  if (window.location.pathname !== lastPathname) {
    lastPathname = window.location.pathname;
    if (lastPathname.startsWith('/portal')) {
      updateLanguageFromMerchant();
    }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

export default i18n;
