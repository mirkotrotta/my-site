'use client';

import Link from 'next/link';
import useTranslation from '@/hooks/useTranslation';

export default function Footer() {
  const { t, language } = useTranslation();

  const currentYear = new Date().getFullYear();

  // Navigation items (keys from locales)
  const navItems = [
    { key: 'common.navigation.home', href: `/${language}` },
    { key: 'common.navigation.about', href: `/${language}/about` },
    { key: 'common.navigation.projects', href: `/${language}/projects` },
    { key: 'common.navigation.blog', href: `/${language}/blog` },
    { key: 'common.navigation.resume', href: `/${language}/resume` },
    { key: 'common.navigation.contact', href: `/${language}/contact` },
  ];

  return (
    <footer className="bg-gray-800 dark:bg-black text-gray-400 py-8 relative">
      <div className="container mx-auto px-12">
        {/* Centered Navigation Section */}
        <div className="flex flex-col items-center gap-6 mb-8">
          <nav>
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {navItems.map((item) => (
                <li key={item.key}>
                  <Link href={item.href} className="hover:text-white hover:underline text-sm">
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Centered Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 flex flex-col items-center text-center gap-2">
          <p className="text-xs">
            {t('common.footer.copyright').replace('{{year}}', currentYear.toString())}
          </p>
          <p className="text-xs">
            {t('common.footer.builtWith')}
          </p>
        </div>
      </div>
    </footer>
  );
} 