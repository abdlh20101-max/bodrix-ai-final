import { useState, useEffect } from 'react';
import type { Language } from '@/lib/i18n';
import { t } from '@/lib/i18n';

export function useLanguage() {
  const [language, setLanguage] = useState<Language>('ar');

  useEffect(() => {
    // Get language from localStorage or browser preference
    const savedLanguage = localStorage.getItem('language') as Language | null;
    if (savedLanguage && (savedLanguage === 'ar' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
      document.documentElement.lang = savedLanguage;
      document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
    } else {
      const browserLang = navigator.language.startsWith('ar') ? 'ar' : 'en';
      setLanguage(browserLang);
      document.documentElement.lang = browserLang;
      document.documentElement.dir = browserLang === 'ar' ? 'rtl' : 'ltr';
    }
  }, []);

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    document.documentElement.lang = newLanguage;
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
  };

  const translate = (key: string) => t(key, language);

  return { language, changeLanguage, t: translate };
}
