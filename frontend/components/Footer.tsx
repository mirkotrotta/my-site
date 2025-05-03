"use client"

import Link from 'next/link';
import SocialLinks, { SocialLink } from './SocialLinks';
import useTranslation from '@/hooks/useTranslation';

interface FooterProps {
  socialLinks: SocialLink[];
  copyrightName?: string;
  copyrightYear?: number;
  className?: string;
}

export default function Footer({ 
  socialLinks,
  copyrightName = 'Mirko Trotta',
  copyrightYear = new Date().getFullYear(),
  className = ''
}: FooterProps) {
  const { language: lang, t } = useTranslation();

  return (
    <footer className={`border-t border-gray-200 dark:border-gray-800 py-8 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('footer.copyright')?.replace('{{year}}', copyrightYear.toString()) || `© ${copyrightYear} ${copyrightName}. All rights reserved.`}
            </p>
          </div>
          
          <div className="flex space-x-6 text-sm">
            <Link 
              href={`/${lang}/privacy`}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              {t('footer.privacy') || 'Privacy Policy'}
            </Link>
            <Link 
              href={`/${lang}/terms`}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              {t('footer.terms') || 'Terms of Service'}
            </Link>
          </div>
          
          <div className="mt-4 md:mt-0">
            <SocialLinks links={socialLinks} size="small" />
          </div>
        </div>
      </div>
    </footer>
  );
} 