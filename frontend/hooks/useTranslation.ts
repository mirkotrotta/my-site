"use client";

import { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import enTranslations from '../locales/en.json';
import deTranslations from '../locales/de.json';

type TranslationKey = string;

// Define basic translations to use before JSON loads
const baseTranslations: Record<string, Record<string, string>> = {
  en: {
    // Common
    'common.navigation.home': 'Home',
    'common.navigation.about': 'About',
    'common.navigation.projects': 'Projects',
    'common.navigation.blog': 'Blog',
    'common.navigation.resume': 'Resume',
    'common.navigation.contact': 'Contact',
    'common.buttons.readMore': 'Read More',
    'common.buttons.viewAll': 'View All',
    'common.buttons.download': 'Download',
    'common.buttons.contact': 'Contact Me',
    'common.buttons.viewProjects': 'View Projects',
    'common.buttons.viewResume': 'View Resume',
    'common.footer.copyright': '© {{year}} Mirko Trotta. All rights reserved.',
    'common.footer.builtWith': 'Built with Next.js and Tailwind CSS',
    'common.darkMode.toggle': 'Toggle dark mode',
    'common.language.en': 'English',
    'common.language.de': 'German',
    'common.language.switchLanguage': 'Switch to {{language}}',
    'common.loading': 'Loading content...',
    // Blog
    'blog.title': 'Latest Articles',
    'blog.subtitle': 'Thoughts on development, design, and systems',
    'blog.readTime': '{{minutes}} min read',
    'blog.viewAll': 'View All Articles',
    'blog.noPosts': 'No blog posts found.'
  },
  de: {
    // Common
    'common.navigation.home': 'Startseite',
    'common.navigation.about': 'Über mich',
    'common.navigation.projects': 'Projekte',
    'common.navigation.blog': 'Blog',
    'common.navigation.resume': 'Lebenslauf',
    'common.navigation.contact': 'Kontakt',
    'common.buttons.readMore': 'Mehr erfahren',
    'common.buttons.viewAll': 'Alle anzeigen',
    'common.buttons.download': 'Herunterladen',
    'common.buttons.contact': 'Kontaktiere mich',
    'common.buttons.viewProjects': 'Projekte ansehen',
    'common.buttons.viewResume': 'Lebenslauf ansehen',
    'common.footer.copyright': '© {{year}} Mirko Trotta. Alle Rechte vorbehalten.',
    'common.footer.builtWith': 'Erstellt mit Next.js und Tailwind CSS',
    'common.darkMode.toggle': 'Dunkelmodus umschalten',
    'common.language.en': 'Englisch',
    'common.language.de': 'Deutsch',
    'common.language.switchLanguage': 'Zu {{language}} wechseln',
    'common.loading': 'Inhalte werden geladen...',
    // Blog
    'blog.title': 'Neueste Artikel',
    'blog.subtitle': 'Gedanken zu Entwicklung, Design und Systemen',
    'blog.readTime': '{{minutes}} Min. Lesezeit',
    'blog.viewAll': 'Alle Artikel ansehen',
    'blog.noPosts': 'Keine Blogbeiträge gefunden.'
  }
};

// Convert nested JSON structure to flat key-value pairs
function flattenMessages(nestedMessages: any, prefix = ''): Record<string, string> {
  return Object.keys(nestedMessages).reduce((messages: Record<string, string>, key) => {
    const value = nestedMessages[key];
    const prefixedKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'string') {
      messages[prefixedKey] = value;
    } else {
      Object.assign(messages, flattenMessages(value, prefixedKey));
    }
    
    return messages;
  }, {});
}

// Load translations from imported JSON files
const loadedTranslations = {
  en: flattenMessages(enTranslations),
  de: flattenMessages(deTranslations),
};

export default function useTranslation() {
  const pathname = usePathname();
  const locale = pathname ? pathname.split('/')[1] : 'en';
  
  const messages = locale === 'de' ? loadedTranslations.de : loadedTranslations.en;

  const t = useCallback((key: TranslationKey): string => {
    const translation = messages[key];
    if (!translation) {
      // Return the last part of the key as fallback
      const parts = key.split('.');
      return parts[parts.length - 1].charAt(0).toUpperCase() + parts[parts.length - 1].slice(1);
    }
    return translation;
  }, [messages]);
  
  return { t, language: locale };
}