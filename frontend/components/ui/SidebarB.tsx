import { ReactNode } from 'react';
import Link from 'next/link';

export type ContentItem = {
  title: string;
  href: string;
  date?: string;
  summary?: string;
  tags?: string[];
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
  return (
    <aside className={`border-l border-gray-200 dark:border-gray-800 pl-6 sticky top-24 self-start ${className}`}>
      {title && (
        <div className="border-b border-gray-200 dark:border-gray-800 pb-4 mb-6">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wider">{title}</h3>
        </div>
      )}
      
      <div className="space-y-8">
        {sections.map((section, index) => (
          <div key={index} className="mb-6">
            <h4 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4 font-medium">
              {section.title}
            </h4>
            
            <ul className="space-y-4">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex} className="border-l-0">
                  <Link href={item.href} className="block group">
                    <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {item.title}
                    </h5>
                    {item.date && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    )}
                    {item.summary && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {item.summary}
                      </p>
                    )}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-[10px] text-gray-600 dark:text-gray-400">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
            
            {section.viewAllLink && (
              <div className="mt-3">
                <Link 
                  href={section.viewAllLink} 
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View all
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {children && (
        <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-800">
          {children}
        </div>
      )}
    </aside>
  );
} 