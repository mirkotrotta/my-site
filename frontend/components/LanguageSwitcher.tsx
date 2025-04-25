'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import useTranslation from '@/hooks/useTranslation';
import { setCookie } from 'cookies-next';

interface LanguageSwitcherProps {
  className?: string;
}

export default function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { language, t } = useTranslation();
  const [isChanging, setIsChanging] = useState(false);

  // Determine the language to switch to
  const targetLanguage = language === 'en' ? 'de' : 'en';
  
  // Get the translated language name
  const targetLanguageName = t(`common.language.${targetLanguage}`);

  const handleLanguageChange = () => {
    if (isChanging) return;
    
    setIsChanging(true);
    
    // Calculate the new URL
    let newPathname = '';
    
    if (pathname === '/en' || pathname === '/de') {
      // If on the homepage, simply switch to the other language homepage
      newPathname = `/${targetLanguage}`;
    } else if (pathname?.startsWith('/en/') || pathname?.startsWith('/de/')) {
      // For subpages, maintain the same path but change the language prefix
      const pathWithoutLang = pathname.substring(3); // Remove '/en/' or '/de/'
      newPathname = `/${targetLanguage}${pathWithoutLang}`;
    } else {
      // Fallback for unexpected paths
      newPathname = `/${targetLanguage}`;
    }
    
    // Save the preference in a cookie
    setCookie('NEXT_LOCALE', targetLanguage, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
    });
    
    // Navigate to the new URL
    router.push(newPathname);
    
    // Add a small delay before allowing another click
    setTimeout(() => {
      setIsChanging(false);
    }, 500);
  };

  // Reset isChanging state when component is unmounted or when language changes
  useEffect(() => {
    return () => setIsChanging(false);
  }, [language]);

  return (
    <button
      onClick={handleLanguageChange}
      disabled={isChanging}
      className={`px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center space-x-1 ${className}`}
      aria-label={t('common.language.switchLanguage', { language: targetLanguageName })}
    >
      <span className="text-sm font-medium">
        {language === 'en' ? '🇬🇧' : '🇩🇪'}
      </span>
      <span className="ml-1">
        {targetLanguageName}
      </span>
    </button>
  );
} 