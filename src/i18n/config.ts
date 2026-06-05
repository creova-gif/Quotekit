import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCA from './locales/en-CA.json';
import frCA from './locales/fr-CA.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en-CA',
    resources: {
      'en-CA': enCA,
      'en': enCA,
      'fr-CA': frCA,
      'fr': frCA,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
