import React from 'react';
import Link from 'next/link';
import { Languages, GlobeIcon } from 'lucide-react';

interface LanguageNoticeProps {
  slug: string;
  currentLang: string;
  targetLang: string;
  message?: string;
  linkText?: string;
}

export default function LanguageNotice({
  slug,
  currentLang,
  targetLang,
  message,
  linkText
}: LanguageNoticeProps) {
  // Default messages based on current language
  const defaultMessage = currentLang === 'en' 
    ? 'This post is also available in German.' 
    : 'Dieser Beitrag ist auch auf Englisch verfügbar.';
  
  const defaultLinkText = currentLang === 'en' 
    ? 'Read in German' 
    : 'Auf Englisch lesen';

  return (
    <div className="mb-8 p-4 border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 rounded-lg">
      <div className="flex gap-3 items-center">
        <Languages className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
        <div>
          <p className="text-blue-800 dark:text-blue-200">
            {message || defaultMessage}
          </p>
          <Link 
            href={`/${targetLang}/blog/${slug}`}
            className="inline-flex items-center gap-1.5 mt-2 text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            <GlobeIcon className="h-4 w-4" />
            <span>{linkText || defaultLinkText}</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 