import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

// Initialize i18next and check for language preference in localStorage
i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: '/locales/locale-{{lng}}.json',
    },
    lng: localStorage.getItem('language') || 'en',
    supportedLngs: ['en', 'hu', 'ro'],
    fallbackLng: 'en',
    ns: ['translation'],
    defaultNS: 'translation',
    debug: false,
  });
