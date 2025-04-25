'use client';

import { usePathname } from 'next/navigation';
import enTranslations from '@/locales/en.json';
import deTranslations from '@/locales/de.json';
import { useMemo } from 'react';

// Define a type for language codes
type LanguageCode = 'en' | 'de';

// Define a map of translations
const translations = {
  en: enTranslations,
  de: deTranslations,
};

// Define a type for the entire translations object
type Translations = typeof enTranslations;

// Helper function to get nested values using dot notation
const getNestedValue = (obj: any, path: string) => {
  const keys = path.split('.');
  return keys.reduce((acc, key) => {
    return acc && acc[key] !== undefined ? acc[key] : undefined;
  }, obj);
};

// Helper function to interpolate variables in strings
const interpolate = (text: string, variables?: Record<string, string | number>): string => {
  if (!variables) return text;
  
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return variables[key]?.toString() || `{{${key}}}`;
  });
};

export default function useTranslation() {
  // Get the pathname from Next.js hooks
  const pathname = usePathname();
  
  // Determine the current language
  // Default to 'de' if we can't determine the language from the URL
  const language = useMemo(() => {
    // Check for language prefix in the pathname
    if (pathname?.startsWith('/de')) {
      return 'de';
    }
    if (pathname?.startsWith('/en')) {
      return 'en';
    }
    
    // Default fallback
    return 'de' as LanguageCode;
  }, [pathname]);

  // Translation function with fallback to English
  const t = (key: string, variables?: Record<string, string | number>): string => {
    // Get the translation from the current language
    const translation = getNestedValue(translations[language], key);
    
    // If translation exists, interpolate variables and return
    if (translation) {
      return interpolate(translation, variables);
    }
    
    // Fallback to English
    const fallbackTranslation = getNestedValue(translations.en, key);
    
    // If fallback exists, interpolate variables and return
    if (fallbackTranslation) {
      return interpolate(fallbackTranslation, variables);
    }
    
    // Return the key as a last resort to avoid displaying nothing
    return key;
  };

  return {
    t,
    language,
    isEN: language === 'en',
    isDE: language === 'de',
  };
} 