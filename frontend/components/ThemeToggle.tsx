'use client';

import { Sun, Moon } from 'lucide-react';
import useTranslation from '@/hooks/useTranslation'; // Assuming translation needed for aria-label

// Assume theme state ('light' | 'dark') and toggle function are passed via props or context
interface ThemeToggleProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  className?: string;
}

export default function ThemeToggle({ theme, toggleTheme, className = '' }: ThemeToggleProps) {
  const { t } = useTranslation(); // Get t function for aria-label

  const isDarkMode = theme === 'dark';
  const Icon = isDarkMode ? Sun : Moon;
  const label = isDarkMode ? t('common.theme.switchToLight') : t('common.theme.switchToDark');

  return (
    <button
      type="button"
      onClick={toggleTheme}
      // Consistent styles: no rounded, no border, no shadow, transparent bg
      className={`p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-1 focus:ring-inset focus:ring-indigo-400 dark:focus:ring-indigo-600 transition-colors ${className}`}
      aria-label={label}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
} 