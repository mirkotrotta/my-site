"use client"

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import useTranslation from '@/hooks/useTranslation';

interface NavItem {
  label: string;
  href: string;
}

interface NavMenuProps {
  items: NavItem[];
  className?: string;
}

export default function NavMenu({ items, className = '' }: NavMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className={`relative ${className}`}>
      {/* Mobile menu button */}
      <div className="md:hidden">
        <button
          onClick={toggleMenu}
          className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-1 focus:ring-inset focus:ring-indigo-500 dark:focus:ring-indigo-600"
          {...{
            'aria-expanded': isOpen ? 'true' : 'false',
            'aria-label': isOpen ? t('common.menu.close') : t('common.menu.open')
          }}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Desktop menu */}
      <div className="hidden md:flex space-x-8">
        {items.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`text-sm font-medium transition-colors hover:text-gray-900 dark:hover:text-white ${
              isActive(item.href)
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-2 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 z-50">
          <div className="flex flex-col space-y-4">
            {items.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-gray-900 dark:hover:text-white ${
                  isActive(item.href)
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
} 