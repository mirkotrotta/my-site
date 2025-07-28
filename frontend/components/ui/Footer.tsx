'use client';

import Link from 'next/link';
import Image from 'next/image';
import useTranslation from '@/hooks/useTranslation';
import SocialLinks from '@/components/SocialLinks';
import GlobalContainer from './GlobalContainer';

export default function Footer() {
  const { t, language } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <GlobalContainer>
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          
          {/* Column 1: Logo Only */}
          <div className="lg:col-span-1">
            <div className="flex flex-col space-y-4">
              {/* Logo */}
              <div className="flex items-center">
                <Image
                  src="/images/logo-transparent-mirko trotta-metacubostudio-germany-deutschland.png"
                  alt="Mirko Trotta - MetaCuboStudio"
                  width={160}
                  height={50}
                  className="h-12 w-auto"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-medium text-sm mb-2">
              {t('common.footer.quickLinks') || 'Quick Links'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/${language}/about`} className="text-gray-400 hover:text-white transition-colors duration-200 text-xs">
                  {t('common.footer.about') || 'About'}
                </Link>
              </li>
              <li>
                <Link href={`/${language}/projects`} className="text-gray-400 hover:text-white transition-colors duration-200 text-xs">
                  {t('common.footer.projects') || 'Projects'}
                </Link>
              </li>
              <li>
                <Link href={`/${language}/blog`} className="text-gray-400 hover:text-white transition-colors duration-200 text-xs">
                  {t('common.footer.blog') || 'Blog'}
                </Link>
              </li>
              <li>
                <Link href={`/${language}/resume`} className="text-gray-400 hover:text-white transition-colors duration-200 text-xs">
                  {t('common.footer.resume') || 'Resume'}
                </Link>
              </li>
              <li>
                <Link href={`/${language}/contact`} className="text-gray-400 hover:text-white transition-colors duration-200 text-xs">
                  {t('common.footer.contact') || 'Contact'}
                </Link>
              </li>
            </ul>
          </div>

            {/* Legal Links */}
            <div>
              <h4 className="text-white font-medium text-xs mb-2">
                {t('common.footer.legal') || 'Legal'}
              </h4>
              <ul className="space-y-1">
                <li>
                  <Link href={`/${language}/privacy`} className="text-gray-400 hover:text-white transition-colors duration-200 text-xs">
                    {t('common.footer.privacy') || 'Privacy Policy'}
                  </Link>
                </li>
                <li>
                  <Link href={`/${language}/terms`} className="text-gray-400 hover:text-white transition-colors duration-200 text-xs">
                    {t('common.footer.terms') || 'Terms of Service'}
                  </Link>
                </li>
                <li>
                  <Link href={`/${language}/impressum`} className="text-gray-400 hover:text-white transition-colors duration-200 text-xs">
                    {t('common.footer.impressum') || 'Impressum'}
                  </Link>
                </li>
              </ul>
            </div>

          {/* Column 4: Contact*/}
          <div>
            <h3 className="text-white font-medium text-sm mb-2">
              {t('common.footer.contact') || 'Contact'}
            </h3>
            
            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <div>
                <a 
                  href="mailto:hello@mirkotrotta.com" 
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-xs"
                >
                  hello@mirkotrotta.com
                </a>
              </div>
              <div>
                <p className="text-gray-400 text-xs">
                  Hanau, Germany
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div className="mb-6">
              <SocialLinks />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-gray-500 text-xs">
              {t('common.footer.copyright').replace('{{year}}', currentYear.toString()) || `© ${currentYear} Mirko Trotta. All rights reserved.`}
            </p>
            <p className="text-gray-500 text-xs">
              {t('common.footer.builtWith') || 'Built with Next.js & Tailwind CSS'}
            </p>
          </div>
        </div>
      </GlobalContainer>
    </footer>
  );
} 