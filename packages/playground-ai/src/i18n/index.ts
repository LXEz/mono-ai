import { en } from '@/i18n/resource/en';
import { zh } from '@/i18n/resource/zh';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

// Language resources
const resources = {
  en: en,
  zh: zh,
};

// Initialize i18n instance
if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      lng: 'zh', // Default language
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
    });
}

export default i18n;
