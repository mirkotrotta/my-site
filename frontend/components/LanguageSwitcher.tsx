'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import useTranslation from '@/hooks/useTranslation';
import { setCookie } from 'cookies-next';

// Define available languages
const availableLanguages = [
  { code: 'en', name: 'English', shortCode: 'EN', flag: 'EN' },
  { code: 'de', name: 'Deutsch', shortCode: 'DE', flag: 'DE' },
  // Add more languages here in the future
];

interface LanguageSwitcherProps {
  className?: string;
}

export default function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { language, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = availableLanguages.find(lang => lang.code === language) || availableLanguages[0];

  const handleLanguageChange = (targetLanguage: string) => {
    if (isChanging || targetLanguage === language) {
      setIsOpen(false);
      return;
    }

    setIsChanging(true);
    setIsOpen(false);

    // Calculate the new URL
    let newPathname = '';
    if (pathname === '/en' || pathname === '/de') {
      newPathname = `/${targetLanguage}`;
    } else if (pathname?.startsWith('/en/') || pathname?.startsWith('/de/')) {
      const pathWithoutLang = pathname.substring(3);
      newPathname = `/${targetLanguage}${pathWithoutLang}`;
    } else {
      newPathname = `/${targetLanguage}`;
    }

    // Save the preference in a cookie
    setCookie('NEXT_LOCALE', targetLanguage, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
    });

    // Navigate to the new URL
    router.push(newPathname);

    // Reset isChanging after navigation potentially finishes or times out
    const timer = setTimeout(() => {
      setIsChanging(false);
    }, 1000); // Increased timeout slightly

    return () => clearTimeout(timer);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // Also ensure isChanging is reset on unmount
      setIsChanging(false);
    };
  }, []);

  // Reset changing state if language prop changes externally
  useEffect(() => {
    setIsChanging(false);
  }, [language]);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isChanging}
        className="inline-flex items-center justify-center p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-1 focus:ring-inset focus:ring-indigo-500 dark:focus:ring-indigo-600 transition-colors"
        {...{
          'aria-haspopup': 'true',
          'aria-expanded': isOpen ? 'true' : 'false',
          'aria-label': t('common.language.switchLanguage')
        }}
      >
        {/* Globe icon */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
        {currentLanguage.flag}
        {/* Chevron icon */}
        <svg className="-mr-0.5 ml-0.5 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex={-1}
        >
          <div className="py-1" role="none">
            {availableLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                disabled={isChanging || lang.code === language}
                className={`${lang.code === language
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-300'
                  } flex items-center w-full px-3 py-1.5 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                role="menuitem"
                tabIndex={-1}
              >
                <span className="mr-2">{lang.flag}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 