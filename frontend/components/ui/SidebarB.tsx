import { ReactNode } from 'react';
import Link from 'next/link';
import useTranslation from '@/hooks/useTranslation';

export type ContentItem = {
  title: string;
  href: string;
  date?: string;
  summary?: string;
  active?: boolean;
  icon?: ReactNode;
};

export type SidebarSection = {
  title: string;
  items: ContentItem[];
  viewAllLink?: string;
};

type SidebarBProps = {
  sections: SidebarSection[];
  title?: string;
  className?: string;
  children?: ReactNode;
};

/**
 * SidebarB - A sidebar component for related content with IBM-style minimal design
 * Used primarily for displaying related posts, recent content, or other supplementary information
 */
export default function SidebarB({ sections, title, className = '', children }: SidebarBProps) {
  const { t } = useTranslation();
  const uniqueTitles = new Set();

  // Get translation text with proper fallbacks
  const getText = (key: string, fallback: string): string => {
    const translated = t(key);
    return (translated && translated !== key) ? translated : fallback;
  };

  return (
    <aside className={`sm:border-l sm:pl-6 border-l-0 pl-0 border-gray-100 dark:border-gray-800 sticky top-24 self-start ${className}`}>
      {title && (
        <div className="border-b border-gray-100 dark:border-gray-800 pb-4 mb-6">
          <h3 className="font-normal text-gray-700 dark:text-gray-300 text-sm">{title}</h3>
        </div>
      )}
      
      {/* Newsletter subscription (children) at the top */}
      {children && (
        <div className="pb-4 mb-6 border-b border-gray-100 dark:border-gray-800">
          {children}
        </div>
      )}
      
      {sections.length > 0 && (
        <div className="space-y-8">
          {sections.map((section, index) => {
            // Check for duplicate titles
            let displayTitle = section.title;
            let count = 1;

            while (uniqueTitles.has(displayTitle)) {
              count++;
              displayTitle = `${section.title} (${count})`; // Append count to make it unique
            }
            uniqueTitles.add(displayTitle);

            return (
              <div key={index} className="border-t border-gray-100 dark:border-gray-800 pt-6">
                <h3 className="font-medium text-lg mb-4">
                  {getText(`blog.sidebar.${section.title.toLowerCase().replace(/\s+/g, '')}`, section.title)}
                </h3>
                
                {section.items.length > 0 ? (
                  <ul className="space-y-3">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        <Link
                          href={item.href}
                          className={`flex items-center no-underline text-sm ${
                            item.active
                              ? 'text-blue-600 dark:text-blue-400 font-medium'
                              : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                          }`}
                        >
                          {item.icon && <span className="mr-2">{item.icon}</span>}
                          <span>{item.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-gray-400 dark:text-gray-500 italic">
                    {getText('blog.sidebar.noItems', 'No items available')}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      
      {/* Fallback when no sections are provided */}
      {sections.length === 0 && !children && (
        <div className="text-sm text-gray-500 dark:text-gray-400 italic">
          {getText('blog.sidebar.noSections', 'No related content available')}
        </div>
      )}
    </aside>
  );
} 